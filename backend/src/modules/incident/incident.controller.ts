import type { Request, Response } from "express";
import Incident from "./incident.model.js";

export const getIncidentsByMonitor = async (
  req: Request<{ monitorId: string }>,
  res: Response
): Promise<void> => {
  try {
    const { monitorId } = req.params;

    const incidents = await Incident.find({
      monitorId,
    } as unknown as Parameters<typeof Incident.find>[0])
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: incidents,
    });
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Internal server error";
    res.status(500).json({ error: errorMessage });
  }
};
