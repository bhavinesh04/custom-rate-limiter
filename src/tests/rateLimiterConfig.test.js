import createRateLimiter from "../middleware/rateLimiter.js";

function testInvalidConfig(config, name) {
    try {
        createRateLimiter(config);
        console.log(`❌ ${name} did not throw`);
    } catch (error) {
        console.log(`✅ ${name} threw correctly`);
    }
}

testInvalidConfig(
    { maxTokens: 0, refillRate: 1 },
    "maxTokens = 0"
);

testInvalidConfig(
    { maxTokens: -1, refillRate: 1 },
    "maxTokens < 0"
);

testInvalidConfig(
    { maxTokens: 3, refillRate: 0 },
    "refillRate = 0"
);

testInvalidConfig(
    { maxTokens: 3, refillRate: -1 },
    "refillRate < 0"
);