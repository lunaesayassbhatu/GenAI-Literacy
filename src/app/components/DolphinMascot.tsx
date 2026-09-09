import { motion } from "motion/react";
import dolphinImg from "../assets/dolphin-mascot.png";

interface DolphinMascotProps {
  size?: number;
  animate?: boolean;
  expression?: "default" | "celebrate" | "hint";
}

// expression is accepted for API compatibility with existing call sites but
// has no visual effect: the mascot is now a single static illustration.
export function DolphinMascot({ size = 80, animate = true }: DolphinMascotProps) {
  return (
    <motion.img
      src={dolphinImg}
      alt="Wave the dolphin mascot"
      width={size}
      style={{ height: "auto", display: "block" }}
      animate={animate ? {
        y: -8,
        rotate: 3
      } : undefined}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut"
      }}
    />
  );
}
