const requests = [];

for (let i = 0; i < 4; i++) {
    requests.push(
        fetch("http://localhost:3000/login", {
            method: "POST"
        })
    );
}

const responses = await Promise.all(requests);

const results = responses.map(res => res.status);

console.log("Statuses:", results);

const allowed = results.filter(status => status === 200).length;
const rejected = results.filter(status => status === 429).length;

console.log("Allowed:", allowed);
console.log("Rejected:", rejected);

if (allowed === 3 && rejected === 1) {
    console.log("✅ Rate limit behavior passed");
} else {
    console.log("❌ Rate limit behavior failed");
    process.exit(1);
}