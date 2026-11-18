import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { Building2, Check, ClipboardCheck, Cpu, Database, Repeat, Rocket, ShieldAlert, Users, X, type LucideIcon } from "lucide-react";
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

// Colours of the "flow" chart (Halle's Canva reference): ASU maroon cards with gold number badges.
const FLOW_RED = "#8B1A2E";
const FLOW_GOLD = "#FFC627";
// The picture's title is a heavy condensed face. These are on most computers, so no font has to be downloaded.
const TITLE_FONT = 'Impact, Haettenschweiler, "Arial Narrow Bold", "Arial Narrow", sans-serif';

// A card can name its own icon; otherwise it gets one by position.
const ICONS_BY_NAME: Record<string, LucideIcon> = {
  database: Database,
  cpu: Cpu,
  repeat: Repeat,
  check: ClipboardCheck,
  rocket: Rocket,
  building: Building2,
  people: Users,
  alert: ShieldAlert,
};

interface ProcessItem {
  title: string;
  /** Name of the card's icon (see ICONS_BY_NAME). */
  icon?: string;
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
  // Width available to the "flow" chart, so it can be scaled to fit (or stacked on a phone).
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [wrapW, setWrapW] = useState(0);
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => setWrapW(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [data.variant]);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const gated = Boolean(onAllViewed);
  // What the cards are called in the on-screen wording: "step" (default) or, say, "question".
  const word: string = data.itemWord ?? "step";
  const iconFor = (item: ProcessItem, i: number): LucideIcon => (item.icon && ICONS_BY_NAME[item.icon]) || STAGE_ICONS[i % STAGE_ICONS.length];
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

  // "flow" is the look from Halle's Canva picture: a white board with layered cards (a maroon card with a white box in front),
  // black outlines, gold number tabs, black arrows and a big maroon title. It is drawn on a fixed 1024-wide canvas that is
  // scaled to fit; below about 760px wide the cards stack instead so the text stays readable on a phone.
  const flow = data.variant === "flow";
  const active = openIndex !== null ? items[openIndex] : null;
  const activeColor = openIndex !== null ? (flow ? FLOW_RED : STAGE_COLORS[openIndex % STAGE_COLORS.length]) : colors.accentGold;
  const ActiveIcon = openIndex !== null ? iconFor(items[openIndex], openIndex) : null;

  const CANVAS_W = 1024;
  const CARD_W = 268;
  const CARD_H = 204;
  const HEAD_H = 70;
  const BOX_DX = 13;
  const BOX_W = 269;
  const INK = "#14080D";
  const OUTLINE = `2.5px solid ${INK}`;
  // Top-left corner of each card. Three on the first row, two centred under them.
  const POS = [
    { x: 42, y: 250 },
    { x: 371, y: 250 },
    { x: 700, y: 250 },
    { x: 207, y: 566 },
    { x: 537, y: 566 },
  ];
  const CANVAS_H = 566 + CARD_H + 24;
  const canvasMode = flow && items.length === POS.length && wrapW >= 760;
  const scale = canvasMode ? Math.min(1, wrapW / CANVAS_W) : 1;

  // The small gold pill that tells the learner a card can be opened (and shows it was).
  const readPill = (seen: boolean) => (
    <span
      className="flex items-center font-bold"
      style={{
        height: 22,
        padding: "0 10px",
        fontSize: 12,
        background: seen ? "#FFFFFF" : FLOW_GOLD,
        border: OUTLINE,
        borderRadius: 11,
        color: INK,
        whiteSpace: "nowrap",
      }}
    >
      {seen ? "✓ Read again" : "Click to read"}
    </span>
  );

  const cardCanvas = (i: number) => {
    const item = items[i];
    const p = POS[i];
    const clickable = readable.includes(i);
    const seen = viewed.has(i);
    return (
      <button
        key={item.title}
        type="button"
        disabled={!clickable}
        aria-haspopup="dialog"
        aria-label={clickable ? `${item.title}. Click to read more.` : item.title}
        onClick={(e) => open(i, e.currentTarget)}
        className="absolute text-left transition-transform enabled:hover:-translate-y-1 enabled:cursor-pointer focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4"
        style={{ left: p.x, top: p.y, width: CARD_W, height: CARD_H, outlineColor: FLOW_GOLD }}
      >
        <span className="absolute inset-0" style={{ background: FLOW_RED, border: OUTLINE, borderRadius: 18 }} />
        <span
          className="absolute flex items-center justify-center font-extrabold"
          style={{ left: -1, top: -22, width: 50, height: 44, background: FLOW_GOLD, border: OUTLINE, borderRadius: 16, color: INK, fontSize: 26 }}
          aria-hidden
        >
          {i + 1}
        </span>
        <span className="absolute font-bold text-white" style={{ left: 62, right: 12, top: 7, fontSize: 17, lineHeight: "19px" }}>
          {item.title}
        </span>
        {seen && (
          <span
            className="absolute flex items-center justify-center"
            style={{ right: -9, top: -9, width: 24, height: 24, borderRadius: 12, background: "#FFFFFF", color: FLOW_RED, border: OUTLINE }}
            aria-hidden
          >
            <Check size={13} strokeWidth={4} />
          </span>
        )}
        <span
          className="absolute"
          style={{
            left: BOX_DX,
            top: HEAD_H,
            width: BOX_W,
            height: CARD_H - HEAD_H,
            background: "#FFFFFF",
            border: OUTLINE,
            borderRadius: 16,
            padding: "10px 14px",
            fontSize: 17,
            lineHeight: "21px",
            color: "#1A1A1A",
            overflow: "hidden",
          }}
        >
          {item.summary}
        </span>
        {clickable && <span style={{ position: "absolute", left: BOX_DX + BOX_W - 14, top: CARD_H - 11, transform: "translateX(-100%)" }}>{readPill(seen)}</span>}
      </button>
    );
  };

  // Black wires, arrows and the connectors between the title and the cards, as in the picture.
  const mirror = (x: number) => CANVAS_W - x;
  const badgeX = (i: number) => POS[i].x + 24;
  const rowMidY = (i: number) => POS[i].y + HEAD_H + (CARD_H - HEAD_H) / 2;
  const boxRight = (i: number) => POS[i].x + BOX_DX + BOX_W;
  const arrowRight = (fromI: number, toI: number) => {
    const y = rowMidY(fromI);
    const x1 = boxRight(fromI);
    const x2 = POS[toI].x;
    return (
      <g key={`a${fromI}`}>
        <path d={`M${x1},${y} H${x2}`} />
        <polyline points={`${x2 - 9},${y - 7} ${x2},${y} ${x2 - 9},${y + 7}`} />
      </g>
    );
  };
  const elbowFromRow1 = () => {
    const x1 = POS[2].x + BOX_DX + BOX_W / 2;
    const y1 = POS[2].y + CARD_H;
    const x2 = badgeX(3);
    const yBend = 488;
    const yEnd = POS[3].y - 22;
    return (
      <g>
        <path d={`M${x1},${y1} V${yBend - 20} Q${x1},${yBend} ${x1 - 20},${yBend} H${x2 + 20} Q${x2},${yBend} ${x2},${yBend + 20} V${yEnd}`} />
        <polyline points={`549,${yBend - 7} 539,${yBend} 549,${yBend + 7}`} />
      </g>
    );
  };
  const wires = (
    <svg
      className="absolute left-0 top-0"
      width={CANVAS_W}
      height={CANVAS_H}
      viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
      fill="none"
      stroke={INK}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {/* the two cables across the top */}
      <path d={`M0,45 H20 Q42,45 42,67 V104 Q42,126 64,126 H394 Q405,126 405,136 Q405,146 394,146 H384`} />
      <path d={`M${CANVAS_W},45 H${mirror(20)} Q${mirror(42)},45 ${mirror(42)},67 V104 Q${mirror(42)},126 ${mirror(64)},126 H${mirror(394)} Q${mirror(405)},126 ${mirror(405)},136 Q${mirror(405)},146 ${mirror(394)},146 H${mirror(384)}`} />
      <rect x={362} y={141} width={22} height={10} rx={5} fill={INK} />
      <rect x={mirror(384)} y={141} width={22} height={10} rx={5} fill={INK} />
      {/* from the title down to the first card */}
      <path d={`M515,100 V176 Q515,198 493,198 H${badgeX(0) + 22} Q${badgeX(0)},198 ${badgeX(0)},220 V${POS[0].y - 22}`} />
      <polyline points="309,191 299,198 309,205" />
      {arrowRight(0, 1)}
      {arrowRight(1, 2)}
      {elbowFromRow1()}
      {arrowRight(3, 4)}
    </svg>
  );

  const canvas = (
    <div style={{ width: CANVAS_W, height: CANVAS_H, transform: `scale(${scale})`, transformOrigin: "top left", position: "relative" }}>
      {wires}
      <div
        className="absolute text-center font-black uppercase"
        style={{ left: 0, width: CANVAS_W, top: 14, fontSize: 76, lineHeight: "84px", color: FLOW_RED, letterSpacing: "0.02em", fontFamily: TITLE_FONT, fontWeight: 400 }}
      >
        {data.diagramTitle ?? data.title}
      </div>
      {items.map((_, i) => cardCanvas(i))}
    </div>
  );

  // Phones: the same cards one under another, with black arrows between them.
  const stacked = (
    <div>
      <div className="text-center font-black uppercase mb-6" style={{ color: FLOW_RED, fontSize: 40, lineHeight: 1.1, fontFamily: TITLE_FONT, fontWeight: 400, letterSpacing: "0.02em" }}>
        {data.diagramTitle ?? data.title}
      </div>
      <ol className="list-none m-0 p-0 flex flex-col px-2">
        {items.map((item, i) => {
          const clickable = readable.includes(i);
          const seen = viewed.has(i);
          return (
            <li key={item.title}>
              <button
                type="button"
                disabled={!clickable}
                aria-haspopup="dialog"
                aria-label={clickable ? `${item.title}. Click to read more.` : item.title}
                onClick={(e) => open(i, e.currentTarget)}
                className="relative block w-full text-left mt-3 pb-3 enabled:cursor-pointer focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4"
                style={{ outlineColor: FLOW_GOLD }}
              >
                <span className="block" style={{ background: FLOW_RED, border: OUTLINE, borderRadius: 18 }}>
                  <span className="block pl-14 pr-10 pt-3 pb-3 text-base font-bold leading-tight text-white">{item.title}</span>
                  <span
                    className="block ml-3 -mr-2 px-4 py-3 text-[15px] leading-snug"
                    style={{ background: "#FFFFFF", border: OUTLINE, borderRadius: 16, color: "#1A1A1A", marginBottom: -2 }}
                  >
                    {item.summary}
                  </span>
                </span>
                <span
                  className="absolute flex items-center justify-center text-xl font-extrabold"
                  style={{ left: -2, top: -12, width: 44, height: 40, background: FLOW_GOLD, border: OUTLINE, borderRadius: 14, color: INK }}
                  aria-hidden
                >
                  {i + 1}
                </span>
                {seen && (
                  <span
                    className="absolute flex items-center justify-center"
                    style={{ right: -9, top: -9, width: 24, height: 24, borderRadius: 12, background: "#FFFFFF", color: FLOW_RED, border: OUTLINE }}
                    aria-hidden
                  >
                    <Check size={13} strokeWidth={4} />
                  </span>
                )}
                {clickable && <span style={{ position: "absolute", right: 14, bottom: 1 }}>{readPill(seen)}</span>}
              </button>
              {i < items.length - 1 && (
                <div className="text-center text-2xl leading-none font-bold pt-2" style={{ color: INK }} aria-hidden>
                  ↓
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );

  const flowLayout = (
    <div className="rounded-3xl p-4 md:p-6" style={{ backgroundColor: "#FFFFFF", boxShadow: "0 6px 0 rgba(0,0,0,0.35), 0 14px 30px rgba(0,0,0,0.4)" }}>
      <div ref={wrapRef} style={canvasMode ? { height: CANVAS_H * scale, overflow: "hidden" } : undefined}>
        {canvasMode ? canvas : stacked}
      </div>
    </div>
  );

  return (
    <div className="space-y-5 mx-auto" style={{ maxWidth: 940 }}>
      <PageHeader data={data} colors={colors} />
      {flow ? flowLayout : (
      <ol className="list-none p-0 m-0 flex flex-col md:flex-row md:items-stretch gap-2 md:gap-1">
        {items.map((item, i) => {
          const color = STAGE_COLORS[i % STAGE_COLORS.length];
          const Icon = iconFor(item, i);
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
      )}

      {gated && readable.length > 0 && (
        <p className="text-sm font-semibold text-center pt-3" style={{ color: allViewed || unlocked ? colors.accentTeal : colors.textSecondary }} aria-live="polite">
          {allViewed || unlocked
            ? `✓ You have read every ${word}. Press Next to continue.`
            : `Click each ${word} to read about it (${viewedCount} of ${readable.length}). Next unlocks when you have opened them all.`}
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
                  style={flow ? { backgroundColor: FLOW_GOLD, color: "#14080D", border: "2px solid #14080D" } : { backgroundColor: activeColor }}
                  aria-hidden
                >
                  {flow ? <span className="text-lg font-extrabold">{(openIndex ?? 0) + 1}</span> : ActiveIcon && <ActiveIcon size={22} />}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold tracking-wider" style={{ color: flow ? FLOW_GOLD : activeColor }}>
                    {word.toUpperCase()} {(openIndex ?? 0) + 1} OF {items.length}
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
                  <SourceMagnifier link={active.link} citation={active.citation} colors={colors} placement="above" />
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
