import express, { type Router } from "express";
import { protect, isAdmin } from "../auth/auth.middleware.js";
import {
  getAllUsersController,
  disableUserController,
  enableUserController,
  updateUserRoleController,
  getMonitorStatsController,
  getAllIncidentsAdminController,
  getSystemStatsController,
} from "./admin.controller.js";

const router: Router = express.Router();

router.get("/users", protect, isAdmin, getAllUsersController);
router.get("/users/monitor-stats", protect, isAdmin, getMonitorStatsController);
router.get("/incidents", protect, isAdmin, getAllIncidentsAdminController);
router.get("/stats", protect, isAdmin, getSystemStatsController);
router.patch("/users/:id/disable", protect, isAdmin, disableUserController);
router.patch("/users/:id/enable", protect, isAdmin, enableUserController);
router.patch("/users/:id/role", protect, isAdmin, updateUserRoleController);

export default router;
