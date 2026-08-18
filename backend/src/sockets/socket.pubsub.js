import { redisConnection } from "../queues/queue.connection.js";
import { getIO } from "./socket.server.js";

const STATUS_CHANNEL = "socket:monitor-status";

let subscriber = null;
let initialized = false;

export const initializeSocketPubSub = async () => {
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

    subscriber.on("error", (error) => {
        console.error(
            "🔴 Socket Pub/Sub Redis error:",
            error.message
        );
    });

    await subscriber.subscribe(STATUS_CHANNEL);

    subscriber.on("message", (channel, message) => {
        if (channel !== STATUS_CHANNEL) {
            return;
        }

        try {
            const event = JSON.parse(message);

            if (!event || typeof event !== "object") {
                console.warn(
                    "⚠️ Invalid socket event received:",
                    message
                );
                return;
            }

            const { userId, ...payload } = event;

            if (!userId) {
                console.warn(
                    "⚠️ Socket event missing userId"
                );
                return;
            }

            const room = `user:${userId}`;

            getIO()
                .to(room)
                .emit("monitor:status", payload);

            console.log(
                `📡 WebSocket event sent → ${room} → monitor ${payload.monitorId}`
            );
        } catch (error) {
            console.error(
                "❌ Failed to process socket event:",
                error.message
            );
        }
    });

    initialized = true;

    console.log(
        `🟢 Socket Pub/Sub subscriber initialized: ${STATUS_CHANNEL}`
    );

    return subscriber;
};

export const publishMonitorStatus = async (payload) => {
    try {
        if (
            !payload ||
            typeof payload !== "object" ||
            !payload.userId ||
            !payload.monitorId
        ) {
            console.warn(
                "⚠️ Invalid monitor status payload:",
                payload
            );
            return;
        }

        await redisConnection.publish(
            STATUS_CHANNEL,
            JSON.stringify(payload)
        );
    } catch (error) {
        console.error(
            "❌ Failed to publish monitor status:",
            error.message
        );
    }
};