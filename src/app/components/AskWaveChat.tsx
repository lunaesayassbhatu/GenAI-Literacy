import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { MessageCircle, Send } from "lucide-react";
import { DolphinMascot } from "./DolphinMascot";
import { useTheme } from "../utils/themeContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "./ui/sheet";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const WELCOME_MESSAGE: ChatMessage = {
  role: "assistant",
  content: "Hi, I'm Wave! Ask me anything about generative AI — how it works, prompt engineering, AI ethics, or academic integrity.",
};

const POSITION_KEY = "asu_genai_ask_wave_pos";
const DRAG_THRESHOLD = 5; // px of movement before a press counts as a drag, not a click

export function AskWaveChat() {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Draggable position — null means "use the default bottom-8 left-8 CSS position".
  const [pos, setPos] = useState<{ x: number; y: number } | null>(() => {
    try {
      const raw = localStorage.getItem(POSITION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dragState = useRef<{ startX: number; startY: number; originX: number; originY: number; dragged: boolean } | null>(null);
  const justDraggedRef = useRef(false);

  function handlePointerDown(e: React.PointerEvent<HTMLButtonElement>) {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    dragState.current = { startX: e.clientX, startY: e.clientY, originX: rect.left, originY: rect.top, dragged: false };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLButtonElement>) {
    const drag = dragState.current;
    if (!drag) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    if (!drag.dragged && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
    drag.dragged = true;

    const rect = buttonRef.current?.getBoundingClientRect();
    const width = rect?.width ?? 150;
    const height = rect?.height ?? 48;
    const nextX = Math.min(Math.max(drag.originX + dx, 8), window.innerWidth - width - 8);
    const nextY = Math.min(Math.max(drag.originY + dy, 8), window.innerHeight - height - 8);
    setPos({ x: nextX, y: nextY });
  }

  function handlePointerUp() {
    const drag = dragState.current;
    if (drag?.dragged) {
      justDraggedRef.current = true;
      setPos((current) => {
        if (current) {
          try { localStorage.setItem(POSITION_KEY, JSON.stringify(current)); } catch { /* ignore */ }
        }
        return current;
      });
    }
    dragState.current = null;
  }

  function handleButtonClick() {
    if (justDraggedRef.current) {
      justDraggedRef.current = false;
      return;
    }
    setOpen(true);
  }

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages = [...messages, { role: "user" as const, content: text }];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Something went wrong. Please try again.");
      }
      setMessages([...nextMessages, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      <motion.button
        ref={buttonRef}
        type="button"
        onClick={handleButtonClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        className={pos ? "fixed z-50 flex items-center gap-2 rounded-full pl-2 pr-4 py-2 shadow-lg" : "fixed bottom-8 left-8 z-50 flex items-center gap-2 rounded-full pl-2 pr-4 py-2 shadow-lg"}
        style={{
          backgroundColor: colors.cardBackground,
          border: `2px solid ${colors.accentGold}`,
          touchAction: "none",
          cursor: "grab",
          ...(pos ? { left: pos.x, top: pos.y, bottom: "auto" } : {}),
        }}
        aria-label="Ask Wave — click to open, drag to move"
        title="Click to open — drag to move"
      >
        <DolphinMascot size={40} animate={false} />
        <span className="text-sm font-semibold flex items-center gap-1" style={{ color: colors.textPrimary }}>
          <MessageCircle size={16} />
          Ask Wave
        </span>
      </motion.button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="flex flex-col p-0"
          style={{ backgroundColor: colors.background, borderColor: colors.cardBorder }}
        >
          <SheetHeader style={{ borderBottom: `1px solid ${colors.cardBorder}` }}>
            <div className="flex items-center gap-3">
              <DolphinMascot size={36} animate={false} />
              <div>
                <SheetTitle style={{ color: colors.textPrimary }}>Ask Wave</SheetTitle>
                <SheetDescription style={{ color: colors.textSecondary }}>
                  Your GenAI literacy guide
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className="max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-line"
                style={
                  m.role === "user"
                    ? {
                        marginLeft: "auto",
                        backgroundColor: colors.accentMaroon,
                        color: "#FFFFFF",
                      }
                    : {
                        backgroundColor: colors.cardBackground,
                        border: `1px solid ${colors.cardBorder}`,
                        color: colors.textPrimary,
                      }
                }
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div
                className="max-w-[85%] rounded-2xl px-3 py-2 text-sm"
                style={{
                  backgroundColor: colors.cardBackground,
                  border: `1px solid ${colors.cardBorder}`,
                  color: colors.textSecondary,
                }}
              >
                Wave is thinking...
              </div>
            )}
            {error && (
              <div className="text-xs px-3" style={{ color: colors.accentPink }}>
                {error}
              </div>
            )}
          </div>

          <div className="p-3 flex items-center gap-2" style={{ borderTop: `1px solid ${colors.cardBorder}` }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about GenAI..."
              disabled={loading}
              className="flex-1 rounded-full px-4 py-2 text-sm outline-none"
              style={{
                backgroundColor: colors.cardBackground,
                border: `1px solid ${colors.cardBorder}`,
                color: colors.textPrimary,
              }}
            />
            <button
              type="button"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="rounded-full p-2 disabled:opacity-50"
              style={{ backgroundColor: colors.accentTeal, color: "#FFFFFF" }}
              aria-label="Send"
            >
              <Send size={18} />
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
