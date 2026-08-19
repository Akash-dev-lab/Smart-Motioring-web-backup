import mongoose from "mongoose";
import type { Request, Response } from "express";
import {
  createMonitor,
  getAllMonitors,
  getMonitorById,
  updateMonitorById,
  deleteMonitorById,
  pauseMonitor,
  resumeMonitor,
} from "./monitor.service.js";

// Express.Request augmentation is applied via ../auth/types/express.d.ts declaration merging

export const createMonitorController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { url, method, interval, monitoringTargets } = req.body;

    if (!url) {
      res.status(400).json({
        success: false,
        message: "URL is required",
      });
      return;
    }

    if (!method) {
      res.status(400).json({
        success: false,
        message: "HTTP method is required",
      });
      return;
    }

    if (interval == null) {
      res.status(400).json({
        success: false,
        message: "Interval is required",
      });
      return;
    }

    if (!Array.isArray(monitoringTargets)) {
      res.status(400).json({
        success: false,
        message: "monitoringTargets must be an array",
      });
      return;
    }

    if (!monitoringTargets.length) {
      res.status(400).json({
        success: false,
        message: "monitoringTargets array must be hold a value.",
      });
      return;
    }

    const monitor = await createMonitor({
      url,
      method,
      interval,
      monitoringTargets,
      userId: req.user!.userId,
    });

    res.status(201).json({
      success: true,
      message: "Monitor created successfully",
      data: monitor,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (
        err.name === "ValidationError" ||
        err.name === "CastError" ||
        err.message.includes("required") ||
        err.message.includes("monitoring target") ||
        err.message.includes("monitoring regions") ||
        err.message.includes("Duplicate")
      ) {
        res.status(400).json({
          success: false,
          message: err.message,
        });
        return;
      }

      res.status(409).json({
        success: false,
        message: err.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getAllMonitorsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const pageRaw = req.query.page;
    const limitRaw = req.query.limit;
    const search =
      typeof req.query.search === "string" ? req.query.search : "";
    const active =
      typeof req.query.active === "string" ? req.query.active : undefined;
    const method =
      typeof req.query.method === "string" ? req.query.method : undefined;
    const sortBy =
      typeof req.query.sortBy === "string" ? req.query.sortBy : "createdAt";
    const sortOrder =
      typeof req.query.sortOrder === "string" ? req.query.sortOrder : "desc";

    const page = pageRaw !== undefined ? Number(pageRaw) : 1;
    const limit = limitRaw !== undefined ? Number(limitRaw) : 10;

    if (!Number.isInteger(page) || page < 1) {
      res.status(400).json({
        success: false,
        message: "Page must be a positive integer",
      });
      return;
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      res.status(400).json({
        success: false,
        message: "Limit must be between 1 and 100",
      });
      return;
    }

    if (active !== undefined && active !== "true" && active !== "false") {
      res.status(400).json({
        success: false,
        message: "Active must be true or false",
      });
      return;
    }

    const activeFilter =
      active === undefined ? undefined : active === "true";

    const result = await getAllMonitors(req.user!.userId, {
      page,
      limit,
      search,
      active: activeFilter,
      method,
      sortBy,
      sortOrder,
    });

    res.json({
      success: true,
      message: "Monitors fetched successfully",
      count: result.monitors.length,
      data: result.monitors,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
        hasNextPage: result.page < result.totalPages,
        hasPreviousPage: result.page > 1,
      },
    });
  } catch (err: unknown) {
    console.error("Get monitors error:", err);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getMonitorByIdController = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid monitor ID",
      });
      return;
    }

    const monitor = await getMonitorById(id, req.user!.userId);

    if (!monitor) {
      res.status(404).json({
        success: false,
        message: "Monitor not found or unauthorized",
      });
      return;
    }

    res.json({
      success: true,
      message: "Monitor fetched successfully",
      data: monitor,
    });
  } catch (_err: unknown) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateMonitorController = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid monitor ID",
      });
      return;
    }

    const updated = await updateMonitorById(
      id,
      req.user!.userId,
      req.body
    );

    if (!updated) {
      res.status(404).json({
        success: false,
        message: "Monitor not found or unauthorized",
      });
      return;
    }

    res.json({
      success: true,
      message: "Monitor updated successfully",
      data: updated,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (
        err.name === "ValidationError" ||
        err.name === "CastError" ||
        err.message.includes("monitoring target") ||
        err.message.includes("monitoring regions") ||
        err.message.includes("Duplicate")
      ) {
        res.status(400).json({
          success: false,
          message: err.message,
        });
        return;
      }
    }

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const deleteMonitorController = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid monitor ID",
      });
      return;
    }

    const deleted = await deleteMonitorById(id, req.user!.userId);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: "Monitor not found or unauthorized",
      });
      return;
    }

    res.json({ success: true, message: "Monitor deleted" });
  } catch (_err: unknown) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const pauseMonitorController = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const monitor = await pauseMonitor(id, req.user!.userId);

    if (!monitor) {
      res.status(404).json({
        success: false,
        message: "Monitor not found",
      });
      return;
    }

    res.json({
      success: true,
      message: "Monitor paused successfully",
      data: monitor,
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "CastError") {
      res.status(400).json({
        success: false,
        message: "Invalid monitor ID",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const resumeMonitorController = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const monitor = await resumeMonitor(id, req.user!.userId);

    if (!monitor) {
      res.status(404).json({
        success: false,
        message: "Monitor not found",
      });
      return;
    }

    res.json({
      success: true,
      message: "Monitor resumed successfully",
      data: monitor,
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "CastError") {
      res.status(400).json({
        success: false,
        message: "Invalid monitor ID",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
