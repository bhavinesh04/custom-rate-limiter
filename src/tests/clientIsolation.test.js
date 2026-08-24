async function makeRequest(userId) {
    const res = await fetch(
        "http://localhost:3000/api/user-test-1",
        {
            headers: {
                "x-user-id": userId
            }
        }
    );

    return res.status;
}

const userA = await Promise.all([
    makeRequest("test-user-A"),
    makeRequest("test-user-A"),
    makeRequest("test-user-A"),
    makeRequest("test-user-A")
]);

const userB = await Promise.all([
    makeRequest("test-user-B"),
    makeRequest("test-user-B"),
    makeRequest("test-user-B"),
    makeRequest("test-user-B")
]);

console.log("User A:", userA);
console.log("User B:", userB);

const userAAllowed = userA.filter(status => status === 200).length;
const userARejected = userA.filter(status => status === 429).length;

const userBAllowed = userB.filter(status => status === 200).length;
const userBRejected = userB.filter(status => status === 429).length;

if (
    userAAllowed === 3 &&
    userARejected === 1 &&
    userBAllowed === 3 &&
    userBRejected === 1
) {
    console.log("✅ Client isolation passed");
} else {
    console.log("❌ Client isolation failed");
    process.exit(1);
}