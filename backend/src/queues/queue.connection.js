import IORedis from "ioredis";

export const redisConnection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

redisConnection.on("connect", () => {
  console.log("🟢 Redis Connected");
});

redisConnection.on("ready", () => {
  console.log("🟢 Redis Ready");
});

redisConnection.on("error", err => {
  console.error("🔴 Redis Error:", err.message);
});