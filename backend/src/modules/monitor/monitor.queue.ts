import { Queue } from "bullmq";
import { redisConnection } from "../../queues/queue.connection.js";
import type { InitializedMonitorQueueInfo } from "./types/index.js";

export const MONITOR_QUEUE_NAME = "monitor-queue";
const QUEUE_PREFIX = MONITOR_QUEUE_NAME;
const queueRegistry = new Map<string, Queue>();

const normalizeRegionKey = (regionKey: string): string => {
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

export const getMonitorQueueName = (regionKey: string): string =>
  `${QUEUE_PREFIX}-${normalizeRegionKey(regionKey)}`;

export const getMonitorQueue = (regionKey: string): Queue => {
  const normalizedRegionKey = normalizeRegionKey(regionKey);

  const existing = queueRegistry.get(normalizedRegionKey);
  if (existing) {
    return existing;
  }

  const queueName = `${QUEUE_PREFIX}-${normalizedRegionKey}`;

  const queue = new Queue(queueName, {
    connection: redisConnection,
  });

  queueRegistry.set(normalizedRegionKey, queue);

  console.log(`🟢 Monitor queue initialized: ${queueName}`);

  return queue;
};

export const getInitializedMonitorQueues = (): InitializedMonitorQueueInfo[] =>
  [...queueRegistry.entries()].map(([regionKey, queue]) => ({
    regionKey,
    queueName: queue.name,
  }));

export const closeMonitorQueues = async (): Promise<void> => {
  const queues = [...queueRegistry.values()];

  await Promise.all(
    queues.map(async (queue) => {
      try {
        await queue.close();
      } catch (error: unknown) {
        console.error(
          `❌ Failed to close monitor queue "${queue.name}":`,
          error instanceof Error ? error.message : "Unknown error"
        );
      }
    })
  );

  queueRegistry.clear();
};
