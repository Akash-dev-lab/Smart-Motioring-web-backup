import { Router } from "express";
import { getAIInsights } from "./ai.controller.js";
import { protect } from "../auth/auth.middleware.js";

const router: Router = Router();

router.get("/insights/:monitorId", protect, getAIInsights);

export default router;
