import createRateLimiter from "./rateLimiter.js"

const loginLimiter = createRateLimiter({ maxTokens: 3, refillRate: 1 })
const apiLimiter = createRateLimiter({ maxTokens: 20, refillRate: 0.5 })

export { loginLimiter, apiLimiter }
