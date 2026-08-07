// src/server.js

import "dotenv/config";

import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";

import { startScheduler } from "./src/modules/monitor/monitor.scheduler.js";
import { startBullWorker } from "./src/workers/monitor.worker.js";


const startServer = async () => {
  try {
    await connectDB();

    startScheduler();

    startBullWorker();

    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });

  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

startServer();