import type { Request, Response } from "express";
import { getMonitorAnalytics } from "./log.service.js";
import type { MonitorAnalyticsRange } from "./types/index.js";

export const getMonitorAnalyticsController = async (
  req: Request<{ monitorId: string }>,
  res: Response
): Promise<void> => {
  try {
    const { monitorId } = req.params;

    // Express query values are string | string[] | ParsedQs | ParsedQs[] | undefined.
    // Narrow to string only; pass through for the service to apply its default ("24h").
    const rawRange = req.query.range;
    const range: MonitorAnalyticsRange | undefined =
      typeof rawRange === "string" ? (rawRange as MonitorAnalyticsRange) : undefined;

    const data = await getMonitorAnalytics(monitorId, range);
    res.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    res.status(500).json({ error: message });
  }
};
