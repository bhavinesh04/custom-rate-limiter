async function getMetrics() {
    const res = await fetch("http://localhost:3000/metrics");
    return res.json();
}

const before = await getMetrics();

const requests = [];

for (let i = 0; i < 4; i++) {
    requests.push(
        fetch("http://localhost:3000/login", {
            method: "POST"
        })
    );
}

const responses = await Promise.all(requests);

const allowed = responses.filter(
    res => res.status === 200
).length;

const rejected = responses.filter(
    res => res.status === 429
).length;

const after = await getMetrics();

console.log("Request results:", {
    allowed,
    rejected
});

console.log("Metrics change:", {
    allowed: after.allowed - before.allowed,
    rejected: after.rejected - before.rejected
});

if (
    after.allowed - before.allowed === allowed &&
    after.rejected - before.rejected === rejected
) {
    console.log("✅ Metrics accuracy passed");
} else {
    console.log("❌ Metrics accuracy failed");
    process.exit(1);
}