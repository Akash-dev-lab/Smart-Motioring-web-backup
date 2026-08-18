// src/server.js

import "dotenv/config";

import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import dns from "dns";
import http from "http";
import { initializeSocketServer } from "./src/sockets/socket.server.js";
import { initializeSocketPubSub } from "./src/sockets/socket.pubsub.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

import { startBullWorker } from "./src/workers/monitor.worker.js";

const startServer = async () => {
  try {
    await connectDB();

    const httpServer = http.createServer(app);

    initializeSocketServer(httpServer);

    startBullWorker();

    httpServer.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });

    await initializeSocketPubSub();

  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

startServer();