import { Document, Model, UpdateQuery } from "mongoose";

export type MonitoringRegionProvider = string;

export interface IMonitoringRegion {
  key: string;
  name: string;
  provider: MonitoringRegionProvider;
  enabled: boolean;
  workerQueue: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IMonitoringRegionDocument extends IMonitoringRegion, Document {}

export type IMonitoringRegionModel = Model<IMonitoringRegionDocument>;

// ── Service & Repository Input Types ──────────────────────────────────────────

export interface CreateMonitoringRegionInput {
  key: string;
  name: string;
  provider?: string;
  enabled?: boolean;
  workerQueue: string;
}

export interface UpdateMonitoringRegionInput {
  key?: string;
  name?: string;
  provider?: string;
  enabled?: boolean;
  workerQueue?: string;
}

export interface NormalizedRegionData {
  key?: string;
  name?: string;
  provider?: string;
  enabled?: boolean;
  workerQueue?: string;
}

export interface FindRegionsFilter {
  enabled?: boolean;
}
