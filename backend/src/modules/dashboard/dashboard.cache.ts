import { redisConnection } from "../../queues/queue.connection.js";

export const DASHBOARD_CACHE_TTL = 15;

export const DASHBOARD_SUMMARY_KEY = "dashboard:summary";
export const DASHBOARD_MONITORS_KEY = "dashboard:monitors";

export const getCachedJson = async <T = unknown>(
  key: string
): Promise<T | null> => {
  try {
    const cached = await redisConnection.get(key);

    if (!cached) {
      console.log(`🟡 Dashboard cache MISS: ${key}`);
      return null;
    }

    console.log(`🟢 Dashboard cache HIT: ${key}`);
    return JSON.parse(cached) as T;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`⚠️ Dashboard cache read failed: ${key}`, message);
    return null;
  }
};

export const setCachedJson = async <T>(
  key: string,
  value: T
): Promise<void> => {
  try {
    await redisConnection.set(
      key,
      JSON.stringify(value),
      "EX",
      DASHBOARD_CACHE_TTL
    );

    console.log(`💾 Dashboard cache SET: ${key} | TTL ${DASHBOARD_CACHE_TTL}s`);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`⚠️ Dashboard cache write failed: ${key}`, message);
  }
};

export const invalidateDashboardCache = async (): Promise<void> => {
  try {
    await redisConnection.del(
      DASHBOARD_SUMMARY_KEY,
      DASHBOARD_MONITORS_KEY
    );

    console.log("🧹 Dashboard cache invalidated");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("⚠️ Dashboard cache invalidation failed:", message);
  }
};
