import { Queue } from "bullmq";
import { redisConnection } from "./queue.connection.js";

export const monitorQueue = new Queue("monitor-queue", {
  connection: redisConnection,
});