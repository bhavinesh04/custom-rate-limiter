import redisClient from "../config/redis.js";
import fs from "fs";

const luaScript = fs.readFileSync(
    new URL("./rateLimiter/rateLimiter.lua", import.meta.url),
    "utf8"
);

export default function createRateLimiter({ maxTokens, refillRate }) {

    return async function rateLimiter(req, res, next) {
        const IP = req.ip;
        const key = `rate_limit:${IP}`;

        try {
            const result = await redisClient.eval(luaScript, {
                keys: [key],
                arguments: [
                    maxTokens.toString(),
                    refillRate.toString(),
                    Date.now().toString()
                ]
            });

            if (result === 1) {
                return next();
            }

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