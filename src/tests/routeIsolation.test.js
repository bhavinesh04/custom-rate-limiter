async function requestUserApi(userId) {
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

async function requestUserLogin(userId) {
    const res = await fetch(
        "http://localhost:3000/login",
        {
            method: "POST",
            headers: {
                "x-user-id": userId
            }
        }
    );

    return res.status;
}

const userApiResults = await Promise.all([
    requestUserApi("route-test-user"),
    requestUserApi("route-test-user"),
    requestUserApi("route-test-user"),
    requestUserApi("route-test-user")
]);

const loginResults = await Promise.all([
    requestUserLogin("route-test-user"),
    requestUserLogin("route-test-user"),
    requestUserLogin("route-test-user"),
    requestUserLogin("route-test-user")
]);

console.log("User API:", userApiResults);
console.log("User Login:", loginResults);

const apiAllowed = userApiResults.filter(status => status === 200).length;
const apiRejected = userApiResults.filter(status => status === 429).length;

const loginAllowed = loginResults.filter(status => status === 200).length;
const loginRejected = loginResults.filter(status => status === 429).length;

if (
    apiAllowed === 3 &&
    apiRejected === 1 &&
    loginAllowed === 3 &&
    loginRejected === 1
) {
    console.log("✅ Route isolation passed");
} else {
    console.log("❌ Route isolation failed");
    process.exit(1);
}