import jwt from "jsonwebtoken";
import User from "../modules/auth/auth.model.js";
import type { AuthenticatedSocket } from "./types/index.js";

const getCookieValue = (
  cookieHeader: string | undefined,
  name: string
): string | null => {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";");

  for (const cookie of cookies) {
    const [key, ...valueParts] = cookie.trim().split("=");

    if (key === name) {
      return decodeURIComponent(valueParts.join("="));
    }
  }

  return null;
};

export const authenticateSocket = async (
  socket: AuthenticatedSocket,
  next: (err?: Error) => void
): Promise<void> => {
  try {
    const token = getCookieValue(
      socket.handshake.headers.cookie,
      "accessToken"
    );

    if (!token) {
      return next(new Error("Authentication required"));
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return next(new Error("JWT_SECRET is not configured"));
    }

    const decoded = jwt.verify(token, secret);

    if (
      !decoded ||
      typeof decoded !== "object" ||
      !("userId" in decoded) ||
      typeof (decoded as Record<string, unknown>).userId !== "string"
    ) {
      return next(new Error("Invalid token payload"));
    }

    const userId = (decoded as { userId: string }).userId;

    const user = await User.findById(userId).select("_id role isActive");

    if (!user) {
      return next(new Error("User not found"));
    }

    if (!user.isActive) {
      return next(new Error("Account is disabled"));
    }

    socket.user = {
      userId: user._id.toString(),
      role: user.role,
    };

    next();
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Socket authentication failed:", message);

    next(new Error("Invalid or expired authentication"));
  }
};
