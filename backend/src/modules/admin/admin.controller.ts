import type { Request, Response } from "express";
import {
  getAllUsers,
  disableUser,
  enableUser,
  updateUserRole,
  getMonitorStats,
  getAllIncidentsAdmin,
} from "./admin.service.js";
import { getSystemStats } from "./admin.stats.js";
import mongoose from "mongoose";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Safely coerce a ParsedQs value to a number, preserving NaN semantics. */
function queryNum(value: unknown): number {
  if (typeof value === "string") return Number(value);
  return NaN;
}

/** Safely coerce a ParsedQs value to a string or undefined. */
function queryStr(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  return undefined;
}

// ---------------------------------------------------------------------------
// Controllers
// ---------------------------------------------------------------------------

export const getAllUsersController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let page = queryNum(req.query.page ?? "1");
    let limit = queryNum(req.query.limit ?? "10");

    if (Number.isNaN(page)) page = 1;
    if (Number.isNaN(limit)) limit = 10;

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

    const result = await getAllUsers({ page, limit });

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      count: result.users.length,
      data: result.users,
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
    console.error("Admin get users error:", err);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const disableUserController = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
      return;
    }

    if (id === req.user?.userId?.toString()) {
      res.status(400).json({
        success: false,
        message: "Admin cannot disable their own account",
      });
      return;
    }

    const user = await disableUser(id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User disabled successfully",
      data: user,
    });
  } catch (err: unknown) {
    console.error("Disable user error:", err);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const enableUserController = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
      return;
    }

    const user = await enableUser(id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User enabled successfully",
      data: user,
    });
  } catch (err: unknown) {
    console.error("Enable user error:", err);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateUserRoleController = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body as { role: unknown };

    // 1. Validate user ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
      return;
    }

    // 2. Validate role
    if (!role || !["user", "admin"].includes(role as string)) {
      res.status(400).json({
        success: false,
        message: "Role must be either user or admin",
      });
      return;
    }

    // 3. Prevent admin from changing their own role
    if (id === req.user?.userId?.toString()) {
      res.status(400).json({
        success: false,
        message: "Admin cannot change their own role",
      });
      return;
    }

    // 4. Update role
    const result = await updateUserRole(id, role as string);

    if (result.type === "NOT_FOUND") {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    if (result.type === "NO_CHANGE") {
      res.status(400).json({
        success: false,
        message: `User is already ${role as string}`,
      });
      return;
    }

    if (result.type === "LAST_ADMIN") {
      res.status(400).json({
        success: false,
        message: "Cannot remove the last active admin",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: `User role updated to ${role as string}`,
      data: result.user,
    });
  } catch (err: unknown) {
    console.error("Update user role error:", err);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getMonitorStatsController = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const stats = await getMonitorStats();

    res.status(200).json({
      success: true,
      message: "Monitor statistics fetched successfully",
      data: stats,
    });
  } catch (err: unknown) {
    console.error("Admin monitor stats error:", err);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getAllIncidentsAdminController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let page = queryNum(req.query.page ?? "1");
    let limit = queryNum(req.query.limit ?? "10");
    const status = queryStr(req.query.status);

    if (Number.isNaN(page)) page = 1;
    if (Number.isNaN(limit)) limit = 10;

    // Pagination validation
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

    // Status validation
    if (status && !["OPEN", "RESOLVED"].includes(status)) {
      res.status(400).json({
        success: false,
        message: "Status must be OPEN or RESOLVED",
      });
      return;
    }

    const result = await getAllIncidentsAdmin({ page, limit, status });

    res.status(200).json({
      success: true,
      message: "Incidents fetched successfully",
      count: result.incidents.length,
      data: result.incidents,
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
    console.error("Admin incident logs error:", err);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getSystemStatsController = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const stats = await getSystemStats();

    res.status(200).json({
      success: true,
      message: "System statistics fetched successfully",
      data: stats,
    });
  } catch (err: unknown) {
    console.error("Admin system stats error:", err);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
