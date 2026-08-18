import express from "express";
import {
  createMonitoringRegionController,
  getMonitoringRegionsController,
  getMonitoringRegionByIdController,
  updateMonitoringRegionController,
  deleteMonitoringRegionController,
} from "./monitoring-region.controller.js";
import { protect, isAdmin } from "../auth/auth.middleware.js";

const router = express.Router();

router.use(protect, isAdmin);

router.post("/", createMonitoringRegionController);
router.get("/", getMonitoringRegionsController);
router.get("/:id", getMonitoringRegionByIdController);
router.patch("/:id", updateMonitoringRegionController);
router.delete("/:id", deleteMonitoringRegionController);

export default router;