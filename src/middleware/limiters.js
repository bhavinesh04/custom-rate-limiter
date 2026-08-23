import createRateLimiter from "./rateLimiter.js"

const loginLimiter = createRateLimiter({ maxTokens: 3, refillRate: 1 })
const apiLimiter = createRateLimiter({ maxTokens: 20, refillRate: 0.5 })
const apiKeyLimiter = createRateLimiter({
    maxTokens: 3,
    refillRate: 1,
    identityErrorMessage: "API key is required",
    keyGenerator: (req) => {
        const apiKey = req.headers["x-api-key"];

        if (!apiKey) {
            return null;
        }

        return `apiKey:${apiKey}`;
    }
});

const userLimiter = createRateLimiter({
    maxTokens: 3,
    refillRate: 0.1,
     identityErrorMessage: "User ID is required",
    keyGenerator: (req) => {
        const userId = req.headers["x-user-id"];

        if (!userId) {
            return null;
        }

        return `user:${userId}`;
    }
});

const userLoginLimiter = createRateLimiter({
    maxTokens: 3,
    refillRate: 0.1,
    identityErrorMessage: "User ID is required",
    keyGenerator: (req) => {
        const userId = req.headers["x-user-id"];
        

        if (!userId) {
            return null;
        }

        return `user:${userId}:login`;
    }
});

export { loginLimiter, apiLimiter, apiKeyLimiter,userLimiter,userLoginLimiter };
