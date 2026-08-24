async function makeRequest() {
    return fetch("http://localhost:3000/login", {
        method: "POST"
    });
}

const responses = [];

for (let i = 0; i < 4; i++) {
    responses.push(await makeRequest());
}

const successfulResponse = responses.find(
    res => res.status === 200
);

const rejectedResponse = responses.find(
    res => res.status === 429
);

console.log(
    "Successful status:",
    successfulResponse?.status
);

console.log(
    "Rejected status:",
    rejectedResponse?.status
);

if (!successfulResponse || !rejectedResponse) {
    console.log("❌ Expected both 200 and 429");
    process.exit(1);
}

const limit = successfulResponse.headers.get(
    "X-RateLimit-Limit"
);

const remaining = successfulResponse.headers.get(
    "X-RateLimit-Remaining"
);

const retryAfter = rejectedResponse.headers.get(
    "Retry-After"
);

const reset = rejectedResponse.headers.get(
    "X-RateLimit-Reset"
);

console.log("Limit:", limit);
console.log("Remaining:", remaining);
console.log("Retry-After:", retryAfter);
console.log("Reset:", reset);

if (
    limit &&
    remaining !== null &&
    retryAfter &&
    reset
) {
    console.log("✅ Rate-limit headers passed");
} else {
    console.log("❌ Rate-limit headers failed");
    process.exit(1);
}