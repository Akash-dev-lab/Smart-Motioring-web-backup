import type { Document, Model, Types } from "mongoose";

// ─── Enums ───────────────────────────────────────────────────────────────────

export type AlertType = "EMAIL" | "WEBHOOK";
export type AlertStatus = "SENT" | "FAILED";

// ─── Nested AI Payload ───────────────────────────────────────────────────────

export interface IAlertAI {
  status?: string;
  reason?: string;
  suggestion?: string[];
}

// ─── Persisted Model ─────────────────────────────────────────────────────────

export interface IAlert {
  monitorId: Types.ObjectId;
  incidentId: Types.ObjectId;
  type?: AlertType;
  status: AlertStatus;
  message: string;
  ai?: IAlertAI | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAlertDocument extends IAlert, Document<Types.ObjectId> {}

export type IAlertModel = Model<IAlertDocument>;

// ─── Email Service Input ─────────────────────────────────────────────────────

export interface SendEmailAlertInput {
  to: string;
  subject: string;
  text: string;
}

// ─── Alert Service Input ─────────────────────────────────────────────────────

export interface TriggerAlertIncidentParam {
  _id: Types.ObjectId | string;
  monitorId: Types.ObjectId | string;
  failCount: number;
}

export interface TriggerAlertInput {
  monitorId: string | Types.ObjectId;
  incident: TriggerAlertIncidentParam;
}
