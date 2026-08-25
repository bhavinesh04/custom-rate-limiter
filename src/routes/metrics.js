import express from "express";
import redisClient from "../config/redis.js";

async function getMetricKeys(pattern) {
  const keys = [];
  let cursor = 0;

  do {
    const result = await redisClient.scan(cursor, {
      match: pattern
    });

    cursor = Number(result[0]);
    keys.push(...result[1]);
  } while (cursor !== 0);

  return keys;
}

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const allowed = await redisClient.get("metrics:allowed");
    const rejected = await redisClient.get("metrics:rejected");

    const allowedKeys = await getMetricKeys("metrics:allowed:*");
    const rejectedKeys = await getMetricKeys("metrics:rejected:*");

    const allowedClientKeys = await getMetricKeys(
      "metrics:allowed:client:*"
    );

    const rejectedClientKeys = await getMetricKeys(
      "metrics:rejected:client:*"
    );

    const endpoints = {};
    const clients = {};

    for (const key of allowedKeys) {
      const endpoint = key.replace("metrics:allowed:", "");

      // Don't treat client metrics as endpoint metrics
      if (endpoint.startsWith("client:")) {
        continue;
      }

      const value = await redisClient.get(key);

      endpoints[endpoint] = {
        allowed: Number(value || 0),
        rejected: 0
      };
    }

    for (const key of rejectedKeys) {
      const endpoint = key.replace("metrics:rejected:", "");

      if (endpoint.startsWith("client:")) {
        continue;
      }

      const value = await redisClient.get(key);

      if (!endpoints[endpoint]) {
        endpoints[endpoint] = {
          allowed: 0,
          rejected: 0
        };
      }

      endpoints[endpoint].rejected = Number(value || 0);
    }

    for (const key of allowedClientKeys) {
      const client = key.replace(
        "metrics:allowed:client:",
        ""
      );

      const value = await redisClient.get(key);

      clients[client] = {
        allowed: Number(value || 0),
        rejected: 0
      };
    }

    for (const key of rejectedClientKeys) {
      const client = key.replace(
        "metrics:rejected:client:",
        ""
      );

      const value = await redisClient.get(key);

      if (!clients[client]) {
        clients[client] = {
          allowed: 0,
          rejected: 0
        };
      }

      clients[client].rejected = Number(value || 0);
    }

    const allowedCount = Number(allowed || 0);
    const rejectedCount = Number(rejected || 0);

    const totalRequests =
      allowedCount + rejectedCount;

    const rejectionRate =
      totalRequests === 0
        ? 0
        : Number(
            ((rejectedCount / totalRequests) * 100).toFixed(2)
          );

    res.json({
      allowed: allowedCount,
      rejected: rejectedCount,
      totalRequests,
      rejectionRate,
      endpoints,
      clients
    });

  } catch (error) {
    console.error("Metrics error:", error);

    res.status(503).json({
      message: "Metrics temporarily unavailable"
    });
  }
});

export default router;