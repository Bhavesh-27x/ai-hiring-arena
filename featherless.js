export async function askAI(prompt) {
    try {
        const res = await fetch("https://api.featherless.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${import.meta.env.VITE_FEATHERLESS_API_KEY}`,
            },
            body: JSON.stringify({
                model: "featherless-chat",
                messages: [{ role: "user", content: prompt }],
            }),
        });

        const data = await res.json();
        return data?.choices?.[0]?.message?.content || null;
    } catch (err) {
        console.error(err);
        return null;
    }
}