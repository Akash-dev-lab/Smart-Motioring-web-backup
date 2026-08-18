import { Worker } from "bullmq";
import axios from "axios";
import { redisConnection } from "../queues/queue.connection.js";
import { MONITOR_QUEUE_NAME } from "../modules/monitor/monitor.queue.js";
import { createLog } from "../modules/logs/log.repository.js";
import Monitor from "../modules/monitor/monitor.model.js";
import MonitoringRegion from "../modules/monitoring-region/monitoring-region.model.js";
import { setCache } from "../utils/cache.js";
import { removeMonitorJob } from "../modules/monitor/monitor.scheduler.js";
import {
  handleFailure,
  handleSuccess,
} from "../modules/incident/incident.processor.js";
import { publishMonitorStatus } from "../sockets/socket.pubsub.js";

const workers = new Map();

export const processMonitorJob = async (job) => {
  const {
    monitorId,
    targetId,
    url,
    method,
    region,
    regionName,
    provider,
  } = job.data;

  // Self-healing check: Verify monitor exists in DB and is active
  const monitor = await Monitor.findById(monitorId);

  if (!monitor || !monitor.active) {
    await removeMonitorJob(monitorId);

    try {
      await job.remove();
    } catch (e) {
      // Ignore if already removed
    }

    console.log(
      `⚠️ Monitor ${monitorId} inactive or not found - cleaned up schedule`
    );
    return;
  }

  const userId = monitor.userId.toString();
  let success = false;
  let latency = 0;

  try {
    const start = Date.now();

    const res = await axios({
      url,
      method,
      timeout: 5000,
    });

    latency = Date.now() - start;
    success = true;

    await createLog({
      monitorId,
      targetId,
      region,
      status: res.status,
      responseTime: latency,
      success: true,
    });

    await setCache(
      `monitor:${monitorId}:status:${targetId || "default"}`,
      {
        monitorId,
        targetId,
        region,
        status: res.status,
        responseTime: latency,
        success: true,
        checkedAt: new Date().toISOString(),
      },
      30
    );

    console.log(`✅ [${region || "default"}] ${url} (${latency}ms)`);

    await handleSuccess(monitorId);

    await publishMonitorStatus({
      userId,
      monitorId,
      targetId,
      region,
      regionName,
      provider,
      status: res.status,
      responseTime: latency,
      success: true,
      checkedAt: new Date().toISOString(),
    });
  } catch (err) {
    latency = 0;
    success = false;
    const status = err.response?.status || 500;

    await createLog({
      monitorId,
      targetId,
      region,
      status,
      responseTime: latency,
      success: false,
    });

    await setCache(
      `monitor:${monitorId}:status:${targetId || "default"}`,
      {
        monitorId,
        targetId,
        region,
        status,
        responseTime: latency,
        success: false,
        error: err.message,
        checkedAt: new Date().toISOString(),
      },
      30
    );

    console.log(
      `❌ [${region || "default"}] Failed: ${url} - ${err.message}`
    );

    // FAILURE → INCIDENT COUNT
    await handleFailure(monitorId);

    await publishMonitorStatus({
      userId,
      monitorId,
      targetId,
      region,
      regionName,
      provider,
      status,
      responseTime: latency,
      success: false,
      error: err.message,
      checkedAt: new Date().toISOString(),
    });
  }
};

export const startRegionalWorkers = async () => {
  const regions = await MonitoringRegion.find({
    enabled: true,
  }).lean();

  if (!regions.length) {
    console.log("⚠️ No enabled monitoring regions found. Starting fallback default worker.");
    if (!workers.has("default")) {
      const defaultWorker = new Worker(
        MONITOR_QUEUE_NAME,
        processMonitorJob,
        {
          connection: redisConnection,
          concurrency: 5,
        }
      );
      workers.set("default", defaultWorker);
      console.log(`🟢 Fallback BullMQ Worker started: ${MONITOR_QUEUE_NAME}`);
    }
    return;
  }

  for (const region of regions) {
    if (workers.has(region.key)) {
      continue;
    }

    const queueName = region.workerQueue || `monitor-queue-${region.key}`;

    const worker = new Worker(
      queueName,
      processMonitorJob,
      {
        connection: redisConnection,
        concurrency: 5,
      }
    );

    worker.on("ready", () => {
      console.log(`🟢 Regional Worker ready: ${queueName}`);
    });

    worker.on("completed", (job) => {
      console.log(`✅ Job completed: ${job.id} | ${region.key}`);
    });

    worker.on("failed", (job, error) => {
      console.error(
        `❌ Job failed: ${job?.id} | ${region.key} | ${error.message}`
      );
    });

    worker.on("error", (error) => {
      console.error(
        `🔴 Worker error [${region.key}]:`,
        error.message
      );
    });

    workers.set(region.key, worker);

    console.log(`🟢 Regional Worker started: ${queueName} (${region.name || region.key})`);
  }
};

export const stopRegionalWorkers = async () => {
  for (const [regionKey, worker] of workers) {
    await worker.close();
    console.log(`🛑 Regional Worker stopped: ${regionKey}`);
  }
  workers.clear();
};

// Backward compatibility alias for server.js
export const startBullWorker = startRegionalWorkers;

