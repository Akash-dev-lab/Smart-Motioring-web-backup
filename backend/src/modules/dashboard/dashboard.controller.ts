import type { Request, Response } from "express";
import Monitor from "../monitor/monitor.model.js";
import Log from "../logs/log.model.js";
import Incident from "../incident/incident.model.js";
import AIInsight from "../ai/ai.model.js";
import {
  DASHBOARD_SUMMARY_KEY,
  DASHBOARD_MONITORS_KEY,
  getCachedJson,
  setCachedJson,
} from "./dashboard.cache.js";
import type {
  DashboardSummary,
  DashboardMonitorAnalytics,
} from "./types/index.js";

export const getDashboardSummary = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const cached = await getCachedJson<DashboardSummary>(DASHBOARD_SUMMARY_KEY);

    if (cached) {
      res.json(cached);
      return;
    }

    const totalMonitors = await Monitor.countDocuments();
    const activeIncidents = await Incident.countDocuments({ status: "OPEN" });

    const totalLogs = await Log.countDocuments();
    const successLogs = await Log.countDocuments({ success: true });

    const uptime = totalLogs
      ? ((successLogs / totalLogs) * 100).toFixed(2)
      : 0;

    const summary: DashboardSummary = {
      totalMonitors,
      activeIncidents,
      uptime,
    };

    await setCachedJson(DASHBOARD_SUMMARY_KEY, summary);

    res.json(summary);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    res.status(500).json({ error: message });
  }
};

export const getAllMonitorsDashboard = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const cached = await getCachedJson<unknown[]>(DASHBOARD_MONITORS_KEY);

    if (cached) {
      res.json(cached);
      return;
    }

    const monitors = await Monitor.find().sort({ createdAt: -1 });

    const data = monitors.map((monitor) =>
      typeof monitor.toObject === "function" ? monitor.toObject() : monitor
    );

    await setCachedJson(DASHBOARD_MONITORS_KEY, data);

    res.json(data);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    res.status(500).json({ error: message });
  }
};

export const getIncidentTimeline = async (
  req: Request<{ monitorId: string }>,
  res: Response
): Promise<void> => {
  try {
    const { monitorId } = req.params;

    const incidents = await Incident.find({
      monitorId,
    } as unknown as Parameters<typeof Incident.find>[0]).sort({ createdAt: -1 });

    res.json(incidents);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    res.status(500).json({ error: message });
  }
};

export const getAIInsights = async (
  req: Request<{ monitorId: string }>,
  res: Response
): Promise<void> => {
  try {
    const { monitorId } = req.params;

    const insights = await AIInsight.find({
      monitorId,
    } as unknown as Parameters<typeof AIInsight.find>[0]).sort({ createdAt: -1 });

    res.json(insights);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    res.status(500).json({ error: message });
  }
};

export const getMonitorAnalytics = async (
  req: Request<{ monitorId: string }>,
  res: Response
): Promise<void> => {
  try {
    const { monitorId } = req.params;

    const logs = await Log.find({
      monitorId,
    } as unknown as Parameters<typeof Log.find>[0])
      .sort({ createdAt: -1 })
      .limit(50);

    const latency = logs.map((l) => l.responseTime);
    const successRate = logs.filter((l) => l.success).length;

    const responseData: DashboardMonitorAnalytics = {
      totalChecks: logs.length,
      successRate,
      latency,
    };

    res.json(responseData);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    res.status(500).json({ error: message });
  }
};
