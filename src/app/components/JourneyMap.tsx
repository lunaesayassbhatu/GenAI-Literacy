import { useLayoutEffect, useRef, useState } from "react";
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
import islandImg from "../assets/journey/island.png";
import roadImg from "../assets/journey/road.png";
import treeImg from "../assets/journey/tree.png";

// Natural aspect ratios (w/h) of the generated art — used to size each piece
// without ever stretching/distorting it.
const ISLAND_RATIO = 452 / 853;
const ROAD_RATIO = 1124 / 790;

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

interface RoadSegment {
  left: number;
  top: number;
  height: number;
  flip: boolean;
}

// Sizes each level's island so it comfortably fits its module + games, while
// always keeping island.png's own proportions intact (no stretching).
function islandSizeFor(itemCount: number) {
  const width = itemCount === 1 ? 220 : itemCount === 2 ? 290 : 360;
  return { width, height: Math.round(width * ISLAND_RATIO) };
}

export function JourneyMap() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const levels = buildLevels();
  const flat = flattenLevels(levels);

  const trailRef = useRef<HTMLDivElement>(null);
  const islandRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [roadSegments, setRoadSegments] = useState<RoadSegment[]>([]);

  useLayoutEffect(() => {
    function measure() {
      const trail = trailRef.current;
      if (!trail) return;
      const trailRect = trail.getBoundingClientRect();

      const centers = islandRefs.current.map((el) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2 - trailRect.left, y: r.top + r.height / 2 - trailRect.top };
      });

      const next: RoadSegment[] = [];
      for (let i = 0; i < centers.length - 1; i++) {
        const a = centers[i];
        const b = centers[i + 1];
        if (!a || !b) continue;
        // The road art keeps its own natural orientation (never rotated, so
        // it can't twist into a weird hook) and is scaled to the full actual
        // vertical gap between islands (never capped, so it always reaches
        // both — no floating disconnected segments). It only runs one
        // diagonal (bottom-left to top-right), so when the upper island
        // actually sits to the LEFT of the lower one, mirror it horizontally
        // to match — otherwise it visually leans the wrong way.
        next.push({
          left: (a.x + b.x) / 2,
          top: (a.y + b.y) / 2,
          height: Math.abs(b.y - a.y) * 1.05,
          flip: a.x < b.x,
        });
      }
      setRoadSegments(next);
    }

    measure();
    const settleTimer = setTimeout(measure, 500);
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(settleTimer);
      window.removeEventListener("resize", measure);
    };
  }, [levels.length]);

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

        <div
          className="mt-2 px-2 py-1 rounded-lg"
          style={{ backgroundColor: "rgba(13,5,8,0.62)" }}
        >
          <p
            className="text-[10px] font-bold uppercase tracking-wider"
            style={{ color: flags.isLocked ? colors.textSecondary : roleColor }}
          >
            {node.kind === "module" ? "Module" : "Game"}
          </p>
          <p
            className="text-xs font-semibold leading-tight"
            style={{ color: flags.isLocked ? colors.textSecondary : node.kind === "game" ? roleColor : "#FFFFFF" }}
          >
            {node.name}
          </p>
          <p className="text-[10px]" style={{ color: "#D8D0D4" }}>
            +{node.xpReward} XP
          </p>
        </div>
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

        <div className="relative" ref={trailRef}>
          {roadSegments.map((seg, i) => (
            <img
              key={i}
              src={roadImg}
              alt=""
              className="absolute pointer-events-none select-none"
              style={{
                left: seg.left,
                top: seg.top,
                height: seg.height,
                width: seg.height * ROAD_RATIO,
                transform: `translate(-50%, -50%) ${seg.flip ? "scaleX(-1)" : ""}`,
                zIndex: 0,
              }}
            />
          ))}

          <div className="relative flex flex-col gap-16" style={{ zIndex: 1 }}>
            {levels.map((level, idx) => {
              const justify = WAVE_POSITIONS[idx % WAVE_POSITIONS.length];
              // Levels sitting at the left edge need clearance from the fixed,
              // draggable "Ask Wave" button which defaults to the bottom-left.
              const needsClearance = justify === "flex-start";
              const itemCount = 1 + level.games.length;
              const { width: islandWidth, height: islandHeight } = islandSizeFor(itemCount);
              const flipTrees = idx % 2 === 1;

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
                    ref={(el) => {
                      islandRefs.current[idx] = el;
                    }}
                    className="relative flex items-center justify-center"
                    style={{
                      width: islandWidth,
                      height: islandHeight,
                      maxWidth: "88vw",
                      marginLeft: needsClearance ? 100 : 0,
                    }}
                  >
                    <img
                      src={islandImg}
                      alt=""
                      className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
                    />
                    <img
                      src={treeImg}
                      alt=""
                      className="absolute pointer-events-none select-none"
                      style={{
                        width: islandWidth * 0.26,
                        top: "-10%",
                        left: flipTrees ? undefined : "0%",
                        right: flipTrees ? "0%" : undefined,
                        transform: flipTrees ? "scaleX(-1)" : undefined,
                      }}
                    />
                    <img
                      src={treeImg}
                      alt=""
                      className="absolute pointer-events-none select-none"
                      style={{
                        width: islandWidth * 0.16,
                        bottom: "-6%",
                        right: flipTrees ? undefined : "6%",
                        left: flipTrees ? "6%" : undefined,
                        transform: flipTrees ? undefined : "scaleX(-1)",
                      }}
                    />

                    <div
                      className="relative flex flex-row flex-wrap items-center justify-center gap-x-4 gap-y-2 p-2"
                      style={{ zIndex: 1 }}
                    >
                      {renderNode(level.module, 64)}

                      {level.games.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-3">
                          {level.games.map((game) => renderNode(game, 52))}
                        </div>
                      )}
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
