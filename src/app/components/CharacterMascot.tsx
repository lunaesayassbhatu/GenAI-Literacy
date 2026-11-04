import { motion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";
import type { CharacterId } from "../utils/userData";
import { getCharacterInfo } from "../data/charactersData";
import { CHARACTER_RIGS, FISH_RIG, GearLayer, hasBackItem, isHatItem } from "./AvatarGear";
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
  /** Ids of currently-equipped cosmetic items (see data/itemsData.ts), layered on top of the character art. */
  equipped?: string[];
}

// Accessories are drawn by AvatarGear.tsx. On the character art they sit in an
// SVG laid over the picture that uses the picture's own pixel grid and the same
// fit/alignment as the <img>, so they stay lined up at any size.
const OVERLAY_STYLE: CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  overflow: "visible",
  pointerEvents: "none",
};

export function CharacterMascot({ character, size = 80, animate = true, variant = "full", equipped = [] }: CharacterMascotProps) {
  const info = getCharacterInfo(character);
  const frames = character ? CHARACTER_ASSETS[character] : undefined;
  const { accent, tail } = APPEARANCE[info.id];

  const bobTransition = { duration: 2, repeat: 0, ease: "easeInOut" as const };
  // A friendly "waving hi" rock: tilts side to side (pivoting from the feet)
  // with a little lift, once, then holds still — reads as a greeting
  // rather than a constant idle sway.
  const waveRockTransition = { duration: 1.4, repeat: 0, ease: "easeInOut" as const };
  const waveRockMotion = { rotate: [0, -10, 8, -5, 0], y: [0, -3, -7, -3, 0] };
  const waveRockMotionSmall = { rotate: [0, -7, 5, -3, 0], y: [0, -2, -4, -2, 0] };
  const blinkTransition = { duration: 0.25, repeat: 0, ease: "easeInOut" as const };
  const waveTransition = { duration: 0.7, repeat: 0, ease: "easeInOut" as const };
  const tailTransition = { duration: 1.1, repeat: 0, repeatType: "mirror" as const, ease: "easeInOut" as const };

  if (frames) {
    const rig = CHARACTER_RIGS[info.id];
    const hasGear = equipped.length > 0;
    const hasBack = hasBackItem(equipped);
    const gearLayer = (behind: boolean, align: string) => (
      <svg viewBox={`0 0 ${rig.width} ${rig.height}`} preserveAspectRatio={align} style={OVERLAY_STYLE} aria-hidden="true">
        <GearLayer rig={rig} ids={equipped} behind={behind} />
      </svg>
    );

    if (variant === "portrait") {
      // Crop in on the head for tight circular/square spots (nav bar, profile).
      // A hat sticks up above the head, so when one is worn the picture drops a
      // little and shrinks to leave room for it inside the crop.
      const wearsHat = equipped.some(isHatItem);
      return (
        <motion.div
          style={{ width: size, height: size, overflow: "hidden", display: "block", transformOrigin: "bottom center" }}
          animate={animate ? waveRockMotionSmall : undefined}
          transition={waveRockTransition}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              transformOrigin: "top center",
              transform: wearsHat ? "translateY(16%) scale(0.84)" : undefined,
            }}
          >
            {hasBack && gearLayer(true, "xMidYMin slice")}
            <img
              src={frames.default}
              alt={`${info.name} character`}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
            />
            {hasGear && gearLayer(false, "xMidYMin slice")}
          </div>
        </motion.div>
      );
    }
    return (
      // The three art files have different aspect ratios (Aisha is much taller
      // than Dev/Jordan), so fit each into the same box, anchored to the feet,
      // instead of letting width set a different height per character.
      <motion.div
        style={{ position: "relative", width: size, height: Math.round(size * 1.15), display: "block", transformOrigin: "bottom center" }}
        animate={animate ? waveRockMotion : undefined}
        transition={waveRockTransition}
      >
        {hasBack && gearLayer(true, "xMidYMax meet")}
        <img
          src={frames.default}
          alt={`${info.name} character`}
          width={size}
          height={Math.round(size * 1.15)}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", objectPosition: "bottom center", display: "block" }}
        />
        {hasGear && gearLayer(false, "xMidYMax meet")}
      </motion.div>
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
      animate={animate ? { y: [0, -16, 0] } : undefined}
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
        <GearLayer rig={FISH_RIG} ids={equipped} behind />

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
        <GearLayer rig={FISH_RIG} ids={equipped} behind={false} />
      </svg>
    </motion.div>
  );
}
