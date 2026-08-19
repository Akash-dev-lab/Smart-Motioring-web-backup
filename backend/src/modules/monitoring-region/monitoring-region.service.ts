import mongoose from "mongoose";
import {
  createRegion,
  findAllRegions,
  findRegionById,
  findRegionByKey,
  updateRegionById,
  deleteRegionById,
} from "./monitoring-region.repository.js";
import type {
  IMonitoringRegionDocument,
  IMonitoringRegion,
  CreateMonitoringRegionInput,
  UpdateMonitoringRegionInput,
  NormalizedRegionData,
  FindRegionsFilter,
} from "./types/index.js";

const normalizeRegionData = (
  data: Partial<CreateMonitoringRegionInput>
): NormalizedRegionData => ({
  key: data.key?.trim().toLowerCase(),
  name: data.name?.trim(),
  provider: data.provider?.trim().toLowerCase() || "aws",
  ...(data.enabled !== undefined && { enabled: data.enabled }),
  workerQueue: data.workerQueue?.trim(),
});

const validateObjectId = (id: string): void => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid monitoring region ID");
  }
};

export const createMonitoringRegion = async (
  payload: CreateMonitoringRegionInput
): Promise<IMonitoringRegionDocument> => {
  const data = normalizeRegionData(payload);

  if (!data.key) throw new Error("Region key is required");
  if (!data.name) throw new Error("Region name is required");
  if (!data.workerQueue) throw new Error("Worker queue is required");

  if (await findRegionByKey(data.key)) {
    throw new Error("A monitoring region with this key already exists");
  }

  return createRegion(data as Partial<IMonitoringRegion>);
};

export const getMonitoringRegions = async ({
  enabled,
}: FindRegionsFilter = {}): Promise<IMonitoringRegionDocument[]> =>
  findAllRegions({ enabled });

export const getMonitoringRegionById = async (
  id: string
): Promise<IMonitoringRegionDocument> => {
  validateObjectId(id);
  const region = await findRegionById(id);
  if (!region) throw new Error("Monitoring region not found");
  return region;
};

export const updateMonitoringRegion = async (
  id: string,
  payload: UpdateMonitoringRegionInput
): Promise<IMonitoringRegionDocument> => {
  validateObjectId(id);
  const data = normalizeRegionData(payload);

  if (data.key !== undefined) {
    const existing = await findRegionByKey(data.key);
    if (
      existing &&
      (existing._id as { toString(): string }).toString() !== id
    ) {
      throw new Error("A monitoring region with this key already exists");
    }
  }

  const updated = await updateRegionById(id, data);
  if (!updated) throw new Error("Monitoring region not found");
  return updated;
};

export const deleteMonitoringRegion = async (
  id: string
): Promise<IMonitoringRegionDocument> => {
  validateObjectId(id);
  const deleted = await deleteRegionById(id);
  if (!deleted) throw new Error("Monitoring region not found");
  return deleted;
};
