import MonitoringRegion from "./monitoring-region.model.js";

export const createRegion = async data => MonitoringRegion.create(data);

export const findAllRegions = async ({ enabled } = {}) => {
  const filter = {};
  if (enabled !== undefined) filter.enabled = enabled;
  return MonitoringRegion.find(filter).sort({ enabled: -1, name: 1 });
};

export const findRegionById = async id => MonitoringRegion.findById(id);

export const findRegionByKey = async key =>
  MonitoringRegion.findOne({ key: key.toLowerCase() });

export const updateRegionById = async (id, data) =>
  MonitoringRegion.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

export const deleteRegionById = async id =>
  MonitoringRegion.findByIdAndDelete(id);
