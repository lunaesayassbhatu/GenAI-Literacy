import type { VercelRequest, VercelResponse } from "@vercel/node";
import { MODULES } from "../src/app/utils/modulesData";

interface ChatMessage {
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

function isValidMessage(m: unknown): m is ChatMessage {
  if (!m || typeof m !== "object") return false;
  const { role, content } = m as Record<string, unknown>;
  return (
    (role === "user" || role === "assistant") &&
    typeof content === "string" &&
    content.trim().length > 0 &&
    content.length <= MAX_MESSAGE_LENGTH
  );
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Server is not configured for chat yet." });
    return;
  }

  const body = req.body as { messages?: unknown };
  if (!Array.isArray(body?.messages) || body.messages.length === 0) {
    res.status(400).json({ error: "messages is required and must be a non-empty array." });
    return;
  }

  const messages = body.messages.filter(isValidMessage).slice(-MAX_HISTORY);
  if (messages.length === 0) {
    res.status(400).json({ error: "No valid messages provided." });
    return;
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
      res.status(502).json({ error: "The AI service is unavailable right now. Please try again." });
      return;
    }

    const data = await upstream.json();
    const reply = data?.content?.[0]?.text;
    if (typeof reply !== "string") {
      res.status(502).json({ error: "Received an unexpected response from the AI service." });
      return;
    }

    res.status(200).json({ reply });
  } catch (err) {
    console.error("Chat handler error:", err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}
