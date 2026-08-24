import createRateLimiter from "./rateLimiter.js";
import { rateLimitConfig } from "../config/rateLimits.js";

const loginLimiter = createRateLimiter(rateLimitConfig.login)
const apiLimiter = createRateLimiter(rateLimitConfig.api)
const apiKeyLimiter = createRateLimiter({
    ...rateLimitConfig.apiKey,
    identityErrorMessage: "API key is required",
    identityType: "apiKey",
    keyGenerator: (req) => {
        const apiKey = req.headers["x-api-key"];

        if (!apiKey) {
            return null;
        }

        return apiKey;
    },
    bucketKeyGenerator: (identity) => `apiKey:${identity}`
});

const userLimiter = createRateLimiter({
    ...rateLimitConfig.user,
     identityErrorMessage: "User ID is required",
     identityType: "user",
    keyGenerator: (req) => {
        const userId = req.headers["x-user-id"];

        if (!userId) {
            return null;
        }

        return userId;
    },
    bucketKeyGenerator: (identity) => `user:${identity}`
});

const userLoginLimiter = createRateLimiter({
    ...rateLimitConfig.userLogin,
    identityErrorMessage: "User ID is required",
    identityType: "user",
    
    keyGenerator: (req) => {
        const userId = req.headers["x-user-id"];
        

        if (!userId) {
            return null;
        }

        return userId;
    },
    bucketKeyGenerator: (identity) => `user:${identity}:login`
});

export { loginLimiter, apiLimiter, apiKeyLimiter,userLimiter,userLoginLimiter };
