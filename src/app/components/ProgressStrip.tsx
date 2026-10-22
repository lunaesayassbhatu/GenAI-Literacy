import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { Link, useLocation } from "react-router-dom";
import { Zap, ArrowRight } from "lucide-react";
import { useTheme } from "../utils/themeContext";
import { MODULES } from "../utils/modulesData";
import { loadModuleProgress, hasEverCompletedModule } from "../utils/moduleProgress";
import { getUserData } from "../utils/userData";
import { getCurrentLevel, getXPProgress, getXPToNextLevel, LEVELS } from "../utils/xpSystem";

/** Height of the footer — pages that fill the viewport subtract this (see ModuleLearning). */
export const PROGRESS_STRIP_HEIGHT = "2.5rem";

const HIDDEN_ROUTES = ["/", "/home", "/reset-password"];

function moduleFraction(moduleId: string): number {
  const p = loadModuleProgress(moduleId);
  if (p && p.totalSteps > 0) {
    if (p.stepIndex >= p.totalSteps - 1) return 1;
    return (p.stepIndex + 1) / p.totalSteps;
  }
  return hasEverCompletedModule(moduleId) ? 1 : 0;
}

function readProgress() {
  const fractions = MODULES.map((m) => moduleFraction(m.id));
  const done = fractions.filter((f) => f >= 1).length;
  const percent = Math.round((fractions.reduce((a, b) => a + b, 0) / MODULES.length) * 100);
  const nextIndex = fractions.findIndex((f) => f < 1);
  const xp = getUserData()?.xp ?? 0;
  const level = getCurrentLevel(xp);
  return {
    done,
    percent,
    next: nextIndex === -1 ? null : MODULES[nextIndex],
    xp,
    level,
    levelPercent: getXPProgress(xp).percentage,
    xpToNext: getXPToNextLevel(xp),
    isMaxLevel: level.level >= LEVELS[LEVELS.length - 1].level,
  };
}

/** Slim, static "Your Progress" footer — pinned to the bottom of every signed-in page, like the header is pinned to the top. */
export function ProgressStrip() {
  const { colors } = useTheme();
  const location = useLocation();
  const [progress, setProgress] = useState(readProgress);
  const [levelUp, setLevelUp] = useState<{ level: number; title: string } | null>(null);
  const lastLevelRef = useRef(progress.level.level);

  // Progress lives in localStorage and changes without a route change, so re-read periodically.
  useEffect(() => {
    setProgress(readProgress());
    const id = window.setInterval(() => setProgress(readProgress()), 1500);
    return () => window.clearInterval(id);
  }, [location.pathname]);

  // Celebrate crossing into a new level (only while the app is open — never on first load).
  useEffect(() => {
    const current = progress.level.level;
    if (current > lastLevelRef.current) {
      setLevelUp({ level: current, title: progress.level.title });
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.15 } });
      const t = window.setTimeout(() => setLevelUp(null), 4000);
      lastLevelRef.current = current;
      return () => window.clearTimeout(t);
    }
    lastLevelRef.current = current;
  }, [progress.level.level]);

  if (HIDDEN_ROUTES.includes(location.pathname)) return null;

  const { done, percent, next, xp, level, levelPercent, xpToNext, isMaxLevel } = progress;
  const onNextModule = next && location.pathname === `/module/${next.id}`;

  return (
    <>
    <AnimatePresence>
      {levelUp && (
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-16 left-1/2 -translate-x-1/2 z-[60] px-8 py-4 rounded-2xl shadow-2xl text-center font-bold"
          style={{ backgroundColor: colors.accentGold, color: "#0D0508" }}
        >
          <div className="text-2xl">🎉 Level Up!</div>
          <div className="text-sm">You're now Level {levelUp.level} · {levelUp.title}</div>
        </motion.div>
      )}
    </AnimatePresence>
    {/* spacer so the last bit of page content is never hidden behind the fixed footer */}
    <div aria-hidden style={{ height: PROGRESS_STRIP_HEIGHT }} />
    <div
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center gap-3 px-4 border-t text-xs"
      style={{
        height: PROGRESS_STRIP_HEIGHT,
        backgroundColor: colors.background,
        borderColor: colors.cardBorder,
        color: colors.textSecondary,
      }}
      aria-label="Your progress"
    >
      <span className="font-bold whitespace-nowrap" style={{ color: colors.textPrimary }}>
        🌊 Your Progress
      </span>

      <div
        className="flex-1 max-w-md h-2 rounded-full overflow-hidden"
        style={{ backgroundColor: colors.progressBarBg }}
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${percent}%`, background: "linear-gradient(90deg, #8B1A2E 0%, #FFC627 100%)" }}
        />
      </div>

      <span className="font-mono whitespace-nowrap" style={{ color: colors.textPrimary }}>
        {percent}%
      </span>
      <span className="hidden sm:inline whitespace-nowrap">
        {done}/{MODULES.length} modules
      </span>

      <div
        className="ml-auto flex items-center gap-2 whitespace-nowrap"
        title={isMaxLevel ? "Max level reached!" : `${xpToNext} XP to Level ${level.level + 1}`}
      >
        <span
          className="px-2 py-0.5 rounded-full font-extrabold"
          style={{ backgroundColor: colors.accentGold, color: "#0D0508" }}
        >
          Lv {level.level} · {level.title}
        </span>
        <div
          className="hidden sm:block w-20 h-2 rounded-full overflow-hidden"
          style={{ backgroundColor: colors.progressBarBg }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${levelPercent}%`, backgroundColor: colors.accentGold }}
          />
        </div>
        {/* key={xp} re-mounts the number so it pops each time XP is earned */}
        <motion.span
          key={xp}
          initial={{ scale: 1.5 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 14 }}
          className="flex items-center gap-1 font-bold"
          style={{ color: colors.accentGold }}
        >
          <Zap size={14} fill={colors.accentGold} />
          {xp} XP
        </motion.span>
        {!isMaxLevel && (
          <span className="hidden lg:inline">{xpToNext} to Lv {level.level + 1}</span>
        )}
      </div>

      {next ? (
        !onNextModule && (
          <Link
            to={`/module/${next.id}`}
            className="hidden md:flex items-center gap-1 font-bold whitespace-nowrap hover:opacity-80"
            style={{ color: colors.accentGold }}
          >
            Continue: {next.name} <ArrowRight size={14} />
          </Link>
        )
      ) : (
        <span className="hidden md:inline font-bold whitespace-nowrap" style={{ color: colors.accentGold }}>
          🎉 All modules complete!
        </span>
      )}
    </div>
    </>
  );
}
