import { motion } from "motion/react";
import type { ReactNode } from "react";
import type { CharacterId } from "../utils/userData";
import { getCharacterInfo } from "../data/charactersData";
import aishaArt from "../assets/characters/aisha.png";
import devArt from "../assets/characters/dev.png";
import jordanArt from "../assets/characters/jordan.png";

interface CharacterFrames {
  default: string;
  blink?: string;
  wave?: string;
}

// Real generated 3D-render art per character — otter (Aisha), octopus (Dev),
// sea turtle (Jordan). Falls back to the procedural SVG fish below for any
// character without art yet.
const CHARACTER_ASSETS: Partial<Record<CharacterId, CharacterFrames>> = {
  aisha: { default: aishaArt },
  dev: { default: devArt },
  jordan: { default: jordanArt },
};

type TailShape = "flowing" | "sleek" | "paddle";

interface Appearance {
  accent: string;
  tail: TailShape;
}

// Each character is a distinct cartoon fish — body color is the character's
// existing brand color, tail shape + fin accent color set them apart further.
const APPEARANCE: Record<CharacterId, Appearance> = {
  aisha: { accent: "#ffd166", tail: "flowing" },
  dev: { accent: "#FFC627", tail: "sleek" },
  jordan: { accent: "#8B1A2E", tail: "paddle" },
};

interface CharacterMascotProps {
  character?: CharacterId;
  size?: number;
  animate?: boolean;
  /** "full" renders the whole fish (body to tail); "portrait" crops to a
   *  head-on view for tight spaces like the nav bar. */
  variant?: "full" | "portrait";
  /** Ids of currently-equipped cosmetic items (see data/itemsData.ts), layered on top of the fish art. */
  equipped?: string[];
}

// Simple SVG gear layered over the base fish art, positioned relative to the
// head (eye at ~30,40) on the left and the back/dorsal area (~x70-110) on the
// right toward the tail. Capes render behind the body (drawn first); hats and
// accessories render in front (drawn last), keyed by item id.
const BACK_SLOT_ITEMS = new Set(["scholars-cape", "masters-cloak"]);

function GearOverlay({ itemId }: { itemId: string }) {
  switch (itemId) {
    case "explorer-cap":
      return <path d="M 14 26 L 30 6 L 46 26 Z" fill="#FFC627" stroke="#0D0508" strokeWidth="1.5" strokeLinejoin="round" />;
    case "champions-crown":
      return (
        <path
          d="M 10 26 L 16 8 L 24 20 L 30 4 L 36 20 L 44 8 L 50 26 Z"
          fill="#FFC627"
          stroke="#8B1A2E"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      );
    case "scholars-cape":
      return <path d="M 95 18 Q 128 38 108 70 Q 88 55 90 28 Z" fill="#8B1A2E" opacity="0.85" />;
    case "masters-cloak":
      return <path d="M 92 12 Q 135 32 112 78 Q 84 60 86 24 Z" fill="#FFC627" opacity="0.9" />;
    case "insight-badge":
      return <circle cx="62" cy="60" r="8" fill="#4AB7C4" stroke="#0D0508" strokeWidth="1.2" />;
    case "game-medal":
      return <circle cx="62" cy="60" r="8" fill="#E8547A" stroke="#0D0508" strokeWidth="1.2" />;
    case "champion-sash":
      return <path d="M 32 28 L 88 66 M 84 28 L 36 66" stroke="#FFC627" strokeWidth="6" strokeLinecap="round" opacity="0.85" />;
    case "cool-shades":
      return (
        <>
          <ellipse cx="28" cy="40" rx="14" ry="11" fill="#1a1a2e" stroke="#0D0508" strokeWidth="2" opacity="0.9" />
          <path d="M 42 38 L 52 34" stroke="#0D0508" strokeWidth="2.5" strokeLinecap="round" />
        </>
      );
    case "scholars-mustache":
      return (
        <path
          d="M 6 50 Q 14 44 20 50 Q 26 44 34 50 Q 26 54 20 50 Q 14 54 6 50 Z"
          fill="#4a3728"
        />
      );
    default:
      return null;
  }
}

export function CharacterMascot({ character, size = 80, animate = true, variant = "full", equipped = [] }: CharacterMascotProps) {
  const info = getCharacterInfo(character);
  const frames = character ? CHARACTER_ASSETS[character] : undefined;
  const { accent, tail } = APPEARANCE[info.id];

  const bobTransition = { duration: 2.6, repeat: Infinity, ease: "easeInOut" as const };
  const blinkTransition = { duration: 0.25, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" as const };
  const waveTransition = { duration: 0.7, repeat: Infinity, repeatDelay: 1.6, ease: "easeInOut" as const };
  const tailTransition = { duration: 1.1, repeat: Infinity, repeatType: "mirror" as const, ease: "easeInOut" as const };

  if (frames) {
    if (variant === "portrait") {
      // Crop in on the head for tight circular/square spots (nav bar, profile).
      return (
        <motion.div
          style={{ width: size, height: size, overflow: "hidden", display: "block" }}
          animate={animate ? { y: [0, -4, 0] } : undefined}
          transition={bobTransition}
        >
          <img
            src={frames.default}
            alt={`${info.name} character`}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
          />
        </motion.div>
      );
    }
    return (
      <motion.img
        src={frames.default}
        alt={`${info.name} character`}
        width={size}
        style={{ height: "auto", display: "block" }}
        animate={animate ? { y: [0, -6, 0] } : undefined}
        transition={bobTransition}
      />
    );
  }

  const bodyId = `fish-body-${info.id}`;
  const viewBox = variant === "portrait" ? "0 15 78 70" : "0 0 165 100";
  const aspect = variant === "portrait" ? 78 / 70 : 165 / 100;
  const height = size / aspect;

  let tailShape: ReactNode;
  if (tail === "flowing") {
    tailShape = (
      <>
        <path d="M 112 50 Q 135 20 158 8 Q 142 35 140 50 Q 142 65 158 92 Q 135 80 112 50 Z" fill={`url(#${bodyId})`} opacity="0.92" />
        <path d="M 112 50 Q 130 30 148 24 Q 136 42 134 50 Q 136 58 148 76 Q 130 70 112 50 Z" fill={accent} opacity="0.55" />
      </>
    );
  } else if (tail === "sleek") {
    tailShape = <path d="M 112 50 L 156 28 L 138 50 L 156 72 Z" fill={`url(#${bodyId})`} />;
  } else {
    tailShape = <path d="M 112 50 Q 150 30 152 50 Q 150 70 112 50 Z" fill={`url(#${bodyId})`} />;
  }

  return (
    <motion.div
      animate={animate ? { y: [0, -6, 0] } : undefined}
      transition={bobTransition}
      style={{ width: size, height, display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <svg viewBox={viewBox} width={size} height={height} role="img" aria-label={`${info.name} character`}>
        <defs>
          <radialGradient id={bodyId} cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
            <stop offset="45%" stopColor={info.color} stopOpacity="1" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
          </radialGradient>
        </defs>

        {/* tail (swims gently, behind the body) */}
        <motion.g
          style={{ transformOrigin: "112px 50px" }}
          animate={animate ? { rotate: [-6, 6] } : undefined}
          transition={tailTransition}
        >
          {tailShape}
        </motion.g>

        {/* back-slot gear (e.g. capes) — drawn behind the body so it peeks out from the back */}
        {equipped.filter((id) => BACK_SLOT_ITEMS.has(id)).map((id) => (
          <GearOverlay key={id} itemId={id} />
        ))}

        {/* dorsal fin */}
        <path d="M 62 22 Q 78 2 92 20 Q 80 24 62 22 Z" fill={accent} opacity="0.85" />

        {/* body */}
        <ellipse cx="65" cy="50" rx="50" ry="32" fill={`url(#${bodyId})`} />

        {/* belly highlight */}
        <ellipse cx="60" cy="62" rx="34" ry="14" fill="#ffffff" opacity="0.18" />

        {/* pectoral fin (waves) */}
        <motion.g
          style={{ transformOrigin: "55px 62px" }}
          animate={animate ? { rotate: [0, -18, 6, -12, 0] } : undefined}
          transition={waveTransition}
        >
          <path d="M 55 62 Q 40 78 30 92 Q 50 86 62 70 Z" fill={accent} />
        </motion.g>

        {/* gill mark */}
        <path d="M 38 38 Q 34 50 38 62" stroke="#000" strokeOpacity="0.2" strokeWidth="2.5" fill="none" />

        {/* eye (blink) */}
        <motion.g
          animate={animate ? { scaleY: [1, 1, 0.1, 1, 1] } : undefined}
          transition={blinkTransition}
          style={{ transformOrigin: "30px 40px" }}
        >
          <circle cx="30" cy="40" r="10" fill="#fff" />
          <circle cx="27" cy="41" r="5.5" fill="#1a1a2e" />
          <circle cx="25" cy="39" r="1.8" fill="#fff" />
        </motion.g>

        {/* mouth */}
        <path d="M 12 52 Q 18 58 26 55" stroke="#000" strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* front-slot gear (hats, accessories) — drawn on top of everything else */}
        {equipped.filter((id) => !BACK_SLOT_ITEMS.has(id)).map((id) => (
          <GearOverlay key={id} itemId={id} />
        ))}
      </svg>
    </motion.div>
  );
}
