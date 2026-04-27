const testRedirect = async () => {
    try {
        console.log("Testing unauthenticated access to root (/)....");
        // Use redirect: 'manual' to catch the 307 Redirect response from the Next.js middleware
        const res = await fetch("http://localhost:3001/", {
            redirect: "manual"
        });

        console.log("Status Code:", res.status);
        if (res.status >= 300 && res.status < 400) {
            console.log("Redirect Location:", res.headers.get("location"));
        } else {
            console.log("Response text:", await res.text());
        }
    } catch (err) {
        console.error("Test failed:", err);
    }
};

testRedirect();
