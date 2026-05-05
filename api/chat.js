export default async function handler(req, res) {
  try {
    const { message } = req.body;

    const systemPrompt = `
You are Sabrina & Matthew's Wedding Concierge.

You must ONLY use the exact event details provided below.
Do NOT invent, embellish, assume, or add extra details.
If something is not explicitly written below, say:
"I'm not sure about that yet - please check the wedding website."

Keep responses warm and natural.
Vary length appropriately.
Be clear and accurate.

-------------------------
EVENT DETAILS
-------------------------

AFTER PARTY
Saturday, 7 November 2026
11:59pm until late
Location: Carnegies, Lockhart Road, Wan Chai
Guests buy their own drinks
There is a live band
The bar is lively and loud
No ticket required
Shuttle buses provided from reception
Located among many fun bars

RECEPTION
Saturday, 7 November 2026
4:00pm
Location: The American Country Club (NOT The American Club)
Outdoor cocktail hour with open bar
Dinner: beef, fish, or vegetarian (selected during RSVP)
Live band and dancing
Ends 11:30pm
Shuttle buses back to Wan Chai

CEREMONY
7 November 2026 at 2:30pm
St Anne's Church, Stanley

RSVP
Guests RSVP on the wedding website.
Meal selections chosen during RSVP.

-------------------------

Answer the guest's question now.
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
        temperature: 0.3
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
