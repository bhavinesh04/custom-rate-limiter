import express from "express";
import redisClient from "../config/redis.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        await redisClient.ping();

        res.json({
            status: "ok",
            redis: "connected"
        });
    } catch (error) {
        console.error("Health check error:", error);

        res.status(503).json({
            status: "error",
            redis: "disconnected"
        });
    }
});

export default router;