// src/modules/logs/log.routes.ts
import { Router } from "express";
import { getMonitorAnalyticsController } from "./log.controller.js";
import { protect } from "../auth/auth.middleware.js";

const router: Router = Router();

router.get("/analytics/:monitorId", protect, getMonitorAnalyticsController);

export default router;
