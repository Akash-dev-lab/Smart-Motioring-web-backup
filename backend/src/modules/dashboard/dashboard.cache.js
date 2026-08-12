import { redisConnection } from "../../queues/queue.connection.js";

export const DASHBOARD_CACHE_TTL = 15;

export const DASHBOARD_SUMMARY_KEY = "dashboard:summary";
export const DASHBOARD_MONITORS_KEY = "dashboard:monitors";

export const getCachedJson = async key => {
    try {
        const cached = await redisConnection.get(key);

        if (!cached) {
            console.log(`🟡 Dashboard cache MISS: ${key}`);
            return null;
        }

        console.log(`🟢 Dashboard cache HIT: ${key}`);
        return JSON.parse(cached);
    } catch (err) {
        console.error(`⚠️ Dashboard cache read failed: ${key}`, err.message);
        return null;
    }
};

export const setCachedJson = async (key, value) => {
    try {
        await redisConnection.set(
            key,
            JSON.stringify(value),
            "EX",
            DASHBOARD_CACHE_TTL
        );

        console.log(`💾 Dashboard cache SET: ${key} | TTL ${DASHBOARD_CACHE_TTL}s`);
    } catch (err) {
        console.error(`⚠️ Dashboard cache write failed: ${key}`, err.message);
    }
};

export const invalidateDashboardCache = async () => {
    try {
        await redisConnection.del(
            DASHBOARD_SUMMARY_KEY,
            DASHBOARD_MONITORS_KEY
        );

        console.log("🧹 Dashboard cache invalidated");
    } catch (err) {
        console.error("⚠️ Dashboard cache invalidation failed:", err.message);
    }
};
