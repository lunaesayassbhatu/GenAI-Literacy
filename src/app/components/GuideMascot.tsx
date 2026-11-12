import { motion } from "motion/react";
import { CharacterMascot } from "./CharacterMascot";
import { getUserData, type CharacterId } from "../utils/userData";

/** Wave's look until a learner picks one. */
export const DEFAULT_GUIDE: CharacterId = "aisha";

/** The animal the learner chose to be Wave, their guide. (Saved in the same place the old character choice was.) */
export function getGuideId(): CharacterId {
  return getUserData()?.selectedCharacter ?? DEFAULT_GUIDE;
}

interface GuideMascotProps {
  size?: number;
  animate?: boolean;
  expression?: "default" | "celebrate" | "hint";
  /** Show a particular animal instead of the learner's choice (the picker uses this). */
  guide?: CharacterId;
}

/**
 * Wave, the guide, drawn as the animal the learner picked. It takes the dolphin's place everywhere:
 * the floating guide, the module guide, the Ask Wave chat and the welcome screen.
 */
export function GuideMascot({ size = 80, animate = true, expression = "default", guide }: GuideMascotProps) {
  const id = guide ?? getGuideId();
  const reaction =
    expression === "celebrate"
      ? { y: [0, -14, 0, -8, 0], rotate: [0, -6, 6, -3, 0] }
      : expression === "hint"
        ? { rotate: [0, -5, 5, 0], y: [0, -3, 0] }
        : undefined;
  return (
    <motion.div
      style={{ display: "inline-block", transformOrigin: "bottom center" }}
      animate={animate ? reaction : undefined}
      transition={{ duration: 0.9, ease: "easeInOut" }}
    >
      <CharacterMascot character={id} size={size} animate={animate && expression === "default"} />
    </motion.div>
  );
}
