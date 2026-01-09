import express from 'express'
import { loginLimiter, apiLimiter } from "./middleware/limiters.js"


const app= express();


 app.post("/login", loginLimiter,(req,res)=>{
 res.json({ message: "Login success" })
})
app.get("/api/test",apiLimiter, (req, res) => {
  res.json({ message: "API OK" })
})

 app.get("/test", (req, res)=>{
      res.json({ message: "Request successful" })
 });

export default app;