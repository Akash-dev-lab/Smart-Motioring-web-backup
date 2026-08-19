import type { Request, Response } from "express";
import {
  createMonitoringRegion,
  getMonitoringRegions,
  getMonitoringRegionById,
  updateMonitoringRegion,
  deleteMonitoringRegion,
} from "./monitoring-region.service.js";

const handleError = (res: Response, err: unknown): void => {
  if (err instanceof Error) {
    if (
      err.name === "ValidationError" ||
      err.message.includes("already exists")
    ) {
      res.status(400).json({ success: false, message: err.message });
      return;
    }

    if (err.message === "Monitoring region not found") {
      res.status(404).json({ success: false, message: err.message });
      return;
    }

    if (err.message === "Invalid monitoring region ID") {
      res.status(400).json({ success: false, message: err.message });
      return;
    }
  }

  console.error("Monitoring region error:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};

export const createMonitoringRegionController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const region = await createMonitoringRegion(req.body);
    res.status(201).json({
      success: true,
      message: "Monitoring region created successfully",
      data: region,
    });
  } catch (err: unknown) {
    handleError(res, err);
  }
};

export const getMonitoringRegionsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const enabledQuery = req.query.enabled;
    let enabled: boolean | undefined;

    if (enabledQuery !== undefined) {
      if (
        typeof enabledQuery !== "string" ||
        !["true", "false"].includes(enabledQuery)
      ) {
        res.status(400).json({
          success: false,
          message: "enabled must be true or false",
        });
        return;
      }
      enabled = enabledQuery === "true";
    }

    const regions = await getMonitoringRegions({ enabled });
    res.json({ success: true, count: regions.length, data: regions });
  } catch (err: unknown) {
    handleError(res, err);
  }
};

export const getMonitoringRegionByIdController = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const region = await getMonitoringRegionById(req.params.id);
    res.json({ success: true, data: region });
  } catch (err: unknown) {
    handleError(res, err);
  }
};

export const updateMonitoringRegionController = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const region = await updateMonitoringRegion(req.params.id, req.body);
    res.json({
      success: true,
      message: "Monitoring region updated successfully",
      data: region,
    });
  } catch (err: unknown) {
    handleError(res, err);
  }
};

export const deleteMonitoringRegionController = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    await deleteMonitoringRegion(req.params.id);
    res.json({
      success: true,
      message: "Monitoring region deleted successfully",
    });
  } catch (err: unknown) {
    handleError(res, err);
  }
};
