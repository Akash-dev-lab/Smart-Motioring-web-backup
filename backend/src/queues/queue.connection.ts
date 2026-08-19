import { Redis, type RedisOptions } from "ioredis";

export type RedisClient = Redis;
export type RedisConnectionOptions = RedisOptions;

const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";

const redisOptions: RedisOptions = {
  maxRetriesPerRequest: null,
};

export const redisConnection = new Redis(redisUrl, redisOptions);

redisConnection.on("connect", () => {
  console.log("🟢 Redis Connected");
});

redisConnection.on("ready", () => {
  console.log("🟢 Redis Ready");
});

redisConnection.on("error", (err: Error) => {
  console.error("🔴 Redis Error:", err.message);
});
