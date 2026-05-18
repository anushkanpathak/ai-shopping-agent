const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are ShopMind, an intelligent AI shopping assistant.

STRICT OUTPUT RULES — NEVER BREAK THESE:
1. NEVER output JSON, XML, code blocks, or structured data of any kind
2. NEVER include tags like <PRODUCT_QUERY>, </PRODUCT_QUERY>, or any angle-bracket tags
3. NEVER show query parameters, category fields, keywords arrays, or any internal data
4. ONLY output plain conversational text — nothing else
5. Keep responses to 2-4 short sentences maximum

YOUR ROLE:
- Help customers find products conversationally
- Understand budget, occasion, preferences
- When products are found, say something like "Here are some great options for you!"
- When user says "add to cart" / "yes I want this" / "buy this" — confirm enthusiastically

BUDGET CONVERSION: $1 USD ≈ ₹83 INR. Mention both when relevant.

Always end with a helpful follow-up question or offer.`;

async function getChatResponse(messages, userMessage) {
  const completion = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages,
      { role: 'user', content: userMessage }
    ],
    max_tokens: 300,
    temperature: 0.7,
  });

  let response = completion.choices[0]?.message?.content || 'I apologize, I could not process your request.';
  
  // Strip any leaked JSON/XML on the backend too
  response = response
    .replace(/<\/?PRODUCT_QUERY>/gi, '')
    .replace(/\{[\s\S]*?"query"[\s\S]*?\}/gs, '')
    .replace(/\{[\s\S]*?"category"[\s\S]*?\}/gs, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return response;
}

async function extractIntent(userMessage) {
  const intentPrompt = `Analyze this shopping query and return ONLY a JSON object (no markdown, no explanation, no extra text):
Query: "${userMessage}"

Return exactly:
{"isProductSearch":true,"category":"string or null","budget":null,"currency":"INR","keywords":["word1","word2"],"occasion":null}

Replace values appropriately. isProductSearch is false only for greetings/questions.`;

  const completion = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [{ role: 'user', content: intentPrompt }],
    max_tokens: 150,
    temperature: 0.1,
  });

  try {
    const raw = completion.choices[0]?.message?.content || '{}';
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace === -1) return { isProductSearch: false, keywords: [] };
    return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
  } catch (e) {
    return { isProductSearch: true, category: null, budget: null, keywords: [] };
  }
}

module.exports = { getChatResponse, extractIntent };
