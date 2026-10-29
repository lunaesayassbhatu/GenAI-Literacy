import type { ReactNode } from "react";

// The whole city of Argonia as one illustration (1200 x 800). The palace sits in the clouds on the summit, the city
// steps down the mountain in four terraces, a waterfall feeds the great lake at the bottom, and the village and
// farmland spread out along the shore. Hotspot positions in data/argoniaCityData.ts are percentages of this picture.

const WALL = "#f0dfc0";
const WALL_SHADE = "#c9b28c";
const STONE = "#9aa0aa";
const STONE_DARK = "#6f7480";
const ROOF_RED = "#b5502f";
const ROOF_MAROON = "#8c1d40";
const ROOF_BLUE = "#4a5f94";
const GLOW = "#ffd36e";

// Where the winding road passes (bottom to top).
const ROAD: Array<[number, number]> = [
  [560, 718], [430, 672], [700, 606], [520, 548], [730, 478], [560, 418], [690, 340], [600, 270], [600, 222],
];

function smooth(points: Array<[number, number]>): string {
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    const [px, py] = points[i - 1];
    const [cx, cy] = points[i];
    const my = (py + cy) / 2;
    d += ` C ${px} ${my}, ${cx} ${my}, ${cx} ${cy}`;
  }
  return d;
}

function Win({ x, y, w = 6, h = 9 }: { x: number; y: number; w?: number; h?: number }) {
  return <path d={`M ${x} ${y + h} V ${y + w / 2} A ${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2} V ${y + h} Z`} fill={GLOW} opacity="0.95" />;
}

function Pine({ x, y, s = 1, shade = false }: { x: number; y: number; s?: number; shade?: boolean }) {
  const g1 = shade ? "#244a40" : "#2f6b52";
  const g2 = shade ? "#2c5a4b" : "#3f8564";
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-2" y="-4" width="4" height="8" fill="#5b4030" />
      <polygon points="0,-34 -13,-6 13,-6" fill={g1} />
      <polygon points="0,-44 -10,-20 10,-20" fill={g2} />
    </g>
  );
}

function Person({ x, y, c = "#b5502f" }: { x: number; y: number; c?: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="1" rx="5" ry="1.6" fill="#000" opacity="0.25" />
      <path d="M -4 0 L -3 -9 H 3 L 4 0 Z" fill={c} />
      <circle cx="0" cy="-12" r="3.4" fill="#e9bf9b" />
    </g>
  );
}

function House({ x, y, w, h, roof, wall = WALL, tall = false }: { x: number; y: number; w: number; h: number; roof: string; wall?: string; tall?: boolean }) {
  const top = y - h;
  return (
    <g>
      <ellipse cx={x + w / 2} cy={y + 1} rx={w * 0.62} ry="3" fill="#000" opacity="0.22" />
      <rect x={x} y={top} width={w} height={h} fill={wall} />
      <rect x={x + w * 0.6} y={top} width={w * 0.4} height={h} fill={WALL_SHADE} opacity="0.55" />
      <polygon points={`${x - 4},${top + 1} ${x + w / 2},${top - (tall ? h * 0.7 : h * 0.55)} ${x + w + 4},${top + 1}`} fill={roof} />
      <polygon points={`${x + w / 2},${top - (tall ? h * 0.7 : h * 0.55)} ${x + w + 4},${top + 1} ${x + w * 0.55},${top + 1}`} fill="#000" opacity="0.18" />
      <Win x={x + w * 0.2} y={top + h * 0.3} />
      {w > 26 && <Win x={x + w * 0.62} y={top + h * 0.3} />}
      <rect x={x + w * 0.42} y={y - h * 0.38} width={w * 0.16} height={h * 0.38} fill="#5b3a2a" />
    </g>
  );
}

function Terrace({ y, x1, x2 }: { y: number; x1: number; x2: number }) {
  const w = x2 - x1;
  const blocks: ReactNode[] = [];
  for (let i = 0; i < Math.floor(w / 26); i++) {
    blocks.push(<line key={i} x1={x1 + i * 26 + (i % 2) * 8} y1={y} x2={x1 + i * 26 + (i % 2) * 8} y2={y + 26} stroke="#00000030" strokeWidth="1" />);
  }
  return (
    <g>
      <rect x={x1} y={y - 22} width={w} height="22" fill="url(#cityGround)" />
      <rect x={x1} y={y - 22} width={w} height="3" fill="#fff" opacity="0.18" />
      <rect x={x1} y={y} width={w} height="26" fill="url(#cityWall)" />
      <line x1={x1} y1={y + 13} x2={x2} y2={y + 13} stroke="#00000030" strokeWidth="1" />
      {blocks}
      <rect x={x1} y={y + 24} width={w} height="4" fill="#000" opacity="0.28" />
    </g>
  );
}

function Lantern({ x, y }: { x: number; y: number }) {
  return (
    <g style={{ animation: "cityFlicker 2.6s ease-in-out infinite" }}>
      <circle cx={x} cy={y} r="11" fill="url(#cityLantern)" />
      <circle cx={x} cy={y} r="2.4" fill="#fff4c4" />
    </g>
  );
}

export function ArgoniaCityScene() {
  return (
    <svg viewBox="0 0 1200 800" className="w-full h-full block" role="img" aria-label="Illustration of the whole city of Argonia: a palace in the clouds on a mountain, four terraces of buildings, a waterfall and a great lake below">
      <defs>
        <linearGradient id="citySky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1d1b5e" />
          <stop offset="38%" stopColor="#6b3f8f" />
          <stop offset="62%" stopColor="#d9708a" />
          <stop offset="82%" stopColor="#f7ae6a" />
          <stop offset="100%" stopColor="#ffd9a0" />
        </linearGradient>
        <radialGradient id="citySun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#fff2c0" stopOpacity="1" />
          <stop offset="30%" stopColor="#ffd27a" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#ff9a5a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cityRock" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a5826e" />
          <stop offset="55%" stopColor="#6a5062" />
          <stop offset="100%" stopColor="#3b2e4d" />
        </linearGradient>
        <linearGradient id="cityGround" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d8c498" />
          <stop offset="100%" stopColor="#b79f78" />
        </linearGradient>
        <linearGradient id="cityWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a766c" />
          <stop offset="100%" stopColor="#5c4a52" />
        </linearGradient>
        <linearGradient id="cityLake" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7fb7e0" />
          <stop offset="100%" stopColor="#2a5a96" />
        </linearGradient>
        <linearGradient id="cityFall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e6f6ff" />
          <stop offset="100%" stopColor="#8fc7ee" />
        </linearGradient>
        <radialGradient id="cityLantern" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#ffe08a" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#ffb347" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cityCloud" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#ffd9e0" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="cityVignette" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#12082a" stopOpacity="0.35" />
          <stop offset="30%" stopColor="#12082a" stopOpacity="0" />
          <stop offset="75%" stopColor="#12082a" stopOpacity="0" />
          <stop offset="100%" stopColor="#12082a" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      <style>{`
        @keyframes cityFlicker { 0%,100% { opacity: 1; } 50% { opacity: 0.72; } }
        @keyframes cityFlow { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -40; } }
        @keyframes cityWheel { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes citySmoke { 0% { transform: translate(0,0) scale(0.6); opacity: 0.55; } 100% { transform: translate(14px,-46px) scale(1.5); opacity: 0; } }
        @keyframes cityBird { from { transform: translateX(-60px); } to { transform: translateX(1300px); } }
        @keyframes cityCloud { from { transform: translateX(0); } to { transform: translateX(40px); } }
        @keyframes cityFlag { 0%,100% { transform: skewY(0deg); } 50% { transform: skewY(8deg); } }
        @media (prefers-reduced-motion: reduce) { svg * { animation: none !important; } }
      `}</style>

      {/* ── sky ─────────────────────────────────────────────── */}
      <rect width="1200" height="800" fill="url(#citySky)" />
      {[[80, 50], [200, 110], [340, 40], [520, 80], [760, 36], [1010, 70], [1120, 140], [900, 24], [140, 190]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.5" fill="#fff" opacity="0.7" />
      ))}
      <circle cx="935" cy="300" r="190" fill="url(#citySun)" />
      <circle cx="935" cy="300" r="34" fill="#fff6d2" />
      {/* light rays */}
      <g opacity="0.12" fill="#ffe7a8">
        <polygon points="935,300 600,0 700,0" />
        <polygon points="935,300 860,0 960,0" />
        <polygon points="935,300 1180,60 1200,160" />
      </g>

      {/* drifting clouds */}
      <g style={{ animation: "cityCloud 30s ease-in-out infinite alternate" }}>
        <ellipse cx="220" cy="170" rx="120" ry="22" fill="url(#cityCloud)" />
        <ellipse cx="290" cy="156" rx="70" ry="18" fill="url(#cityCloud)" />
        <ellipse cx="1000" cy="130" rx="130" ry="20" fill="url(#cityCloud)" />
        <ellipse cx="1070" cy="116" rx="70" ry="16" fill="url(#cityCloud)" />
      </g>

      {/* ── far mountains ───────────────────────────────────── */}
      <polygon points="0,470 80,380 150,430 260,330 360,440 440,400 520,470 0,470" fill="#6b4f93" opacity="0.7" />
      <polygon points="1200,470 1120,360 1040,420 960,340 880,430 820,400 760,470 1200,470" fill="#6b4f93" opacity="0.75" />
      <polygon points="0,520 120,440 220,500 330,430 430,510 500,480 0,520" fill="#4b3873" opacity="0.8" />
      <polygon points="1200,520 1080,430 970,500 880,440 780,510 1200,520" fill="#4b3873" opacity="0.85" />

      {/* ── the great mountain ──────────────────────────────── */}
      <polygon
        points="60,800 140,640 230,560 300,470 380,380 450,300 520,220 570,150 600,110 640,140 690,210 760,290 830,360 910,450 980,540 1060,640 1140,800"
        fill="url(#cityRock)"
      />
      {/* shaded west face, sunlit east face */}
      <polygon points="600,110 570,150 520,220 450,300 380,380 300,470 230,560 140,640 60,800 500,800 560,300" fill="#1f1838" opacity="0.32" />
      <polygon points="600,110 640,140 690,210 760,290 830,360 910,450 980,540 1060,640 1140,800 760,800 640,300" fill="#ffb36b" opacity="0.16" />
      {/* rock ridges */}
      <g stroke="#00000030" strokeWidth="2" fill="none">
        <path d="M600 112 L585 250 L520 380" />
        <path d="M606 120 L640 260 L700 400" />
        <path d="M450 300 L470 420 L400 520" />
        <path d="M830 360 L800 470 L860 560" />
      </g>

      {/* pines on the slopes */}
      {[[250, 580], [275, 560], [180, 640], [210, 622], [320, 500], [345, 480], [395, 400], [430, 330], [480, 262], [700, 270], [770, 330], [840, 380], [880, 420], [940, 500], [1010, 590], [1040, 612], [150, 700], [1080, 700]].map(([x, y], i) => (
        <Pine key={i} x={x} y={y} s={0.9 + (i % 3) * 0.12} shade={x < 600} />
      ))}

      {/* ── the winding road (under the buildings) ──────────── */}
      <path d={smooth(ROAD)} fill="none" stroke="#6e5a4a" strokeWidth="19" strokeLinecap="round" />
      <path d={smooth(ROAD)} fill="none" stroke="#e8d6b0" strokeWidth="13" strokeLinecap="round" />
      <path d={smooth(ROAD)} fill="none" stroke="#c9b283" strokeWidth="1.5" strokeDasharray="3 9" strokeLinecap="round" />
      {/* north road leaving the kingdom */}
      <path d="M 770 304 Q 840 330 905 326 T 1010 360" fill="none" stroke="#6e5a4a" strokeWidth="9" strokeLinecap="round" opacity="0.9" />
      <path d="M 770 304 Q 840 330 905 326 T 1010 360" fill="none" stroke="#d8c59c" strokeWidth="5" strokeLinecap="round" />

      {/* ── TERRACES ────────────────────────────────────────── */}
      <Terrace y={300} x1={466} x2={750} />
      <Terrace y={430} x1={342} x2={884} />
      <Terrace y={560} x1={232} x2={994} />
      <Terrace y={675} x1={116} x2={1080} />

      {/* ── THE PALACE ──────────────────────────────────────── */}
      <g>
        <ellipse cx="600" cy="218" rx="120" ry="7" fill="#000" opacity="0.25" />
        {/* side towers */}
        <rect x="508" y="118" width="38" height="100" fill={WALL} />
        <rect x="531" y="118" width="15" height="100" fill={WALL_SHADE} opacity="0.6" />
        <polygon points="503,120 527,70 551,120" fill={ROOF_MAROON} />
        <rect x="654" y="118" width="38" height="100" fill={WALL} />
        <rect x="677" y="118" width="15" height="100" fill={WALL_SHADE} opacity="0.6" />
        <polygon points="649,120 673,70 697,120" fill={ROOF_MAROON} />
        {/* main hall */}
        <rect x="540" y="158" width="120" height="60" fill={WALL} />
        <rect x="610" y="158" width="50" height="60" fill={WALL_SHADE} opacity="0.55" />
        {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={540 + i * 20} y="152" width="12" height="8" fill={WALL} />)}
        {/* central keep */}
        <rect x="574" y="100" width="52" height="62" fill={WALL} />
        <rect x="604" y="100" width="22" height="62" fill={WALL_SHADE} opacity="0.55" />
        <polygon points="566,102 600,40 634,102" fill={ROOF_MAROON} />
        <polygon points="600,40 634,102 604,102" fill="#000" opacity="0.2" />
        <circle cx="600" cy="128" r="9" fill={GLOW} />
        <rect x="598.5" y="119" width="3" height="18" fill="#8a5a1a" />
        <rect x="591" y="126.5" width="18" height="3" fill="#8a5a1a" />
        {/* flag */}
        <line x1="600" y1="40" x2="600" y2="14" stroke="#5b4030" strokeWidth="2" />
        <g style={{ transformOrigin: "600px 20px", animation: "cityFlag 3s ease-in-out infinite" }}>
          <polygon points="600,14 628,21 600,28" fill="#ffc627" />
        </g>
        {/* windows and doors */}
        {[518, 664].map((x) => <Win key={x} x={x} y={140} w={8} h={14} />)}
        {[518, 664].map((x) => <Win key={x + 1} x={x} y={176} w={8} h={14} />)}
        {[556, 574, 622, 640].map((x) => <Win key={x} x={x} y={182} w={8} h={14} />)}
        <path d="M 588 218 V 198 A 12 12 0 0 1 612 198 V 218 Z" fill="#4a1d2e" />
        {/* palace flags on the side towers */}
        <line x1="527" y1="70" x2="527" y2="52" stroke="#5b4030" strokeWidth="1.5" />
        <polygon points="527,52 543,57 527,62" fill="#8c1d40" />
        <line x1="673" y1="70" x2="673" y2="52" stroke="#5b4030" strokeWidth="1.5" />
        <polygon points="673,52 689,57 673,62" fill="#8c1d40" />
        <Lantern x={556} y={214} />
        <Lantern x={644} y={214} />
      </g>
      {/* clouds around the palace */}
      <g opacity="0.95">
        <ellipse cx="470" cy="206" rx="86" ry="15" fill="url(#cityCloud)" />
        <ellipse cx="740" cy="200" rx="92" ry="16" fill="url(#cityCloud)" />
        <ellipse cx="600" cy="232" rx="170" ry="14" fill="url(#cityCloud)" opacity="0.7" />
      </g>

      {/* ── UPPER TOWN (terrace 1) ──────────────────────────── */}
      {/* the pigeon loft */}
      <g>
        <ellipse cx="495" cy="300" rx="22" ry="3" fill="#000" opacity="0.22" />
        <rect x="480" y="262" width="30" height="38" fill={WALL} />
        <rect x="498" y="262" width="12" height="38" fill={WALL_SHADE} opacity="0.55" />
        <polygon points="474,264 495,236 516,264" fill={ROOF_BLUE} />
        <circle cx="488" cy="276" r="3.5" fill="#3a2d3d" />
        <circle cx="502" cy="276" r="3.5" fill="#3a2d3d" />
        <circle cx="495" cy="288" r="3.5" fill="#3a2d3d" />
        <g fill="#fff" opacity="0.95">
          <ellipse cx="520" cy="250" rx="4" ry="2.4" />
          <ellipse cx="470" cy="244" rx="4" ry="2.4" />
          <ellipse cx="540" cy="232" rx="4" ry="2.4" />
        </g>
      </g>
      <House x={540} y={298} w={34} h={26} roof={ROOF_RED} />
      <House x={586} y={298} w={30} h={22} roof={ROOF_BLUE} wall="#ecd6b4" />
      <House x={640} y={298} w={36} h={28} roof={ROOF_MAROON} />
      {/* the Eastgate bastion */}
      <g>
        <ellipse cx="757" cy="302" rx="46" ry="4" fill="#000" opacity="0.25" />
        <rect x="722" y="244" width="70" height="58" fill={STONE} />
        <rect x="762" y="244" width="30" height="58" fill={STONE_DARK} opacity="0.55" />
        {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={722 + i * 15} y="236" width="9" height="10" fill={STONE} />)}
        <path d="M 744 302 V 276 A 13 13 0 0 1 770 276 V 302 Z" fill="#2a1d2e" />
        <line x1="757" y1="260" x2="757" y2="276" stroke="#5b4030" strokeWidth="1.5" />
        <path d="M 738 252 h 9 v 10 h -9 z" fill={GLOW} opacity="0.9" />
        <path d="M 767 252 h 9 v 10 h -9 z" fill={GLOW} opacity="0.9" />
        <Lantern x={736} y={292} />
        <Lantern x={778} y={292} />
        <line x1="757" y1="236" x2="757" y2="214" stroke="#5b4030" strokeWidth="2" />
        <polygon points="757,214 779,220 757,226" fill="#4a5f94" />
        <Person x={732} y={304} c="#4a5f94" />
        <Person x={782} y={304} c="#4a5f94" />
      </g>

      {/* the hooded rider on the north road */}
      <g transform="translate(850 326)">
        <ellipse cx="0" cy="12" rx="16" ry="2.6" fill="#000" opacity="0.3" />
        <path d="M -14 4 Q -12 -4 -4 -4 L 8 -4 Q 14 -4 16 -10 L 20 -6 Q 18 4 12 5 L 10 12 H 7 L 6 6 H -6 L -8 12 H -11 L -12 6 Z" fill="#2a1f33" />
        <path d="M -2 -4 L 0 -17 Q 4 -22 8 -17 L 9 -4 Z" fill="#3a2d4a" />
        <circle cx="4" cy="-18" r="4" fill="#2a1f33" />
        <path d="M 0 -17 Q 4 -25 9 -18 L 6 -14 Z" fill="#1d1426" />
      </g>

      {/* ── MIDDLE TOWN (terrace 2) ─────────────────────────── */}
      {/* the codex workshop with its waterwheel */}
      <g>
        <ellipse cx="405" cy="432" rx="62" ry="4" fill="#000" opacity="0.25" />
        <rect x="362" y="372" width="88" height="58" fill={WALL} />
        <rect x="414" y="372" width="36" height="58" fill={WALL_SHADE} opacity="0.55" />
        <polygon points="354,374 406,330 458,374" fill={ROOF_RED} />
        <polygon points="406,330 458,374 418,374" fill="#000" opacity="0.18" />
        <rect x="424" y="318" width="16" height="34" fill={STONE_DARK} />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx="432" cy="316" r="9" fill="#ddd" opacity="0.5" style={{ animation: `citySmoke 4s ease-out ${i * 1.3}s infinite` }} />
        ))}
        <Win x={376} y={392} w={9} h={14} />
        <Win x={430} y={392} w={9} h={14} />
        <path d="M 398 430 V 408 A 9 9 0 0 1 416 408 V 430 Z" fill="#4a2f1f" />
        {/* gear sign */}
        <g transform="translate(406 356)">
          <circle r="11" fill="#7c8591" />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <rect key={i} x="-2.5" y="-15" width="5" height="6" fill="#7c8591" transform={`rotate(${i * 45})`} />)}
          <circle r="4" fill="#3a3440" />
        </g>
        {/* waterwheel */}
        <g transform="translate(350 410)">
          <g style={{ transformOrigin: "0px 0px", animation: "cityWheel 7s linear infinite" }}>
            <circle r="24" fill="none" stroke="#6a4a2c" strokeWidth="4" />
            {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x="-2" y="-24" width="4" height="48" fill="#8a5a2e" transform={`rotate(${i * 30})`} />)}
            <circle r="5" fill="#3a2a1a" />
          </g>
        </g>
        <Lantern x={452} y={426} />
      </g>
      {/* the university hall */}
      <g>
        <ellipse cx="822" cy="432" rx="64" ry="4" fill="#000" opacity="0.25" />
        <rect x="770" y="382" width="104" height="48" fill={WALL} />
        <rect x="830" y="382" width="44" height="48" fill={WALL_SHADE} opacity="0.55" />
        <polygon points="762,384 822,352 882,384" fill={ROOF_BLUE} />
        {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={778 + i * 20} y="388" width="7" height="42" fill="#fbf1da" />)}
        {/* clock tower */}
        <rect x="806" y="318" width="32" height="68" fill={WALL} />
        <rect x="826" y="318" width="12" height="68" fill={WALL_SHADE} opacity="0.55" />
        <polygon points="802,320 822,286 842,320" fill={ROOF_MAROON} />
        <circle cx="822" cy="338" r="9" fill="#fff8e6" stroke="#8a6a3a" strokeWidth="2" />
        <line x1="822" y1="338" x2="822" y2="331" stroke="#3a2d3d" strokeWidth="1.5" />
        <line x1="822" y1="338" x2="827" y2="340" stroke="#3a2d3d" strokeWidth="1.5" />
        <path d="M 812 430 V 412 A 10 10 0 0 1 832 412 V 430 Z" fill="#4a2f1f" />
        <Person x={790} y={436} c="#8c1d40" />
        <Person x={858} y={436} c="#2a6f5a" />
        <Person x={868} y={437} c="#b5502f" />
      </g>
      {/* the rumor board in the square */}
      <g>
        <ellipse cx="606" cy="432" rx="52" ry="4" fill="#000" opacity="0.22" />
        <rect x="574" y="388" width="64" height="40" rx="2" fill="#7a5230" />
        <rect x="578" y="392" width="56" height="32" fill="#e8d6b0" />
        <rect x="571" y="426" width="5" height="10" fill="#5b3a22" />
        <rect x="636" y="426" width="5" height="10" fill="#5b3a22" />
        <polygon points="568,390 606,376 644,390 644,388 606,372 568,388" fill="#5b3a22" />
        {[[582, 396, "#fff"], [596, 398, "#ffe7a8"], [610, 395, "#fff"], [622, 399, "#ffd0c0"], [584, 410, "#ffe7a8"], [598, 412, "#fff"], [614, 410, "#ffd0c0"], [624, 413, "#fff"]].map(([x, y, c], i) => (
          <rect key={i} x={x as number} y={y as number} width="10" height="9" fill={c as string} transform={`rotate(${(i % 3) - 1} ${x} ${y})`} />
        ))}
        <Person x={558} y={438} c="#b5502f" />
        <Person x={566} y={440} c="#2a6f5a" />
        <Person x={650} y={438} c="#4a5f94" />
        <Person x={660} y={440} c="#8c1d40" />
        <Lantern x={560} y={420} />
        <Lantern x={654} y={420} />
      </g>
      <House x={488} y={428} w={30} h={24} roof={ROOF_BLUE} />
      <House x={530} y={428} w={26} h={20} roof={ROOF_RED} wall="#ecd6b4" />

      {/* ── LOWER TOWN (terrace 3) ──────────────────────────── */}
      {/* the market */}
      <g>
        <ellipse cx="310" cy="562" rx="64" ry="4" fill="#000" opacity="0.25" />
        {[[258, "#c43a3a", "#fbe9e9"], [300, "#e0a526", "#fff6dc"], [342, "#3a78c4", "#e6f0fb"]].map(([x, c1, c2], i) => (
          <g key={i}>
            <rect x={(x as number) + 3} y="528" width="3" height="32" fill="#5b3a22" />
            <rect x={(x as number) + 35} y="528" width="3" height="32" fill="#5b3a22" />
            <path d={`M ${(x as number) - 2} 528 H ${(x as number) + 43} L ${(x as number) + 38} 512 H ${(x as number) + 3} Z`} fill={c1 as string} />
            {[0, 1, 2, 3].map((k) => <path key={k} d={`M ${(x as number) + 3 + k * 9.2} 512 h 4.6 l 1 16 h -4.6 Z`} fill={c2 as string} opacity="0.9" />)}
            <rect x={(x as number) + 4} y="544" width="34" height="14" fill="#8a5a2e" />
            <circle cx={(x as number) + 12} cy="542" r="4" fill={i === 0 ? "#d94a3a" : i === 1 ? "#f2b632" : "#7fb34a"} />
            <circle cx={(x as number) + 22} cy="542" r="4" fill={i === 0 ? "#e86a4a" : i === 1 ? "#e08a1e" : "#9bcf5f"} />
            <circle cx={(x as number) + 32} cy="542" r="4" fill={i === 0 ? "#d94a3a" : i === 1 ? "#f2b632" : "#7fb34a"} />
          </g>
        ))}
        <Person x={290} y={566} c="#2a6f5a" />
        <Person x={334} y={567} c="#b5502f" />
        <Lantern x={296} y={520} />
      </g>
      {/* the scribes' hall */}
      <g>
        <ellipse cx="925" cy="562" rx="72" ry="4" fill="#000" opacity="0.25" />
        <rect x="866" y="508" width="120" height="52" fill={WALL} />
        <rect x="940" y="508" width="46" height="52" fill={WALL_SHADE} opacity="0.55" />
        <polygon points="858,510 926,474 994,510" fill={ROOF_RED} />
        <polygon points="926,474 994,510 940,510" fill="#000" opacity="0.18" />
        {[0, 1, 2, 3].map((i) => <Win key={i} x={878 + i * 28} y={524} w={10} h={16} />)}
        <path d="M 916 560 V 540 A 10 10 0 0 1 936 540 V 560 Z" fill="#4a2f1f" />
        {/* scroll sign */}
        <g transform="translate(926 498)">
          <rect x="-14" y="-6" width="28" height="12" rx="2" fill="#f3e6c4" stroke="#8a6a3a" strokeWidth="1" />
          <line x1="-10" y1="-2" x2="10" y2="-2" stroke="#6a4a2c" strokeWidth="1" />
          <line x1="-10" y1="2" x2="6" y2="2" stroke="#6a4a2c" strokeWidth="1" />
        </g>
        <Person x={880} y={565} c="#4a5f94" />
        <Person x={972} y={566} c="#8c1d40" />
        <Lantern x={864} y={546} />
      </g>
      <House x={420} y={558} w={30} h={24} roof={ROOF_MAROON} />
      <House x={462} y={558} w={34} h={28} roof={ROOF_BLUE} wall="#ecd6b4" />
      <House x={756} y={558} w={30} h={24} roof={ROOF_RED} />
      <House x={798} y={558} w={28} h={22} roof={ROOF_MAROON} wall="#ecd6b4" />

      {/* ── THE WATERFALL (feeds the lake) ──────────────────── */}
      <g>
        <path d="M 336 436 C 326 520, 344 600, 330 704" stroke="url(#cityFall)" strokeWidth="16" fill="none" strokeLinecap="round" />
        <path d="M 336 436 C 326 520, 344 600, 330 704" stroke="#fff" strokeWidth="3" fill="none" strokeDasharray="6 14" opacity="0.9" style={{ animation: "cityFlow 1.2s linear infinite" }} />
        <ellipse cx="330" cy="712" rx="30" ry="7" fill="#fff" opacity="0.5" />
      </g>

      {/* ── VILLAGE (terrace 4) ─────────────────────────────── */}
      {[[132, 24, ROOF_RED], [168, 28, ROOF_BLUE], [208, 24, ROOF_MAROON], [250, 30, ROOF_RED], [726, 26, ROOF_BLUE], [770, 30, ROOF_RED], [816, 26, ROOF_MAROON], [860, 30, ROOF_BLUE], [910, 26, ROOF_RED], [958, 30, ROOF_MAROON], [1008, 24, ROOF_BLUE], [1042, 22, ROOF_RED]].map(([x, w, r], i) => (
        <House key={i} x={x as number} y={672} w={w as number} h={18 + (i % 3) * 4} roof={r as string} wall={i % 2 ? "#ecd6b4" : WALL} />
      ))}
      {/* a windmill on the east edge */}
      <g transform="translate(1080 650)">
        <polygon points="-12,22 -7,-30 7,-30 12,22" fill={WALL} />
        <polygon points="-9,-30 0,-44 9,-30" fill={ROOF_MAROON} />
        <g style={{ transformOrigin: "0px -30px", animation: "cityWheel 14s linear infinite" }}>
          {[0, 90, 180, 270].map((a) => (
            <g key={a} transform={`translate(0 -30) rotate(${a})`}>
              <rect x="-2" y="-34" width="4" height="34" fill="#6a4a2c" />
              <rect x="2" y="-34" width="11" height="22" fill="#f3e6c4" opacity="0.95" />
            </g>
          ))}
        </g>
      </g>
      <Pine x={122} y={684} s={1.2} shade />
      <Pine x={288} y={682} s={1.1} shade />
      <Pine x={700} y={682} s={1.1} />
      <Pine x={1062} y={690} s={1.2} />

      {/* ── THE GREAT LAKE ──────────────────────────────────── */}
      <ellipse cx="480" cy="750" rx="360" ry="56" fill="url(#cityLake)" />
      <ellipse cx="480" cy="738" rx="300" ry="20" fill="#fff" opacity="0.1" />
      <g stroke="#fff" strokeWidth="1.5" fill="none" opacity="0.35">
        <path d="M 250 750 q 20 -5 40 0 t 40 0" />
        <path d="M 420 768 q 20 -5 40 0 t 40 0" />
        <path d="M 600 744 q 20 -5 40 0 t 40 0" />
        <path d="M 540 776 q 20 -5 40 0 t 40 0" />
      </g>
      {/* reflection of the sun */}
      <ellipse cx="640" cy="752" rx="60" ry="5" fill="#ffd27a" opacity="0.4" />
      {/* a little boat */}
      <g transform="translate(470 744)">
        <path d="M -22 0 H 22 L 16 9 H -16 Z" fill="#6a4a2c" />
        <line x1="0" y1="0" x2="0" y2="-26" stroke="#5b4030" strokeWidth="2" />
        <polygon points="0,-26 18,-6 0,-6" fill="#f6efe0" />
      </g>
      {/* reeds and the shore */}
      <path d="M 120 780 Q 300 800 480 800 T 840 780 L 840 800 H 120 Z" fill="#2d4a3a" opacity="0.8" />
      {[140, 170, 760, 800].map((x, i) => (
        <path key={i} d={`M ${x} 782 q 3 -16 6 -22 M ${x + 6} 782 q 0 -14 -2 -20`} stroke="#5f8a52" strokeWidth="2" fill="none" />
      ))}

      {/* ── FARMLAND on the east shore ──────────────────────── */}
      <g>
        <polygon points="830,700 1190,690 1200,740 840,748" fill="#8fb55a" />
        <polygon points="840,748 1200,740 1200,780 850,790" fill="#d6b94f" />
        <polygon points="850,790 1200,780 1200,800 860,800" fill="#9a7a42" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <line key={i} x1={870 + i * 42} y1="700" x2={880 + i * 44} y2="748" stroke="#6a8f3c" strokeWidth="2" opacity="0.7" />
        ))}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <line key={i} x1={870 + i * 42} y1="750" x2={880 + i * 44} y2="790" stroke="#b79a38" strokeWidth="2" opacity="0.7" />
        ))}
        <Person x={1010} y={745} c="#8c1d40" />
      </g>

      {/* ── birds ───────────────────────────────────────────── */}
      {[[0, 90, 40], [1, 130, 56], [2, 70, 70]].map(([i, y, dur]) => (
        <g key={i as number} style={{ animation: `cityBird ${dur}s linear ${(i as number) * -12}s infinite` }}>
          <path d={`M 0 ${y} q 6 -6 12 0 q 6 -6 12 0`} stroke="#2a1f33" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </g>
      ))}

      <rect width="1200" height="800" fill="url(#cityVignette)" />
    </svg>
  );
}
