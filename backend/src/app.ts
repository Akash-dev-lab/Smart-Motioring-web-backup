import express, { type Request, type Response, type NextFunction, type ErrorRequestHandler } from "express";
import cors, { type CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import logRoutes from "./modules/logs/log.routes.js";
import monitorRoutes from "./modules/monitor/monitor.routes.js";
import aiRoutes from "./modules/ai/ai.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import incidentRoutes from "./modules/incident/incident.routes.js";
import { apiRateLimiter } from "./middleware/rateLimiter.js";
import adminRoutes from "./modules/admin/admin.routes.js";
import monitoringRegionRoutes from "./modules/monitoring-region/monitoring-region.routes.js";

const app = express();

// CORS Configuration
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions: CorsOptions = {
  origin: (
    requestOrigin: string | undefined,
    callback: (err: Error | null, origin?: boolean) => void
  ): void => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!requestOrigin) {
      callback(null, true);
      return;
    }

    // Check if origin is in allowed list
    if (allowedOrigins.includes(requestOrigin)) {
      callback(null, true);
      return;
    }

    // Reject all other origins
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Middleware
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(apiRateLimiter);

// Routes
app.use("/auth", authRoutes);
app.use("/logs", logRoutes);
app.use("/ai", aiRoutes);
app.use("/monitors", monitorRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/incidents", incidentRoutes);
app.use("/admin", adminRoutes);
app.use("/admin/monitoring-regions", monitoringRegionRoutes);

// Health check endpoint
app.get("/", (_req: Request, res: Response): void => {
  res.json({
    status: "ok",
    message: "Smart Monitoring API is running",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((_req: Request, res: Response): void => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
const errorHandler: ErrorRequestHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const error = err instanceof Error ? err : new Error("Internal server error");
  console.error(error.stack);
  res.status(500).json({ error: error.message || "Internal server error" });
};

app.use(errorHandler);

export default app;
