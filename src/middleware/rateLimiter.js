import redisClient from "../config/redis.js";
import fs from "fs";
console.log("RATE LIMITER FILE LOADED");
const luaScript = fs.readFileSync(
    new URL("./rateLimiter/rateLimiter.lua", import.meta.url),
    "utf8"
);

export default function createRateLimiter({ maxTokens,
    refillRate,
    keyGenerator = (req) => req.ip ,
    bucketKeyGenerator = (identity) => identity,
    identityErrorMessage = "Client identity is required",
  identityType = "ip"}) {

    return async function rateLimiter(req, res, next) {
        const identity = keyGenerator(req);
        const bucketIdentity = bucketKeyGenerator(identity);

if (!identity) {
    return res.status(400).json({
        message: identityErrorMessage
    });
}

const key = `rate_limit:${bucketIdentity}`;

        try {
            const result = await redisClient.eval(luaScript, {
                keys: [key],
                arguments: [
                    maxTokens.toString(),
                    refillRate.toString(),
                    Date.now().toString()
                ]
            });

            console.log("LUA RESULT:", result);

   if (result[0] === 1) {
    await redisClient.incr("metrics:allowed");
await redisClient.incr(`metrics:allowed:${req.path}`);
await redisClient.incr(
    `metrics:allowed:client:${identityType}:${identity}`
);
    
    res.setHeader("X-RateLimit-Limit", maxTokens);
    res.setHeader("X-RateLimit-Remaining", result[1]);
    return next();
}
await redisClient.incr("metrics:rejected");
await redisClient.incr(`metrics:rejected:${req.path}`);
await redisClient.incr(
    `metrics:rejected:client:${identityType}:${identity}`
);

    const retryAfter = result[2];

res.setHeader("X-RateLimit-Limit", maxTokens);
res.setHeader("X-RateLimit-Remaining", result[1]);
res.setHeader("Retry-After", retryAfter);

return res.status(429).json({
    message: "Too many requests"
});

        } catch (error) {
            console.error("Rate limiter error:", error);

            return res.status(503).json({
                message: "Rate limiter temporarily unavailable"
            });
        }
    };
}