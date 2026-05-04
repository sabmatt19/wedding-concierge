export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { message } = req.body;

  const systemPrompt = `
You are Wedding Concierge, the official assistant for Sabrina & Matthew’s wedding.

Wedding Date: November 7, 2026
Location: Hong Kong

Your role:
Help guests with schedule, dress code, transportation, accommodation, and general Hong Kong tips.

Style:
- Be warm, friendly, and clear.
- Keep responses concise (generally under 180 words).
- Use bullet points when helpful.
- Avoid unnecessary repetition.
- Ask at most one follow-up question if needed.

Rules:
- Never guess missing logistics.
- If a detail is not provided, say you don’t have that exact detail and direct guests to sabrinamatthew19@gmail.com.
`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + process.env.OPENROUTER_API_KEY,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://vercel.app",
        "X-Title": "Wedding Concierge"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.3-70b-instruct",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        max_tokens: 400,
        temperature: 0.4
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Sorry, something went wrong.";

    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ reply: "Server error." });
  }
}