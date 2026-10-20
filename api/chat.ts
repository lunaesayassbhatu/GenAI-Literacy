import type { VercelRequest, VercelResponse } from "@vercel/node";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const MAX_HISTORY = 10;
const MAX_MESSAGE_LENGTH = 2000;
// CreateAI (ASU) OpenAI-compatible gateway. Model format is provider/model_name.
const CREATEAI_URL = "https://api-main.aiml.asu.edu/v1/chat/completions";
const MODEL = "aws/claude4_5_haiku";

// Kept inline (instead of importing src/app/utils/modulesData.ts) so this serverless
// function has no cross-folder or extensionless imports, which crash Vercel's ESM runtime.
// Keep in sync with MODULES in src/app/utils/modulesData.ts.
const MODULE_TOPICS = [
  ["What is GenAI?", "Learn the basics of Generative AI and how it works"],
  ["Trust in GenAI", "Understand why GenAI can't be treated as a reliable source of truth"],
  ["How does GenAI 'learn'?", "Understand how AI outputs are shaped by training data and what that means for quality"],
  ["Using GenAI Responsibly", "AI literacy is for everyone, not just those with technical backgrounds"],
  ["GenAI and Bias", "Understand AI bias, unequal representation, and why trust in AI needs to be earned, not assumed"],
  ["Getting AI to Do What You Want", "Learn how to communicate with AI effectively so it actually helps you"],
  ["GenAI and the Environment", "Understand the real environmental impact of GenAI and what it means to be an intentional user"],
];

function buildSystemPrompt(): string {
  const topics = MODULE_TOPICS.map(([name, description]) => `- ${name}: ${description}`).join("\n");
  return `You are Wave, the friendly dolphin guide for the ASU GenAI Lab (also known as ASU Sunwave) — a web app that teaches Arizona State University students, faculty, and staff about generative AI literacy.

Your job is to answer questions about generative AI: how it works, its limitations (like hallucinations), prompt engineering, AI ethics, academic integrity, and responsible use. The app's own learning modules cover these topics:
${topics}

Personality: you are bubbly, upbeat, and genuinely excited to help — like the friendliest peer mentor on campus. Greet warmly, cheer on curiosity ("Great question!"), normalize not knowing things, and celebrate small wins. Use plain, everyday language and a relatable analogy or quick real-life example when it helps. Sprinkle in a few fun emojis (🌊 🐬 ✨ 💡 🎉), but never more than one or two per paragraph.

Formatting (the chat renders this lightly, so use ONLY these):
- Start with a one-line friendly hook or direct answer.
- Put key terms in **bold**.
- Use short "- " bullet lists (3-4 bullets max) for steps, tips, or comparisons.
- Keep paragraphs to 1-2 sentences, and keep the whole reply under about 120 words.
- End with a short, fun follow-up question or a nudge toward a related module or game in the app.
- Do not use headings, tables, code fences, or numbered lists.

If a question is unrelated to GenAI literacy or AI tools, kindly and playfully redirect the student back to that scope rather than answering it.`;
}

export function isValidMessage(m: unknown): m is ChatMessage {
  if (!m || typeof m !== "object") return false;
  const { role, content } = m as Record<string, unknown>;
  return (
    (role === "user" || role === "assistant") &&
    typeof content === "string" &&
    content.trim().length > 0 &&
    content.length <= MAX_MESSAGE_LENGTH
  );
}

export interface ChatResult {
  status: number;
  body: { reply?: string; error?: string };
}

/** Shared logic behind the Ask Wave chat endpoint — used by both the Vercel
 * serverless function (production) and the Vite dev-server middleware (local dev). */
export async function runChat(rawMessages: unknown, apiKey: string | undefined): Promise<ChatResult> {
  if (!apiKey) {
    return { status: 500, body: { error: "Server is not configured for chat yet." } };
  }

  if (!Array.isArray(rawMessages) || rawMessages.length === 0) {
    return { status: 400, body: { error: "messages is required and must be a non-empty array." } };
  }

  const messages = rawMessages.filter(isValidMessage).slice(-MAX_HISTORY);
  if (messages.length === 0) {
    return { status: 400, body: { error: "No valid messages provided." } };
  }

  try {
    const upstream = await fetch(CREATEAI_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 600,
        messages: [
          { role: "system", content: buildSystemPrompt() },
          ...messages.map((m) => ({ role: m.role, content: m.content })),
        ],
      }),
    });

    if (!upstream.ok) {
      const errText = await upstream.text();
      console.error("CreateAI API error:", upstream.status, errText);
      return { status: 502, body: { error: "The AI service is unavailable right now. Please try again." } };
    }

    const data = await upstream.json();
    const reply = data?.choices?.[0]?.message?.content;
    if (typeof reply !== "string") {
      return { status: 502, body: { error: "Received an unexpected response from the AI service." } };
    }

    return { status: 200, body: { reply } };
  } catch (err) {
    console.error("Chat handler error:", err);
    return { status: 500, body: { error: "Something went wrong. Please try again." } };
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const body = req.body as { messages?: unknown };
  const result = await runChat(body?.messages, process.env.CREATEAI_API_KEY);
  res.status(result.status).json(result.body);
}
