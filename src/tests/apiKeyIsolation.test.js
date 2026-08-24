async function makeRequest(apiKey) {
    const res = await fetch(
        "http://localhost:3000/api/key-test",
        {
            headers: {
                "x-api-key": apiKey
            }
        }
    );

    return res.status;
}

const keyA = await Promise.all([
    makeRequest("TEST-KEY-A"),
    makeRequest("TEST-KEY-A"),
    makeRequest("TEST-KEY-A"),
    makeRequest("TEST-KEY-A")
]);

const keyB = await Promise.all([
    makeRequest("TEST-KEY-B"),
    makeRequest("TEST-KEY-B"),
    makeRequest("TEST-KEY-B"),
    makeRequest("TEST-KEY-B")
]);

console.log("Key A:", keyA);
console.log("Key B:", keyB);

const keyAAllowed = keyA.filter(status => status === 200).length;
const keyARejected = keyA.filter(status => status === 429).length;

const keyBAllowed = keyB.filter(status => status === 200).length;
const keyBRejected = keyB.filter(status => status === 429).length;

if (
    keyAAllowed === 3 &&
    keyARejected === 1 &&
    keyBAllowed === 3 &&
    keyBRejected === 1
) {
    console.log("✅ API key isolation passed");
} else {
    console.log("❌ API key isolation failed");
    process.exit(1);
}