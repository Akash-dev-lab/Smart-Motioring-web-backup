import type { Document, Model, Types } from "mongoose";

// ─── Enum ────────────────────────────────────────────────────────────────────

export type IncidentStatus = "OPEN" | "RESOLVED";

// ─── Persisted Model ─────────────────────────────────────────────────────────

export interface IIncident {
  monitorId: Types.ObjectId;
  status: IncidentStatus;
  message?: string;
  failCount: number;
  startedAt: Date;
  resolvedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IIncidentDocument extends IIncident, Document<Types.ObjectId> {}

export type IIncidentModel = Model<IIncidentDocument>;

// ─── Service Input ───────────────────────────────────────────────────────────

// Processor/worker callers pass monitorId as string from job.data.
// Mongoose coerces string → ObjectId at persist time.
export interface CreateIncidentInput {
  monitorId: string | Types.ObjectId;
  failCount: number;
}

