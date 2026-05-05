export default async function handler(req, res) {
  try {
    const { message } = req.body;

    const systemPrompt = "You are a helpful wedding concierge.";

    const response = await 
fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": 
"https://sabrinamatthew-wedding-concierge.vercel.app",
        "X-Title": "Wedding Concierge"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    console.log("FULL OPENROUTER RESPONSE:", JSON.stringify(data));

    return res.status(200).json({ reply: JSON.stringify(data) });

  } catch (error) {
    console.error("SERVER ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
}
