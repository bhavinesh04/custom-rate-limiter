const requests = [];

for (let i = 0; i < 10; i++) {
    requests.push(
        fetch("http://localhost:3000/login", {
            method: "POST"
        })
    );
}

const responses = await Promise.all(requests);

const results = await Promise.all(
    responses.map(res => res.status)
);

console.log(results);

console.log(
    "Allowed:",
    results.filter(status => status === 200).length
);

console.log(
    "Rejected:",
    results.filter(status => status === 429).length
);