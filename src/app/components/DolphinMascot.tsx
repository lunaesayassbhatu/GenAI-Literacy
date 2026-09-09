import { motion } from "motion/react";

interface DolphinMascotProps {
  size?: number;
  animate?: boolean;
  expression?: "default" | "celebrate" | "hint";
}

export function DolphinMascot({ size = 80, animate = true, expression = "default" }: DolphinMascotProps) {
  // Different smile paths based on expression
  const getSmilePath = () => {
    switch (expression) {
      case "celebrate":
        return "M 18 50 Q 22 55 26 50"; // Bigger smile
      case "hint":
        return "M 18 51 L 26 51"; // Neutral line
      default:
        return "M 18 50 Q 22 53 26 50"; // Normal smile
    }
  };

  // Eye changes based on expression
  const getEyeElement = () => {
    if (expression === "celebrate") {
      // Happy closed eye
      return (
        <path
          d="M 26 44 Q 28 42 30 44"
          stroke="#000000"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
      );
    }
    // Normal eye
    return (
      <>
        <circle cx="28" cy="44" r="3" fill="#000000" />
        <circle cx="29" cy="43" r="1" fill="#ffffff" />
      </>
    );
  };

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
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
    >
      {/* Dolphin Body */}
      <ellipse cx="50" cy="55" rx="35" ry="25" fill="#FFC627" />
      
      {/* Dolphin Head */}
      <ellipse cx="30" cy="48" rx="20" ry="18" fill="#FFD454" />
      
      {/* Snout */}
      <ellipse cx="15" cy="48" rx="8" ry="6" fill="#FFE17B" />
      
      {/* Eye - changes based on expression */}
      {getEyeElement()}
      
      {/* Smile - changes based on expression */}
      <path
        d={getSmilePath()}
        stroke="#000000"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Dorsal Fin */}
      <path
        d="M 55 35 Q 58 25 60 35 L 55 35 Z"
        fill="#E5A500"
      />
      
      {/* Tail Fin */}
      <path
        d="M 75 50 Q 85 45 90 48 Q 85 55 75 52 Z"
        fill="#E5A500"
      />
      
      {/* Pectoral Fin */}
      <ellipse cx="42" cy="60" rx="12" ry="6" fill="#E5A500" transform="rotate(-20 42 60)" />
      
      {/* Belly highlight */}
      <ellipse cx="45" cy="62" rx="18" ry="12" fill="#ffffff" opacity="0.3" />
    </motion.svg>
  );
}