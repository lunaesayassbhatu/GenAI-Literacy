import type { VercelRequest, VercelResponse } from "@vercel/node";
import { runChat } from "./chatHandler";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const body = req.body as { messages?: unknown };
  const result = await runChat(body?.messages, process.env.ANTHROPIC_API_KEY);
  res.status(result.status).json(result.body);
}
