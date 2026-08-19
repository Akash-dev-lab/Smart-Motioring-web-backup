import type { Request, Response, CookieOptions } from "express";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
} from "./auth.service.js";

// Express.Request augmentation is applied via ./types/express.d.ts declaration merging

// ── Shared cookie options ─────────────────────────────────────────────────────

// Cross-origin cookie settings (Vercel → Render)
const ACCESS_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: true,       // Always true for production (HTTPS required)
  sameSite: "none",   // Required for cross-origin cookies
  maxAge: 60 * 60 * 1000, // 1 hour
};

const REFRESH_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const CLEAR_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
};

// ── REGISTER ──────────────────────────────────────────────────────────────────

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user, accessToken, refreshToken } = await registerUser(req.body);

    // Set HTTP-only cookies — tokens never sent in JSON
    res.cookie("accessToken", accessToken, ACCESS_COOKIE_OPTIONS);
    res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (err: unknown) {
    res.status(400).json({
      error: err instanceof Error ? err.message : "Registration failed",
    });
  }
};

// ── LOGIN ─────────────────────────────────────────────────────────────────────

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user, accessToken, refreshToken } = await loginUser(req.body);

    // Set HTTP-only cookies — tokens never sent in JSON
    res.cookie("accessToken", accessToken, ACCESS_COOKIE_OPTIONS);
    res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (err: unknown) {
    res.status(401).json({
      error: err instanceof Error ? err.message : "Login failed",
    });
  }
};

// ── REFRESH ───────────────────────────────────────────────────────────────────

export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken: string | undefined = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new Error("Refresh token not found");
    }

    const data = await refreshAccessToken(refreshToken);

    // Set new access token cookie with cross-origin settings
    res.cookie("accessToken", data.accessToken, ACCESS_COOKIE_OPTIONS);

    res.json({ message: "Token refreshed successfully" });
  } catch (err: unknown) {
    res.status(401).json({
      error: err instanceof Error ? err.message : "Token refresh failed",
    });
  }
};

// ── LOGOUT ────────────────────────────────────────────────────────────────────

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // req.user is set by protect middleware — safe to assert non-null here
    await logoutUser(req.user!.userId);

    // Clear cookies with same settings used to set them
    res.clearCookie("accessToken", CLEAR_COOKIE_OPTIONS);
    res.clearCookie("refreshToken", CLEAR_COOKIE_OPTIONS);

    res.json({ message: "Logged out successfully" });
  } catch (err: unknown) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "Logout failed",
    });
  }
};
