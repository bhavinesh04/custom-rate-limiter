import { createClient } from "redis"

const redisClient = createClient({
    url: process.env.REDIS_URL,
    socket: {
        reconnectStrategy: (retries) => {
    if (retries > 5) {
        return false;
    }

    return Math.min(retries * 100, 1000);
}
    }
});

redisClient.on("error", (err) => {
  console.error("Redis Error:", err)
})

await redisClient.connect()

console.log("✅ Redis connected")

export default redisClient
