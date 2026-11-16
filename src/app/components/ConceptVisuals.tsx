import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { Check, ClipboardCheck, Cpu, Database, Repeat, Rocket, X } from "lucide-react";
import { SourceMagnifier } from "./SourceMagnifier";

/**
 * Two small diagram pages used inside the module lessons:
 *  - ProcessStep: a numbered row of stages (how a GenAI model learns). Each stage opens a pop-up with the full explanation.
 *  - FrameworkTableStep: three coloured columns of related skills (what GenAI literacy covers).
 */

function PageHeader({ data, colors }: { data: any; colors: any }) {
  return (
    <div>
      <span
        className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-2"
        style={{ backgroundColor: "rgba(232,84,122,0.2)", color: colors.accentPink }}
      >
        Section {data.section}
      </span>
      <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
        {data.title}
      </h2>
      {data.subtitle && (
        <p className="text-sm" style={{ color: colors.textSecondary }}>
          {data.subtitle}
        </p>
      )}
    </div>
  );
}

function SourceLinks({ links, colors }: { links?: { label: string; url: string }[]; colors: any }) {
  if (!links || links.length === 0) return null;
  return (
    <ul className="space-y-1 text-sm break-all list-none p-0 m-0">
      {links.map((l) => (
        <li key={l.url}>
          <a href={l.url} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: colors.accentGold }}>
            {l.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

// Same ASU-palette tones as the web map, so the diagrams look like they belong together.
const STAGE_COLORS = ["#8B1A2E", "#D6396A", "#23909F", "#B97A00", "#1D4E9E"];
const STAGE_ICONS = [Database, Cpu, Repeat, ClipboardCheck, Rocket];

interface ProcessItem {
  title: string;
  /** One plain sentence shown on the card. */
  summary?: string;
  /** The full explanation, shown in the pop-up. A stage without any is just a label. */
  paragraphs?: string[];
  /** A web page the information came from (magnifying glass opens it). */
  link?: string;
  /** A source with no web page, such as a book (magnifying glass shows the reference). */
  citation?: string;
}

/**
 * A numbered row of stages. Click a stage to read about it in a pop-up. When `onAllViewed` is given
 * (during a lesson), the lesson's Next button stays locked until every stage has been opened.
 */
export function ProcessStep({
  data,
  colors,
  onAllViewed,
  unlocked = false,
}: {
  data: any;
  colors: any;
  onAllViewed?: () => void;
  /** True when the lesson's Next button is already available (for example on a page that was finished before). */
  unlocked?: boolean;
}) {
  const items: ProcessItem[] = (data.steps ?? []).map((s: string | ProcessItem) => (typeof s === "string" ? { title: s } : s));
  const readable = items.map((it, i) => (it.paragraphs && it.paragraphs.length > 0 ? i : -1)).filter((i) => i >= 0);
  const [viewed, setViewed] = useState<Set<number>>(() => new Set());
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const gated = Boolean(onAllViewed);
  const allViewed = readable.every((i) => viewed.has(i));
  const viewedCount = readable.filter((i) => viewed.has(i)).length;

  useEffect(() => {
    if (allViewed) onAllViewed?.();
  }, [allViewed]); // eslint-disable-line react-hooks/exhaustive-deps

  const close = () => {
    setOpenIndex(null);
    openerRef.current?.focus();
  };

  useEffect(() => {
    if (openIndex === null) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  const open = (i: number, el: HTMLButtonElement) => {
    openerRef.current = el;
    setViewed((prev) => new Set(prev).add(i));
    setOpenIndex(i);
  };

  const active = openIndex !== null ? items[openIndex] : null;
  const activeColor = openIndex !== null ? STAGE_COLORS[openIndex % STAGE_COLORS.length] : colors.accentGold;
  const ActiveIcon = openIndex !== null ? STAGE_ICONS[openIndex % STAGE_ICONS.length] : null;

  return (
    <div className="space-y-5 mx-auto" style={{ maxWidth: 940 }}>
      <PageHeader data={data} colors={colors} />
      <ol className="list-none p-0 m-0 flex flex-col md:flex-row md:items-stretch gap-2 md:gap-1">
        {items.map((item, i) => {
          const color = STAGE_COLORS[i % STAGE_COLORS.length];
          const Icon = STAGE_ICONS[i % STAGE_ICONS.length];
          const clickable = readable.includes(i);
          const seen = viewed.has(i);
          return (
            <li key={item.title} className="flex flex-col md:flex-row md:flex-1 items-stretch gap-2 md:gap-1">
              <button
                type="button"
                disabled={!clickable}
                aria-haspopup="dialog"
                aria-label={clickable ? `${item.title}. Click to read more.` : item.title}
                onClick={(e) => open(i, e.currentTarget)}
                className="relative flex-1 rounded-2xl px-3 py-4 text-center flex flex-col items-center gap-2 transition-transform enabled:hover:-translate-y-1 enabled:cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{
                  backgroundColor: colors.cardBackground,
                  border: `2px solid ${color}`,
                  boxShadow: seen ? `0 0 0 3px ${color}33` : undefined,
                  outlineColor: color,
                }}
              >
                {seen && (
                  <span
                    className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: color, color: "#fff" }}
                    aria-hidden
                  >
                    <Check size={12} strokeWidth={4} />
                  </span>
                )}
                <span
                  className="absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold text-white"
                  style={{ backgroundColor: color }}
                  aria-hidden
                >
                  {i + 1}
                </span>
                <span
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: color }}
                  aria-hidden
                >
                  <Icon size={24} />
                </span>
                <span className="font-bold leading-snug text-sm" style={{ color: colors.textPrimary }}>
                  {item.title}
                </span>
                {item.summary && (
                  <span className="text-xs leading-snug" style={{ color: colors.textPrimary, opacity: 0.85 }}>
                    {item.summary}
                  </span>
                )}
                {clickable && (
                  <span className="mt-auto pt-1 text-xs font-bold" style={{ color: seen ? colors.textSecondary : colors.accentGold }}>
                    {seen ? "Read again" : "Click to read more"}
                  </span>
                )}
              </button>
              {i < items.length - 1 && (
                <span className="text-center text-2xl font-bold md:px-0.5 md:self-center" style={{ color: colors.accentGold }} aria-hidden>
                  <span className="md:hidden">↓</span>
                  <span className="hidden md:inline">→</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>

      {gated && readable.length > 0 && (
        <p className="text-sm font-semibold text-center pt-3" style={{ color: allViewed || unlocked ? colors.accentTeal : colors.textSecondary }} aria-live="polite">
          {allViewed || unlocked
            ? "✓ You have read every step. Press Next to continue."
            : `Click each step to read about it (${viewedCount} of ${readable.length}). Next unlocks when you have opened them all.`}
        </p>
      )}

      {/* The pop-up is drawn on the page itself (not inside the lesson frame) so nothing can cover or clip it. */}
      {active &&
        createPortal(
          <div
            className="fixed inset-0 z-[90] flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.65)" }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl rounded-2xl flex flex-col"
              style={{
                backgroundColor: colors.cardBackground,
                border: `2px solid ${activeColor}`,
                boxShadow: `0 0 36px ${activeColor}55`,
                maxHeight: "85vh",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 px-6 pt-5 pb-3 flex-shrink-0">
                <span
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0"
                  style={{ backgroundColor: activeColor }}
                  aria-hidden
                >
                  {ActiveIcon && <ActiveIcon size={22} />}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold tracking-wider" style={{ color: activeColor }}>
                    STEP {(openIndex ?? 0) + 1} OF {items.length}
                  </div>
                  <h3 className="text-xl font-bold leading-tight" style={{ color: colors.textPrimary }}>
                    {active.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close"
                  className="p-1 rounded-full hover:opacity-70 flex-shrink-0"
                  style={{ color: colors.textSecondary }}
                >
                  <X size={22} />
                </button>
              </div>

              <div className="px-6 pb-4 overflow-y-auto min-h-0 space-y-3">
                {(active.paragraphs ?? []).map((text, k) => (
                  <p key={k} className="leading-relaxed" style={{ color: colors.textPrimary, whiteSpace: "pre-line" }}>
                    {text}
                  </p>
                ))}
              </div>

              <div className="flex items-center justify-between gap-4 px-6 pb-5 pt-2 flex-shrink-0">
                <button
                  ref={closeRef}
                  type="button"
                  onClick={close}
                  className="px-6 py-3 rounded-xl font-bold transition-all hover:scale-105"
                  style={{ backgroundColor: colors.accentGold, color: "#0D0508" }}
                >
                  Got it
                </button>
                {(active.link || active.citation) && (
                  <SourceMagnifier link={active.link} citation={active.link ? undefined : active.citation} colors={colors} placement="above" />
                )}
              </div>
            </motion.div>
          </div>,
          document.body
        )}
    </div>
  );
}

const TABLE_TONES: Record<string, { bg: string; text: string }> = {
  maroon: { bg: "#8B1A2E", text: "#FFFFFF" },
  grey: { bg: "#7A7F85", text: "#FFFFFF" },
  gold: { bg: "#FFC627", text: "#1A1A1A" },
};

export function FrameworkTableStep({ data, colors }: { data: any; colors: any }) {
  const columns: { title: string; tone: string; items: string[] }[] = data.columns ?? [];
  const body = (children: ReactNode) => (
    <div className="space-y-5 mx-auto" style={{ maxWidth: 940 }}>
      <PageHeader data={data} colors={colors} />
      {children}
      <SourceLinks links={data.links} colors={colors} />
    </div>
  );

  return body(
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {columns.map((col) => {
        const tone = TABLE_TONES[col.tone] ?? TABLE_TONES.gold;
        return (
          // The three columns are the same height. Each column's boxes share the height left under its (same-height) header,
          // so columns with fewer boxes get slightly taller boxes and every column ends at the same line.
          <div key={col.title} className="flex flex-col gap-2">
            <div
              className="px-4 pt-4 pb-9 text-center font-bold leading-snug flex items-center justify-center md:min-h-[7.5rem]"
              style={{
                backgroundColor: tone.bg,
                color: tone.text,
                clipPath: "polygon(0 0, 100% 0, 100% 78%, 50% 100%, 0 78%)",
              }}
            >
              {col.title}
            </div>
            <div className="flex flex-col gap-2 flex-1">
              {col.items.map((item) => (
                <div
                  key={item}
                  className="rounded-lg px-3 py-3 text-center text-sm flex items-center justify-center flex-1"
                  style={{ backgroundColor: colors.cardBackground, border: "1px solid rgba(255,198,39,0.2)", color: colors.textPrimary }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
