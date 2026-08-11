import { monitorQueue } from '../../queues/monitor.queue.js';

const getMonitorJobId = monitorId =>
  `monitor:${monitorId}`;

/**
 * Add recurring monitor job
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

  const jobId = getMonitorJobId(_id);

  await monitorQueue.add(
    'check-url',
    {
      monitorId: _id.toString(),
      url,
      method,
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

  console.log(
    `📅 Monitor scheduled: ${url} | every ${interval}ms`
  );

  return true;
};

/**
 * Remove recurring monitor job
 */
export const removeMonitorJob = async (
  monitorId,
  interval
) => {
  if (!monitorId) {
    throw new Error('Monitor ID is required');
  }

  const idStr = monitorId.toString();
  const jobId = getMonitorJobId(idStr);

  // 1. Primary: Use BullMQ removeRepeatable with exact interval
  if (interval) {
    await monitorQueue.removeRepeatable(
      'check-url',
      { every: Number(interval) },
      jobId
    );
  }

  // 2. Secondary fallback: Search getRepeatableJobs list by key or id match
  const repeatableJobs = await monitorQueue.getRepeatableJobs();
  for (const job of repeatableJobs) {
    if (
      job.id === jobId ||
      job.id === idStr ||
      job.key.includes(idStr) ||
      (job.every && String(job.every) === String(interval))
    ) {
      await monitorQueue.removeRepeatableByKey(job.key);
    }
  }

  // console.log(`🗑️ Monitor schedule removed: ${idStr}`);
  return true;
};

/**
 * Clear all repeatable jobs from Redis queue (useful for resetting test state)
 */
export const clearAllRepeatableJobs = async () => {
  const repeatableJobs = await monitorQueue.getRepeatableJobs();
  for (const job of repeatableJobs) {
    await monitorQueue.removeRepeatableByKey(job.key);
  }
  console.log(`🧹 Cleared all ${repeatableJobs.length} repeatable jobs from Redis.`);
};