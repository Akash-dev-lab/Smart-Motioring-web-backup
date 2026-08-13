import express from "express";
import { register, login, refresh, logout } from "./auth.controller.js";
import { protect } from "./auth.middleware.js";
import { authRateLimiter } from "../../middleware/rateLimiter.js";

const router = express.Router();

router.post("/register", authRateLimiter, register);
router.post("/login", authRateLimiter, login);
router.post("/refresh", authRateLimiter, refresh);
router.post("/logout", protect, logout);

export default router;