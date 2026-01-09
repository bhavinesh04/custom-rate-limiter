import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db.js"
import app from "./app.js"
import "./config/redis.js"


dotenv.config()
connectDB()

app.use(cors())

// Health check
app.get("/", (req, res) => {
  res.send("🚦 Rate Limiter API running")
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
