import type { Types } from "mongoose";
import type { AllowedHttpMethod } from "../../utils/constants.js";
import Monitor from "./monitor.model.js";
import {
  addMonitorJob,
  removeMonitorJob,
} from "./monitor.scheduler.js";
import { invalidateDashboardCache } from "../dashboard/dashboard.cache.js";
import type {
  IPopulatedMonitorDocument,
  CreateMonitorInput,
  UpdateMonitorInput,
  GetAllMonitorsOptions,
  PaginatedMonitorsResult,
  IMonitorDocument,
} from "./types/index.js";

const monitorPopulate = {
  path: "monitoringTargets.region",
  select: "key name provider enabled workerQueue",
};

export const createMonitor = async (
  payload: CreateMonitorInput
): Promise<IPopulatedMonitorDocument> => {
  const existingMonitor = await Monitor.findOne({
    userId: payload.userId,
    url: payload.url,
    method: payload.method as AllowedHttpMethod,
  });

  if (existingMonitor) {
    throw new Error(
      "A monitor with this URL and HTTP method already exists."
    );
  }

  const monitor = await Monitor.create(
    payload as unknown as Partial<IMonitorDocument>
  );

  const populatedMonitor = (await Monitor.findById(monitor._id).populate(
    monitorPopulate
  )) as unknown as IPopulatedMonitorDocument;

  await invalidateDashboardCache();

  if (!populatedMonitor.active) return populatedMonitor;

  await addMonitorJob(populatedMonitor);

  return populatedMonitor;
};

export const getActiveMonitors = async (): Promise<
  IPopulatedMonitorDocument[]
> => {
  return (await Monitor.find({ active: true }).populate(
    monitorPopulate
  )) as unknown as IPopulatedMonitorDocument[];
};

export const getAllMonitors = async (
  userId: string | Types.ObjectId,
  {
    page = 1,
    limit = 10,
    search = "",
    active,
    method,
    sortBy = "createdAt",
    sortOrder = "desc",
  }: GetAllMonitorsOptions = {}
): Promise<PaginatedMonitorsResult> => {
  const filter: Record<string, unknown> = { userId };

  if (search.trim()) {
    const escapedSearch = search
      .trim()
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    filter.url = {
      $regex: escapedSearch,
      $options: "i",
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
    "createdAt",
    "updatedAt",
    "url",
    "interval",
    "active",
  ];

  const safeSortBy = allowedSortFields.includes(sortBy)
    ? sortBy
    : "createdAt";

  const safeSortOrder: 1 | -1 = sortOrder === "asc" ? 1 : -1;

  const [monitors, total] = await Promise.all([
    Monitor.find(filter)
      .populate(monitorPopulate)
      .sort({ [safeSortBy]: safeSortOrder })
      .skip(skip)
      .limit(limit) as unknown as Promise<IPopulatedMonitorDocument[]>,

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

export const getMonitorById = async (
  id: string,
  userId: string | Types.ObjectId
): Promise<IPopulatedMonitorDocument | null> => {
  return (await Monitor.findOne({ _id: id, userId }).populate(
    monitorPopulate
  )) as unknown as IPopulatedMonitorDocument | null;
};

export const updateMonitorById = async (
  id: string,
  userId: string | Types.ObjectId,
  data: UpdateMonitorInput
): Promise<IPopulatedMonitorDocument | null> => {
  const existingMonitor = (await Monitor.findOne({
    _id: id,
    userId,
  }).populate(monitorPopulate)) as unknown as IPopulatedMonitorDocument | null;

  if (!existingMonitor) return null;

  await removeMonitorJob(
    existingMonitor,
    existingMonitor.interval
  );

  const updatedMonitor = (await Monitor.findOneAndUpdate(
    { _id: id, userId },
    data,
    {
      new: true,
      runValidators: true,
    }
  ).populate(monitorPopulate)) as unknown as IPopulatedMonitorDocument | null;

  if (updatedMonitor && updatedMonitor.active) {
    await addMonitorJob(updatedMonitor);
  }

  await invalidateDashboardCache();

  return updatedMonitor;
};

export const deleteMonitorById = async (
  id: string,
  userId: string | Types.ObjectId
): Promise<IPopulatedMonitorDocument | null> => {
  const monitor = (await Monitor.findOneAndDelete({
    _id: id,
    userId,
  }).populate(monitorPopulate)) as unknown as IPopulatedMonitorDocument | null;

  if (!monitor) {
    return null;
  }

  await removeMonitorJob(monitor, monitor.interval);
  await invalidateDashboardCache();

  return monitor;
};

export const pauseMonitor = async (
  id: string,
  userId: string | Types.ObjectId
): Promise<IPopulatedMonitorDocument | null> => {
  const monitor = (await Monitor.findOne({
    _id: id,
    userId,
  }).populate(monitorPopulate)) as unknown as IPopulatedMonitorDocument | null;

  if (!monitor) {
    return null;
  }

  await removeMonitorJob(monitor, monitor.interval);

  monitor.active = false;
  await monitor.save();

  await invalidateDashboardCache();

  return monitor;
};

export const resumeMonitor = async (
  id: string,
  userId: string | Types.ObjectId
): Promise<IPopulatedMonitorDocument | null> => {
  const monitor = (await Monitor.findOne({
    _id: id,
    userId,
  }).populate(monitorPopulate)) as unknown as IPopulatedMonitorDocument | null;

  if (!monitor) {
    return null;
  }

  monitor.active = true;
  await monitor.save();

  const populatedMonitor = (await Monitor.findById(monitor._id).populate(
    monitorPopulate
  )) as unknown as IPopulatedMonitorDocument;

  await addMonitorJob(populatedMonitor);
  await invalidateDashboardCache();

  return populatedMonitor;
};
