import { redisConnection } from "../queues/queue.connection.js";

const DEFAULT_TTL = 30;

/**
 * Get cached value parsed as JSON.
 */
export const getCache = async <T = unknown>(key: string): Promise<T | null> => {
  try {
    const value = await redisConnection.get(key);

    if (!value) {
      return null;
    }

    return JSON.parse(value) as T;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`❌ Redis GET failed [${key}]:`, message);
    return null;
  }
};

/**
 * Set cached value serialized as JSON.
 */
export const setCache = async <T = unknown>(
  key: string,
  value: T,
  ttl: number = DEFAULT_TTL
): Promise<boolean> => {
  try {
    await redisConnection.set(key, JSON.stringify(value), "EX", ttl);
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`❌ Redis SET failed [${key}]:`, message);
    return false;
  }
};

/**
 * Delete cached key.
 */
export const deleteCache = async (key: string): Promise<boolean> => {
  try {
    await redisConnection.del(key);
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`❌ Redis DELETE failed [${key}]:`, message);
    return false;
  }
};

/**
 * Delete multiple cache keys matching a glob pattern.
 */
export const deleteCacheByPattern = async (
  pattern: string
): Promise<boolean> => {
  try {
    const keys = await redisConnection.keys(pattern);

    if (!keys.length) {
      return true;
    }

    await redisConnection.del(...keys);
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`❌ Redis pattern delete failed [${pattern}]:`, message);
    return false;
  }
};
