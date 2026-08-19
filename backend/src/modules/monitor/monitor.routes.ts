import express, { type Router } from "express";
import {
  createMonitorController,
  getAllMonitorsController,
  getMonitorByIdController,
  updateMonitorController,
  deleteMonitorController,
  pauseMonitorController,
  resumeMonitorController,
} from "./monitor.controller.js";
import { protect } from "../auth/auth.middleware.js";

const router: Router = express.Router();

router.post("/", protect, createMonitorController);
router.get("/", protect, getAllMonitorsController);
router.get("/:id", protect, getMonitorByIdController);
router.put("/:id", protect, updateMonitorController);
router.delete("/:id", protect, deleteMonitorController);
router.patch("/:id/pause", protect, pauseMonitorController);
router.patch("/:id/resume", protect, resumeMonitorController);

export default router;
