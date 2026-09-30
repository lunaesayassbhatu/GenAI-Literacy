import { useEffect, useMemo, useState } from "react";
import { GameHeader } from "./GameHeader";
import { XPToast } from "./XPToast";
import { CharacterMascot } from "../CharacterMascot";
import { FloatingWave } from "../FloatingWave";
import { STATEMENTS, Statement } from "../../data/gameData";
import { addXP, awardBadge, saveHighScore, getHighScore, getUserData } from "../../utils/userData";
import { getEquippedItemIds } from "../../utils/itemsSystem";
import { useNavigate } from "react-router-dom";
import { Ghost, DoorOpen, Heart, RotateCcw, ArrowLeft, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

// ─── SHOWCASE ONLY ───────────────────────────────────────────────────────────
// A top-down walk-around dungeon demo (CodeCombat-style movement) instead of
// the swipe-card mechanic used elsewhere. Walk into a creature to trigger a
// Fact-or-Myth style encounter, reusing the main STATEMENTS bank so it isn't
// tied to any one narrative world. Not wired into the Games hub / Journey Map.

type GamePhase = "idle" | "playing" | "won" | "lost";
type TileType = "wall" | "floor" | "enemy" | "exit";

interface Tile {
  type: TileType;
  encounterIdx?: number;
}

interface Pos {
  row: number;
  col: number;
}

interface ActiveEncounter extends Pos {
  idx: number;
  statement: Statement;
}

const MAZE_ROWS = [
  "###########",
  "#S........#",
  "#.##.#.##.#",
  "#..E...E..#",
  "#.#.....#.#",
  "#....E....#",
  "#.##.E.##.#",
  "#........X#",
  "###########",
];

const TILE_PX = 48;
const TOTAL_HP = 3;
const XP_PER_CORRECT = 15;
const XP_PER_WRONG = -5;
const ENCOUNTER_RESOLVE_MS = 1400;
const ACCENT = "#eab308";

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildGrid(): { grid: Tile[][]; start: Pos } {
  let start: Pos = { row: 1, col: 1 };
  let enemyCount = 0;
  const grid: Tile[][] = MAZE_ROWS.map((rowStr, r) =>
    rowStr.split("").map((ch, c) => {
      if (ch === "#") return { type: "wall" as const };
      if (ch === "X") return { type: "exit" as const };
      if (ch === "E") return { type: "enemy" as const, encounterIdx: enemyCount++ };
      if (ch === "S") start = { row: r, col: c };
      return { type: "floor" as const };
    })
  );
  return { grid, start };
}

const TOTAL_ENCOUNTERS = MAZE_ROWS.join("").split("").filter((ch) => ch === "E").length;

export function DungeonCrawlGame() {
  const navigate = useNavigate();
  const { grid, start } = useMemo(buildGrid, []);

  const [gamePhase, setGamePhase] = useState<GamePhase>("idle");
  const [playerPos, setPlayerPos] = useState<Pos>(start);
  const [encounters, setEncounters] = useState<Statement[]>([]);
  const [defeated, setDefeated] = useState<Set<number>>(new Set());
  const [hp, setHp] = useState(TOTAL_HP);
  const [xp, setXp] = useState(0);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [activeEncounter, setActiveEncounter] = useState<ActiveEncounter | null>(null);
  const [encounterLocked, setEncounterLocked] = useState(false);
  const [encounterFeedback, setEncounterFeedback] = useState<{ correct: boolean; why: string } | null>(null);

  const [waveMessage, setWaveMessage] = useState("Use arrow keys or WASD to explore the dungeon.");
  const [waveExpression, setWaveExpression] = useState<"default" | "celebrate" | "hint">("default");

  function startGame() {
    setEncounters(shuffle(STATEMENTS).slice(0, TOTAL_ENCOUNTERS));
    setPlayerPos(start);
    setDefeated(new Set());
    setHp(TOTAL_HP);
    setXp(0);
    setActiveEncounter(null);
    setEncounterFeedback(null);
    setEncounterLocked(false);
    setIsNewHighScore(false);
    setShowToast(false);
    setWaveMessage("Walk into a creature to hear its claim — is it FACT or MYTH?");
    setWaveExpression("default");
    setGamePhase("playing");
  }

  function finishGame(result: "won" | "lost") {
    const earned = Math.max(0, xp);
    addXP(earned);
    if (result === "won") {
      awardBadge("dungeon-crawler", "Dungeon Crawler", "Reach the exit in the Dungeon Crawl showcase", "🗝️");
    }
    setIsNewHighScore(saveHighScore("dungeon-crawl", earned));
    setGamePhase(result);
    setShowToast(true);
    setWaveMessage(result === "won" ? "You made it to the exit!" : "The dungeon got the better of you this time.");
    setWaveExpression(result === "won" ? "celebrate" : "hint");
  }

  function attemptMove(dRow: number, dCol: number) {
    if (gamePhase !== "playing" || activeEncounter) return;
    const nr = playerPos.row + dRow;
    const nc = playerPos.col + dCol;
    const tile = grid[nr]?.[nc];
    if (!tile || tile.type === "wall") return;

    if (tile.type === "enemy" && !defeated.has(tile.encounterIdx!)) {
      setActiveEncounter({ row: nr, col: nc, idx: tile.encounterIdx!, statement: encounters[tile.encounterIdx!] });
      setWaveMessage("A creature blocks the way — is its claim FACT or MYTH?");
      setWaveExpression("hint");
      return;
    }

    setPlayerPos({ row: nr, col: nc });
    if (tile.type === "exit") finishGame("won");
  }

  function answerEncounter(pickedFact: boolean) {
    if (!activeEncounter || encounterLocked) return;
    setEncounterLocked(true);
    const correct = pickedFact === activeEncounter.statement.isFact;
    setEncounterFeedback({ correct, why: activeEncounter.statement.why });

    if (correct) {
      setDefeated((prev) => new Set(prev).add(activeEncounter.idx));
      setXp((x) => x + XP_PER_CORRECT);
      setWaveMessage("Correct! The creature dissolves.");
      setWaveExpression("celebrate");
    } else {
      setHp((h) => Math.max(0, h - 1));
      setXp((x) => Math.max(0, x + XP_PER_WRONG));
      setWaveMessage("Not quite — it's still blocking the way.");
      setWaveExpression("hint");
    }

    const enc = activeEncounter;
    window.setTimeout(() => {
      setActiveEncounter(null);
      setEncounterFeedback(null);
      setEncounterLocked(false);
      if (correct) setPlayerPos({ row: enc.row, col: enc.col });
    }, ENCOUNTER_RESOLVE_MS);
  }

  useEffect(() => {
    if (gamePhase === "playing" && hp <= 0) finishGame("lost");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hp]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (gamePhase !== "playing") return;
      if (activeEncounter) {
        if (e.key === "f" || e.key === "F" || e.key === "1") answerEncounter(true);
        if (e.key === "m" || e.key === "M" || e.key === "2") answerEncounter(false);
        return;
      }
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") attemptMove(-1, 0);
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") attemptMove(1, 0);
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") attemptMove(0, -1);
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") attemptMove(0, 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gamePhase, activeEncounter, encounterLocked, playerPos, defeated, encounters]);

  const clearedCount = defeated.size;
  const finalXP = Math.max(0, xp);

  if (gamePhase === "idle") {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#1c1917" }}>
        <GameHeader title="Dungeon Crawl" />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-sm text-center">
            <div className="text-7xl mb-6">🏰</div>
            <h2 className="text-3xl font-bold mb-3" style={{ color: "#ffffff" }}>
              Dungeon Crawl
            </h2>
            <p className="mb-2 text-sm font-semibold" style={{ color: ACCENT }}>
              A showcase concept — walk-around mechanic demo
            </p>
            <p className="mb-8 text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              Walk your character through the dungeon with{" "}
              <strong style={{ color: "#ffffff" }}>arrow keys or WASD</strong>. Every creature you meet
              makes a claim about AI — decide <strong style={{ color: "#4ade80" }}>FACT</strong> or{" "}
              <strong style={{ color: "#ff6b6b" }}>MYTH</strong> to clear the way. Reach the golden door to finish.
            </p>
            <button
              onClick={startGame}
              className="w-full py-4 rounded-2xl text-lg font-bold hover:opacity-90 transition-opacity"
              style={{ backgroundColor: ACCENT, color: "#1c1917" }}
            >
              Enter the Dungeon 🗝️
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gamePhase === "won" || gamePhase === "lost") {
    const won = gamePhase === "won";
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#1c1917" }}>
        <GameHeader title="Dungeon Crawl" />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-sm">
            <div
              className="rounded-3xl p-8 text-center shadow-2xl"
              style={{ backgroundColor: "#292524", border: `1px solid ${ACCENT}4d` }}
            >
              <div className="text-6xl mb-4">{won ? "🗝️" : "💀"}</div>
              <h2 className="text-2xl font-bold mb-1" style={{ color: "#ffffff" }}>
                {won ? "You Escaped!" : "Overwhelmed..."}
              </h2>
              <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.45)" }}>
                {won ? "You reached the exit." : "You ran out of health."}
              </p>
              {isNewHighScore ? (
                <div className="mb-4 px-4 py-2 rounded-xl text-sm font-bold" style={{ backgroundColor: "rgba(234,179,8,0.15)", color: ACCENT }}>
                  🏆 New high score!
                </div>
              ) : getHighScore("dungeon-crawl") > 0 && (
                <div className="mb-4 text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Best: {getHighScore("dungeon-crawl")} XP
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="rounded-2xl p-3" style={{ backgroundColor: "rgba(234,179,8,0.12)" }}>
                  <div className="text-2xl font-bold" style={{ color: ACCENT }}>{finalXP}</div>
                  <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>XP earned</div>
                </div>
                <div className="rounded-2xl p-3" style={{ backgroundColor: "rgba(74,222,128,0.1)" }}>
                  <div className="text-2xl font-bold" style={{ color: "#4ade80" }}>{clearedCount}/{TOTAL_ENCOUNTERS}</div>
                  <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>creatures cleared</div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={startGame}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold hover:opacity-90"
                  style={{ backgroundColor: ACCENT, color: "#1c1917" }}
                >
                  <RotateCcw size={18} /> Try Again
                </button>
                <button
                  onClick={() => navigate("/games")}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold hover:opacity-80"
                  style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)" }}
                >
                  <ArrowLeft size={18} /> Back to Games
                </button>
              </div>
            </div>
          </div>
        </div>
        <XPToast amount={finalXP} visible={showToast} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col select-none" style={{ backgroundColor: "#1c1917" }}>
      <GameHeader title="Dungeon Crawl" xp={xp} showXP />

      <main className="flex-1 flex flex-col items-center px-4 pb-6">
        <div className="flex items-center justify-between w-full max-w-md mb-3">
          <div className="flex items-center gap-1">
            {Array.from({ length: TOTAL_HP }).map((_, i) => (
              <Heart
                key={i}
                size={20}
                color={i < hp ? "#ff6b6b" : "rgba(255,255,255,0.15)"}
                fill={i < hp ? "#ff6b6b" : "none"}
              />
            ))}
          </div>
          <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.45)" }}>
            {clearedCount}/{TOTAL_ENCOUNTERS} cleared
          </span>
        </div>

        <div
          className="relative"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${grid[0].length}, ${TILE_PX}px)`,
            gridTemplateRows: `repeat(${grid.length}, ${TILE_PX}px)`,
            gap: 2,
          }}
        >
          {grid.flatMap((row, r) =>
            row.map((tile, c) => {
              const isPlayer = playerPos.row === r && playerPos.col === c;
              const isLiveEnemy = tile.type === "enemy" && !defeated.has(tile.encounterIdx!);
              const isExit = tile.type === "exit";
              const bg =
                tile.type === "wall" ? "#12100e" :
                isExit             ? "rgba(234,179,8,0.15)" :
                "#3f3a34";
              const border =
                tile.type === "wall" ? "1px solid #0c0a09" :
                isExit             ? `1px solid ${ACCENT}` :
                isLiveEnemy         ? "1px solid rgba(255,107,107,0.4)" :
                "1px solid #2b2723";
              return (
                <div
                  key={`${r}-${c}`}
                  className="flex items-center justify-center rounded-sm"
                  style={{ width: TILE_PX, height: TILE_PX, backgroundColor: bg, border }}
                >
                  {isPlayer ? (
                    <CharacterMascot character={getUserData()?.selectedCharacter} size={34} equipped={getEquippedItemIds()} />
                  ) : isLiveEnemy ? (
                    <Ghost size={22} color="#ff6b6b" style={{ animation: "dungeonPulse 1.4s ease-in-out infinite" }} />
                  ) : isExit ? (
                    <DoorOpen size={24} color={ACCENT} />
                  ) : null}
                </div>
              );
            })
          )}
        </div>

        <p className="text-xs mt-4 mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>
          Arrow keys or WASD to move
        </p>

        <div className="grid grid-cols-3 gap-1 mt-1" style={{ width: 148 }}>
          <div />
          <button onClick={() => attemptMove(-1, 0)} className="flex items-center justify-center py-2 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }}>
            <ChevronUp size={20} />
          </button>
          <div />
          <button onClick={() => attemptMove(0, -1)} className="flex items-center justify-center py-2 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }}>
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => attemptMove(1, 0)} className="flex items-center justify-center py-2 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }}>
            <ChevronDown size={20} />
          </button>
          <button onClick={() => attemptMove(0, 1)} className="flex items-center justify-center py-2 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }}>
            <ChevronRight size={20} />
          </button>
        </div>
      </main>

      {activeEncounter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
          <div
            className="w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl"
            style={{ backgroundColor: "#292524", border: `1px solid ${ACCENT}4d` }}
          >
            {!encounterFeedback ? (
              <>
                <Ghost size={40} color="#ff6b6b" className="mx-auto mb-3" />
                <p className="text-base font-semibold leading-snug mb-6" style={{ color: "#ffffff" }}>
                  {activeEncounter.statement.text}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => answerEncounter(false)}
                    className="flex-1 py-3 rounded-xl font-bold text-sm hover:opacity-90"
                    style={{ backgroundColor: "rgba(255,107,107,0.15)", color: "#ff6b6b", border: "1px solid rgba(255,107,107,0.3)" }}
                  >
                    MYTH
                  </button>
                  <button
                    onClick={() => answerEncounter(true)}
                    className="flex-1 py-3 rounded-xl font-bold text-sm hover:opacity-90"
                    style={{ backgroundColor: "rgba(74,222,128,0.12)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.3)" }}
                  >
                    FACT
                  </button>
                </div>
              </>
            ) : (
              <div style={{ animation: "feedbackEnter 0.28s ease both" }}>
                <div className="text-4xl mb-2">{encounterFeedback.correct ? "✅" : "❌"}</div>
                <p className="font-bold text-base mb-1" style={{ color: encounterFeedback.correct ? "#4ade80" : "#ff6b6b" }}>
                  {encounterFeedback.correct ? `Correct! +${XP_PER_CORRECT} XP` : `Not quite! ${XP_PER_WRONG} XP`}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {encounterFeedback.why}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes dungeonPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.88); }
        }
        @keyframes feedbackEnter {
          from { opacity: 0; transform: scale(0.88) translateY(14px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
      `}</style>

      <FloatingWave message={waveMessage} expression={waveExpression} />
    </div>
  );
}
