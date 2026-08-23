import express from 'express'
import { loginLimiter, apiLimiter, apiKeyLimiter ,userLimiter,userLoginLimiter} from "./middleware/limiters.js"

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

 app.get("/api/key-test", apiKeyLimiter, (req, res) => {
    res.json({ message: "API key request successful" });
});

app.get("/api/user-test-1", userLimiter, (req, res) => {
    res.json({ message: "User API 1 successful" });
});

app.get("/api/user-test-2", userLimiter, (req, res) => {
    res.json({ message: "User API 2 successful" });
});

app.get("/api/user-login-test", userLoginLimiter, (req, res) => {
    res.json({ message: "User login API successful" });
});
export default app;