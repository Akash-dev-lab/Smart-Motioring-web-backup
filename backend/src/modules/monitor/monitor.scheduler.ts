import type { Queue } from "bullmq";
import type { Types } from "mongoose";
import Monitor from "./monitor.model.js";
import MonitoringRegion from "../monitoring-region/monitoring-region.model.js";
import { getMonitorQueue } from "./monitor.queue.js";
import type {
  IPopulatedMonitorDocument,
  IMonitorDocument,
  IPopulatedMonitoringTarget,
  MonitorJobPayload,
} from "./types/index.js";
import type { IMonitoringRegionDocument } from "../monitoring-region/types/index.js";

const getMonitorJobId = (
  monitorId: string | Types.ObjectId,
  targetId: string | Types.ObjectId
): string => `monitor:${monitorId.toString()}:${targetId.toString()}`;

const getEnabledTargets = (
  monitor: IPopulatedMonitorDocument | IMonitorDocument
): IPopulatedMonitoringTarget[] => {
  if (!Array.isArray(monitor.monitoringTargets)) {
    return [];
  }

  return (monitor.monitoringTargets as unknown as IPopulatedMonitoringTarget[]).filter(
    (target) => {
      const region = target.region as unknown as IMonitoringRegionDocument | undefined;
      return (
        target.enabled === true &&
        region &&
        region.enabled !== false &&
        Boolean(region.key)
      );
    }
  );
};

const removeRepeatableJobsFromQueue = async (
  queue: Queue,
  monitorId: string | Types.ObjectId
): Promise<void> => {
  const idStr = monitorId.toString();
  const repeatableJobs = await queue.getRepeatableJobs();

  for (const job of repeatableJobs) {
    if (
      job.id?.startsWith(`monitor:${idStr}:`) ||
      job.key?.includes(`monitor:${idStr}:`)
    ) {
      await queue.removeRepeatableByKey(job.key);
    }
  }
};

/**
 * Add one recurring BullMQ job for every enabled monitoring target.
 *
 * Job identity:
 *   monitor:<monitorId>:<targetId>
 */
export const addMonitorJob = async (
  monitor: IPopulatedMonitorDocument
): Promise<boolean> => {
  const { _id, url, method, interval } = monitor;

  if (!_id || !url || !method || !interval) {
    throw new Error("Monitor ID, URL, method and interval are required");
  }

  const targets = getEnabledTargets(monitor);

  if (targets.length === 0) {
    throw new Error(
      "At least one enabled monitoring target with an enabled region is required"
    );
  }

  let scheduledCount = 0;

  for (const target of targets) {
    const region = target.region as unknown as IMonitoringRegionDocument;
    const targetId = (target._id as { toString(): string }).toString();
    const regionKey = region.key;
    const queue = getMonitorQueue(regionKey);
    const jobId = getMonitorJobId(_id, targetId);

    const jobData: MonitorJobPayload = {
      monitorId: _id.toString(),
      targetId,
      url,
      method,
      region: regionKey,
      regionName: region.name,
      provider: region.provider,
    };

    await queue.add("check-url", jobData, {
      jobId,
      repeat: {
        every: interval,
      },
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    });

    scheduledCount++;

    console.log(
      `📅 Monitor scheduled: ${url} | region=${regionKey} | target=${targetId} | every ${interval}ms`
    );
  }

  console.log(
    `🌍 Monitor fan-out complete: ${url} | ${scheduledCount} regional target(s)`
  );

  return true;
};

/**
 * Remove all regional recurring jobs belonging to a monitor.
 *
 * The monitor's persisted monitoringTargets determine which regional
 * queues need to be inspected.
 */
export const removeMonitorJob = async (
  monitorOrId:
    | IPopulatedMonitorDocument
    | IMonitorDocument
    | string
    | Types.ObjectId,
  interval?: number | string
): Promise<boolean> => {
  const monitor =
    typeof monitorOrId === "object" && monitorOrId !== null
      ? (monitorOrId as IPopulatedMonitorDocument)
      : ((await Monitor.findById(monitorOrId).populate(
          "monitoringTargets.region",
          "key name provider enabled workerQueue"
        )) as unknown as IPopulatedMonitorDocument | null);

  if (!monitor?._id) {
    throw new Error("Monitor ID is required");
  }

  const idStr = monitor._id.toString();
  const regions = new Set<string>();

  if (Array.isArray(monitor.monitoringTargets)) {
    for (const target of monitor.monitoringTargets) {
      const region = target.region as unknown as IMonitoringRegionDocument | undefined;
      if (region?.key) {
        regions.add(region.key);
      }
    }
  }

  for (const regionKey of regions) {
    const queue = getMonitorQueue(regionKey);

    if (interval) {
      const targetsForRegion = (
        monitor.monitoringTargets as unknown as IPopulatedMonitoringTarget[]
      ).filter(
        (target) =>
          (target.region as unknown as IMonitoringRegionDocument | undefined)?.key ===
          regionKey
      );

      for (const target of targetsForRegion) {
        const targetId = (target._id as { toString(): string }).toString();
        const jobId = getMonitorJobId(idStr, targetId);

        try {
          await queue.removeRepeatable(
            "check-url",
            { every: Number(interval) },
            jobId
          );
        } catch (error: unknown) {
          console.warn(
            `⚠️ removeRepeatable failed for ${jobId}: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
        }
      }
    }

    await removeRepeatableJobsFromQueue(queue, idStr);
  }

  console.log(
    `🗑️ Monitor regional schedules removed: ${idStr} | ${regions.size} region(s)`
  );

  return true;
};

/**
 * Clear all monitor repeatable jobs across every configured region.
 * No region list is hard-coded.
 */
export const clearAllRepeatableJobs = async (): Promise<number> => {
  const regions = await MonitoringRegion.find({}).select("key").lean();

  let total = 0;

  for (const region of regions) {
    const queue = getMonitorQueue(region.key);
    const repeatableJobs = await queue.getRepeatableJobs();

    for (const job of repeatableJobs) {
      await queue.removeRepeatableByKey(job.key);
      total++;
    }
  }

  console.log(
    `🧹 Cleared ${total} repeatable monitor jobs across ${regions.length} configured region(s).`
  );

  return total;
};

export { getMonitorJobId };
