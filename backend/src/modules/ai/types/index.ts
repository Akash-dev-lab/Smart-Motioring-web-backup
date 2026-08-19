import type { Document, Model, Types } from "mongoose";

// ─── Status Enum ─────────────────────────────────────────────────────────────

export type AIInsightStatus =
  | "STABLE"
  | "UNSTABLE"
  | "DEGRADED"
  | "DOWN"
  | "ERROR"
  | "UNKNOWN";

// ─── Persisted Model ─────────────────────────────────────────────────────────

export interface IAIInsight {
  monitorId: Types.ObjectId;
  incidentId?: Types.ObjectId | null;
  status: AIInsightStatus;
  reason: string;
  suggestion: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAIInsightDocument
  extends IAIInsight,
    Document<Types.ObjectId> {}

export type IAIInsightModel = Model<IAIInsightDocument>;

// ─── Formatter Output ────────────────────────────────────────────────────────

export interface FormattedAIResponse {
  status: AIInsightStatus;
  reason: string;
  suggestion: string[];
}

// ─── Prompt Builder Input ────────────────────────────────────────────────────

export interface PromptBuilderMonitorParam {
  url?: string;
  method?: string;
  interval?: number;
}

export interface PromptBuilderLogParam {
  status: number;
  responseTime: number;
  success: boolean;
}

export interface PromptBuilderIncidentParam {
  message?: string;
}

export interface BuildPromptInput {
  monitor?: PromptBuilderMonitorParam | null;
  logs?: PromptBuilderLogParam[] | null;
  incident?: PromptBuilderIncidentParam | null;
}
