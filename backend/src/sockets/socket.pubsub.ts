import type { Redis } from "ioredis";
import { redisConnection } from "../queues/queue.connection.js";
import { getIO } from "./socket.server.js";
import type { MonitorStatusPubSubPayload } from "./types/index.js";

const STATUS_CHANNEL = "socket:monitor-status";

let subscriber: Redis | null = null;
let initialized = false;

export const initializeSocketPubSub = async (): Promise<Redis | null> => {
  if (initialized) {
    return subscriber;
  }

  subscriber = redisConnection.duplicate();

  subscriber.on("connect", () => {
    console.log("🟢 Socket Pub/Sub Redis connected");
  });

  subscriber.on("ready", () => {
    console.log("🟢 Socket Pub/Sub Redis ready");
  });

  subscriber.on("error", (error: Error) => {
    console.error("🔴 Socket Pub/Sub Redis error:", error.message);
  });

  await subscriber.subscribe(STATUS_CHANNEL);

  subscriber.on("message", (channel: string, message: string) => {
    if (channel !== STATUS_CHANNEL) {
      return;
    }

    try {
      const event = JSON.parse(message) as unknown;

      if (!event || typeof event !== "object") {
        console.warn("⚠️ Invalid socket event received:", message);
        return;
      }

      const record = event as Record<string, unknown>;
      const { userId, ...payload } = record;

      if (!userId || typeof userId !== "string") {
        console.warn("⚠️ Socket event missing userId");
        return;
      }

      const room = `user:${userId}`;

      getIO().to(room).emit("monitor:status", payload);

      console.log(
        `📡 WebSocket event sent → ${room} → monitor ${String(payload.monitorId)}`
      );
    } catch (error: unknown) {
      const messageStr =
        error instanceof Error ? error.message : "Unknown error";
      console.error("❌ Failed to process socket event:", messageStr);
    }
  });

  initialized = true;

  console.log(
    `🟢 Socket Pub/Sub subscriber initialized: ${STATUS_CHANNEL}`
  );

  return subscriber;
};

export const publishMonitorStatus = async (
  payload: MonitorStatusPubSubPayload
): Promise<void> => {
  try {
    if (
      !payload ||
      typeof payload !== "object" ||
      !("userId" in payload) ||
      !("monitorId" in payload) ||
      !(payload as Record<string, unknown>).userId ||
      !(payload as Record<string, unknown>).monitorId
    ) {
      console.warn("⚠️ Invalid monitor status payload:", payload);
      return;
    }

    await redisConnection.publish(
      STATUS_CHANNEL,
      JSON.stringify(payload)
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Failed to publish monitor status:", message);
  }
};
