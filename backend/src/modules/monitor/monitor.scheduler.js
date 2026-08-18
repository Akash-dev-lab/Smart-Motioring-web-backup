import Monitor from './monitor.model.js';
import MonitoringRegion from '../monitoring-region/monitoring-region.model.js';
import { getMonitorQueue } from './monitor.queue.js';

const getMonitorJobId = (monitorId, targetId) =>
  `monitor:${monitorId}:${targetId}`;

const getEnabledTargets = monitor => {
  if (!Array.isArray(monitor.monitoringTargets)) {
    return [];
  }

  return monitor.monitoringTargets.filter(target => {
    return (
      target.enabled === true &&
      target.region &&
      target.region.enabled !== false &&
      target.region.key
    );
  });
};

const removeRepeatableJobsFromQueue = async (queue, monitorId) => {
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
export const addMonitorJob = async monitor => {
  const {
    _id,
    url,
    method,
    interval,
  } = monitor;

  if (!_id || !url || !method || !interval) {
    throw new Error(
      'Monitor ID, URL, method and interval are required'
    );
  }

  const targets = getEnabledTargets(monitor);

  if (targets.length === 0) {
    throw new Error(
      'At least one enabled monitoring target with an enabled region is required'
    );
  }

  let scheduledCount = 0;

  for (const target of targets) {
    const region = target.region;
    const targetId = target._id.toString();
    const regionKey = region.key;
    const queue = getMonitorQueue(regionKey);
    const jobId = getMonitorJobId(_id, targetId);

    await queue.add(
      'check-url',
      {
        monitorId: _id.toString(),
        targetId,
        url,
        method,
        region: regionKey,
        regionName: region.name,
        provider: region.provider,
      },
      {
        jobId,
        repeat: {
          every: interval,
        },
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      }
    );

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
  monitorOrId,
  interval
) => {
  const monitor =
    typeof monitorOrId === 'object' && monitorOrId !== null
      ? monitorOrId
      : await Monitor.findById(monitorOrId).populate(
          'monitoringTargets.region',
          'key name provider enabled workerQueue'
        );

  if (!monitor?._id) {
    throw new Error('Monitor ID is required');
  }

  const idStr = monitor._id.toString();
  const regions = new Set();

  if (Array.isArray(monitor.monitoringTargets)) {
    for (const target of monitor.monitoringTargets) {
      if (target.region?.key) {
        regions.add(target.region.key);
      }
    }
  }

  for (const regionKey of regions) {
    const queue = getMonitorQueue(regionKey);

    if (interval) {
      const targetsForRegion = (monitor.monitoringTargets || []).filter(
        target => target.region?.key === regionKey
      );

      for (const target of targetsForRegion) {
        const targetId = target._id.toString();
        const jobId = getMonitorJobId(idStr, targetId);

        try {
          await queue.removeRepeatable(
            'check-url',
            { every: Number(interval) },
            jobId
          );
        } catch (error) {
          console.warn(
            `⚠️ removeRepeatable failed for ${jobId}: ${error.message}`
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
export const clearAllRepeatableJobs = async () => {
  const regions = await MonitoringRegion.find({})
    .select('key')
    .lean();

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
