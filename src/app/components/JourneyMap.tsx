import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Lock, CheckCircle2 } from "lucide-react";
import { Header } from "./Header";
import { CharacterMascot } from "./CharacterMascot";
import { useTheme } from "../utils/themeContext";
import { getUserData } from "../utils/userData";
import { getEquippedItemIds } from "../utils/itemsSystem";
import { MODULES } from "../utils/modulesData";
import { hasEverCompletedModule } from "../utils/moduleProgress";
import { GAME_OPTIONS } from "./Games";

interface MapNode {
  kind: "module" | "game";
  id: string;
  name: string;
  icon: string;
  color: string;
  path: string;
  xpReward: number;
  isComplete: () => boolean;
}

// The same 7 modules + 7 games that exist elsewhere in the app, interleaved
// into a single guided path. This doesn't change how Learning Lab / Games
// work — it's just a second, gated view over the same progress data.
function buildPath(): MapNode[] {
  const moduleById = (id: string) => {
    const m = MODULES.find((mod) => mod.id === id)!;
    return {
      kind: "module" as const,
      id: m.id,
      name: m.name,
      icon: m.icon,
      color: m.iconColor,
      path: `/module/${m.id}`,
      xpReward: m.xpReward,
      isComplete: () => hasEverCompletedModule(m.id),
    };
  };

  const gameById = (id: string) => {
    const g = GAME_OPTIONS.find((game) => game.id === id)!;
    return {
      kind: "game" as const,
      id: g.id,
      name: g.name,
      icon: "🎮",
      color: g.color,
      path: g.path,
      xpReward: g.xpReward,
      isComplete: () => getUserData()?.badges.some((b) => b.id === g.badgeId) ?? false,
    };
  };

  return [
    moduleById("module-1"), moduleById("module-2"), gameById("ethics"), gameById("fact-or-myth"),
    moduleById("module-3"), gameById("black-box"),
    moduleById("module-4"), moduleById("module-5"), gameById("bias"),
    moduleById("module-6"), gameById("build-a-prompt"), gameById("sandbox"),
    moduleById("module-7"), gameById("environment"),
  ];
}

export function JourneyMap() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const path = buildPath();

  const completedFlags = path.map((node) => node.isComplete());
  // "You are here" = the first incomplete node, or the last node if everything's done.
  const currentIndex = completedFlags.findIndex((done) => !done);
  const youAreHereIndex = currentIndex === -1 ? path.length - 1 : currentIndex;
  const hasAnyProgress = completedFlags.some(Boolean);
  const youAreHereLabel = hasAnyProgress ? "You are here" : "Start here";

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2" style={{ color: colors.textPrimary }}>
            Your Journey
          </h1>
          <p style={{ color: colors.textSecondary }}>
            Modules and games, in order — complete one to unlock the next
          </p>
        </div>

        <div className="relative">
          {/* Center connecting line */}
          <div
            className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1"
            style={{
              backgroundImage: `repeating-linear-gradient(to bottom, ${colors.cardBorder} 0 10px, transparent 10px 20px)`,
            }}
          />

          <div className="relative flex flex-col gap-10">
            {path.map((node, idx) => {
              const isComplete = completedFlags[idx];
              const isLocked = idx > 0 && !completedFlags[idx - 1] && !isComplete;
              const isYouAreHere = idx === youAreHereIndex;
              const alignRight = idx % 2 === 1;

              return (
                <motion.div
                  key={`${node.kind}-${node.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.05, 0.4) }}
                  className="flex"
                  style={{ justifyContent: alignRight ? "flex-end" : "flex-start" }}
                >
                  <div
                    className="relative flex items-center gap-3"
                    style={{
                      width: "55%",
                      // Keep clear of the fixed "Ask Wave" button (bottom-8 left-8), which
                      // otherwise sits on top of left-column nodes at any scroll position.
                      marginLeft: alignRight ? 0 : 150,
                    }}
                  >
                    {isYouAreHere && (
                      <div
                        className="absolute -top-16"
                        style={{ left: alignRight ? "auto" : 6, right: alignRight ? 6 : "auto" }}
                      >
                        <CharacterMascot
                          character={getUserData()?.selectedCharacter}
                          size={48}
                          equipped={getEquippedItemIds()}
                        />
                        <div
                          className="text-xs font-bold text-center mt-1 px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: colors.accentGold, color: "#0D0508" }}
                        >
                          {youAreHereLabel}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => !isLocked && navigate(node.path)}
                      disabled={isLocked}
                      className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:hover:scale-100 relative"
                      style={{
                        backgroundColor: isLocked ? colors.cardBackground : `${node.color}30`,
                        border: `3px solid ${isLocked ? colors.cardBorder : node.color}`,
                        opacity: isLocked ? 0.5 : 1,
                      }}
                    >
                      {isLocked ? (
                        <Lock size={22} style={{ color: colors.textSecondary }} />
                      ) : (
                        <span className="text-2xl">{node.icon}</span>
                      )}
                      {isComplete && (
                        <div
                          className="absolute -top-1 -right-1 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: colors.accentTeal, width: 22, height: 22 }}
                        >
                          <CheckCircle2 size={16} color="#0D0508" />
                        </div>
                      )}
                    </button>

                    <div className="min-w-0">
                      <p
                        className="text-xs font-bold uppercase tracking-wider"
                        style={{ color: isLocked ? colors.textSecondary : node.color }}
                      >
                        {node.kind === "module" ? "Module" : "Game"}
                      </p>
                      <p className="font-semibold truncate" style={{ color: colors.textPrimary }}>
                        {node.name}
                      </p>
                      <p className="text-xs" style={{ color: colors.textSecondary }}>
                        +{node.xpReward} XP
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
