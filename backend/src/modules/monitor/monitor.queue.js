import { Queue } from "bullmq";
import { redisConnection } from "../../queues/queue.connection.js";

export const MONITOR_QUEUE_NAME = "monitor-queue";
const QUEUE_PREFIX = MONITOR_QUEUE_NAME;
const queueRegistry = new Map();

const normalizeRegionKey = regionKey => {
  if (typeof regionKey !== "string") {
    throw new TypeError("regionKey must be a string");
  }

  const normalized = regionKey.trim().toLowerCase();

  if (!normalized) {
    throw new Error("regionKey is required");
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalized)) {
    throw new Error(
      "regionKey must contain only lowercase letters, numbers and hyphens"
    );
  }

  return normalized;
};

export const monitorQueue = new Queue(MONITOR_QUEUE_NAME, {
  connection: redisConnection,
});

export const getMonitorQueueName = regionKey =>
  `${QUEUE_PREFIX}-${normalizeRegionKey(regionKey)}`;

export const getMonitorQueue = regionKey => {
  const normalizedRegionKey = normalizeRegionKey(regionKey);

  if (queueRegistry.has(normalizedRegionKey)) {
    return queueRegistry.get(normalizedRegionKey);
  }

  const queueName = `${QUEUE_PREFIX}-${normalizedRegionKey}`;

  const queue = new Queue(queueName, {
    connection: redisConnection,
  });

  queueRegistry.set(normalizedRegionKey, queue);

  console.log(`🟢 Monitor queue initialized: ${queueName}`);

  return queue;
};

export const getInitializedMonitorQueues = () =>
  [...queueRegistry.entries()].map(([regionKey, queue]) => ({
    regionKey,
    queueName: queue.name,
  }));

export const closeMonitorQueues = async () => {
  const queues = [...queueRegistry.values()];

  await Promise.all(
    queues.map(async queue => {
      try {
        await queue.close();
      } catch (error) {
        console.error(
          `❌ Failed to close monitor queue "${queue.name}":`,
          error.message
        );
      }
    })
  );

  queueRegistry.clear();
};
