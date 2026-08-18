import Monitor from './monitor.model.js';
import {
  addMonitorJob,
  removeMonitorJob,
} from './monitor.scheduler.js';
import { invalidateDashboardCache } from '../dashboard/dashboard.cache.js';

const monitorPopulate = {
  path: 'monitoringTargets.region',
  select: 'key name provider enabled workerQueue',
};

export const createMonitor = async payload => {
  const existingMonitor = await Monitor.findOne({
    userId: payload.userId,
    url: payload.url,
    method: payload.method,
  });

  if (existingMonitor) {
    throw new Error(
      'A monitor with this URL and HTTP method already exists.'
    );
  }

  const monitor = await Monitor.create(payload);

  const populatedMonitor = await Monitor.findById(monitor._id).populate(
    monitorPopulate
  );

  await invalidateDashboardCache();

  if (!populatedMonitor.active) return populatedMonitor;

  await addMonitorJob(populatedMonitor);

  return populatedMonitor;
};

export const getActiveMonitors = async () => {
  return await Monitor.find({ active: true }).populate(monitorPopulate);
};

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

  if (search.trim()) {
    const escapedSearch = search
      .trim()
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    filter.url = {
      $regex: escapedSearch,
      $options: 'i',
    };
  }

  if (active !== undefined) {
    filter.active = active;
  }

  if (method) {
    filter.method = method.toUpperCase();
  }

  const skip = (page - 1) * limit;

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
      .populate(monitorPopulate)
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

export const getMonitorById = async (id, userId) => {
  return await Monitor.findOne({ _id: id, userId }).populate(
    monitorPopulate
  );
};

export const updateMonitorById = async (id, userId, data) => {
  const existingMonitor = await Monitor.findOne({
    _id: id,
    userId,
  }).populate(monitorPopulate);

  if (!existingMonitor) return null;

  await removeMonitorJob(
    existingMonitor,
    existingMonitor.interval
  );

  const updatedMonitor = await Monitor.findOneAndUpdate(
    { _id: id, userId },
    data,
    {
      new: true,
      runValidators: true,
    }
  ).populate(monitorPopulate);

  if (updatedMonitor && updatedMonitor.active) {
    await addMonitorJob(updatedMonitor);
  }

  await invalidateDashboardCache();

  return updatedMonitor;
};

export const deleteMonitorById = async (id, userId) => {
  const monitor = await Monitor.findOneAndDelete({
    _id: id,
    userId,
  }).populate(monitorPopulate);

  if (!monitor) {
    return null;
  }

  await removeMonitorJob(monitor, monitor.interval);
  await invalidateDashboardCache();

  return monitor;
};

export const pauseMonitor = async (id, userId) => {
  const monitor = await Monitor.findOne({
    _id: id,
    userId,
  }).populate(monitorPopulate);

  if (!monitor) {
    return null;
  }

  await removeMonitorJob(monitor, monitor.interval);

  monitor.active = false;
  await monitor.save();

  await invalidateDashboardCache();

  return monitor;
};

export const resumeMonitor = async (id, userId) => {
  const monitor = await Monitor.findOne({
    _id: id,
    userId,
  }).populate(monitorPopulate);

  if (!monitor) {
    return null;
  }

  monitor.active = true;
  await monitor.save();

  const populatedMonitor = await Monitor.findById(monitor._id).populate(
    monitorPopulate
  );

  await addMonitorJob(populatedMonitor);
  await invalidateDashboardCache();

  return populatedMonitor;
};
