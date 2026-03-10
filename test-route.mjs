const testBackend = async () => {
    try {
        console.log("Logging in direct to backend...");
        const loginRes = await fetch("http://localhost:5018/api/User/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: "adimin@semPerdaDeDinheiro.com",
                password: "admin"
            })
        });

        const loginText = await loginRes.text();
        const envelope = JSON.parse(loginText);
        const token = envelope.data.accessToken;
        const personId = envelope.data.personId; // maybe it's there?

        console.log("Got token. Fetching MonthMovements...");
        const moveRes = await fetch("http://localhost:5018/api/MonthMovements", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        console.log("MonthMovements Status:", moveRes.status);
        console.log("MonthMovements Res:", await moveRes.text());

        console.log("Fetching Person's Resume logic testing if MonthMovements needs personId...");

    } catch (err) {
        console.error("Test failed:", err);
    }
};

testBackend();
