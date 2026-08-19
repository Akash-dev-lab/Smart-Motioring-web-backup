import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import User from "./auth.model.js";
import type { AuthJwtPayload } from "./types/index.js";

// Express.Request augmentation is applied via types/express.d.ts declaration merging

// ── 🔒 protect ────────────────────────────────────────────────────────────────

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token: string | undefined = req.cookies.accessToken;

    if (!token) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as AuthJwtPayload;

    const user = await User.findById(decoded.userId)
      .select("_id role isActive")
      .lean();

    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({
        error: "Account is disabled. Please contact admin.",
      });
      return;
    }

    req.user = {
      userId: (user._id as { toString(): string }).toString(),
      role: user.role as Express.AuthenticatedUser["role"],
    };

    next();
  } catch (_err: unknown) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// ── 🛡️ isAdmin ────────────────────────────────────────────────────────────────

export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role !== "admin") {
    res.status(403).json({ error: "Admin access only" });
    return;
  }
  next();
};
