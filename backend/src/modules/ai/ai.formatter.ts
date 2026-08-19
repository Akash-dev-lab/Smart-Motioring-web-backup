import type { AIInsightStatus, FormattedAIResponse } from "./types/index.js";

const VALID_STATUSES: readonly AIInsightStatus[] = [
  "STABLE",
  "UNSTABLE",
  "DEGRADED",
  "DOWN",
  "ERROR",
  "UNKNOWN",
];

export const formatAIResponse = (
  raw: string | null | undefined
): FormattedAIResponse => {
  try {
    if (!raw) throw new Error("Empty AI response");

    const jsonMatch = raw.match(/\{[\s\S]*\}/);

    if (!jsonMatch) throw new Error("No JSON found");

    const parsed: unknown = JSON.parse(jsonMatch[0]);

    if (!parsed || typeof parsed !== "object") {
      throw new Error("Invalid JSON structure");
    }

    const parsedRecord = parsed as Record<string, unknown>;

    // 🔥 NORMALIZE SUGGESTIONS (CRITICAL FIX)
    let suggestions: string[] = [];
    if (Array.isArray(parsedRecord.suggestion)) {
      suggestions = parsedRecord.suggestion.map((s: unknown) => String(s));
    } else if (parsedRecord.suggestion) {
      suggestions = [String(parsedRecord.suggestion)];
    }

    const rawStatus =
      typeof parsedRecord.status === "string"
        ? parsedRecord.status.toUpperCase()
        : "";

    const status: AIInsightStatus = VALID_STATUSES.includes(
      rawStatus as AIInsightStatus
    )
      ? (rawStatus as AIInsightStatus)
      : "UNKNOWN";

    const reason =
      typeof parsedRecord.reason === "string" && parsedRecord.reason
        ? parsedRecord.reason
        : "No reason provided";

    return {
      status,
      reason,
      suggestion: suggestions,
    };
  } catch (_err: unknown) {
    return {
      status: "ERROR",
      reason: "AI parsing failed",
      suggestion: raw ? [raw] : ["No AI response"],
    };
  }
};
