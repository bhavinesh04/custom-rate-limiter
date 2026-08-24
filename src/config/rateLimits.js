export const rateLimitConfig = {
    login: {
        maxTokens: 3,
        refillRate: 1
    },

    api: {
        maxTokens: 20,
        refillRate: 0.5
    },

    apiKey: {
        maxTokens: 3,
        refillRate: 1
    },

    user: {
        maxTokens: 3,
        refillRate: 0.1
    },

    userLogin: {
        maxTokens: 3,
        refillRate: 0.1
    }
};