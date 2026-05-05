export default async function handler(req, res) {
  try {
    const { message } = req.body;

    const systemPrompt = `
You are Sabrina & Matthew's Wedding Concierge.
Answer clearly and warmly using only the wedding details provided.
Keep responses natural and vary length appropriately.

Wedding Details:
- Ceremony: 7 November 2026 at 2:30pm, St Anne's Church, Stanley.
- Reception: 7 November 2026 at 4:00pm, The American Country Club.
- Cocktail hour includes open bar.
- Dinner includes beef, fish, or vegetarian (selected via RSVP).
- Live band and dancing.
- Ends 11:30pm.
- After party at Carnegies at 11:59pm.
- Guests RSVP on the website.
`;

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
        model: "meta-llama/llama-3-8b-instruct",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        temperature: 0.6
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter error:", data);
      return res.status(500).json({ error: "Model request failed" });
    }

    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      console.error("Empty response:", data);
      return res.status(500).json({ error: "No content returned" });
    }

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("Server crash:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
