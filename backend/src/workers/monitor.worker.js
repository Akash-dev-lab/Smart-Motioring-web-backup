import { Worker } from "bullmq";
import axios from "axios";
import { redisConnection } from "../queues/queue.connection.js";
import { MONITOR_QUEUE_NAME } from "../modules/monitor/monitor.queue.js";
import { createLog } from "../modules/logs/log.repository.js";
import Monitor from "../modules/monitor/monitor.model.js";
import { setCache } from "../utils/cache.js";
import { removeMonitorJob } from "../modules/monitor/monitor.scheduler.js";
import { handleFailure, handleSuccess } from "../modules/incident/incident.processor.js";

export const startBullWorker = () => {
  const worker = new Worker(
    MONITOR_QUEUE_NAME,
    async (job) => {
      const { monitorId, url, method } = job.data;

      // Self-healing check: Verify monitor exists in DB and is active
      const monitor = await Monitor.findById(monitorId);

      if (!monitor || !monitor.active) {
        await removeMonitorJob(monitorId);

        try {
          await job.remove();
        } catch (e) {
          // Ignore if already removed
        }

        return;
      }

      let success = false;
      let latency = 0;

      try {
        const start = Date.now();

        const res = await axios({
          url,
          method,
          timeout: 5000
        });

        latency = Date.now() - start;
        success = true;

        await createLog({
          monitorId,
          status: res.status,
          responseTime: latency,
          success: true
        });

        await setCache(
          `monitor:${monitorId}:status`,
          {
            monitorId,
            status: res.status,
            responseTime: latency,
            success: true,
            checkedAt: new Date().toISOString()
          },
          30
        );

        console.log(`✅ ${url} (${latency}ms)`);

        await handleSuccess(monitorId);

      } catch (err) {
        latency = 0;
        success = false;

        await createLog({
          monitorId,
          status: err.response?.status || 500,
          responseTime: latency,
          success: false
        });

        await setCache(
          `monitor:${monitorId}:status`,
          {
            monitorId,
            status: err.response?.status || 500,
            responseTime: latency,
            success: false,
            checkedAt: new Date().toISOString()
          },
          30
        );

        console.log(`❌ Failed: ${url} - ${err.message}`);

        // FAILURE → INCIDENT COUNT
        await handleFailure(monitorId);
      }
    },
    {
      connection: redisConnection,
      concurrency: 5
    }
  );

  console.log(`🟢 BullMQ Worker started: ${MONITOR_QUEUE_NAME}`);

  return worker;
};
