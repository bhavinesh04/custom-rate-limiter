import TokenBucket from "./tokenBucket.js";

const bucket = new TokenBucket(3, 1);

console.assert(bucket.consume() === true, "First request should be allowed");
console.assert(bucket.consume() === true, "Second request should be allowed");
console.assert(bucket.consume() === true, "Third request should be allowed");
console.assert(bucket.consume() === false, "Fourth request should be rejected");

console.log("All basic Token Bucket tests passed!");