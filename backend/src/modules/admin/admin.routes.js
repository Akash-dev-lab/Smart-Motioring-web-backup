import express from "express";
import { protect, isAdmin } from "../auth/auth.middleware.js";
import { getAllUsersController, disableUserController, enableUserController } from "./admin.controller.js";

const router = express.Router();

router.get("/users", protect, isAdmin, getAllUsersController);

router.patch("/users/:id/disable", protect, isAdmin, disableUserController);
router.patch("/users/:id/enable", protect, isAdmin, enableUserController);

export default router;