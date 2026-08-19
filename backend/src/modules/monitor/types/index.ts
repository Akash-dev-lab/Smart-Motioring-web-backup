import type { Document, Model, Types } from "mongoose";
import type { AllowedHttpMethod } from "../../../utils/constants.js";
import type { IMonitoringRegionDocument } from "../../monitoring-region/types/index.js";

// ── Target Subdocument Typing ─────────────────────────────────────────────────

export interface IMonitoringTarget<TRegion = Types.ObjectId> {
  _id?: Types.ObjectId;
  region: TRegion;
  enabled: boolean;
}

export type IPopulatedMonitoringTarget = IMonitoringTarget<IMonitoringRegionDocument>;

// ── Core Monitor Typing ───────────────────────────────────────────────────────

export interface IMonitor<TRegion = Types.ObjectId> {
  userId: Types.ObjectId;
  url: string;
  method: AllowedHttpMethod;
  interval: number;
  active: boolean;
  monitoringTargets: IMonitoringTarget<TRegion>[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IMonitorDocument
  extends IMonitor<Types.ObjectId>,
    Document<Types.ObjectId> {}

export type IPopulatedMonitorDocument = IMonitor<IMonitoringRegionDocument> &
  Document<Types.ObjectId>;

export type IMonitorModel = Model<IMonitorDocument>;

// ── Service Input / Query Types ──────────────────────────────────────────────

export interface CreateMonitoringTargetInput {
  region: string | Types.ObjectId;
  enabled?: boolean;
}

export interface CreateMonitorInput {
  userId: string | Types.ObjectId;
  url: string;
  method?: AllowedHttpMethod | string;
  interval?: number;
  active?: boolean;
  monitoringTargets?: CreateMonitoringTargetInput[];
}

export interface UpdateMonitorInput {
  url?: string;
  method?: AllowedHttpMethod | string;
  interval?: number;
  active?: boolean;
  monitoringTargets?: CreateMonitoringTargetInput[];
}

export interface GetAllMonitorsOptions {
  page?: number;
  limit?: number;
  search?: string;
  active?: boolean;
  method?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc" | string;
}

export interface PaginatedMonitorsResult {
  monitors: IPopulatedMonitorDocument[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ── Queue & Job Types ────────────────────────────────────────────────────────

export interface InitializedMonitorQueueInfo {
  regionKey: string;
  queueName: string;
}

export interface MonitorJobPayload {
  monitorId: string;
  targetId: string;
  url: string;
  method: string;
  region: string;
  regionName: string;
  provider: string;
}
