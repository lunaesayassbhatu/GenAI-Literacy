import type { ReactNode } from "react";
import { motion } from "motion/react";

// Banner candidates built around AI imagery (illustrated SVG, no image files needed):
// HeroBrain (circuit brain), HeroRobot (friendly assistant), HeroPrompt (a chat window answering).

const GOLD = "#FFC627";
const MAROON = "#8C1D40";
const DEEP = "#6B1530";

const CARD_SHADOW = "0 8px 0 #1A0A12, 0 14px 24px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.12)";

/** Shared layout: ASU + title + subtitle on the left, the illustration on the right. */
function AIFrame({ subtitle, background, art }: { subtitle: string; background: string; art: ReactNode }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl px-6 py-10 md:py-8"
      style={{ background, boxShadow: CARD_SHADOW, border: "1px solid rgba(255,198,39,0.25)" }}
    >
      <style>{`
        @keyframes aiShine { from { background-position: 0% 50%; } to { background-position: 200% 50%; } }
        @keyframes aiNode { 0%,100% { opacity: .45; } 50% { opacity: 1; } }
        @keyframes aiCaret { 0%,49% { opacity: 1; } 50%,100% { opacity: 0; } }
        @keyframes aiFlow { from { stroke-dashoffset: 24; } to { stroke-dashoffset: 0; } }
        @keyframes aiGrow { 0% { transform: scaleX(0); } 55%,100% { transform: scaleX(1); } }
        @keyframes aiBlink { 0%,90%,100% { transform: scaleY(1); } 95% { transform: scaleY(0.1); } }
      `}</style>
      <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-4">
        <div className="flex-1 text-center md:text-left z-10">
          {/* inline styles on purpose: ASU must stay centred over the title in every layout */}
          <div style={{ display: "grid", width: "fit-content", justifyItems: "center", textAlign: "center" }}>
            <p
              className="text-sm md:text-base font-bold tracking-[0.5em] uppercase mb-1"
              style={{ color: "#F0E0E4", textAlign: "center", paddingLeft: "0.5em", width: "100%" }}
            >
              ASU
            </p>
            <h1
              className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4"
              style={{
                backgroundImage: "linear-gradient(100deg, #FFC627 0%, #FFE9A0 22%, #FFC627 44%, #FF9A3C 66%, #FFC627 100%)",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "aiShine 5s linear infinite",
                filter: "drop-shadow(0 3px 0 rgba(58,10,26,0.9)) drop-shadow(0 8px 14px rgba(0,0,0,0.4))",
              }}
            >
              GenAI Lab
            </h1>
          </div>
          <p className="text-lg md:text-xl font-semibold max-w-xl mx-auto md:mx-0" style={{ color: "#F0E0E4" }}>
            {subtitle}
          </p>
        </div>
        <div className="relative flex-shrink-0" style={{ width: 340, height: 270 }}>
          <div
            aria-hidden
            className="absolute rounded-full"
            style={{
              left: 40,
              top: 0,
              width: 260,
              height: 260,
              background: "radial-gradient(circle, rgba(255,198,39,0.45) 0%, rgba(255,154,60,0.2) 45%, rgba(255,198,39,0) 70%)",
            }}
          />
          {art}
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── 1. Brain + circuits ───────────────────────── */

// Circuit traces: [path, node x, node y]
const TRACES: Array<[string, number, number]> = [
  ["M104 110 H62 V70 H30", 30, 70],
  ["M100 150 H48 V190 H22", 22, 190],
  ["M120 196 V232 H86", 86, 232],
  ["M236 110 H282 V66 H312", 312, 66],
  ["M240 150 H294 V196 H320", 320, 196],
  ["M214 196 V240 H258", 258, 240],
  ["M170 52 V22 H214", 214, 22],
];

export function HeroBrain({ subtitle }: { subtitle: string }) {
  const art = (
    <svg className="absolute left-0 top-0" width="340" height="270" viewBox="0 0 340 270" aria-hidden>
      <defs>
        <radialGradient id="brainFill" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#B02A58" />
          <stop offset="100%" stopColor={DEEP} />
        </radialGradient>
      </defs>
      {/* circuit traces */}
      {TRACES.map(([d, x, y], i) => (
        <g key={i}>
          <path d={d} fill="none" stroke="rgba(255,198,39,0.35)" strokeWidth="2" />
          <path
            d={d}
            fill="none"
            stroke={GOLD}
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeDasharray="4 20"
            style={{ animation: `aiFlow ${2 + (i % 3) * 0.6}s linear ${i * 0.25}s infinite` }}
          />
          <circle cx={x} cy={y} r="5" fill={GOLD} style={{ animation: `aiNode 2.4s ease-in-out ${i * 0.3}s infinite` }} />
        </g>
      ))}
      {/* brain: two hemispheres built from lobes */}
      <g stroke={GOLD} strokeWidth="3" fill="url(#brainFill)" strokeLinejoin="round">
        <path d="M168 54 C150 40 120 46 112 68 C92 70 84 92 94 106 C80 120 86 144 104 150 C100 172 118 192 140 188 C146 204 168 208 170 192 Z" />
        <path d="M172 54 C190 40 220 46 228 68 C248 70 256 92 246 106 C260 120 254 144 236 150 C240 172 222 192 200 188 C194 204 172 208 170 192 Z" />
      </g>
      {/* folds */}
      <g fill="none" stroke="rgba(255,198,39,0.65)" strokeWidth="2.4" strokeLinecap="round">
        <path d="M118 74 C130 80 132 94 122 100" />
        <path d="M104 118 C120 112 134 122 132 136" />
        <path d="M128 160 C142 152 152 160 150 174" />
        <path d="M150 70 C158 86 150 100 156 112" />
        <path d="M222 74 C210 80 208 94 218 100" />
        <path d="M236 118 C220 112 206 122 208 136" />
        <path d="M212 160 C198 152 188 160 190 174" />
        <path d="M190 70 C182 86 190 100 184 112" />
      </g>
      {/* spark in the middle */}
      <path d="M170 112 l6 14 14 6 -14 6 -6 14 -6 -14 -14 -6 14 -6 z" fill={GOLD} style={{ animation: "aiNode 2s ease-in-out infinite" }} />
    </svg>
  );
  return <AIFrame subtitle={subtitle} background="radial-gradient(ellipse at 20% 0%, #8C1D40 0%, #3E0C1C 70%)" art={art} />;
}

/* ───────────────────────── 2. Friendly robot helper ───────────────────────── */

export function HeroRobot({ subtitle }: { subtitle: string }) {
  const art = (
    <>
      <svg className="absolute left-0 top-0" width="340" height="270" viewBox="0 0 340 270" aria-hidden>
        <defs>
          <linearGradient id="botDesk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3A1522" />
            <stop offset="100%" stopColor="#24101A" />
          </linearGradient>
        </defs>
        {/* antenna */}
        <path d="M170 62 V44" stroke="#CFC2B4" strokeWidth="4" strokeLinecap="round" />
        <circle cx="170" cy="38" r="8" fill={GOLD} style={{ animation: "aiNode 1.6s ease-in-out infinite" }} />
        {/* ears */}
        <rect x="100" y="104" width="12" height="34" rx="5" fill={GOLD} />
        <rect x="228" y="104" width="12" height="34" rx="5" fill={GOLD} />
        {/* head */}
        <rect x="108" y="62" width="124" height="104" rx="26" fill="#F3E7D8" />
        <rect x="122" y="80" width="96" height="62" rx="18" fill="#241730" />
        {/* eyes */}
        <g style={{ transformOrigin: "170px 108px", animation: "aiBlink 5s infinite" }}>
          <circle cx="148" cy="108" r="9" fill={GOLD} />
          <circle cx="192" cy="108" r="9" fill={GOLD} />
          <circle cx="151" cy="105" r="2.6" fill="#fff" />
          <circle cx="195" cy="105" r="2.6" fill="#fff" />
        </g>
        <path d="M156 128 Q170 140 184 128" stroke={GOLD} strokeWidth="4" strokeLinecap="round" fill="none" />
        {/* body */}
        <path d="M122 232 V190 Q122 172 142 170 H198 Q218 172 218 190 V232 Z" fill={MAROON} />
        <rect x="150" y="186" width="40" height="30" rx="8" fill="#241730" />
        <path d="M170 191 l3.4 8 8 3.4 -8 3.4 -3.4 8 -3.4 -8 -8 -3.4 8 -3.4 z" fill={GOLD} />
        {/* arms */}
        <path d="M122 186 Q94 200 98 226" stroke={MAROON} strokeWidth="18" strokeLinecap="round" fill="none" />
        <g style={{ transformOrigin: "218px 188px", animation: "aiWave 2.4s ease-in-out infinite" }}>
          <path d="M218 186 Q252 170 258 134" stroke={MAROON} strokeWidth="18" strokeLinecap="round" fill="none" />
          <circle cx="258" cy="128" r="11" fill="#F3E7D8" />
        </g>
        {/* desk */}
        <rect x="0" y="232" width="340" height="38" rx="6" fill="url(#botDesk)" />
        <rect x="0" y="232" width="340" height="5" fill={GOLD} opacity="0.85" />
        <rect x="26" y="214" width="58" height="18" rx="3" fill={GOLD} />
        <rect x="32" y="200" width="50" height="14" rx="3" fill="#F3E7D8" />
      </svg>
      <style>{`@keyframes aiWave { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-16deg); } }`}</style>
      <motion.div
        aria-hidden
        className="absolute rounded-2xl px-3 py-2 text-xs font-bold whitespace-nowrap"
        style={{
          left: 0,
          top: 40,
          backgroundColor: "rgba(255,255,255,0.14)",
          border: "1px solid rgba(255,198,39,0.5)",
          color: "#FFF4D6",
        }}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
      >
        Ask me anything 💬
      </motion.div>
      <motion.div
        aria-hidden
        className="absolute rounded-2xl px-3 py-2 text-xs font-bold whitespace-nowrap"
        style={{
          right: 0,
          top: 20,
          backgroundColor: "rgba(255,255,255,0.14)",
          border: "1px solid rgba(255,198,39,0.5)",
          color: "#FFF4D6",
        }}
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 3.1, repeat: Infinity, delay: 0.7, ease: "easeInOut" }}
      >
        ✅ Fact-check it
      </motion.div>
    </>
  );
  return <AIFrame subtitle={subtitle} background="linear-gradient(135deg, #7A1736 0%, #5A1228 55%, #3E0C1C 100%)" art={art} />;
}

/* ───────────────────────── 3. Prompt window ───────────────────────── */

const ANSWER_LINES = [190, 160, 176, 120];

export function HeroPrompt({ subtitle }: { subtitle: string }) {
  const art = (
    <>
      <svg className="absolute left-0 top-0" width="340" height="270" viewBox="0 0 340 270" aria-hidden>
        {/* window */}
        <rect x="30" y="34" width="280" height="200" rx="16" fill="#1E0C13" stroke={GOLD} strokeWidth="3" />
        <path d="M30 50 a16 16 0 0 1 16 -16 H294 a16 16 0 0 1 16 16 V62 H30 Z" fill={MAROON} />
        <circle cx="50" cy="48" r="5" fill="#FF6B6B" />
        <circle cx="68" cy="48" r="5" fill={GOLD} />
        <circle cx="86" cy="48" r="5" fill="#6BE08A" />
        {/* the user's prompt */}
        <rect x="104" y="78" width="188" height="34" rx="14" fill="#F3E7D8" />
        <text x="118" y="100" fontSize="13" fontWeight="700" fill="#3A0A1A" fontFamily="Inter, Segoe UI, Arial, sans-serif">
          Explain AI in plain words
        </text>
        {/* the answer */}
        <circle cx="54" cy="142" r="14" fill={GOLD} />
        <path d="M54 134 l2.6 5.4 5.4 2.6 -5.4 2.6 -2.6 5.4 -2.6 -5.4 -5.4 -2.6 5.4 -2.6 z" fill="#3A0A1A" />
        {ANSWER_LINES.map((w, i) => (
          <rect
            key={i}
            x="80"
            y={134 + i * 20}
            width={w}
            height="9"
            rx="4.5"
            fill={i === 0 ? "#F3E7D8" : "rgba(243,231,216,0.7)"}
            style={{ transformOrigin: "0% 50%", transformBox: "fill-box", animation: `aiGrow 5s ease-out ${i * 0.5}s infinite` }}
          />
        ))}
        {/* typing caret */}
        <rect x="80" y="212" width="8" height="12" rx="2" fill={GOLD} style={{ animation: "aiCaret 1s steps(1) infinite" }} />
      </svg>
      <motion.div
        aria-hidden
        className="absolute rounded-full px-3 py-1.5 text-xs font-bold whitespace-nowrap"
        style={{ left: -6, top: 4, backgroundColor: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,198,39,0.5)", color: "#FFF4D6" }}
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      >
        💡 Write a clear prompt
      </motion.div>
      <motion.div
        aria-hidden
        className="absolute rounded-full px-3 py-1.5 text-xs font-bold whitespace-nowrap"
        style={{ right: -6, bottom: 0, backgroundColor: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,198,39,0.5)", color: "#FFF4D6" }}
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, delay: 1, ease: "easeInOut" }}
      >
        ⚖️ Use it wisely
      </motion.div>
    </>
  );
  return <AIFrame subtitle={subtitle} background="linear-gradient(160deg, #2A0F26 0%, #5A1A33 60%, #7A1736 100%)" art={art} />;
}
