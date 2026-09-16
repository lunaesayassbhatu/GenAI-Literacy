import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { DolphinMascot } from "./DolphinMascot";
import { useTheme } from "../utils/themeContext";

type MoodType = "default" | "thinking" | "celebrate" | "hint" | "spin";

interface WaveMascotProps {
  message: string;
  mood?: MoodType;
  onAnimationComplete?: () => void;
  actionLabel?: string;
  onActionClick?: () => void;
  compactHintMode?: boolean;
}

export function WaveMascot({
  message,
  mood = "default",
  onAnimationComplete,
  actionLabel,
  onActionClick,
  compactHintMode = false
}: WaveMascotProps) {
  const { colors } = useTheme();
  const [currentMood, setCurrentMood] = useState<MoodType>(mood);
  const [showSparkles, setShowSparkles] = useState(false);
  const [isBubbleOpen, setIsBubbleOpen] = useState(!compactHintMode);

  useEffect(() => {
    setCurrentMood(mood);
    
    if (mood === "celebrate") {
      setShowSparkles(true);
      setTimeout(() => setShowSparkles(false), 1000);
    }
  }, [mood]);

  useEffect(() => {
    setIsBubbleOpen(!compactHintMode);
  }, [compactHintMode]);

  // Animation variants based on mood
  const getMoodAnimation = () => {
    switch (currentMood) {
      case "thinking":
        return {
          rotate: [-5, 5, -5, 0],
          transition: { duration: 0.8, times: [0, 0.3, 0.6, 1] }
        };
      case "celebrate":
        return {
          y: [0, -20, 0, -10, 0],
          scale: [1, 1.1, 1, 1.05, 1],
          rotate: [0, -10, 10, -5, 0],
          transition: { duration: 1, times: [0, 0.2, 0.4, 0.7, 1] }
        };
      case "hint":
        return {
          x: [0, -5, 5, -5, 5, 0],
          transition: { duration: 0.6 }
        };
      case "spin":
        return {
          rotate: [0, 360],
          scale: [1, 1.2, 1],
          transition: { duration: 1, times: [0, 0.5, 1] }
        };
      default:
        return {};
    }
  };

  // Border glow color based on mood
  const getBorderColor = () => {
    switch (currentMood) {
      case "celebrate":
      case "spin":
        return "#FFC627";
      case "hint":
        return "#4AB7C4";
      default:
        return "#FFC627";
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3">
      {/* Speech Bubble */}
      <AnimatePresence mode="wait">
        {isBubbleOpen ? (
          <motion.div
            key={message}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="max-w-xs px-4 py-3 rounded-2xl shadow-lg relative"
            style={{
              backgroundColor: colors.cardBackground,
              border: `2px solid ${getBorderColor()}`,
              boxShadow: currentMood === "celebrate" || currentMood === "hint"
                ? `0 0 20px ${getBorderColor()}40`
                : 'none',
              cursor: compactHintMode ? "pointer" : "default"
            }}
            onClick={() => {
              if (compactHintMode) setIsBubbleOpen(false);
            }}
          >
            <button
              type="button"
              aria-label="Dismiss message"
              onClick={(e) => {
                e.stopPropagation();
                setIsBubbleOpen(false);
              }}
              className="absolute top-2 right-2 p-1 rounded-full transition-opacity hover:opacity-70"
              style={{ color: colors.textSecondary }}
            >
              <X size={14} />
            </button>
            <div className="text-xs font-bold mb-1 tracking-wider pr-4" style={{ color: colors.accentGoldText }}>
              WAVE · YOUR GUIDE
            </div>
            <div className="text-sm leading-relaxed whitespace-pre-line pr-4" style={{ color: colors.textPrimary }}>
              {message}
            </div>
            {!compactHintMode && actionLabel && onActionClick && (
              <button
                type="button"
                onClick={onActionClick}
                className="mt-3 px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:scale-105"
                style={{
                  color: '#FFFFFF',
                  backgroundColor: colors.accentTeal
                }}
              >
                {actionLabel}
              </button>
            )}
            {compactHintMode && actionLabel && onActionClick && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onActionClick();
                }}
                className="mt-3 px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:scale-105"
                style={{
                  color: '#FFFFFF',
                  backgroundColor: colors.accentTeal
                }}
              >
                {actionLabel}
              </button>
            )}
            {compactHintMode && (
              <div className="mt-2 text-[11px] font-semibold" style={{ color: colors.accentGoldText }}>
                Click to close
              </div>
            )}
            {/* Speech bubble pointer */}
            <div
              className="absolute -bottom-2 right-8 w-4 h-4 transform rotate-45"
              style={{
                backgroundColor: colors.cardBackground,
                borderRight: `2px solid ${getBorderColor()}`,
                borderBottom: `2px solid ${getBorderColor()}`
              }}
            />
          </motion.div>
        ) : (
          compactHintMode && actionLabel && onActionClick && (
            <motion.button
              key={`hint-pill-${actionLabel}`}
              type="button"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              onClick={() => {
                onActionClick();
                setIsBubbleOpen(true);
              }}
              className="px-3 py-2 rounded-full text-xs font-semibold shadow-lg transition-all hover:scale-105"
              style={{
                color: '#FFFFFF',
                backgroundColor: colors.accentTeal,
                border: '1px solid rgba(255,255,255,0.25)'
              }}
            >
              {actionLabel}
            </motion.button>
          )
        )}
      </AnimatePresence>

      {/* Wave Dolphin */}
      <div className="relative">
        {/* Sparkles for celebration */}
        <AnimatePresence>
          {showSparkles && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                  animate={{
                    opacity: 0,
                    scale: 1,
                    x: Math.cos((i * Math.PI) / 3) * 30,
                    y: Math.sin((i * Math.PI) / 3) * 30
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute top-1/2 left-1/2 text-2xl pointer-events-none"
                  style={{ transformOrigin: 'center' }}
                >
                  ✨
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>

        <motion.div
          animate={getMoodAnimation()}
          onAnimationComplete={() => {
            if (currentMood !== "default" && onAnimationComplete) {
              onAnimationComplete();
            }
          }}
          onClick={() => {
            if (!isBubbleOpen) setIsBubbleOpen(true);
          }}
          style={{ cursor: isBubbleOpen ? "default" : "pointer" }}
          title={isBubbleOpen ? undefined : "Show Wave's message"}
        >
          <DolphinMascot
            size={80}
            animate={currentMood === "default"}
            expression={
              currentMood === "celebrate" ? "celebrate"
              : currentMood === "hint" ? "hint"
              : "default"
            }
          />
        </motion.div>
      </div>
    </div>
  );
}
