import Monitor from './monitor.model.js';
import { addMonitorJob, removeMonitorJob } from './monitor.scheduler.js';

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

  if (!monitor.active) return monitor;

  await addMonitorJob(monitor);

  return monitor;
};

export const getActiveMonitors = async () => {
  return await Monitor.find({ active: true });
};

// 🔥 GET ALL
export const getAllMonitors = async userId => {
  return await Monitor.find({ userId }).sort({ createdAt: -1 });
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
  } else {
    console.log("Monitor Not Found...");
  }

  return monitor;
};