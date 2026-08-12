import { redisConnection } from "../queues/queue.connection.js";

const RATE_LIMIT_SCRIPT = `
local current = redis.call("INCR", KEYS[1])

if current == 1 then
  redis.call("EXPIRE", KEYS[1], ARGV[1])
end

local ttl = redis.call("TTL", KEYS[1])

return { current, ttl }
`;

const createRateLimiter = ({
    windowSeconds = 15 * 60,
    maxRequests = 100,
    keyPrefix = "rate-limit",
}) => {
    return async (req, res, next) => {
        try {
            const identifier =
                req.user?.userId ||
                req.ip ||
                req.socket.remoteAddress ||
                "unknown";

            const key = `${keyPrefix}:${identifier}`;

            const [current, ttl] = await redisConnection.eval(
                RATE_LIMIT_SCRIPT,
                1,
                key,
                windowSeconds
            );

            const remaining = Math.max(maxRequests - Number(current), 0);

            res.setHeader("X-RateLimit-Limit", maxRequests);
            res.setHeader("X-RateLimit-Remaining", remaining);
            res.setHeader("X-RateLimit-Reset", Number(ttl));

            if (Number(current) > maxRequests) {
                return res.status(429).json({
                    success: false,
                    message: "Too many requests. Please try again later.",
                    retryAfter: Number(ttl),
                });
            }

            next();
        } catch (error) {
            console.error("Rate limiter error:", error);

            // Redis failure should NOT take the whole API down.
            next();
        }
    };
};

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