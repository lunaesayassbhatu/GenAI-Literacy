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

interface Level {
  module: MapNode;
  games: MapNode[];
}

// Where each level's node cluster sits across the width of the path, cycling
// through left / center / right so the trail winds rather than running straight.
const WAVE_POSITIONS: Array<"flex-start" | "center" | "flex-end"> = ["flex-start", "center", "flex-end"];

function moduleById(id: string): MapNode {
  const m = MODULES.find((mod) => mod.id === id)!;
  return {
    kind: "module",
    id: m.id,
    name: m.name,
    icon: m.icon,
    color: m.iconColor,
    path: `/module/${m.id}`,
    xpReward: m.xpReward,
    isComplete: () => hasEverCompletedModule(m.id),
  };
}

function gameById(id: string): MapNode {
  const g = GAME_OPTIONS.find((game) => game.id === id)!;
  return {
    kind: "game",
    id: g.id,
    name: g.name,
    icon: "🎮",
    color: g.color,
    path: g.path,
    xpReward: g.xpReward,
    isComplete: () => getUserData()?.badges.some((b) => b.id === g.badgeId) ?? false,
  };
}

// Each level pairs a module with the game(s) that reinforce its specific topic,
// so the two show up together on the trail instead of in an arbitrary order.
function buildLevels(): Level[] {
  return [
    { module: moduleById("module-1"), games: [] },
    { module: moduleById("module-2"), games: [gameById("fact-or-myth")] }, // trust / misconceptions
    { module: moduleById("module-3"), games: [gameById("black-box")] }, // training data / black box
    { module: moduleById("module-4"), games: [gameById("ethics")] }, // responsible use
    { module: moduleById("module-5"), games: [gameById("bias")] }, // bias
    { module: moduleById("module-6"), games: [gameById("build-a-prompt"), gameById("sandbox")] }, // prompting
    { module: moduleById("module-7"), games: [gameById("environment")] }, // environment
  ];
}

function flattenLevels(levels: Level[]): MapNode[] {
  return levels.flatMap((lvl) => [lvl.module, ...lvl.games]);
}

function nodeKey(node: MapNode) {
  return `${node.kind}-${node.id}`;
}

export function JourneyMap() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const levels = buildLevels();
  const flat = flattenLevels(levels);

  const completedFlags = flat.map((node) => node.isComplete());
  // "You are here" = the first incomplete node, or the last node if everything's done.
  const currentIndex = completedFlags.findIndex((done) => !done);
  const youAreHereIndex = currentIndex === -1 ? flat.length - 1 : currentIndex;
  const hasAnyProgress = completedFlags.some(Boolean);
  const youAreHereLabel = hasAnyProgress ? "You are here" : "Start here";

  const flagsByKey = new Map(
    flat.map((node, idx) => [
      nodeKey(node),
      {
        isComplete: completedFlags[idx],
        isLocked: idx > 0 && !completedFlags[idx - 1] && !completedFlags[idx],
        isYouAreHere: idx === youAreHereIndex,
      },
    ])
  );

  function renderNode(node: MapNode, size: number) {
    const flags = flagsByKey.get(nodeKey(node))!;
    const roleColor = node.kind === "module" ? colors.accentTeal : colors.accentPink;

    return (
      <div key={nodeKey(node)} className="relative flex flex-col items-center text-center" style={{ width: size + 24 }}>
        {flags.isYouAreHere && (
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-10">
            <CharacterMascot
              character={getUserData()?.selectedCharacter}
              size={48}
              equipped={getEquippedItemIds()}
            />
            <div
              className="text-xs font-bold text-center mt-1 px-2 py-0.5 rounded-full whitespace-nowrap"
              style={{ backgroundColor: colors.accentGold, color: "#0D0508" }}
            >
              {youAreHereLabel}
            </div>
          </div>
        )}

        <button
          onClick={() => !flags.isLocked && navigate(node.path)}
          disabled={flags.isLocked}
          className="rounded-full flex items-center justify-center flex-shrink-0 shadow-lg transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:hover:scale-100 relative"
          style={{
            width: size,
            height: size,
            backgroundColor: flags.isLocked ? colors.cardBackground : `${node.color}30`,
            border: `3px solid ${flags.isLocked ? colors.cardBorder : node.color}`,
            opacity: flags.isLocked ? 0.5 : 1,
          }}
        >
          {flags.isLocked ? (
            <Lock size={size >= 60 ? 22 : 18} style={{ color: colors.textSecondary }} />
          ) : (
            <span style={{ fontSize: size >= 60 ? 24 : 20 }}>{node.icon}</span>
          )}
          {flags.isComplete && (
            <div
              className="absolute -top-1 -right-1 rounded-full flex items-center justify-center"
              style={{ backgroundColor: colors.accentTeal, width: 20, height: 20 }}
            >
              <CheckCircle2 size={14} color="#0D0508" />
            </div>
          )}
        </button>

        <p
          className="text-[10px] font-bold uppercase tracking-wider mt-2"
          style={{ color: flags.isLocked ? colors.textSecondary : roleColor }}
        >
          {node.kind === "module" ? "Module" : "Game"}
        </p>
        <p
          className="text-xs font-semibold leading-tight"
          style={{ color: flags.isLocked ? colors.textSecondary : node.kind === "game" ? roleColor : colors.textPrimary }}
        >
          {node.name}
        </p>
        <p className="text-[10px]" style={{ color: colors.textSecondary }}>
          +{node.xpReward} XP
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2" style={{ color: colors.textPrimary }}>
            Your Path
          </h1>
          <p style={{ color: colors.textSecondary }}>
            Modules and their matching games, in order — complete one to unlock the next
          </p>
        </div>

        <div className="relative">
          {/* Center connecting line — the trail the level clusters wind along */}
          <div
            className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1"
            style={{
              backgroundImage: `repeating-linear-gradient(to bottom, ${colors.cardBorder} 0 10px, transparent 10px 20px)`,
            }}
          />

          <div className="relative flex flex-col gap-16">
            {levels.map((level, idx) => {
              const justify = WAVE_POSITIONS[idx % WAVE_POSITIONS.length];
              // Levels sitting at the left edge need clearance from the fixed,
              // draggable "Ask Wave" button which defaults to the bottom-left.
              const needsClearance = justify === "flex-start";

              return (
                <motion.div
                  key={level.module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.08, 0.4) }}
                  className="relative flex"
                  style={{ justifyContent: justify }}
                >
                  <div
                    className="flex flex-col sm:flex-row items-center gap-x-6 gap-y-4 rounded-3xl p-4"
                    style={{
                      marginLeft: needsClearance ? 100 : 0,
                      border: level.games.length > 0 ? `1px dashed ${colors.cardBorder}` : "none",
                      backgroundColor: level.games.length > 0 ? colors.cardBackground : "transparent",
                    }}
                  >
                    {renderNode(level.module, 64)}

                    {level.games.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-4">
                        {level.games.map((game) => renderNode(game, 52))}
                      </div>
                    )}
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
