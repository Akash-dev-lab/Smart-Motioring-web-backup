import Monitor from './monitor.model.js';

export const createMonitor = async payload => {
  const existingMonitor = await Monitor.findOne({
    userId: payload.userId,
    url: payload.url,
    method: payload.method,
  });

  if (existingMonitor) {
    throw new Error('A monitor with this URL and HTTP method already exists.');
  }

  return await Monitor.create(payload);
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

// 🔥 UPDATE
export const updateMonitorById = async (id, userId, data) => {
  return await Monitor.findOneAndUpdate({ _id: id, userId }, data, {
    new: true,
  });
};

// 🔥 DELETE
export const deleteMonitorById = async (id, userId) => {
  return await Monitor.findOneAndDelete({ _id: id, userId });
};

const setMonitorStatus = async (id, userId, active) => {
  return await Monitor.findOneAndUpdate(
    { _id: id, userId },
    { active },
    { new: true }
  );
};

export const pauseMonitor = async (id, userId) => {
  return await setMonitorStatus(id, userId, false);
};

export const resumeMonitor = async (id, userId) => {
  return await setMonitorStatus(id, userId, true);
};