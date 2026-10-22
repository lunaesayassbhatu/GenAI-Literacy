import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { WaveDolphin3D } from "./WaveDolphin3D";
import { useTheme } from "../utils/themeContext";
import { getUserData } from "../utils/userData";
import { useAuth } from "../utils/authContext";

type IntroKind = "module";

const COPY: Record<IntroKind, { greeting: string; ask: string }> = {
  module: {
    greeting: "Hi, I'm Wave! 🌊",
    ask: "I live in the bottom right corner. Curious about something outside the lesson? Type your question and I'll answer it.",
  },
};

function introKindForPath(pathname: string): IntroKind | null {
  return pathname === "/learning-lab" ? "module" : null;
}

// The intro shows once per sign-in: we remember the sign-in it was shown for. A new sign-in
// (Supabase's last_sign_in_at changes; token refreshes do not change it) shows it again.
function storageKey(kind: IntroKind, userKey: string): string {
  return `asu_genai_wave_intro_${kind}_${userKey}`;
}

function hasSeen(kind: IntroKind, userKey: string, signInMarker: string): boolean {
  try {
    return localStorage.getItem(storageKey(kind, userKey)) === signInMarker;
  } catch {
    return true; // if storage is unavailable, don't nag on every page
  }
}

function markSeen(kind: IntroKind, userKey: string, signInMarker: string): void {
  try {
    localStorage.setItem(storageKey(kind, userKey), signInMarker);
  } catch {
    /* ignore */
  }
}

/**
 * When a learner opens the Learning Lab, Wave introduces himself (and the Ask Wave chat) over a blurred backdrop.
 * Shown once each time the learner signs in. The Guide Wave intro is separate: it appears once, on a learner's first module (see ModuleLearning).
 */
export function WaveIntro() {
  const { colors } = useTheme();
  const { pathname } = useLocation();
  const { session, loading } = useAuth();
  const [kind, setKind] = useState<IntroKind | null>(null);

  const userKey = session?.user?.id ?? getUserData()?.username ?? "guest";
  const signInMarker = session?.user?.last_sign_in_at ?? getUserData()?.loginDate ?? "";

  useEffect(() => {
    if (loading) return;
    const k = introKindForPath(pathname);
    setKind(k && !hasSeen(k, userKey, signInMarker) ? k : null);
  }, [pathname, loading, userKey, signInMarker]);

  const dismiss = () => {
    if (kind) markSeen(kind, userKey, signInMarker);
    setKind(null);
  };

  useEffect(() => {
    if (!kind) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [kind]); // eslint-disable-line react-hooks/exhaustive-deps

  const copy = kind ? COPY[kind] : null;

  return (
    <AnimatePresence>
      {kind && copy && (
        <motion.div
          key={kind}
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 backdrop-blur-md"
          style={{ backgroundColor: "rgba(13,5,8,0.55)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Meet Wave"
        >
          <motion.div
            className="w-full max-w-3xl rounded-3xl border-2 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 shadow-2xl"
            style={{ backgroundColor: colors.cardBackground, borderColor: colors.accentGold }}
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            {/* Framed Wave portrait */}
            <div
              className="flex-shrink-0 flex flex-col items-center justify-center rounded-2xl border-2 p-5"
              style={{
                borderColor: colors.accentGold,
                background: "linear-gradient(160deg, rgba(255,198,39,0.18), rgba(139,26,46,0.18))",
                boxShadow: "0 0 32px rgba(255,198,39,0.25)",
              }}
            >
              {/* Underwater scene with a real 3D Wave swimming laps (three.js) */}
              <div
                className="relative overflow-hidden rounded-xl"
                style={{
                  width: 280,
                  height: 220,
                  background:
                    "radial-gradient(ellipse at 50% 15%, rgba(120,220,255,0.35), rgba(20,90,140,0.30) 45%, rgba(8,30,60,0.55) 100%)",
                }}
              >
                {/* rising bubbles */}
                {[18, 52, 78, 34, 66].map((left, i) => (
                  <motion.span
                    key={i}
                    aria-hidden
                    className="absolute rounded-full"
                    style={{
                      left: `${left}%`,
                      bottom: -10,
                      width: 5 + (i % 3) * 3,
                      height: 5 + (i % 3) * 3,
                      border: "1px solid rgba(255,255,255,0.55)",
                      backgroundColor: "rgba(255,255,255,0.12)",
                    }}
                    animate={{ y: [0, -230], opacity: [0, 0.9, 0] }}
                    transition={{ duration: 4 + i * 0.7, repeat: Infinity, delay: i * 0.8, ease: "easeOut" }}
                  />
                ))}
                <div className="absolute inset-0">
                  <WaveDolphin3D width={280} height={220} />
                </div>
              </div>
              <p className="text-sm font-extrabold tracking-widest mt-1" style={{ color: colors.accentGold }}>
                WAVE
              </p>
              <p className="text-xs" style={{ color: colors.textSecondary }}>your GenAI helper</p>
            </div>

            {/* Side description */}
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                {copy.greeting}
              </h2>
              <div
                className="rounded-xl p-3 border mb-5"
                style={{ borderColor: "rgba(75,183,196,0.55)", backgroundColor: "rgba(75,183,196,0.08)" }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-extrabold text-sm" style={{ color: colors.accentTeal }}>
                    💬 Ask Wave
                  </span>
                </div>
                <p className="text-sm leading-snug" style={{ color: colors.textPrimary }}>{copy.ask}</p>
              </div>
              <button
                onClick={dismiss}
                autoFocus
                className="px-6 py-3 rounded-xl font-bold transition-all hover:scale-105"
                style={{ backgroundColor: colors.accentGold, color: "#0D0508" }}
              >
                Let's go! 🌊
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
