export default async function handler(req, res) {
  try {
    const { message } = req.body;

    const systemPrompt = `
You are Sabrina & Matthew's Wedding Concierge.

Answer clearly and naturally using only the wedding event details 
provided.
Vary response length appropriately.
Be warm and helpful.

EVENT DETAILS

OUT OF TOWNERS WELCOME LUNCH
Friday, 6 November 2026 at 2:30pm (arrive by 2:15pm)
Location: Lamma Rainbow Seafood Restaurant
Private ferry departs Central Public Pier No.9 at 2:30pm sharp
Return boat at 5:30pm
Hosts are paying
Food includes Hong Kong meat and seafood dishes
Vegetarian options available
Drinks: water, beer, wine, soft drinks
Dress code: Smart Casual

SUNSET SIPS
Friday, 6 November 2026 at 5:00pm
Location: Sunset Pier Bar, top of Central Ferry Pier No.3
Guests buy their own drinks
Smart Casual

WEDDING CEREMONY
Saturday, 7 November 2026 at 2:30pm (arrive by 2:15pm)
Location: St Anne's Church, Stanley
Shuttle buses depart Wan Chai at 1:30pm
Dress code: Black Tie Optional, Sea & Sky theme

RECEPTION
Saturday, 7 November 2026 at 4:00pm
Location: The American Country Club (NOT The American Club)
Outdoor cocktail hour with open bar
Seated dinner (beef, fish, or vegetarian selected via RSVP)
Full open bar during dinner
Live band and dancing
Ends at 11:30pm
Shuttle buses back to Wan Chai provided

AFTER PARTY
Saturday, 7 November 2026 at 11:59pm
Location: Carnegies, Wan Chai
Guests buy their own drinks

BEAN VOYAGE
Sunday, 8 November 2026 from 2:00pm-4:00pm
Blend and Grind Startstreet, Wan Chai
Casual
Guests buy their own items

RSVP
Guests RSVP on the wedding website and choose their meal there.

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
        model: "mistralai/mistral-7b-instruct",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        temperature: 0.5
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter error:", data);
      return res.status(500).json({ error: "Model request failed" });
    }

    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      console.error("No content returned:", data);
      return res.status(500).json({ error: "Empty response" });
    }

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("Server crash:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
