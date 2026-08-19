import type { Request, Response } from "express";
import mongoose from "mongoose";
import Monitor from "../monitor/monitor.model.js";
import Log from "../logs/log.model.js";
import Incident from "../incident/incident.model.js";
import { buildPrompt } from "./ai.promptBuilder.js";
import { callAI } from "./ai.service.js";
import { formatAIResponse } from "./ai.formatter.js";

export const getAIInsights = async (
  req: Request<{ monitorId: string }>,
  res: Response
): Promise<void> => {
  try {
    const { monitorId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(monitorId)) {
      res.status(400).json({
        message: "Invalid monitor ID",
      });
      return;
    }

    const monitor = await Monitor.findById(monitorId);

    if (!monitor) {
      console.log(monitor);
      res.status(404).json({ message: "Monitor not found" });
      return;
    }

    const logs = await Log.find({
      monitorId: new mongoose.Types.ObjectId(monitorId),
    })
      .sort({ createdAt: -1 })
      .limit(10);

    const incident = await Incident.findOne({
      monitorId: new mongoose.Types.ObjectId(monitorId),
      status: "OPEN",
    });

    if (!logs || logs.length === 0) {
      res.status(404).json({ message: "No logs found" });
      return;
    }

    const prompt = buildPrompt({ monitor, logs, incident });

    const rawAI = await callAI(prompt);

    const formatted = formatAIResponse(rawAI);

    res.json({
      monitorId,
      ai: formatted,
    });
  } catch (err: unknown) {
    console.error("❌ AI Controller Error:", err);

    res.status(500).json({
      message: "AI failed",
    });
  }
};
