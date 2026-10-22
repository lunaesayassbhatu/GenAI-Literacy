import { useEffect } from "react";
import { motion } from "motion/react";
import { getUserData } from "../utils/userData";

function storageKey(): string {
  return `asu_genai_guide_wave_intro_${getUserData()?.username ?? "guest"}`;
}

export function hasSeenGuideWaveIntro(): boolean {
  try {
    return localStorage.getItem(storageKey()) === "1";
  } catch {
    return true; // storage unavailable: don't nag on every module
  }
}

function markGuideWaveIntroSeen(): void {
  try {
    localStorage.setItem(storageKey(), "1");
  } catch {
    /* ignore */
  }
}

/**
 * First time a learner enters any module: blur and dim the rest of the screen so Guide Wave
 * (the corner mascot, which sits above this overlay) is the only thing in focus.
 * Not a pop-up card — just the blur; click anywhere (or press Enter/Esc) to continue.
 */
export function GuideWaveIntro({ onDismiss }: { onDismiss: () => void }) {
  const dismiss = () => {
    markGuideWaveIntroSeen();
    onDismiss();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <motion.div
      className="fixed inset-0 z-[45] backdrop-blur-md cursor-pointer"
      style={{ backgroundColor: "rgba(13,5,8,0.6)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={dismiss}
      role="presentation"
    >
      <p
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-semibold px-4 py-2 rounded-full"
        style={{ color: "#F0E0E4", backgroundColor: "rgba(0,0,0,0.35)" }}
      >
        Click anywhere to continue
      </p>
    </motion.div>
  );
}
