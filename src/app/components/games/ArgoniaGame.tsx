import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Lock, Check, RotateCcw, Zap, ScrollText, Map as MapIcon } from "lucide-react";
import { GameHeader } from "./GameHeader";
import { ArgoniaFigure3D, type FigureKind } from "./ArgoniaFigure3D";
import { ArgoniaPortrait } from "./ArgoniaPortrait";
import worldPicture from "../../assets/argonia-world.jpg";
import { CharacterMascot } from "../CharacterMascot";
import { FloatingWave } from "../FloatingWave";
import { addXP, saveHighScore, getUserData } from "../../utils/userData";
import { getEquippedItemIds } from "../../utils/itemsSystem";
import {
  ARGONIA_LEVELS,
  WORLD,
  type ArgoniaLevel,
  loadArgoniaProgress,
  saveArgoniaLevelDone,
  isLevelUnlocked,
} from "../../data/argoniaData";

// Argonia: The Vanishing King — a story quest built from the team's world document.
// Three screens: the MAP (level select + clue board) → a LEVEL (story beats) → the RESULT (XP, clue, takeaway).
// All story text lives in data/argoniaData.ts, so this file never needs to change when the story does.

const ACCENT = "#8b5cf6";
const GOLD = "#FFC627";
const XP_GOOD_CHOICE = 20;
const XP_FLAG_RIGHT = 10;
const XP_FLAG_WRONG = -5;

// Where each level sits on the map (top = the palace, bottom = the great lake). Coordinates are on a 360 x 640 canvas.
const NODES: Array<{ x: number; y: number }> = [
  { x: 235, y: 118 },
  { x: 118, y: 196 },
  { x: 240, y: 274 },
  { x: 112, y: 352 },
  { x: 245, y: 430 },
  { x: 120, y: 506 },
  { x: 200, y: 576 },
];

/** A beat's heading, with its 3D figure beside it when it has one (stacked on a phone, side by side from `sm` up). */
function BeatHead({ figure, portrait, name, talking = false, children }: { figure?: FigureKind; portrait?: string; name?: string; talking?: boolean; children: React.ReactNode }) {
  if (!figure && !portrait) return <>{children}</>;
  const big = figure !== "codex";
  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-1">
      {portrait ? (
        <ArgoniaPortrait src={portrait} alt={name ?? "Portrait"} />
      ) : (
        <div className="flex-shrink-0 rounded-2xl" style={{ background: "radial-gradient(circle at 50% 70%, rgba(139,92,246,0.28), rgba(139,92,246,0) 70%)" }}>
          <ArgoniaFigure3D kind={figure!} width={big ? 150 : 170} height={big ? 190 : 150} talking={talking} />
        </div>
      )}
      <div className="flex-1 min-w-0 w-full">{children}</div>
    </div>
  );
}

// ─── MAP ─────────────────────────────────────────────────────────────────────

export function ArgoniaMap({
  done,
  selected,
  onSelect,
  onStart,
}: {
  done: string[];
  selected: number;
  onSelect: (i: number) => void;
  onStart: (i: number) => void;
}) {
  const level = ARGONIA_LEVELS[selected];
  const unlocked = isLevelUnlocked(selected, done);
  const finished = done.includes(level.id);
  const current = ARGONIA_LEVELS.findIndex((l, i) => isLevelUnlocked(i, done) && !done.includes(l.id));
  const playable = ARGONIA_LEVELS.filter((l) => l.playable);

  // a smooth winding trail through the level nodes
  const trail = useMemo(() => {
    let d = `M ${NODES[0].x} ${NODES[0].y}`;
    for (let i = 1; i < NODES.length; i++) {
      const p = NODES[i - 1];
      const c = NODES[i];
      const midY = (p.y + c.y) / 2;
      d += ` C ${p.x} ${midY}, ${c.x} ${midY}, ${c.x} ${c.y}`;
    }
    return d;
  }, []);

  return (
    <div className="grid md:grid-cols-[minmax(0,440px)_minmax(0,1fr)] gap-6 items-start justify-center">
      {/* ── left: the mountain and the selected trial ───────────────────────── */}
      <div>
        <div className="relative rounded-3xl overflow-hidden shadow-2xl" style={{ border: `1px solid ${ACCENT}55` }}>
          <svg viewBox="0 0 360 640" className="w-full block" role="img" aria-label="Map of Argonia, from the palace at the top to the great lake at the bottom">
            <defs>
              <linearGradient id="argSky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1b1245" />
                <stop offset="55%" stopColor="#3a2169" />
                <stop offset="100%" stopColor="#5a2d6f" />
              </linearGradient>
              <linearGradient id="argMountain" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6b5a8a" />
                <stop offset="100%" stopColor="#2c1f45" />
              </linearGradient>
              <linearGradient id="argLake" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82c4" />
                <stop offset="100%" stopColor="#1d4f86" />
              </linearGradient>
            </defs>
            <rect width="360" height="640" fill="url(#argSky)" />
            {[[30, 30], [90, 58], [180, 22], [300, 48], [332, 112], [52, 118], [150, 76]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="1.4" fill="#fff" opacity="0.7" />
            ))}
            {/* the mountain */}
            <path d="M-10 640 L-10 330 L70 232 L120 262 L205 74 L300 222 L350 192 L370 262 L370 640 Z" fill="url(#argMountain)" />
            <path d="M205 74 L240 120 L205 114 L180 126 Z" fill="#fff" opacity="0.28" />
            {/* the palace in the clouds */}
            <g transform="translate(205 66)">
              <rect x="-22" y="-6" width="44" height="22" rx="2" fill="#e9dcc2" />
              <rect x="-10" y="-22" width="20" height="18" rx="2" fill="#f4ead4" />
              <path d="M-14 -22 L0 -40 L14 -22 Z" fill="#8C1D40" />
              <rect x="-4" y="2" width="8" height="14" rx="1" fill="#6b1d3a" />
              <circle cx="-16" cy="-1" r="2" fill="#ffd36e" />
              <circle cx="16" cy="-1" r="2" fill="#ffd36e" />
            </g>
            {[[150, 94, 34], [262, 98, 30], [200, 126, 40]].map(([x, y, r], i) => (
              <ellipse key={i} cx={x} cy={y} rx={r} ry={r / 3.2} fill="#fff" opacity="0.22" />
            ))}
            {/* the great lake that powers the codex */}
            <ellipse cx="190" cy="622" rx="170" ry="34" fill="url(#argLake)" />
            <ellipse cx="190" cy="614" rx="120" ry="12" fill="#fff" opacity="0.1" />
            {/* the trail */}
            <path d={trail} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="10" strokeLinecap="round" />
            <path d={trail} fill="none" stroke={GOLD} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="2 9" opacity="0.85" />
          </svg>

          {/* the level markers: real buttons, so they work with keyboard and touch */}
          {ARGONIA_LEVELS.map((lv, i) => {
            const isDone = done.includes(lv.id);
            const open = isLevelUnlocked(i, done);
            const isCurrent = i === current;
            const isSelected = i === selected;
            const soon = !lv.playable;
            const bg = isDone ? GOLD : isCurrent ? ACCENT : soon ? "rgba(255,255,255,0.12)" : open ? ACCENT : "rgba(80,70,100,0.9)";
            const side = NODES[i].x > 180 ? "right" : "left";
            return (
              <button
                key={lv.id}
                type="button"
                onClick={() => onSelect(i)}
                aria-label={`Trial ${lv.moduleNumber}: ${lv.title}${isDone ? " (finished)" : soon ? " (coming soon)" : !open ? " (locked)" : ""}`}
                aria-current={isSelected ? "true" : undefined}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full font-extrabold transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                style={{
                  left: `${(NODES[i].x / 360) * 100}%`,
                  top: `${(NODES[i].y / 640) * 100}%`,
                  width: 44,
                  height: 44,
                  background: bg,
                  color: isDone ? "#1b1245" : "#ffffff",
                  border: soon ? "2px dashed rgba(255,255,255,0.4)" : `2px solid ${isSelected ? "#ffffff" : "rgba(255,255,255,0.35)"}`,
                  boxShadow: isCurrent ? `0 0 0 6px ${ACCENT}55, 0 0 18px ${ACCENT}` : isSelected ? "0 0 0 3px rgba(255,255,255,0.5)" : "0 3px 8px rgba(0,0,0,0.45)",
                  animation: isCurrent ? "argPulse 2s ease-in-out infinite" : undefined,
                  opacity: soon ? 0.7 : 1,
                }}
              >
                {isDone ? <Check size={22} strokeWidth={3} /> : !open && !soon ? <Lock size={17} /> : lv.moduleNumber}
                <span
                  className="absolute text-[10px] font-bold whitespace-nowrap px-1.5 py-0.5 rounded"
                  style={{
                    [side === "right" ? "right" : "left"]: 52,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "rgba(13,5,25,0.7)",
                    color: "#F0E0E4",
                    pointerEvents: "none",
                  }}
                >
                  {lv.place}
                </span>
              </button>
            );
          })}
        </div>

        {/* the selected trial */}
        <div
          className="mt-4 rounded-2xl p-5"
          style={{ backgroundColor: "rgba(255,255,255,0.05)", border: `1px solid ${ACCENT}55` }}
        >
          <div className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: ACCENT }}>
            Trial {level.moduleNumber} · {level.place}
          </div>
          <h3 className="text-xl font-bold mb-1" style={{ color: "#ffffff" }}>{level.title}</h3>
          <p className="text-xs mb-2" style={{ color: "rgba(255,255,255,0.5)" }}>Module {level.moduleNumber}: {level.module}</p>
          <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.8)" }}>{level.playable ? level.teaser : "This trial opens in a future update."}</p>
          {level.playable && unlocked ? (
            <button
              onClick={() => onStart(selected)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform"
              style={{ backgroundColor: finished ? "rgba(255,255,255,0.1)" : ACCENT, color: "#ffffff" }}
            >
              {finished ? <><RotateCcw size={18} /> Play again</> : <>Begin trial <ArrowRight size={18} /></>}
            </button>
          ) : (
            <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: "rgba(255,255,255,0.55)" }}>
              <Lock size={16} />
              {level.playable ? "Finish the previous trial to open this one." : "Coming soon"}
            </div>
          )}
        </div>
      </div>

      {/* ── right: the mystery and the clue board ───────────────────────────── */}
      <aside className="space-y-4">
        {/* on the very first visit the story card above already says this */}
        {done.length > 0 && (
          <div className="rounded-2xl p-5" style={{ backgroundColor: "rgba(255,255,255,0.05)", border: `1px solid ${ACCENT}55` }}>
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase mb-2" style={{ color: GOLD }}>
              <MapIcon size={14} /> The mystery
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.85)", fontFamily: "Georgia, serif" }}>
              {WORLD.tagline}
            </p>
          </div>
        )}

        <div className="rounded-2xl p-5" style={{ backgroundColor: "rgba(255,255,255,0.05)", border: `1px solid ${ACCENT}55` }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase" style={{ color: GOLD }}>
              <ScrollText size={14} /> Clue board
            </div>
            <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.6)" }}>
              {playable.filter((l) => done.includes(l.id)).length} of {playable.length}
            </span>
          </div>
          <div className="space-y-2">
            {playable.map((l) => {
              const got = done.includes(l.id);
              return (
                <div
                  key={l.id}
                  className="rounded-xl p-3"
                  style={{
                    backgroundColor: got ? "rgba(255,198,39,0.1)" : "rgba(255,255,255,0.03)",
                    border: `1px dashed ${got ? GOLD : "rgba(255,255,255,0.15)"}`,
                  }}
                >
                  {got ? (
                    <>
                      <div className="text-sm font-bold" style={{ color: GOLD }}>📜 {l.clue.title}</div>
                      <p className="text-xs mt-1 leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>{l.clue.text}</p>
                    </>
                  ) : (
                    <div className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                      ❔ Clue {l.moduleNumber}: finish Trial {l.moduleNumber} to reveal it
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-[11px] mt-3" style={{ color: "rgba(255,255,255,0.4)" }}>More clues appear as new trials open.</p>
        </div>

        <div className="rounded-2xl p-4 text-sm flex items-center gap-3" style={{ backgroundColor: "rgba(139,92,246,0.12)", border: `1px solid ${ACCENT}55`, color: "rgba(255,255,255,0.8)" }}>
          <ArgoniaFigure3D kind="codex" width={130} height={110} talking />
          <div>
            <span className="font-bold" style={{ color: GOLD }}>Your codex: </span>
            {WORLD.codexReminder}
            <div className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>Drag it to turn it around.</div>
          </div>
        </div>
      </aside>
    </div>
  );
}

// ─── LEVEL PLAYER ────────────────────────────────────────────────────────────

export function ArgoniaLevelPlayer({
  level,
  hasNext,
  onFinish,
  onNext,
  onExit,
  startBeat = 0,
}: {
  level: ArgoniaLevel;
  hasNext: boolean;
  /** Called when the last beat is finished; returns the XP actually awarded (replays award none). */
  onFinish: (score: number) => number;
  onNext: () => void;
  onExit: () => void;
  startBeat?: number;
}) {
  const [beatIndex, setBeatIndex] = useState(startBeat);
  const [xp, setXp] = useState(0);
  const [awarded, setAwarded] = useState(0);
  const [phase, setPhase] = useState<"playing" | "result">("playing");

  // per-beat state
  const [picked, setPicked] = useState<number | null>(null);
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [flagSubmitted, setFlagSubmitted] = useState(false);

  const beat = level.beats[beatIndex];
  const isLastBeat = beatIndex === level.beats.length - 1;

  const resetBeat = () => {
    setPicked(null);
    setFlagged(new Set());
    setFlagSubmitted(false);
  };

  const next = () => {
    if (isLastBeat) {
      setAwarded(onFinish(Math.max(0, xp)));
      setPhase("result");
      return;
    }
    setBeatIndex((i) => i + 1);
    resetBeat();
  };

  const choose = (index: number) => {
    if (picked !== null || beat.kind !== "choice") return;
    setPicked(index);
    if (beat.options[index].good) setXp((v) => v + XP_GOOD_CHOICE);
  };

  const toggleFlag = (index: number) => {
    if (flagSubmitted) return;
    setFlagged((prev) => {
      const n = new Set(prev);
      if (n.has(index)) n.delete(index);
      else n.add(index);
      return n;
    });
  };

  const submitFlags = () => {
    if (beat.kind !== "flag" || flagSubmitted) return;
    let gain = 0;
    beat.sentences.forEach((s, i) => {
      if (flagged.has(i)) gain += s.suspicious ? XP_FLAG_RIGHT : XP_FLAG_WRONG;
    });
    setXp((v) => Math.max(0, v + gain));
    setFlagSubmitted(true);
  };

  const replay = () => {
    setBeatIndex(0);
    setXp(0);
    setAwarded(0);
    resetBeat();
    setPhase("playing");
  };

  const canContinue =
    beat?.kind === "scene" ||
    (beat?.kind === "choice" && picked !== null) ||
    (beat?.kind === "flag" && flagSubmitted);

  if (phase === "result") {
    return (
      <div className="max-w-2xl mx-auto rounded-3xl p-8 text-center shadow-2xl" style={{ backgroundColor: "rgba(255,255,255,0.05)", border: `1px solid ${ACCENT}66`, animation: "argEnter 0.35s ease both" }}>
        <div className="text-6xl mb-3">🏆</div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: "#ffffff" }}>Trial complete!</h2>
        <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,0.6)" }}>{level.title}</p>
        <div className="inline-flex items-center gap-2 text-3xl font-bold py-3 px-6 rounded-2xl mb-2" style={{ backgroundColor: "rgba(251,191,36,0.15)", color: "#fbbf24" }}>
          <Zap size={26} />
          {awarded > 0 ? `+${awarded} XP` : "No new XP"}
        </div>
        <p className="text-xs mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>
          {awarded > 0 ? `You scored ${xp} in this trial.` : `Replays are practice only. You scored ${xp} this time.`}
        </p>

        <div className="text-left rounded-xl p-4 mb-4" style={{ backgroundColor: "rgba(255,198,39,0.1)", border: `1px dashed ${GOLD}` }}>
          <div className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: GOLD }}>New clue added to your board</div>
          <div className="font-bold" style={{ color: "#ffffff" }}>📜 {level.clue.title}</div>
          <p className="text-sm mt-1 leading-relaxed" style={{ color: "rgba(255,255,255,0.85)" }}>{level.clue.text}</p>
        </div>

        <div className="text-left rounded-xl p-4 mb-6" style={{ backgroundColor: "rgba(139,92,246,0.12)", border: `1px solid ${ACCENT}55` }}>
          <div className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: ACCENT }}>What to remember</div>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.85)" }}>{level.takeaway}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {hasNext && (
            <button onClick={onNext} className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold hover:opacity-90" style={{ backgroundColor: ACCENT, color: "#ffffff" }}>
              Next trial <ArrowRight size={18} />
            </button>
          )}
          <button onClick={onExit} className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold hover:opacity-90" style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "#ffffff" }}>
            <MapIcon size={18} /> Back to the map
          </button>
          <button onClick={replay} className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold hover:opacity-90" style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.8)" }}>
            <RotateCcw size={18} /> Replay
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-5">
        <button onClick={onExit} className="flex items-center gap-1.5 text-sm font-semibold mb-3 hover:opacity-80" style={{ color: "rgba(255,255,255,0.6)" }}>
          <ArrowLeft size={16} /> Back to the map
        </button>
        <div className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: ACCENT }}>
          Trial {level.moduleNumber} · {level.place}
        </div>
        <h2 className="text-2xl font-bold" style={{ color: "#ffffff" }}>{level.title}</h2>
        <div className="flex gap-1.5 mt-3" aria-label={`Step ${beatIndex + 1} of ${level.beats.length}`}>
          {level.beats.map((_, i) => (
            <span key={i} className="h-1.5 flex-1 rounded-full" style={{ backgroundColor: i <= beatIndex ? ACCENT : "rgba(255,255,255,0.12)" }} />
          ))}
        </div>
      </div>

      <div key={`${level.id}-${beatIndex}`} className="rounded-3xl p-7 shadow-2xl" style={{ backgroundColor: "rgba(255,255,255,0.05)", border: `1px solid ${ACCENT}55`, animation: "argEnter 0.35s ease both" }}>
        {beat.kind === "scene" && (
          <BeatHead figure={beat.figure ?? beat.speaker?.figure} portrait={beat.speaker?.portrait} name={beat.speaker?.name} talking={Boolean(beat.speaker)}>
            {!(beat.figure ?? beat.speaker?.figure) && <div className="text-5xl mb-3">{beat.emoji}</div>}
            {beat.speaker && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-3" style={{ backgroundColor: "rgba(255,198,39,0.15)", color: GOLD }}>
                {beat.speaker.emoji} {beat.speaker.name}
              </span>
            )}
            <h3 className="text-xl font-bold mb-2" style={{ color: GOLD }}>{beat.title}</h3>
            <p className="leading-relaxed" style={{ color: "rgba(255,255,255,0.88)", fontFamily: "Georgia, serif", fontSize: 17 }}>{beat.text}</p>
          </BeatHead>
        )}

        {beat.kind === "choice" && (
          <>
            <BeatHead figure={beat.figure}>
              {!beat.figure && <div className="text-4xl mb-3">{beat.emoji}</div>}
              <h3 className="text-lg font-bold mb-4" style={{ color: "#ffffff" }}>{beat.prompt}</h3>
            </BeatHead>
            <div className="space-y-3">
              {beat.options.map((o, i) => {
                const chosen = picked === i;
                const revealGood = picked !== null && o.good;
                return (
                  <button
                    key={i}
                    onClick={() => choose(i)}
                    disabled={picked !== null}
                    className="w-full text-left p-4 rounded-xl border-2 transition-all disabled:cursor-default"
                    style={{
                      color: "#ffffff",
                      backgroundColor: chosen ? (o.good ? "rgba(74,222,128,0.12)" : "rgba(255,107,107,0.12)") : revealGood ? "rgba(74,222,128,0.07)" : "rgba(255,255,255,0.04)",
                      borderColor: chosen ? (o.good ? "#4ade80" : "#ff6b6b") : revealGood ? "rgba(74,222,128,0.5)" : "rgba(255,255,255,0.15)",
                      opacity: picked !== null && !chosen && !revealGood ? 0.5 : 1,
                    }}
                  >
                    {o.text}
                  </button>
                );
              })}
            </div>
            {picked !== null && (
              <div
                className="mt-4 rounded-xl p-4"
                style={{
                  backgroundColor: beat.options[picked].good ? "rgba(74,222,128,0.1)" : "rgba(255,107,107,0.1)",
                  border: `1px solid ${beat.options[picked].good ? "#4ade80" : "#ff6b6b"}`,
                }}
              >
                <p className="font-bold mb-1" style={{ color: beat.options[picked].good ? "#4ade80" : "#ff6b6b" }}>
                  {beat.options[picked].good ? `Good call! +${XP_GOOD_CHOICE} XP` : "Not the best move"}
                </p>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>{beat.options[picked].feedback}</p>
              </div>
            )}
          </>
        )}

        {beat.kind === "flag" && (
          <>
            <BeatHead figure={beat.figure}>
              {!beat.figure && <div className="text-4xl mb-3">{beat.emoji}</div>}
              <h3 className="text-lg font-bold mb-4" style={{ color: "#ffffff" }}>{beat.prompt}</h3>
            </BeatHead>
            <div className="rounded-2xl p-3 space-y-2" style={{ backgroundColor: "rgba(245,235,215,0.08)", border: "1px solid rgba(245,235,215,0.2)" }}>
              {beat.sentences.map((s, i) => {
                const isFlagged = flagged.has(i);
                const verdict = flagSubmitted ? (s.suspicious === isFlagged ? "right" : "wrong") : null;
                return (
                  <div key={i}>
                    <button
                      onClick={() => toggleFlag(i)}
                      disabled={flagSubmitted}
                      className="w-full text-left p-3 rounded-lg border-2 transition-all disabled:cursor-default"
                      style={{
                        color: "#F5EBD7",
                        fontFamily: "Georgia, serif",
                        backgroundColor: isFlagged ? "rgba(251,191,36,0.14)" : "transparent",
                        borderColor: verdict === "right" ? "#4ade80" : verdict === "wrong" ? "#ff6b6b" : isFlagged ? GOLD : "rgba(245,235,215,0.15)",
                      }}
                    >
                      {isFlagged && !flagSubmitted ? "🚩 " : ""}
                      {s.text}
                    </button>
                    {flagSubmitted && (
                      <p className="text-xs mt-1 px-1" style={{ color: verdict === "right" ? "#4ade80" : "#ff6b6b" }}>
                        {verdict === "right" ? "✅" : "❌"} {s.suspicious ? "Worth checking. " : "Fine to take as general knowledge. "}
                        <span style={{ color: "rgba(255,255,255,0.65)" }}>{s.why}</span>
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
            {!flagSubmitted && (
              <button onClick={submitFlags} className="mt-4 px-5 py-2 rounded-xl font-bold hover:opacity-90" style={{ backgroundColor: GOLD, color: "#0D0508" }}>
                Submit
              </button>
            )}
          </>
        )}
      </div>

      <div className="flex justify-end mt-5">
        <button
          onClick={next}
          disabled={!canContinue}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 disabled:opacity-35 disabled:cursor-not-allowed"
          style={{ backgroundColor: ACCENT, color: "#ffffff" }}
        >
          {isLastBeat ? "Finish trial" : "Continue"}
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

// ─── THE GAME ────────────────────────────────────────────────────────────────

export function ArgoniaGame() {
  const [done, setDone] = useState<string[]>(() => loadArgoniaProgress());
  const [view, setView] = useState<"map" | "play">("map");
  const firstOpen = ARGONIA_LEVELS.findIndex((l, i) => isLevelUnlocked(i, loadArgoniaProgress()) && !loadArgoniaProgress().includes(l.id));
  const [selected, setSelected] = useState(firstOpen === -1 ? 0 : firstOpen);
  const [playKey, setPlayKey] = useState(0);

  const level = ARGONIA_LEVELS[selected];
  const hasNext = selected + 1 < ARGONIA_LEVELS.length && isLevelUnlocked(selected + 1, done.includes(level.id) ? done : [...done, level.id]);

  const start = (i: number) => {
    setSelected(i);
    setPlayKey((k) => k + 1);
    setView("play");
    window.scrollTo({ top: 0 });
  };

  // XP counts the first time a trial is finished; replays are practice only.
  const finish = (score: number): number => {
    const firstTime = !done.includes(level.id);
    const gain = firstTime ? score : 0;
    if (gain > 0) addXP(gain);
    saveHighScore(`argonia-${level.id}`, score);
    setDone(saveArgoniaLevelDone(level.id));
    return gain;
  };

  const goNext = () => start(Math.min(selected + 1, ARGONIA_LEVELS.length - 1));

  const waveMessage =
    view === "map"
      ? done.length === 0
        ? "Pick Trial 1 to begin. Each trial teaches something from a module."
        : "Choose your next trial, or replay one for practice."
      : "Take your time. Think about what you'd be able to check afterwards.";

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #120a1f 0%, #1b0f2e 60%, #1A0A0F 100%)" }}>
      <GameHeader title="Argonia: The Vanishing King" subtitle={view === "map" ? "A story quest" : level.title} />
      <main className="max-w-5xl mx-auto px-4 py-8">
        {view === "map" ? (
          <>
            {done.length === 0 && (
              <div className="mb-6 rounded-3xl p-6 md:p-8 shadow-2xl" style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.25), rgba(139,28,64,0.25))", border: `1px solid ${ACCENT}66` }}>
                <img src={worldPicture} alt="The kingdom of Argonia: the palace above a village, a lake and a windmill at sunset" className="w-full rounded-2xl mb-5 object-cover" style={{ aspectRatio: "16 / 6", objectPosition: "50% 12%", border: `1px solid ${ACCENT}66` }} />
                <div className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: GOLD }}>The story so far</div>
                <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: "#ffffff" }}>The king has vanished.</h2>
                <p className="leading-relaxed mb-5 max-w-2xl" style={{ color: "rgba(255,255,255,0.85)", fontFamily: "Georgia, serif", fontSize: 17 }}>
                  Argonia is a kingdom high on a mountain in the clouds. Its king, your oldest friend, has disappeared without a trace, and so has his codex, the machine that answers questions written on slips of paper. You were away for two years. Now you're home, and the palace doors are closing. Learn to use your own codex, and to doubt it, and find out what happened.
                </p>
                <button onClick={() => start(0)} className="flex items-center gap-2 px-7 py-3 rounded-xl font-bold hover:scale-105 transition-transform" style={{ backgroundColor: GOLD, color: "#0D0508" }}>
                  Begin your journey <ArrowRight size={18} />
                </button>
              </div>
            )}
            <Link to="/games/argonia/city" className="flex items-center gap-2 mb-4 text-sm font-semibold underline" style={{ color: GOLD }}>
              🏙️ Or explore the whole city: click its buildings, people and objects
            </Link>
            <ArgoniaMap done={done} selected={selected} onSelect={setSelected} onStart={start} />
          </>
        ) : (
          <ArgoniaLevelPlayer
            key={playKey}
            level={level}
            hasNext={hasNext}
            onFinish={finish}
            onNext={goNext}
            onExit={() => setView("map")}
          />
        )}
      </main>

      <style>{`
        @keyframes argEnter { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes argPulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.1); } }
      `}</style>

      <Link to="/choose-character" className="fixed top-24 right-6 z-40 block hover:opacity-80 transition-opacity" title="Change your character">
        <CharacterMascot character={getUserData()?.selectedCharacter} size={64} equipped={getEquippedItemIds()} />
      </Link>

      <FloatingWave message={waveMessage} expression="default" />
    </div>
  );
}
