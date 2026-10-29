// Moving life drawn on top of the city picture: birds crossing the sky, pigeons circling the dovecote, chimney smoke,
// people walking the cobbled road, sparkles on the lake and drifting sunlight. Coordinates are pixels of the 1264 x 848
// picture (data/argoniaCityData.ts → IMAGE_SPOT_POSITIONS uses the same image). The layer ignores the mouse, so
// the hotspots under and above it keep working, and it is left out for people who prefer reduced motion.

const ROAD_UP = "M 300 840 C 380 760 450 700 480 640 C 510 580 560 520 600 450 C 620 415 630 395 640 385";
const ROAD_DOWN = "M 640 385 C 630 395 620 415 600 450 C 560 520 510 580 480 640 C 450 700 380 760 300 840";
const ROAD_MID = "M 120 760 C 220 730 300 690 380 700 C 440 706 480 680 510 640";
const SQUARE = "M 880 770 C 820 790 760 780 700 770 C 650 762 620 790 560 790";

const COLORS = ["#4a2e2a", "#2f3a38", "#5a3a28", "#33384a", "#3f3226", "#5a2a30"];

function Walker({ path, dur, delay, color, scaleFrom, scaleTo }: { path: string; dur: number; delay: number; color: string; scaleFrom: number; scaleTo: number }) {
  return (
    <g>
      <animateMotion dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" path={path} />
      <g>
        <animateTransform attributeName="transform" type="scale" dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" values={`${scaleFrom};${scaleTo}`} calcMode="linear" />
        <g opacity="0.92" style={{ animation: "lifeStep 0.55s ease-in-out infinite" }}>
          <ellipse cx="0" cy="0" rx="9" ry="3" fill="#000" opacity="0.28" />
          <path d="M -7 0 L -5 -26 H 5 L 7 0 Z" fill={color} />
          <rect x="-9" y="-24" width="4" height="12" rx="2" fill={color} />
          <rect x="5" y="-24" width="4" height="12" rx="2" fill={color} />
          <circle cx="0" cy="-33" r="6" fill="#c9a07c" />
          <path d="M -6 -34 Q 0 -43 6 -34 Z" fill="#2a1d14" />
        </g>
      </g>
    </g>
  );
}

function Bird({ y, dur, delay, size = 1 }: { y: number; dur: number; delay: number; size?: number }) {
  return (
    <g transform={`translate(0 ${y})`}>
      <g style={{ animation: `lifeFly ${dur}s linear ${delay}s infinite` }}>
       <g transform={`scale(${size})`}>
        <path d="M -14 0 Q -7 -9 0 0 Q 7 -9 14 0" stroke="#2b2118" strokeWidth="3" fill="none" strokeLinecap="round" style={{ transformOrigin: "0 0", animation: "lifeFlap 0.5s ease-in-out infinite" }} />
       </g>
      </g>
    </g>
  );
}

export function ArgoniaCityLife() {
  const reduce = typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return null;
  return (
    <svg viewBox="0 0 1264 848" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" style={{ zIndex: 1 }}>
      <defs>
        <radialGradient id="lifeSun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#fff0b8" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffcf7a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <style>{`
        @keyframes lifeFly { from { transform: translateX(-80px); } to { transform: translateX(1340px); } }
        @keyframes lifeFlap { 0%,100% { transform: scaleY(1); } 50% { transform: scaleY(-0.6); } }
        @keyframes lifeStep { 0%,100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-2.5px) rotate(2deg); } }
        @keyframes lifeSmoke { 0% { transform: translate(0,0) scale(0.5); opacity: 0.6; } 100% { transform: translate(26px,-90px) scale(2.2); opacity: 0; } }
        @keyframes lifeGlint { 0%,100% { opacity: 0; transform: scale(0.4); } 50% { opacity: 0.95; transform: scale(1); } }
        @keyframes lifeSun { 0%,100% { opacity: 0.55; } 50% { opacity: 1; } }
        @keyframes lifeCircle { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes lifeHop { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
      `}</style>

      {/* sunlight breathing near the sun */}
      <circle cx="1170" cy="170" r="260" fill="url(#lifeSun)" style={{ animation: "lifeSun 6s ease-in-out infinite" }} />

      {/* birds crossing the sky */}
      <Bird y={120} dur={26} delay={0} size={2.2} />
      <Bird y={190} dur={34} delay={-9} size={1.8} />
      <Bird y={150} dur={30} delay={-17} size={1.4} />
      <Bird y={260} dur={40} delay={-25} size={1.6} />
      <Bird y={90} dur={36} delay={-4} size={1.2} />

      {/* pigeons circling the dovecote */}
      <g transform="translate(115 300)">
        {[0, 1, 2, 3].map((i) => (
          <g key={i} style={{ animation: `lifeCircle ${7 + i}s linear ${-i * 2}s infinite`, transformOrigin: "0 0" }}>
            <g transform={`translate(${46 + i * 9} 0)`}>
              <ellipse rx="6" ry="3.2" fill="#ffffff" opacity="0.95" />
              <path d="M -2 0 L -9 -6 L -4 1 Z M 2 0 L 9 -6 L 4 1 Z" fill="#e8eaf0" style={{ transformOrigin: "0 0", animation: "lifeFlap 0.35s ease-in-out infinite" }} />
            </g>
          </g>
        ))}
      </g>

      {/* smoke from the workshop chimney */}
      <g transform="translate(905 352)">
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} r="9" fill="#e9e6e0" style={{ animation: `lifeSmoke 5s ease-out ${i * 1.25}s infinite` }} />
        ))}
      </g>

      {/* people walking the cobbled road */}
      <Walker path={ROAD_UP} dur={26} delay={0} color={COLORS[0]} scaleFrom={1.0} scaleTo={0.45} />
      <Walker path={ROAD_DOWN} dur={30} delay={-12} color={COLORS[1]} scaleFrom={0.45} scaleTo={1.0} />
      <Walker path={ROAD_UP} dur={34} delay={-20} color={COLORS[4]} scaleFrom={1.0} scaleTo={0.45} />
      <Walker path={ROAD_MID} dur={22} delay={-4} color={COLORS[3]} scaleFrom={0.7} scaleTo={0.6} />
      <Walker path={SQUARE} dur={20} delay={-8} color={COLORS[5]} scaleFrom={0.95} scaleTo={0.9} />
      <Walker path={SQUARE} dur={24} delay={-16} color={COLORS[2]} scaleFrom={0.9} scaleTo={0.95} />

      {/* glints on the lake */}
      {[[830, 372], [900, 392], [960, 365], [1010, 385], [870, 345], [940, 352]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <path d="M -9 0 H 9 M 0 -3 V 3" stroke="#fffbe8" strokeWidth="2" strokeLinecap="round" style={{ animation: `lifeGlint ${2.4 + (i % 3) * 0.6}s ease-in-out ${i * 0.45}s infinite`, transformOrigin: "0 0" }} />
        </g>
      ))}
    </svg>
  );
}
