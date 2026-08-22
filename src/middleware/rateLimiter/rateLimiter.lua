local tokens = redis.call("HGET", KEYS[1], "tokens")
local lastRefillTime = redis.call("HGET", KEYS[1], "lastRefillTime")

if not tokens then
    tokens = ARGV[1]
    lastRefillTime = ARGV[3]
end

tokens = tonumber(tokens)
lastRefillTime = tonumber(lastRefillTime)

local maxTokens = tonumber(ARGV[1])
local refillRate = tonumber(ARGV[2])
local currentTime = tonumber(ARGV[3])

local elapsed = (currentTime - lastRefillTime) / 1000

local refill = elapsed * refillRate

tokens = math.min(maxTokens, tokens + refill)

lastRefillTime = currentTime

if tokens >= 1 then
    tokens = tokens - 1

    redis.call(
        "HSET",
        KEYS[1],
        "tokens",
        tokens,
        "lastRefillTime",
        currentTime
    )
    redis.call("EXPIRE", KEYS[1], 600)

    return 1
end

redis.call(
    "HSET",
    KEYS[1],
    "tokens",
    tokens,
    "lastRefillTime",
    currentTime
)
redis.call("EXPIRE", KEYS[1], 600)

return 0