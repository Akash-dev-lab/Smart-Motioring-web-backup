import express from "express";
import { 
  createMonitorController, 
  getAllMonitorsController, 
  getMonitorByIdController,
  updateMonitorController, 
  deleteMonitorController,
  pauseMonitorController,
  resumeMonitorController
} from "./monitor.controller.js";
import { protect, isAdmin } from "../auth/auth.middleware.js";
// import { getAllMonitorsAdmin } from "./monitor.service.js";

const router = express.Router();

router.post("/", protect, createMonitorController);
router.get("/", protect, getAllMonitorsController);
router.get("/:id", protect, getMonitorByIdController);
router.put("/:id", protect, updateMonitorController);
router.delete("/:id", protect, deleteMonitorController);
router.patch("/:id/pause", protect, pauseMonitorController);
router.patch("/:id/resume", protect, resumeMonitorController);

// 🔥 admin → ALL monitors (global view)
// router.get("/admin/all", protect, isAdmin, async (req, res) => {
//   try {
//     const monitors = await getAllMonitorsAdmin();
//     res.json({
//       success: true,
//       count: monitors.length,
//       data: monitors
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

export default router;