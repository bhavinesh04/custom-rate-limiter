import { createClient } from "redis";
import { Redis } from "@upstash/redis";

let redisClient;

if (process.env.UPSTASH_REDIS_REST_URL) {
  // Production: Upstash REST Redis
  if (!process.env.UPSTASH_REDIS_REST_TOKEN) {
    throw new Error("UPSTASH_REDIS_REST_TOKEN is not defined");
  }

  redisClient = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN
  });

  console.log("✅ Using Upstash Redis");
} else {
  // Local: Docker Redis
  if (!process.env.REDIS_URL) {
    throw new Error("REDIS_URL is not defined");
  }

  redisClient = createClient({
    url: process.env.REDIS_URL,
    socket: {
      reconnectStrategy: (retries) => {
        return Math.min(retries * 100, 1000);
      }
    }
  });

  redisClient.on("error", (err) => {
    console.error("Redis Error:", err);
  });

  redisClient.on("connect", () => {
    console.log("Redis connecting...");
  });

  redisClient.on("ready", () => {
    console.log("Redis ready");
  });

  redisClient.on("reconnecting", () => {
    console.log("Redis reconnecting...");
  });

  await redisClient.connect();

  console.log("✅ Local Redis connected");
}

export default redisClient;