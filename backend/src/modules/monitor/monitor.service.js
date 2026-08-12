import Monitor from './monitor.model.js';
import { addMonitorJob, removeMonitorJob } from './monitor.scheduler.js';
import { invalidateDashboardCache } from '../dashboard/dashboard.cache.js';

export const createMonitor = async payload => {
  const existingMonitor = await Monitor.findOne({
    userId: payload.userId,
    url: payload.url,
    method: payload.method,
  });

  if (existingMonitor) {
    throw new Error('A monitor with this URL and HTTP method already exists.');
  }

  const monitor = await Monitor.create(payload);

  await invalidateDashboardCache();

  if (!monitor.active) return monitor;

  await addMonitorJob(monitor);

  return monitor;
};

export const getActiveMonitors = async () => {
  return await Monitor.find({ active: true });
};

// 🔥 GET ALL
export const getAllMonitors = async (
  userId,
  {
    page = 1,
    limit = 10,
    search = '',
    active,
    method,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = {}
) => {
  const filter = { userId };

  // 🔎 SEARCH
  if (search.trim()) {
    const escapedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    filter.url = {
      $regex: escapedSearch,
      $options: 'i',
    };
  }

  // 🔥 ACTIVE FILTER
  if (active !== undefined) {
    filter.active = active;
  }

  // 🔥 HTTP METHOD FILTER
  if (method) {
    filter.method = method.toUpperCase();
  }

  // 🔢 PAGINATION
  const skip = (page - 1) * limit;

  // ↕️ SORTING
  const allowedSortFields = [
    'createdAt',
    'updatedAt',
    'url',
    'interval',
    'active',
  ];

  const safeSortBy = allowedSortFields.includes(sortBy)
    ? sortBy
    : 'createdAt';

  const safeSortOrder = sortOrder === 'asc' ? 1 : -1;

  const [monitors, total] = await Promise.all([
    Monitor.find(filter)
      .sort({ [safeSortBy]: safeSortOrder })
      .skip(skip)
      .limit(limit),

    Monitor.countDocuments(filter),
  ]);

  return {
    monitors,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

// 🔥 GET BY ID
export const getMonitorById = async (id, userId) => {
  return await Monitor.findOne({ _id: id, userId });
};

// ✅ ADMIN GET ALL
// export const getAllMonitorsAdmin = async () => {
//   return await Monitor.find().sort({ createdAt: -1 });
// };

// 🔥 UPDATE & RESCHEDULE
export const updateMonitorById = async (id, userId, data) => {
  const existingMonitor = await Monitor.findOne({ _id: id, userId });
  if (!existingMonitor) return null;

  // 1. Remove old job schedule
  await removeMonitorJob(existingMonitor._id, existingMonitor.interval);

  // 2. Update monitor in database
  const updatedMonitor = await Monitor.findOneAndUpdate(
    { _id: id, userId },
    data,
    { new: true }
  );

  // 3. Reschedule job with new settings if monitor is active
  if (updatedMonitor && updatedMonitor.active) {
    await addMonitorJob(updatedMonitor);
  }

  await invalidateDashboardCache();

  return updatedMonitor;
};

// 🔥 DELETE
export const deleteMonitorById = async (id, userId) => {
  const monitor = await Monitor.findOneAndDelete({
    _id: id,
    userId,
  });

  if (!monitor) {
    return null;
  }

  await removeMonitorJob(monitor._id, monitor.interval);
  await invalidateDashboardCache();

  return monitor;
};

const setMonitorStatus = async (id, userId, active) => {
  return await Monitor.findOneAndUpdate(
    { _id: id, userId },
    { active },
    { new: true }
  );
};

export const pauseMonitor = async (id, userId) => {
  const monitor = await Monitor.findOneAndUpdate(
    {
      _id: id,
      userId,
    },
    {
      active: false,
    },
    {
      new: true,
    }
  );

  if (monitor) {
    await removeMonitorJob(monitor._id, monitor.interval);
    await invalidateDashboardCache();
  } else {
    console.log("Monitor Not Found...");
  }

  return monitor;
};

export const resumeMonitor = async (id, userId) => {
  const monitor = await Monitor.findOneAndUpdate(
    {
      _id: id,
      userId,
    },
    {
      active: true,
    },
    {
      new: true,
    }
  );

  if (monitor) {
    await addMonitorJob(monitor);
    await invalidateDashboardCache();
  } else {
    console.log("Monitor Not Found...");
  }

  return monitor;
};