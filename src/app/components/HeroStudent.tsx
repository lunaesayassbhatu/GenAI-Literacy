import { motion } from "motion/react";
import type { CharacterId } from "../utils/userData";

const CHIPS = [
  { text: "💡 Write a clear prompt", left: "-18%", top: "6%", delay: 0 },
  { text: "✅ Fact-check it", left: "62%", top: "-1%", delay: 0.8 },
  { text: "⚖️ Use it wisely", left: "69%", top: "40%", delay: 1.6 },
];

interface Look {
  skin: string;
  hair: string;
  style: "long" | "short" | "curly";
  glasses: boolean;
  blush: boolean;
}

// The learner's chosen character decides which student we draw.
const LOOKS: Record<CharacterId, Look> = {
  aisha: { skin: "#C68642", hair: "#2A1810", style: "long", glasses: false, blush: true },
  dev: { skin: "#8D5524", hair: "#141414", style: "curly", glasses: true, blush: false },
  jordan: { skin: "#E3B27A", hair: "#5B3A29", style: "short", glasses: false, blush: false },
};

const HOODIE = "#8C1D40";
const HOODIE_DARK = "#6B1530";
const GOLD = "#FFC627";

function Student({ look }: { look: Look }) {
  const { skin, hair, style, glasses, blush } = look;
  return (
    <svg className="absolute left-0 top-0" width="340" height="270" viewBox="0 0 340 270" aria-hidden>
      <defs>
        <linearGradient id="deskGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3A1522" />
          <stop offset="100%" stopColor="#24101A" />
        </linearGradient>
      </defs>

      {/* hair that sits behind the head and shoulders */}
      {style === "long" && (
        <path d="M128 78 Q126 36 170 32 Q214 36 212 78 L226 168 Q205 178 194 150 L146 150 Q135 178 114 168 Z" fill={hair} />
      )}

      {/* torso: hoodie */}
      <path d="M104 236 L104 168 Q104 132 142 126 L198 126 Q236 132 236 168 L236 236 Z" fill={HOODIE} />
      {/* hood behind the neck */}
      <path d="M134 124 Q170 156 206 124 Q202 110 170 108 Q138 110 134 124 Z" fill={HOODIE_DARK} />
      {/* drawstrings */}
      <path d="M160 140 L158 172" stroke={GOLD} strokeWidth="3" strokeLinecap="round" />
      <path d="M180 140 L182 172" stroke={GOLD} strokeWidth="3" strokeLinecap="round" />
      <circle cx="158" cy="174" r="3" fill={GOLD} />
      <circle cx="182" cy="174" r="3" fill={GOLD} />

      {/* arms reaching to the keyboard (hands tuck behind the laptop) */}
      <path d="M118 146 Q92 184 128 222" stroke={HOODIE} strokeWidth="24" strokeLinecap="round" fill="none" />
      <path d="M222 146 Q248 184 212 222" stroke={HOODIE} strokeWidth="24" strokeLinecap="round" fill="none" />
      <circle cx="124" cy="220" r="10" fill={skin} />
      <circle cx="216" cy="220" r="10" fill={skin} />

      {/* long hair falling in front of the shoulders */}
      {style === "long" && (
        <>
          <path d="M132 96 Q118 130 124 170 Q140 176 148 150 Q142 124 146 100 Z" fill={hair} />
          <path d="M208 96 Q222 130 216 170 Q200 176 192 150 Q198 124 194 100 Z" fill={hair} />
        </>
      )}

      {/* neck and head */}
      <rect x="158" y="100" width="24" height="28" rx="8" fill={skin} />
      <ellipse cx="136" cy="88" rx="6" ry="9" fill={skin} />
      <ellipse cx="204" cy="88" rx="6" ry="9" fill={skin} />
      <circle cx="170" cy="82" r="35" fill={skin} />

      {/* hair on top */}
      {style === "long" && <path d="M134 80 Q134 40 170 40 Q206 40 206 80 Q192 58 170 58 Q148 58 134 80 Z" fill={hair} />}
      {style === "short" && <path d="M134 78 Q132 42 170 40 Q208 42 206 78 Q196 60 176 60 Q150 58 134 78 Z" fill={hair} />}
      {style === "curly" && (
        <g fill={hair}>
          <path d="M134 78 Q132 44 170 42 Q208 44 206 78 Q196 62 170 62 Q146 62 134 78 Z" />
          {[140, 152, 164, 176, 188, 200].map((x, i) => (
            <circle key={x} cx={x} cy={i % 2 ? 46 : 50} r="9" />
          ))}
        </g>
      )}

      {/* face */}
      <circle cx="157" cy="86" r="3.4" fill="#1B1020" />
      <circle cx="183" cy="86" r="3.4" fill="#1B1020" />
      <circle cx="158.2" cy="84.8" r="1.1" fill="#fff" />
      <circle cx="184.2" cy="84.8" r="1.1" fill="#fff" />
      <path d="M150 76 Q157 72 164 76" stroke={hair} strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M176 76 Q183 72 190 76" stroke={hair} strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M170 90 Q167 98 171 99" stroke="#00000033" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M158 104 Q170 116 182 104 Q170 108 158 104 Z" fill="#FFFFFF" stroke="#7A3B2A" strokeWidth="1.6" strokeLinejoin="round" />
      {blush && (
        <>
          <circle cx="148" cy="98" r="5" fill="#FF8FA3" opacity="0.35" />
          <circle cx="192" cy="98" r="5" fill="#FF8FA3" opacity="0.35" />
        </>
      )}
      {glasses && (
        <g stroke="#1A1A1A" strokeWidth="2.2" fill="rgba(255,255,255,0.12)">
          <circle cx="157" cy="86" r="10" />
          <circle cx="183" cy="86" r="10" />
          <path d="M167 86 H173" />
        </g>
      )}

      {/* laptop: we see the back of the lid, with a gold sparkle sticker */}
      <rect x="116" y="160" width="108" height="62" rx="7" fill="#241730" stroke="#3B2A44" strokeWidth="2" />
      <path d="M170 176 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4 z" fill={GOLD} />
      <path d="M96 222 H244 L256 232 H84 Z" fill="#3A2A44" />

      {/* desk */}
      <rect x="0" y="232" width="340" height="38" rx="6" fill="url(#deskGrad)" />
      <rect x="0" y="232" width="340" height="5" fill={GOLD} opacity="0.85" />

      {/* stack of books */}
      <rect x="20" y="218" width="64" height="14" rx="2" fill={GOLD} />
      <rect x="26" y="206" width="56" height="12" rx="2" fill="#F3E7D8" />
      <rect x="22" y="194" width="60" height="12" rx="2" fill={HOODIE} />

      {/* coffee mug with steam */}
      <rect x="276" y="208" width="26" height="24" rx="4" fill={GOLD} />
      <path d="M302 213 q9 0 9 8 q0 8 -9 8" fill="none" stroke={GOLD} strokeWidth="3" />
      <rect x="276" y="208" width="26" height="5" rx="2" fill="#7A1736" />
      {[282, 289, 296].map((x, i) => (
        <path
          key={x}
          d={`M${x} 204 q-3 -5 0 -10`}
          fill="none"
          stroke="#FFF4D6"
          strokeWidth="1.6"
          strokeLinecap="round"
          style={{ animation: `steam 2.4s ${i * 0.5}s infinite` }}
        />
      ))}
    </svg>
  );
}

/**
 * "Student" banner: an illustrated ASU student (drawn to match the learner's chosen character)
 * works on a laptop, with a sunrise glowing behind and study-tip chips floating around.
 */
export function HeroStudent({ subtitle, character }: { subtitle: string; character?: CharacterId }) {
  const look = LOOKS[character ?? "aisha"] ?? LOOKS.aisha;
  return (
    <div
      className="relative overflow-hidden rounded-2xl px-6 py-10 md:py-8"
      style={{
        background: "linear-gradient(135deg, #7A1736 0%, #5A1228 55%, #3E0C1C 100%)",
        boxShadow: "0 8px 0 #1A0A12, 0 14px 24px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.12)",
        border: "1px solid rgba(255,198,39,0.25)",
      }}
    >
      <style>{`
        @keyframes steam { 0% { opacity: 0; transform: translateY(0); } 40% { opacity: .8; } 100% { opacity: 0; transform: translateY(-12px); } }
        @keyframes studentShine { from { background-position: 0% 50%; } to { background-position: 200% 50%; } }
        @keyframes typeDot { 0%,80%,100% { opacity: .25; } 40% { opacity: 1; } }
      `}</style>

      <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-4">
        {/* text */}
        <div className="flex-1 text-center md:text-left z-10">
          <p className="text-sm md:text-base font-bold tracking-[0.5em] uppercase mb-1" style={{ color: "#F0E0E4" }}>
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
              animation: "studentShine 5s linear infinite",
              filter: "drop-shadow(0 3px 0 rgba(58,10,26,0.9)) drop-shadow(0 8px 14px rgba(0,0,0,0.4))",
            }}
          >
            GenAI Lab
          </h1>
          <p className="text-lg md:text-xl font-semibold max-w-xl mx-auto md:mx-0" style={{ color: "#F0E0E4" }}>
            {subtitle}
          </p>
        </div>

        {/* scene */}
        <div className="relative flex-shrink-0" style={{ width: 340, height: 270 }}>
          <div
            aria-hidden
            className="absolute rounded-full"
            style={{
              left: 40,
              top: 0,
              width: 260,
              height: 260,
              background: "radial-gradient(circle, rgba(255,198,39,0.5) 0%, rgba(255,154,60,0.22) 45%, rgba(255,198,39,0) 70%)",
            }}
          />

          <Student look={look} />

          {/* a small floating "AI chat" card */}
          <motion.div
            aria-hidden
            className="absolute rounded-xl p-2"
            style={{
              left: 4,
              top: 92,
              width: 92,
              backgroundColor: "rgba(255,255,255,0.14)",
              border: "1px solid rgba(255,198,39,0.45)",
            }}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="rounded-lg h-3 mb-1.5 ml-6" style={{ backgroundColor: GOLD }} />
            <div className="rounded-lg h-5 mb-1.5" style={{ backgroundColor: "#F3E7D8" }} />
            <div className="flex gap-1 ml-1">
              {[0, 0.2, 0.4].map((d) => (
                <span key={d} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#F3E7D8", animation: `typeDot 1.2s ${d}s infinite` }} />
              ))}
            </div>
          </motion.div>

          {CHIPS.map((c, i) => (
            <motion.div
              key={i}
              aria-hidden
              className="absolute text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap"
              style={{
                left: c.left,
                top: c.top,
                backgroundColor: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,198,39,0.45)",
                color: "#FFF4D6",
              }}
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, delay: c.delay, ease: "easeInOut" }}
            >
              {c.text}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
