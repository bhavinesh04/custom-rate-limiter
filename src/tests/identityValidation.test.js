async function testMissingApiKey() {
    const res = await fetch(
        "http://localhost:3000/api/key-test"
    );

    const body = await res.json();

    console.log("API key:", res.status, body);

    return res.status === 400 &&
        body.message === "API key is required";
}

async function testMissingUserId() {
    const res = await fetch(
        "http://localhost:3000/api/user-test-1"
    );

    const body = await res.json();

    console.log("User ID:", res.status, body);

    return res.status === 400 &&
        body.message === "User ID is required";
}

const apiKeyPassed = await testMissingApiKey();
const userIdPassed = await testMissingUserId();

if (apiKeyPassed && userIdPassed) {
    console.log("✅ Identity validation passed");
} else {
    console.log("❌ Identity validation failed");
    process.exit(1);
}