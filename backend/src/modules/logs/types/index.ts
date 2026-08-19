import type { Document, Model, Types } from "mongoose";

// ─── Persisted Model ────────────────────────────────────────────────────────

export interface ILog {
  monitorId: Types.ObjectId;
  status: number;
  responseTime: number;
  success: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ILogDocument extends ILog, Document<Types.ObjectId> {}

export type ILogModel = Model<ILogDocument>;

// ─── Repository ─────────────────────────────────────────────────────────────

export interface LogQueryOptions {
  limit?: number;
  lean?: boolean;
}

// Accepts string monitorId from JS worker callers; Mongoose coerces to ObjectId at persist time
export interface CreateLogInput {
  monitorId: string | Types.ObjectId;
  status: number;
  responseTime: number;
  success: boolean;
  targetId?: string;
  region?: string;
}

// ─── Service / Analytics ────────────────────────────────────────────────────

export type MonitorAnalyticsRange = "1h" | "24h";

export interface MonitorAnalyticsTrendPoint {
  time: string;
  latency: number;
}

export interface MonitorAnalyticsResult {
  uptime: string;
  avgLatency: number;
  totalChecks: number;
  success: number;
  failures: number;
  status: "UP" | "DOWN";
  trend: MonitorAnalyticsTrendPoint[];
}

// ─── Internal Aggregation Result Shapes ─────────────────────────────────────

export interface AnalyticsSummary {
  _id: Types.ObjectId;
  totalChecks: number;
  avgLatency: number;
  success: number;
  failures: number;
}

export interface AnalyticsTimeSeriesPoint {
  _id: string;
  avgLatency: number;
}

export interface AnalyticsLatestLog {
  success: boolean;
}

export interface AnalyticsAggregationResult {
  summary: AnalyticsSummary[];
  timeseries: AnalyticsTimeSeriesPoint[];
  latest: AnalyticsLatestLog[];
}
