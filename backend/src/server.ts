// src/server.ts

import "dotenv/config";

import app from "./app.js";
import { connectDB } from "./config/db.js";
import dns from "dns";
import http from "http";
import { initializeSocketServer } from "./sockets/socket.server.js";
import { initializeSocketPubSub } from "./sockets/socket.pubsub.js";
import mongoose from "mongoose";
import { redisConnection } from "./queues/queue.connection.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

import { stopRegionalWorkers, startBullWorker } from "./workers/monitor.worker.js";

let httpServer: http.Server;
let pubsubSubscriber: unknown;

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    httpServer = http.createServer(app);

    const io = initializeSocketServer(httpServer);

    startBullWorker();

    const port = process.env.PORT || "3000";

    httpServer.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });

    pubsubSubscriber = await initializeSocketPubSub();

  } catch (err: unknown) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

const gracefulShutdown = async (signal: string): Promise<void> => {
  console.log(`\n🛑 ${signal} received. Starting graceful shutdown...`);

  try {
    // Stop accepting new connections
    if (httpServer) {
      httpServer.close(() => {
        console.log("✅ HTTP server closed");
      });
    }

    // Stop BullMQ workers
    await stopRegionalWorkers();

    // Close Redis connections
    if (redisConnection) {
      await redisConnection.quit();
      console.log("✅ Redis connection closed");
    }

    // Close MongoDB connection
    await mongoose.connection.close();
    console.log("✅ MongoDB connection closed");

    console.log("✅ Graceful shutdown complete");
    process.exit(0);
  } catch (err: unknown) {
    console.error("❌ Error during shutdown:", err);
    process.exit(1);
  }
};

// Handle graceful shutdown signals
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

startServer();
