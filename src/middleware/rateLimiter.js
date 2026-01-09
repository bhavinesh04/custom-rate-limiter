
export default function createRateLimiter({maxTokens, refillRate }) {
  // everything goes inside

const requestStore = new Map();
  const INACTIVITY_LIMIT = 10 * 60 * 1000

  function cleanupInactiveIPs() {
  const now = Date.now()

  for (const [IP, data] of requestStore){
if (now - data.lastRefillTime > INACTIVITY_LIMIT) {
  requestStore.delete(IP)

}
}
}
setInterval(cleanupInactiveIPs, INACTIVITY_LIMIT)


return function rateLimiter(req, res, next){
    const IP = req.ip;
    const currentTime = Date.now();

    //first req from 1 IP
    if(!requestStore.has(IP)){
        requestStore.set(IP,{
            tokens: maxTokens - 1,
            lastRefillTime: currentTime,
        });
        return next();
    }
        const data = requestStore.get(IP);
        const timePassesd = currentTime- data.lastRefillTime;
        const tokensToAdd = (timePassesd / 1000) * refillRate

        data.tokens = Math.min(maxTokens, data.tokens + tokensToAdd)
        data.lastRefillTime = currentTime

        //allow or block 
    if (data.tokens >= 1) {
  data.tokens -= 1
 return next()

} else {
  return res.status(429).json({ message: "Too many requests" })
}
}
}
