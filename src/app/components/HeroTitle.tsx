import { motion } from "motion/react";
import dolphinImg from "../assets/dolphin-mascot.png";

const BUBBLES = [
  { left: "8%", size: 9, delay: 0, duration: 5.5 },
  { left: "21%", size: 6, delay: 1.8, duration: 4.6 },
  { left: "36%", size: 11, delay: 0.7, duration: 6.2 },
  { left: "63%", size: 7, delay: 2.6, duration: 5 },
  { left: "78%", size: 10, delay: 1.1, duration: 5.8 },
  { left: "91%", size: 6, delay: 3.2, duration: 4.4 },
];

/**
 * The home page banner: a shimmering gold title riding on an ocean wave, with bubbles rising
 * and Wave the dolphin leaping across the banner every few seconds.
 */
export function HeroTitle({ subtitle }: { subtitle: string }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl px-6 pt-12 pb-20 text-center"
      style={{
        background: "radial-gradient(ellipse at 50% 0%, #A3244B 0%, #6B1530 55%, #4A0D22 100%)",
        boxShadow: "0 8px 0 #3A0A1A, 0 14px 24px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.2)",
        border: "1px solid rgba(255,198,39,0.25)",
      }}
    >
      <style>{`
        @keyframes heroShine { from { background-position: 0% 50%; } to { background-position: 200% 50%; } }
        @keyframes heroWave { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>

      {/* rising bubbles */}
      {BUBBLES.map((b, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="absolute rounded-full pointer-events-none"
          style={{
            left: b.left,
            bottom: -16,
            width: b.size,
            height: b.size,
            border: "1px solid rgba(255,255,255,0.45)",
            backgroundColor: "rgba(255,255,255,0.08)",
          }}
          animate={{ y: [0, -300], opacity: [0, 0.85, 0] }}
          transition={{ duration: b.duration, repeat: Infinity, delay: b.delay, ease: "easeOut" }}
        />
      ))}

      {/* Wave leaping across the banner: flips to face the direction of travel and tilts along the arc */}
      <motion.div
        aria-hidden
        className="absolute pointer-events-none"
        style={{ top: "34%", left: 0 }}
        animate={{
          x: ["-12vw", "20vw", "52vw", "84vw", "112vw"].map((v) => v),
          y: [60, -30, -78, -30, 60],
          rotate: [-38, -18, 0, 18, 38],
        }}
        transition={{ duration: 3.4, repeat: Infinity, repeatDelay: 5, ease: "easeInOut", times: [0, 0.25, 0.5, 0.75, 1] }}
      >
        <img
          src={dolphinImg}
          alt=""
          width={78}
          draggable={false}
          style={{ transform: "scaleX(-1)", height: "auto", filter: "drop-shadow(0 6px 8px rgba(0,0,0,0.45))" }}
        />
      </motion.div>

      <p
        className="relative text-sm md:text-base font-bold tracking-[0.5em] uppercase mb-1"
        style={{ color: "#F0E0E4", textShadow: "0 2px 0 rgba(0,0,0,0.35)" }}
      >
        ASU
      </p>

      <h1
        className="relative text-5xl md:text-7xl font-extrabold tracking-tight mb-4"
        style={{
          backgroundImage: "linear-gradient(100deg, #FFC627 0%, #FFE9A0 22%, #FFC627 44%, #FF9A3C 66%, #FFC627 100%)",
          backgroundSize: "200% 100%",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          animation: "heroShine 5s linear infinite",
          filter: "drop-shadow(0 3px 0 rgba(58,10,26,0.9)) drop-shadow(0 8px 14px rgba(0,0,0,0.45))",
        }}
      >
        GenAI Lab
      </h1>

      <p className="relative text-xl md:text-2xl font-semibold max-w-2xl mx-auto" style={{ color: "#F0E0E4" }}>
        {subtitle}
      </p>

      {/* animated ocean waves along the bottom edge */}
      <div className="absolute left-0 right-0 bottom-0 h-14 pointer-events-none" aria-hidden>
        {[
          { color: "rgba(75,183,196,0.35)", duration: 9, top: 6 },
          { color: "rgba(255,198,39,0.45)", duration: 6.5, top: 14 },
          { color: "#3A0A1A", duration: 5, top: 24 },
        ].map((w, i) => (
          <svg
            key={i}
            className="absolute left-0"
            style={{ width: "200%", height: 36, top: w.top, animation: `heroWave ${w.duration}s linear infinite` }}
            viewBox="0 0 200 36"
            preserveAspectRatio="none"
          >
            <path d="M0 18 Q 12.5 2 25 18 T 50 18 T 75 18 T 100 18 T 125 18 T 150 18 T 175 18 T 200 18 V36 H0 Z" fill={w.color} />
          </svg>
        ))}
      </div>
    </div>
  );
}
