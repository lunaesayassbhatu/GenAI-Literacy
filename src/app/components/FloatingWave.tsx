import { DolphinMascot } from "./DolphinMascot";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "../utils/themeContext";

interface FloatingWaveProps {
  message: string;
  expression?: "default" | "celebrate" | "hint";
  show?: boolean;
}

export function FloatingWave({ message, expression = "default", show = true }: FloatingWaveProps) {
  const { colors } = useTheme();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 right-6 z-50"
        >
          {/* Speech Bubble */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="mb-2 relative"
          >
            <div
              className="rounded-xl p-4 shadow-lg border max-w-xs"
              style={{
                backgroundColor: colors.cardBackground,
                borderColor: colors.cardBorder
              }}
            >
              <div className="text-xs mb-2 uppercase tracking-wider" style={{ color: colors.accentGoldText }}>
                WAVE • your guide
              </div>
              <p className="text-sm" style={{ color: colors.textPrimary }}>
                {message}
              </p>
            </div>
            {/* Triangle pointer */}
            <div
              className="absolute left-1/2 -bottom-2 transform -translate-x-1/2"
              style={{
                width: 0,
                height: 0,
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
                borderTop: "8px solid rgba(255,198,39,0.13)"
              }}
            />
          </motion.div>

          {/* Dolphin */}
          <div className="flex justify-center">
            <DolphinMascot size={100} expression={expression} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
