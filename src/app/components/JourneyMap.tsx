import { useEffect, useRef, useState } from "react";
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

// Small decorative accents scattered on each floating-island platform,
// cycling for a bit of variety from stop to stop.
const ISLAND_DECOR: Array<[string, string]> = [
  ["🌳", "🌸"],
  ["🌲", "🌼"],
  ["🌳", "🌺"],
];

interface Point {
  x: number;
  y: number;
}

interface Footprint {
  x: number;
  y: number;
  angle: number;
}

// Smooth curve through every module's actual on-screen position, so the
// trail genuinely winds from stop to stop instead of running straight.
function smoothPathD(points: Point[]): string {
  if (points.length < 2) return "";
  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
  }
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
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

  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const basePathRef = useRef<SVGPathElement>(null);
  const [trailD, setTrailD] = useState("");
  const [svgSize, setSvgSize] = useState({ width: 0, height: 0 });
  const [footprints, setFootprints] = useState<Footprint[]>([]);

  useEffect(() => {
    function measure() {
      const container = containerRef.current;
      if (!container) return;
      const containerRect = container.getBoundingClientRect();
      const points: Point[] = nodeRefs.current
        .filter((el): el is HTMLDivElement => Boolean(el))
        .map((el) => {
          const rect = el.getBoundingClientRect();
          return {
            x: rect.left - containerRect.left + rect.width / 2,
            y: rect.top - containerRect.top + rect.height / 2,
          };
        });
      setSvgSize({ width: containerRect.width, height: containerRect.height });
      setTrailD(smoothPathD(points));
    }

    // Delay past the entrance animation (levels stagger in with a y-offset)
    // so the measured positions are the final, settled ones.
    const timer = window.setTimeout(measure, 700);
    const observer = new ResizeObserver(measure);
    if (containerRef.current) observer.observe(containerRef.current);
    window.addEventListener("resize", measure);
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [levels.length]);

  // Walk stepping-length increments along the real rendered curve (not the
  // straight-line points) so footprints actually sit on the path and turn
  // to face the direction of travel.
  useEffect(() => {
    if (!trailD) {
      setFootprints([]);
      return;
    }
    const raf = requestAnimationFrame(() => {
      const pathEl = basePathRef.current;
      if (!pathEl) return;
      const total = pathEl.getTotalLength();
      const spacing = 32;
      const steps = Math.floor(total / spacing);
      const pts: Footprint[] = [];
      for (let i = 1; i < steps; i++) {
        const len = i * spacing;
        const p = pathEl.getPointAtLength(len);
        const p2 = pathEl.getPointAtLength(Math.min(len + 1, total));
        const angle = Math.atan2(p2.y - p.y, p2.x - p.x) * (180 / Math.PI);
        pts.push({ x: p.x, y: p.y, angle });
      }
      setFootprints(pts);
    });
    return () => cancelAnimationFrame(raf);
  }, [trailD]);

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

  function renderNode(node: MapNode, size: number, setRef?: (el: HTMLDivElement | null) => void) {
    const flags = flagsByKey.get(nodeKey(node))!;
    const roleColor = node.kind === "module" ? colors.accentTeal : colors.accentPink;

    return (
      <div
        key={nodeKey(node)}
        ref={setRef}
        className="relative flex flex-col items-center text-center"
        style={{ width: size + 24 }}
      >
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

        <div ref={containerRef} className="relative">
          {/* Rope bridges between floating islands — a smooth curve through
              every module's actual position (so it bends with the zigzag),
              styled as a rope with wooden planks crossing it. */}
          {trailD && (
            <svg
              className="absolute top-0 left-0 pointer-events-none"
              width={svgSize.width}
              height={svgSize.height}
              style={{ zIndex: 0 }}
            >
              <path ref={basePathRef} d={trailD} fill="none" stroke="#8B6F47" strokeWidth={4} strokeLinecap="round" opacity={0.7} />
              {footprints.map((f, i) => (
                <rect
                  key={i}
                  x={-9}
                  y={-2.5}
                  width={18}
                  height={5}
                  rx={1.5}
                  fill="#6B4A2B"
                  opacity={0.85}
                  transform={`translate(${f.x} ${f.y}) rotate(${f.angle + 90})`}
                />
              ))}
            </svg>
          )}

          <div className="relative flex flex-col gap-16" style={{ zIndex: 1 }}>
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
                  <div className="relative" style={{ marginLeft: needsClearance ? 100 : 0, marginTop: 14 }}>
                    {/* Grassy cap peeking over the top edge of the platform */}
                    <div
                      className="absolute -top-2 left-3 right-3 rounded-full"
                      style={{ height: 14, background: "linear-gradient(180deg, #6ee089 0%, #2f9e4f 100%)", zIndex: 1 }}
                    />
                    <span className="absolute -top-4 left-1 text-base" style={{ zIndex: 2 }}>
                      {ISLAND_DECOR[idx % ISLAND_DECOR.length][0]}
                    </span>
                    <span className="absolute -top-4 right-1 text-base" style={{ zIndex: 2 }}>
                      {ISLAND_DECOR[idx % ISLAND_DECOR.length][1]}
                    </span>

                    {/* The floating platform itself — a rock/earth body under the grass cap */}
                    <div
                      className="relative flex flex-col sm:flex-row items-center gap-x-6 gap-y-4 rounded-3xl p-4 shadow-lg"
                      style={{
                        background: "linear-gradient(180deg, #5a4632 0%, #3d2f1f 100%)",
                        border: "2px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      {renderNode(level.module, 64, (el) => {
                        nodeRefs.current[idx] = el;
                      })}

                      {level.games.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-4">
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
