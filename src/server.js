import "dotenv/config";
import cors from "cors"
import app from "./app.js"
import "./config/redis.js"
import metricsRouter from "./routes/metrics.js";
import healthRouter from "./routes/health.js";


// dotenv.config()


app.use(cors())

// Health check
app.get("/", (req, res) => {
  res.send("🚦 Rate Limiter API running")
})

app.use("/metrics", metricsRouter);
app.use("/health", healthRouter);

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
