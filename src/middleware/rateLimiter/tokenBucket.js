export default class TokenBucket {
    constructor(maxTokens, refillRate) {
        this.maxTokens = maxTokens;
        this.refillRate = refillRate;

        this.tokens = maxTokens;
        this.lastRefillTime = Date.now();
    }

    consume() {
        const currentTime = Date.now();

        const timePassed =
            (currentTime - this.lastRefillTime) / 1000;

        const tokensToAdd =
            timePassed * this.refillRate;

        this.tokens = Math.min(
            this.maxTokens,
            this.tokens + tokensToAdd
        );

        this.lastRefillTime = currentTime;

        if (this.tokens >= 1) {
            this.tokens -= 1;
            return true;
        }

        return false;
    }
}