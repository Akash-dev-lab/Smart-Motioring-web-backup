import { redisConnection } from "../queues/queue.connection.js";

const DEFAULT_TTL = 30;

/**
 * Get cached value
 */
export const getCache = async (key) => {
    try {
        const value = await redisConnection.get(key);

        if (!value) {
            return null;
        }

        return JSON.parse(value);
    } catch (error) {
        console.error(`❌ Redis GET failed [${key}]:`, error.message);
        return null;
    }
};

/**
 * Set cached value
 */
export const setCache = async (
    key,
    value,
    ttl = DEFAULT_TTL
) => {
    try {
        await redisConnection.set(
            key,
            JSON.stringify(value),
            "EX",
            ttl
        );

        return true;
    } catch (error) {
        console.error(`❌ Redis SET failed [${key}]:`, error.message);
        return false;
    }
};

/**
 * Delete cached value
 */
export const deleteCache = async (key) => {
    try {
        await redisConnection.del(key);

        return true;
    } catch (error) {
        console.error(`❌ Redis DELETE failed [${key}]:`, error.message);
        return false;
    }
};

/**
 * Delete multiple cache keys
 */
export const deleteCacheByPattern = async (pattern) => {
    try {
        const keys = await redisConnection.keys(pattern);

        if (!keys.length) {
            return true;
        }

        await redisConnection.del(...keys);

        return true;
    } catch (error) {
        console.error(
            `❌ Redis pattern delete failed [${pattern}]:`,
            error.message
        );

        return false;
    }
};