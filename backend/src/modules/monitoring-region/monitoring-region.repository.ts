import type { UpdateQuery } from "mongoose";
import MonitoringRegion from "./monitoring-region.model.js";
import type {
  IMonitoringRegionDocument,
  IMonitoringRegion,
  FindRegionsFilter,
} from "./types/index.js";

export const createRegion = async (
  data: Partial<IMonitoringRegion>
): Promise<IMonitoringRegionDocument> => MonitoringRegion.create(data);

export const findAllRegions = async ({
  enabled,
}: FindRegionsFilter = {}): Promise<IMonitoringRegionDocument[]> => {
  const filter: Record<string, unknown> = {};
  if (enabled !== undefined) filter.enabled = enabled;
  return MonitoringRegion.find(filter).sort({ enabled: -1, name: 1 });
};

export const findRegionById = async (
  id: string
): Promise<IMonitoringRegionDocument | null> => MonitoringRegion.findById(id);

export const findRegionByKey = async (
  key: string
): Promise<IMonitoringRegionDocument | null> =>
  MonitoringRegion.findOne({ key: key.toLowerCase() });

export const updateRegionById = async (
  id: string,
  data: UpdateQuery<IMonitoringRegionDocument>
): Promise<IMonitoringRegionDocument | null> =>
  MonitoringRegion.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

export const deleteRegionById = async (
  id: string
): Promise<IMonitoringRegionDocument | null> =>
  MonitoringRegion.findByIdAndDelete(id);
