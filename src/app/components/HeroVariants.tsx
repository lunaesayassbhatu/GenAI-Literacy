import { useEffect, useState } from "react";
import { motion } from "motion/react";

const FRAME_STYLE = {
  boxShadow: "0 8px 0 #1A0A12, 0 14px 24px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,198,39,0.25)",
} as const;

const STARS = Array.from({ length: 34 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  top: `${(i * 53) % 62}%`,
  size: 1 + (i % 3),
  delay: (i % 7) * 0.45,
}));

/** "Beacon" banner: a night sky where a lighthouse beam sweeps across the sea and lights up the title. */
export function HeroBeacon({ subtitle }: { subtitle: string }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl px-6 pt-12 pb-24 text-center"
      style={{ background: "linear-gradient(180deg, #0E0716 0%, #2A0F26 55%, #5A1A33 100%)", ...FRAME_STYLE }}
    >
      <style>{`
        @keyframes beaconSweep { 0%,100% { transform: rotate(-9deg); opacity: .55; } 50% { transform: rotate(7deg); opacity: .95; } }
        @keyframes beaconGlow { 0%,100% { text-shadow: 0 0 14px rgba(255,214,120,.55), 0 0 34px rgba(255,198,39,.25); } 50% { text-shadow: 0 0 22px rgba(255,226,150,.95), 0 0 56px rgba(255,198,39,.55); } }
        @keyframes seaDrift { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>

      {/* twinkling stars */}
      {STARS.map((st, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="absolute rounded-full bg-white"
          style={{ left: st.left, top: st.top, width: st.size, height: st.size }}
          animate={{ opacity: [0.15, 1, 0.15] }}
          transition={{ duration: 2.8, repeat: Infinity, delay: st.delay }}
        />
      ))}

      {/* sweeping light beam */}
      <div className="absolute pointer-events-none" style={{ right: 70, top: "46%", width: 0, height: 0 }} aria-hidden>
        <div
          style={{
            position: "absolute",
            right: 0,
            top: -90,
            width: 760,
            height: 180,
            transformOrigin: "100% 50%",
            background: "linear-gradient(270deg, rgba(255,232,160,0.75) 0%, rgba(255,214,120,0.25) 45%, rgba(255,198,39,0) 100%)",
            clipPath: "polygon(100% 44%, 0 0, 0 100%, 100% 56%)",
            animation: "beaconSweep 7s ease-in-out infinite",
            filter: "blur(2px)",
          }}
        />
      </div>

      {/* lighthouse */}
      <svg className="absolute" style={{ right: 36, bottom: 38, width: 74, height: 170 }} viewBox="0 0 74 170" aria-hidden>
        <path d="M22 168 L28 52 H46 L52 168 Z" fill="#F3E7D8" />
        <path d="M24 120 L26.5 84 H47.5 L50 120 Z" fill="#8C1D40" />
        <path d="M22.5 160 L24 138 H50 L51.5 160 Z" fill="#8C1D40" />
        <rect x="24" y="40" width="26" height="14" rx="2" fill="#2B1B2B" />
        <rect x="27" y="26" width="20" height="16" rx="3" fill="#FFE9A0" />
        <path d="M22 28 L37 8 L52 28 Z" fill="#8C1D40" />
        <circle cx="37" cy="34" r="18" fill="url(#lampGlow)" />
        <defs>
          <radialGradient id="lampGlow">
            <stop offset="0%" stopColor="#FFF2C0" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#FFC627" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      <p className="relative text-sm md:text-base font-bold tracking-[0.5em] uppercase mb-1" style={{ color: "#F0E0E4" }}>
        ASU
      </p>
      <h1
        className="relative text-5xl md:text-7xl font-extrabold tracking-tight mb-4"
        style={{ color: "#FFE9A8", animation: "beaconGlow 7s ease-in-out infinite" }}
      >
        GenAI Lab
      </h1>
      {subtitle && (
<p className="relative text-xl md:text-2xl font-semibold max-w-2xl mx-auto" style={{ color: "#F0E0E4" }}>
        {subtitle}
      </p>
)}

      {/* dark sea */}
      <div className="absolute left-0 right-0 bottom-0 h-16 pointer-events-none overflow-hidden" aria-hidden>
        {[
          { color: "rgba(40,18,48,0.9)", duration: 11, top: 8 },
          { color: "#14091A", duration: 7, top: 26 },
        ].map((w, i) => (
          <svg
            key={i}
            className="absolute left-0"
            style={{ width: "200%", height: 40, top: w.top, animation: `seaDrift ${w.duration}s linear infinite` }}
            viewBox="0 0 200 40"
            preserveAspectRatio="none"
          >
            <path d="M0 20 Q 12.5 4 25 20 T 50 20 T 75 20 T 100 20 T 125 20 T 150 20 T 175 20 T 200 20 V40 H0 Z" fill={w.color} />
          </svg>
        ))}
      </div>
    </div>
  );
}

// The network frames the banner (left and right clusters plus the top and bottom rims) so it never runs through the text.
const NODES: [number, number][] = [
  [4, 30], [13, 62], [21, 20], [9, 88], [30, 9], [46, 10], [62, 9], [72, 12],
  [80, 30], [88, 64], [95, 26], [91, 90], [30, 94], [50, 93], [70, 94],
];
const LINKS: [number, number][] = [
  [0, 1], [0, 2], [1, 2], [1, 3], [2, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 10], [8, 9], [9, 10], [9, 11],
  [3, 12], [12, 13], [13, 14], [14, 11],
];

/** "Circuit" banner: a glowing neural network with pulses travelling along it and a typed-out title. */
export function HeroCircuit({ subtitle }: { subtitle: string }) {
  const full = "GenAI Lab";
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (shown >= full.length) return;
    const t = window.setTimeout(() => setShown((n) => n + 1), 140);
    return () => window.clearTimeout(t);
  }, [shown]);

  return (
    <div
      className="relative overflow-hidden rounded-2xl px-6 py-14 text-center"
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(140,29,64,0.9) 0%, rgba(54,12,30,1) 60%), #2A0A18",
        ...FRAME_STYLE,
      }}
    >
      <style>{`
        @keyframes pulseTravel { from { stroke-dashoffset: 24; } to { stroke-dashoffset: 0; } }
        @keyframes nodePulse { 0%,100% { transform: scale(0.75); opacity: .65; } 50% { transform: scale(1.25); opacity: 1; } }
        @keyframes caret { 0%,49% { opacity: 1; } 50%,100% { opacity: 0; } }
      `}</style>

      {/* faint grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,198,39,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,198,39,0.06) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
        }}
      />

      {/* neural network */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        {LINKS.map(([a, b], i) => (
          <g key={i}>
            <line x1={NODES[a][0]} y1={NODES[a][1]} x2={NODES[b][0]} y2={NODES[b][1]} stroke="rgba(255,198,39,0.22)" strokeWidth="0.25" vectorEffect="non-scaling-stroke" />
            <line
              x1={NODES[a][0]}
              y1={NODES[a][1]}
              x2={NODES[b][0]}
              y2={NODES[b][1]}
              stroke="#FFD24D"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeDasharray="4 20"
              vectorEffect="non-scaling-stroke"
              style={{ animation: `pulseTravel ${2.2 + (i % 4) * 0.5}s linear ${i * 0.3}s infinite` }}
            />
          </g>
        ))}
      </svg>

      {NODES.map(([x, y], i) => (
        <span
          key={i}
          aria-hidden
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: 10,
            height: 10,
            marginLeft: -5,
            marginTop: -5,
            backgroundColor: "#FFC627",
            boxShadow: "0 0 10px 2px rgba(255,198,39,0.7)",
            animation: `nodePulse 2.6s ease-in-out ${i * 0.25}s infinite`,
          }}
        />
      ))}

      <p className="relative font-mono text-sm md:text-base tracking-widest mb-1" style={{ color: "#8FE3EE", textShadow: "0 0 10px rgba(143,227,238,0.6)" }}>
        {"> ASU"}
      </p>
      <h1
        className="relative text-5xl md:text-7xl font-extrabold tracking-tight mb-4 min-h-[1.2em]"
        style={{ color: "#FFE9A8", textShadow: "0 0 18px rgba(255,198,39,0.55), 0 3px 0 rgba(0,0,0,0.4)" }}
        aria-label={full}
      >
        {full.slice(0, shown)}
        <span
          aria-hidden
          className="inline-block align-middle ml-1"
          style={{ width: 6, height: "0.8em", backgroundColor: "#8FE3EE", animation: "caret 1s steps(1) infinite" }}
        />
      </h1>
      {subtitle && (
<p className="relative text-xl md:text-2xl font-semibold max-w-2xl mx-auto" style={{ color: "#F0E0E4" }}>
        {subtitle}
      </p>
)}
    </div>
  );
}
