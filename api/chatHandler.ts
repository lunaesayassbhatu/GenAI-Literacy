import { MODULES } from "../src/app/utils/modulesData.ts";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const MAX_HISTORY = 10;
const MAX_MESSAGE_LENGTH = 2000;
const MODEL = "claude-haiku-4-5-20251001";

function buildSystemPrompt(): string {
  const topics = MODULES.map((m) => `- ${m.name}: ${m.description}`).join("\n");
  return `You are Wave, the friendly dolphin guide for the ASU GenAI Lab (also known as ASU Sunwave) — a web app that teaches Arizona State University students, faculty, and staff about generative AI literacy.

Your job is to answer questions about generative AI: how it works, its limitations (like hallucinations), prompt engineering, AI ethics, academic integrity, and responsible use. The app's own learning modules cover these topics:
${topics}

Stay warm, concise, and encouraging, matching a friendly campus-guide tone. Prefer short answers (a few sentences or a short list) over long essays. If a question is unrelated to GenAI literacy or AI tools, gently redirect the student back to that scope rather than answering it.`;
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
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 512,
        system: buildSystemPrompt(),
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    });

    if (!upstream.ok) {
      const errText = await upstream.text();
      console.error("Anthropic API error:", upstream.status, errText);
      return { status: 502, body: { error: "The AI service is unavailable right now. Please try again." } };
    }

    const data = await upstream.json();
    const reply = data?.content?.[0]?.text;
    if (typeof reply !== "string") {
      return { status: 502, body: { error: "Received an unexpected response from the AI service." } };
    }

    return { status: 200, body: { reply } };
  } catch (err) {
    console.error("Chat handler error:", err);
    return { status: 500, body: { error: "Something went wrong. Please try again." } };
  }
}
