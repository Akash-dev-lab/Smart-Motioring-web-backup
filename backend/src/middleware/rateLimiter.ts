import type { Request, Response, NextFunction } from "express";
import { redisConnection } from "../queues/queue.connection.js";

// Express.Request augmentation is applied via ../modules/auth/types/express.d.ts declaration merging

// ── Lua atomic INCR / EXPIRE / TTL script ────────────────────────────────────
const RATE_LIMIT_SCRIPT = `
local current = redis.call("INCR", KEYS[1])

if current == 1 then
  redis.call("EXPIRE", KEYS[1], ARGV[1])
end

local ttl = redis.call("TTL", KEYS[1])

return { current, ttl }
`;

// ── Factory config type ───────────────────────────────────────────────────────

interface RateLimiterOptions {
  windowSeconds?: number;
  maxRequests?: number;
  keyPrefix?: string;
}

// ── Factory ───────────────────────────────────────────────────────────────────

const createRateLimiter = ({
  windowSeconds = 15 * 60,
  maxRequests = 100,
  keyPrefix = "rate-limit",
}: RateLimiterOptions) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const identifier: string =
        req.user?.userId ??
        req.ip ??
        req.socket.remoteAddress ??
        "unknown";

      const key = `${keyPrefix}:${identifier}`;

      // Redis EVAL returns an array; type as [number, number] tuple
      const result = await redisConnection.eval(
        RATE_LIMIT_SCRIPT,
        1,
        key,
        windowSeconds
      ) as [number, number];

      const [current, ttl] = result;

      const remaining = Math.max(maxRequests - Number(current), 0);

      res.setHeader("X-RateLimit-Limit", maxRequests);
      res.setHeader("X-RateLimit-Remaining", remaining);
      res.setHeader("X-RateLimit-Reset", Number(ttl));

      if (Number(current) > maxRequests) {
        res.status(429).json({
          success: false,
          message: "Too many requests. Please try again later.",
          retryAfter: Number(ttl),
        });
        return;
      }

      next();
    } catch (error: unknown) {
      console.error("Rate limiter error:", error);

      // Redis failure must NOT take the whole API down — fail-open
      next();
    }
  };
};

// ── Named limiters ────────────────────────────────────────────────────────────

export const apiRateLimiter = createRateLimiter({
  windowSeconds: 15 * 60,
  maxRequests: 100,
  keyPrefix: "rate-limit:api",
});

export const authRateLimiter = createRateLimiter({
  windowSeconds: 15 * 60,
  maxRequests: 10,
  keyPrefix: "rate-limit:auth",
});
