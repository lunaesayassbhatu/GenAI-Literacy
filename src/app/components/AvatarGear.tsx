import type { ReactNode } from "react";
import type { CharacterId } from "../utils/userData";

// Every accessory is drawn once, in the same flat-colour + dark-outline style,
// inside a 100 x 100 box. The same drawing is used for the little previews in
// the Avatar Accessories list and for the gear worn by each character.

const INK = "#2A1218";
const SW = 3;
const GLINT = { stroke: "#fff", strokeOpacity: 0.55, strokeWidth: 3, fill: "none", strokeLinecap: "round" } as const;

function star5(cx: number, cy: number, outer: number, inner: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (-90 + i * 36) * (Math.PI / 180);
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(" ");
}

function sparkle(x: number, y: number, r: number, fill: string): ReactNode {
  const k = r * 0.35;
  return (
    <path
      key={`${x}-${y}`}
      d={`M ${x} ${y - r} L ${x + k} ${y - k} L ${x + r} ${y} L ${x + k} ${y + k} L ${x} ${y + r} L ${x - k} ${y + k} L ${x - r} ${y} L ${x - k} ${y - k} Z`}
      fill={fill}
    />
  );
}

function Flower({ cx, cy, r, petal, core }: { cx: number; cy: number; r: number; petal: string; core: string }) {
  return (
    <g>
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i * 72 - 90) * (Math.PI / 180);
        return (
          <circle
            key={i}
            cx={cx + Math.cos(a) * r * 0.62}
            cy={cy + Math.sin(a) * r * 0.62}
            r={r * 0.46}
            fill={petal}
            stroke={INK}
            strokeWidth={2}
          />
        );
      })}
      <circle cx={cx} cy={cy} r={r * 0.34} fill={core} stroke={INK} strokeWidth={2} />
    </g>
  );
}

function Earring() {
  return (
    <>
      <circle cx="50" cy="13" r="7" fill="none" stroke={INK} strokeWidth="7" />
      <circle cx="50" cy="13" r="7" fill="none" stroke="#E8B100" strokeWidth="3.4" />
      <path d="M 44 29 L 56 29 L 54 38 L 46 38 Z" fill="#E8B100" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      <path
        d="M 50 36 C 36 52 30 62 38 76 C 44 88 56 88 62 76 C 70 62 64 52 50 36 Z"
        fill="#2AA4D8"
        stroke={INK}
        strokeWidth={SW}
        strokeLinejoin="round"
      />
      <path d="M 50 46 C 42 58 40 66 45 76 C 48 80 52 80 55 76 C 60 66 58 58 50 46 Z" fill="#7FD3F0" />
      <path d="M 42 62 Q 43 56 47 52" {...GLINT} strokeWidth={2.6} />
    </>
  );
}

const half = "M 50 38 C 44 30 32 32 24 38 C 17 43 10 41 7 33 C 4 45 10 58 22 57 C 32 56 36 48 44 50 C 47 51 49 52 50 52 Z";

const NECKLACE_BEADS = Array.from({ length: 11 }, (_, i) => {
  const t = i / 10;
  const u = 1 - t;
  return { x: u * u * 8 + 2 * u * t * 50 + t * t * 92, y: u * u * 14 + 2 * u * t * 92 + t * t * 14 };
});

const ART: Record<string, () => ReactNode> = {
  // ── Hats ───────────────────────────────────────────────────────────────────
  "explorer-cap": () => (
    <>
      <ellipse cx="50" cy="68" rx="42" ry="12" fill="#9CC2B0" stroke={INK} strokeWidth={SW} />
      <path d="M 17 66 Q 15 28 50 26 Q 85 28 83 66 Q 50 76 17 66 Z" fill="#A9CDBB" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M 17.5 57 Q 50 67 82.5 57 L 83 66 Q 50 76 17 66 Z" fill="#F2B79A" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
      <circle cx="30" cy="46" r="2.6" fill={INK} />
      <path d="M 30 48 Q 22 60 26 72 Q 27 77 24 80" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M 31 38 Q 41 31 54 32" {...GLINT} />
    </>
  ),
  "champions-crown": () => (
    <>
      <path d="M 12 76 L 7 30 L 30 52 L 50 20 L 70 52 L 93 30 L 88 76 Z" fill="#FFC627" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
      <rect x="11" y="66" width="78" height="16" rx="3" fill="#F5A800" stroke={INK} strokeWidth={SW} />
      {[7, 50, 93].map((x, i) => (
        <circle key={x} cx={x} cy={[28, 17, 28][i]} r="5" fill="#FFE27A" stroke={INK} strokeWidth="2.2" />
      ))}
      {[28, 50, 72].map((x) => (
        <circle key={x} cx={x} cy="74" r="4.6" fill="#3E8FD6" stroke={INK} strokeWidth="1.8" />
      ))}
      <path d="M 22 60 L 19 42" {...GLINT} />
    </>
  ),
  beanie: () => (
    <>
      <path d="M 15 64 C 12 26 34 18 50 18 C 66 18 88 26 85 64 Z" fill="#8E6BD0" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
      {[28, 39, 50, 61, 72].map((x) => (
        <path key={x} d={`M ${x} 26 Q ${x + (x - 50) * 0.2} 44 ${x + (x - 50) * 0.25} 62`} stroke="#6F4DB3" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      ))}
      <rect x="9" y="58" width="82" height="26" rx="9" fill="#A585E6" stroke={INK} strokeWidth={SW} />
      {[22, 34, 46, 58, 70, 82].map((x) => (
        <line key={x} x1={x} y1="63" x2={x} y2="79" stroke="#7B58C4" strokeWidth="2.4" strokeLinecap="round" />
      ))}
      <path d="M 30 32 Q 38 25 48 25" {...GLINT} />
    </>
  ),
  "hair-bow": () => (
    <>
      <path d="M 50 50 C 36 22 6 24 8 50 C 10 76 36 76 50 50 Z" fill="#FF2E93" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M 50 50 C 64 22 94 24 92 50 C 90 76 64 76 50 50 Z" fill="#FF2E93" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M 46 56 L 32 90 L 46 82 L 50 92 Z" fill="#E01179" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M 54 56 L 68 90 L 54 82 L 50 92 Z" fill="#E01179" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
      <rect x="40" y="38" width="20" height="24" rx="8" fill="#FF5BAA" stroke={INK} strokeWidth={SW} />
      <path d="M 16 42 Q 22 34 32 36" {...GLINT} />
    </>
  ),
  "flower-crown": () => (
    <>
      <path d="M 8 66 Q 50 40 92 66" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />
      <path d="M 8 66 Q 50 40 92 66" fill="none" stroke="#2F8F5B" strokeWidth="4.4" strokeLinecap="round" />
      <ellipse cx="10" cy="60" rx="13" ry="6" transform="rotate(-40 10 60)" fill="#3FA877" stroke={INK} strokeWidth="2.2" />
      <ellipse cx="90" cy="60" rx="13" ry="6" transform="rotate(40 90 60)" fill="#3FA877" stroke={INK} strokeWidth="2.2" />
      <Flower cx={16.4} cy={61.3} r={11} petal="#F0606A" core="#FFD166" />
      <Flower cx={83.6} cy={61.3} r={11} petal="#F0606A" core="#FFD166" />
      <Flower cx={33.2} cy={54} r={13} petal="#FFA95C" core="#FFD166" />
      <Flower cx={66.8} cy={54} r={13} petal="#FFA95C" core="#FFD166" />
      <Flower cx={50} cy={48} r={17} petal="#E8334A" core="#FFD166" />
    </>
  ),

  // ── Face ───────────────────────────────────────────────────────────────────
  "reading-glasses": () => (
    <>
      <circle cx="27" cy="50" r="19" fill="#CDE8F0" fillOpacity=".4" stroke={INK} strokeWidth="4.4" />
      <circle cx="73" cy="50" r="19" fill="#CDE8F0" fillOpacity=".4" stroke={INK} strokeWidth="4.4" />
      <path d="M 45 46 Q 50 40 55 46" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <path d="M 9 44 L 2 38 M 91 44 L 98 38" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <path d="M 16 42 Q 20 36 28 35" {...GLINT} strokeOpacity={0.85} />
      <path d="M 62 42 Q 66 36 74 35" {...GLINT} strokeOpacity={0.85} />
    </>
  ),
  "cool-shades": () => (
    <>
      {[4, 54].map((x) => (
        <rect key={x} x={x} y="32" width="42" height="32" rx="11" fill="#1B1B2E" stroke={INK} strokeWidth="9" />
      ))}
      <path d="M 46 42 L 54 42" stroke={INK} strokeWidth="9" strokeLinecap="round" />
      {[4, 54].map((x) => (
        <rect key={`r${x}`} x={x} y="32" width="42" height="32" rx="11" fill="#1B1B2E" stroke="#D62839" strokeWidth="5.5" />
      ))}
      <path d="M 46 42 L 54 42" stroke="#D62839" strokeWidth="5.5" strokeLinecap="round" />
      <path d="M 14 40 L 22 57" {...GLINT} strokeOpacity={0.7} />
      <path d="M 64 40 L 72 57" {...GLINT} strokeOpacity={0.7} />
    </>
  ),
  "scholars-mustache": () => (
    <>
      <path d={half} fill="#5A3A27" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
      <path d={half} transform="translate(100 0) scale(-1 1)" fill="#5A3A27" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M 41 42 Q 31 40 23 44" {...GLINT} stroke="#9A7050" strokeOpacity={1} strokeWidth={2.4} />
      <path d="M 59 42 Q 69 40 77 44" {...GLINT} stroke="#9A7050" strokeOpacity={1} strokeWidth={2.4} />
    </>
  ),

  // ── Back ───────────────────────────────────────────────────────────────────
  "scholars-cape": () => (
    <>
      <path d="M 30 12 Q 50 4 70 12 L 94 90 Q 50 78 6 90 Z" fill="#8B1A2E" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M 35 20 Q 50 14 65 20 L 80 80 Q 50 72 20 80 Z" fill="#6B1325" />
      <path d="M 28 12 Q 50 26 72 12 L 70 21 Q 50 34 30 21 Z" fill="#FFC627" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      <circle cx="50" cy="24" r="5" fill="#FFE27A" stroke={INK} strokeWidth="2.2" />
    </>
  ),
  "masters-cloak": () => (
    <>
      <path d="M 50 4 C 30 4 22 20 22 36 L 10 92 Q 50 82 90 92 L 78 36 C 78 20 70 4 50 4 Z" fill="#4B2A86" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M 50 12 C 38 12 32 22 32 34 L 68 34 C 68 22 62 12 50 12 Z" fill="#2E1A5E" />
      <path d="M 10 92 Q 50 82 90 92" fill="none" stroke="#FFC627" strokeWidth="4.4" strokeLinecap="round" />
      {sparkle(30, 62, 5, "#FFC627")}
      {sparkle(68, 54, 4, "#FFC627")}
      {sparkle(50, 74, 4.5, "#FFC627")}
      {sparkle(40, 46, 3, "#FFE27A")}
      {sparkle(74, 76, 3, "#FFE27A")}
    </>
  ),

  // ── Accessories ────────────────────────────────────────────────────────────
  "insight-badge": () => (
    <>
      <path d="M 38 62 L 26 94 L 40 86 L 50 96 L 52 64 Z" fill="#E8547A" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M 62 62 L 74 94 L 60 86 L 50 96 L 48 64 Z" fill="#C93A63" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
      <circle cx="50" cy="40" r="30" fill="#4AB7C4" stroke={INK} strokeWidth={SW} />
      <circle cx="50" cy="40" r="21" fill="#8EDDE6" stroke={INK} strokeWidth="2.4" />
      <polygon points={star5(50, 40, 13, 5.4)} fill="#fff" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
    </>
  ),
  "game-medal": () => (
    <>
      <path d="M 22 4 L 50 50 L 78 4 L 63 4 L 50 26 L 37 4 Z" fill="#E8547A" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
      <circle cx="50" cy="68" r="26" fill="#FFC627" stroke={INK} strokeWidth={SW} />
      <circle cx="50" cy="68" r="17" fill="#FFE27A" stroke="#C58B00" strokeWidth="2.4" />
      <polygon points={star5(50, 68, 11, 4.6)} fill="#F5A800" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
    </>
  ),
  "champion-sash": () => (
    <>
      <line x1="10" y1="12" x2="90" y2="88" stroke={INK} strokeWidth="27" />
      <line x1="10" y1="12" x2="90" y2="88" stroke="#8B1A2E" strokeWidth="21" />
      <line x1="4.5" y1="17.8" x2="84.5" y2="93.8" stroke="#FFC627" strokeWidth="2.6" />
      <line x1="15.5" y1="6.2" x2="95.5" y2="82.2" stroke="#FFC627" strokeWidth="2.6" />
      <polygon points={star5(50, 50, 9, 3.8)} fill="#FFC627" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
    </>
  ),
  "gem-necklace": () => (
    <>
      <path d="M 8 14 Q 50 92 92 14" fill="none" stroke={INK} strokeWidth="3" />
      {NECKLACE_BEADS.map((b, i) => (
        <circle key={i} cx={b.x} cy={b.y} r="5.4" fill="#FFC627" stroke={INK} strokeWidth="2" />
      ))}
      <path d="M 50 58 C 41 68 38 78 44 86 C 48 92 52 92 56 86 C 62 78 59 68 50 58 Z" fill="#4AB7C4" stroke={INK} strokeWidth="2.8" strokeLinejoin="round" />
      <path d="M 45 76 Q 46 70 49 67" {...GLINT} strokeWidth={2.4} />
    </>
  ),
  "gem-earrings": Earring,
  "flower-bouquet": () => (
    <>
      <ellipse cx="29" cy="48" rx="13" ry="6" transform="rotate(-30 29 48)" fill="#3FA877" stroke={INK} strokeWidth="2.2" />
      <ellipse cx="71" cy="48" rx="13" ry="6" transform="rotate(30 71 48)" fill="#3FA877" stroke={INK} strokeWidth="2.2" />
      <Flower cx={33} cy={37} r={14} petal="#F0606A" core="#FFD166" />
      <Flower cx={67} cy={37} r={14} petal="#FF8FB3" core="#FFD166" />
      <Flower cx={50} cy={25} r={16} petal="#FFFFFF" core="#FFC627" />
      <path d="M 50 98 L 22 52 L 78 52 Z" fill="#FBE9EF" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M 50 98 L 40 52 L 60 52 Z" fill="#F4B6C8" />
      <path d="M 50 98 L 22 52 L 78 52 Z" fill="none" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M 50 58 L 36 51 L 36 65 Z" fill="#E8547A" stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M 50 58 L 64 51 L 64 65 Z" fill="#E8547A" stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
      <circle cx="50" cy="58" r="4.4" fill="#C93A63" stroke={INK} strokeWidth="2" />
    </>
  ),
  "wizard-staff": () => (
    <>
      <circle cx="50" cy="20" r="19" fill="#7FE0EA" fillOpacity=".28" />
      <path d="M 50 97 L 50 34" stroke={INK} strokeWidth="11" strokeLinecap="round" />
      <path d="M 50 97 L 50 34" stroke="#9A6A3C" strokeWidth="6" strokeLinecap="round" />
      <path d="M 50 42 C 33 40 29 20 41 12" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <path d="M 50 42 C 33 40 29 20 41 12" fill="none" stroke="#9A6A3C" strokeWidth="4.6" strokeLinecap="round" />
      <path d="M 50 42 C 67 40 71 20 59 12" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <path d="M 50 42 C 67 40 71 20 59 12" fill="none" stroke="#9A6A3C" strokeWidth="4.6" strokeLinecap="round" />
      <circle cx="50" cy="22" r="12" fill="#5FD4E2" stroke={INK} strokeWidth={SW} />
      <circle cx="45.5" cy="17.5" r="4" fill="#fff" fillOpacity=".85" />
    </>
  ),
};

/** The drawing for an accessory, in a 100 x 100 box (render inside an <svg>). */
export function GearArt({ id }: { id: string }) {
  const draw = ART[id];
  return draw ? <g>{draw()}</g> : null;
}

/** A small stand-alone preview of an accessory (used in the Avatar Accessories list). */
export function GearIcon({ id, size = 44, locked = false }: { id: string; size?: number; locked?: boolean }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-hidden="true"
      style={{ filter: locked ? "grayscale(1)" : undefined, opacity: locked ? 0.5 : 1, overflow: "visible" }}
    >
      {id === "gem-earrings" ? (
        <>
          <g transform="translate(-4 14) scale(0.62)">
            <Earring />
          </g>
          <g transform="translate(42 14) scale(0.62)">
            <Earring />
          </g>
        </>
      ) : (
        <GearArt id={id} />
      )}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Where each accessory sits on each character
// ─────────────────────────────────────────────────────────────────────────────

type GearPart =
  | "hat" | "eyes" | "mustache" | "back" | "badge" | "medal" | "sash"
  | "neck" | "ears" | "bouquet" | "staff";

const PART_OF_ITEM: Record<string, GearPart> = {
  "explorer-cap": "hat",
  "champions-crown": "hat",
  beanie: "hat",
  "hair-bow": "hat",
  "flower-crown": "hat",
  "reading-glasses": "eyes",
  "cool-shades": "eyes",
  "scholars-mustache": "mustache",
  "scholars-cape": "back",
  "masters-cloak": "back",
  "insight-badge": "badge",
  "game-medal": "medal",
  "champion-sash": "sash",
  "gem-necklace": "neck",
  "gem-earrings": "ears",
  "flower-bouquet": "bouquet",
  "wizard-staff": "staff",
};

export function isHatItem(id: string): boolean {
  return PART_OF_ITEM[id] === "hat";
}

export function isEyewearItem(id: string): boolean {
  return PART_OF_ITEM[id] === "eyes";
}

export function hasBackItem(ids: string[]): boolean {
  return ids.some((id) => PART_OF_ITEM[id] === "back");
}

/** `x`/`y` is where the middle of the 100 x 100 drawing lands (in the character's own pixels); `w` is its width. */
interface Anchor {
  x: number;
  y: number;
  w: number;
  rot?: number;
  /** Squashes the drawing vertically (1 = as drawn) so a hat can be as wide as a wide, flat head without towering over it. */
  sy?: number;
}

export interface GearRig {
  width: number;
  height: number;
  anchors: Partial<Record<Exclude<GearPart, "ears">, Anchor>> & { earL?: Anchor; earR?: Anchor };
  /** Per-item tweaks on top of the part's anchor (e.g. a flower crown wraps the head, a bow sits to the side). */
  items?: Record<string, Partial<Anchor>>;
}

export const CHARACTER_RIGS: Record<CharacterId, GearRig> = {
  // Aisha the otter — 465 x 796
  aisha: {
    width: 465,
    height: 796,
    anchors: {
      hat: { x: 250, y: 12, w: 255, rot: 4 },
      eyes: { x: 245, y: 150, w: 300, rot: 9 },
      mustache: { x: 240, y: 218, w: 170, rot: 2 },
      back: { x: 232, y: 538, w: 620 },
      badge: { x: 150, y: 395, w: 110 },
      medal: { x: 240, y: 440, w: 150 },
      sash: { x: 240, y: 480, w: 340 },
      neck: { x: 240, y: 375, w: 210 },
      earL: { x: 62, y: 172, w: 100 },
      earR: { x: 438, y: 206, w: 100 },
      bouquet: { x: 115, y: 575, w: 250, rot: -8 },
      staff: { x: 405, y: 520, w: 480, rot: 6 },
    },
    items: {
      // Hats are as wide as the head where they sit (about 300 px) and squashed a little so they hug it.
      "explorer-cap": { x: 234, y: 8, w: 437, sy: 0.72, rot: 3 },
      beanie: { x: 234, y: -5, w: 374, sy: 0.62, rot: 3 },
      "champions-crown": { x: 234, y: -2, w: 342, sy: 0.64, rot: 3 },
      "flower-crown": { y: 62, w: 330, rot: 3 },
      "hair-bow": { x: 345, y: 44, w: 165, rot: 16 },
    },
  },
  // Dev the octopus — 672 x 730
  dev: {
    width: 672,
    height: 730,
    anchors: {
      hat: { x: 330, y: 35, w: 270 },
      eyes: { x: 330, y: 250, w: 330, rot: -4 },
      mustache: { x: 340, y: 318, w: 170 },
      back: { x: 336, y: 455, w: 660 },
      badge: { x: 250, y: 520, w: 120 },
      medal: { x: 340, y: 500, w: 150 },
      sash: { x: 340, y: 540, w: 330 },
      neck: { x: 335, y: 470, w: 250 },
      earL: { x: 122, y: 330, w: 100 },
      earR: { x: 548, y: 318, w: 100 },
      bouquet: { x: 75, y: 300, w: 240, rot: -14 },
      staff: { x: 612, y: 470, w: 470, rot: 4 },
    },
    items: {
      "explorer-cap": { x: 326, y: 27, w: 518, sy: 0.74 },
      beanie: { x: 326, y: 12, w: 436, sy: 0.62 },
      "champions-crown": { x: 326, y: 19, w: 399, sy: 0.64 },
      "flower-crown": { y: 70, w: 340 },
      "hair-bow": { x: 430, y: 60, w: 190, rot: 14 },
    },
  },
  // Jordan the sea turtle — 610 x 755
  jordan: {
    width: 610,
    height: 755,
    anchors: {
      hat: { x: 305, y: 30, w: 240, rot: 5 },
      eyes: { x: 302, y: 132, w: 270, rot: 7 },
      mustache: { x: 290, y: 192, w: 140, rot: 5 },
      back: { x: 300, y: 470, w: 640 },
      badge: { x: 200, y: 450, w: 110 },
      medal: { x: 300, y: 470, w: 140 },
      sash: { x: 300, y: 500, w: 320 },
      neck: { x: 300, y: 335, w: 210 },
      earL: { x: 168, y: 198, w: 90 },
      earR: { x: 446, y: 216, w: 90 },
      bouquet: { x: 75, y: 285, w: 230, rot: -10 },
      staff: { x: 552, y: 520, w: 470, rot: 4 },
    },
    items: {
      "explorer-cap": { x: 306, y: 14, w: 349, sy: 0.78, rot: 4 },
      beanie: { x: 306, y: 4, w: 295, sy: 0.68, rot: 4 },
      "champions-crown": { x: 306, y: 10, w: 270, sy: 0.64, rot: 4 },
      "flower-crown": { x: 305, y: 70, w: 300, rot: 5 },
      "hair-bow": { x: 405, y: 50, w: 175, rot: 16 },
    },
  },
};

/**
 * The illustrated student (see HeroStudent.tsx). Positions are in that drawing's own 340 x 270 space:
 * head centred at 170,82, eyes at 157 and 183 (y 86), ears at 136 and 204, shoulders from y 126.
 */
export const STUDENT_RIG: GearRig = {
  width: 340,
  height: 270,
  anchors: {
    hat: { x: 170, y: 44, w: 84 },
    eyes: { x: 170, y: 86, w: 57 },
    mustache: { x: 170, y: 101, w: 36 },
    back: { x: 170, y: 232, w: 300 },
    badge: { x: 140, y: 162, w: 44 },
    medal: { x: 170, y: 156, w: 60 },
    sash: { x: 170, y: 182, w: 135 },
    neck: { x: 170, y: 143, w: 70 },
    earL: { x: 136, y: 108, w: 32 },
    earR: { x: 204, y: 108, w: 32 },
    bouquet: { x: 118, y: 190, w: 74, rot: -10 },
    staff: { x: 246, y: 150, w: 150 },
  },
  items: {
    // Wide enough to cover the hair (about 80 px across), not just the face.
    "explorer-cap": { y: 48, w: 121, sy: 0.8 },
    beanie: { y: 40, w: 104, sy: 0.8 },
    "flower-crown": { y: 64, w: 104 },
    "hair-bow": { x: 198, y: 48, w: 50, rot: 16 },
    "champions-crown": { y: 42, w: 94, sy: 0.85 },
  },
};

/** Fallback cartoon fish (used only when no character has been picked): 165 x 100, eye at about 30,40. */
export const FISH_RIG: GearRig = {
  width: 165,
  height: 100,
  anchors: {
    hat: { x: 30, y: 8, w: 42 },
    eyes: { x: 28, y: 40, w: 34 },
    mustache: { x: 22, y: 54, w: 22 },
    back: { x: 100, y: 50, w: 90 },
    badge: { x: 62, y: 62, w: 16 },
    medal: { x: 62, y: 64, w: 22 },
    sash: { x: 62, y: 50, w: 56 },
  },
};

function place(a: Anchor): string {
  const s = a.w / 100;
  return `translate(${a.x} ${a.y}) rotate(${a.rot ?? 0}) scale(${s} ${s * (a.sy ?? 1)}) translate(-50 -50)`;
}

/**
 * The worn accessories for one character, as SVG groups. Render it twice inside
 * an <svg> sized to the rig: once with `behind` (capes, drawn under the body)
 * and once without (everything else, drawn over it).
 */
export function GearLayer({ rig, ids, behind }: { rig: GearRig; ids: string[]; behind: boolean }) {
  return (
    <>
      {ids
        .filter((id) => (PART_OF_ITEM[id] === "back") === behind)
        .map((id) => {
          const part = PART_OF_ITEM[id];
          if (!part) return null;
          const tweak = rig.items?.[id];
          if (part === "ears") {
            return (
              <g key={id}>
                {rig.anchors.earL && (
                  <g transform={place({ ...rig.anchors.earL, ...tweak })}>
                    <GearArt id={id} />
                  </g>
                )}
                {rig.anchors.earR && (
                  <g transform={place({ ...rig.anchors.earR, ...tweak })}>
                    <GearArt id={id} />
                  </g>
                )}
              </g>
            );
          }
          const base = rig.anchors[part];
          if (!base) return null;
          return (
            <g key={id} transform={place({ ...base, ...tweak })}>
              <GearArt id={id} />
            </g>
          );
        })}
    </>
  );
}
