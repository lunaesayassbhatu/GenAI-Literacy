import { useState, useRef, useEffect, useCallback } from "react";
import { GameHeader } from "./GameHeader";
import { XPToast } from "./XPToast";
import { CharacterMascot } from "../CharacterMascot";
import { FloatingWave } from "../FloatingWave";
import { BANK_PORTAL_STATEMENTS, Statement } from "../../data/gameData";
import { addXP, awardBadge, saveHighScore, getHighScore, getUserData } from "../../utils/userData";
import { getEquippedItemIds } from "../../utils/itemsSystem";
import { Link, useNavigate } from "react-router-dom";
import { RotateCcw, ArrowLeft } from "lucide-react";

// ─── SHOWCASE ONLY ───────────────────────────────────────────────────────────
// Demo of the "Grand Globe" world concept (Western, small dwindling town, a
// portal in the bank that answers questions — sometimes wrong). Same swipe
// engine as Fact or Myth; not wired into the Games hub / Journey Map since
// no world has actually been chosen yet.

type GamePhase  = "idle" | "playing" | "over";
type CardState  = "entering" | "idle" | "flying-right" | "flying-left";

interface FeedbackInfo {
  correct: boolean;
  why:     string;
  isFact:  boolean;
}

const TOTAL_TIME     = 60;
const XP_PER_CORRECT = 15;
const XP_PER_WRONG   = -5;
const FLY_MS         = 320;
const FEEDBACK_MS    = 1500;

const ACCENT = "#d97706";

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function BankPortalGame() {
  const navigate = useNavigate();

  const gRef = useRef({
    phase:    "idle" as GamePhase,
    queue:    [] as Statement[],
    current:  null as Statement | null,
    timeLeft: TOTAL_TIME,
    score:    0,
    total:    0,
    xp:       0,
    locked:   false,
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const t1       = useRef<ReturnType<typeof setTimeout>  | null>(null);
  const t2       = useRef<ReturnType<typeof setTimeout>  | null>(null);
  const rafRef   = useRef<number | null>(null);

  const [gamePhase,  setGamePhase]  = useState<GamePhase>("idle");
  const [timeLeft,   setTimeLeft]   = useState(TOTAL_TIME);
  const [score,      setScore]      = useState(0);
  const [total,      setTotal]      = useState(0);
  const [xp,         setXp]         = useState(0);

  const [cardText,   setCardText]   = useState("");
  const [cardKey,    setCardKey]    = useState(0);
  const [cardState,  setCardState]  = useState<CardState>("idle");

  const [feedback,   setFeedback]   = useState<FeedbackInfo | null>(null);

  const [dragX,      setDragX]      = useState(0);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const dragStart    = useRef<number | null>(null);
  const dragging     = useRef(false);

  const [showToast,  setShowToast]  = useState(false);
  const [waveMessage, setWaveMessage] = useState("Swipe right if you'd TRUST the portal's answer, left if it's a RISKY GUESS.");
  const [waveExpression, setWaveExpression] = useState<"default" | "celebrate" | "hint">("default");

  useEffect(() => {
    if (gamePhase !== "playing") return;
    setCardState("entering");
    const id1 = requestAnimationFrame(() => {
      const id2 = requestAnimationFrame(() => {
        setCardState("idle");
      });
      rafRef.current = id2;
    });
    rafRef.current = id1;
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [cardKey]); // eslint-disable-line react-hooks/exhaustive-deps

  function clearTimers() {
    if (t1.current)       { clearTimeout(t1.current);  t1.current = null; }
    if (t2.current)       { clearTimeout(t2.current);  t2.current = null; }
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }

  function stopCountdown() {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }

  function finishGame() {
    stopCountdown();
    clearTimers();
    const g = gRef.current;
    g.phase  = "over";
    const earned = Math.max(0, g.xp);
    addXP(earned);
    awardBadge("bank-portal-explorer", "Portal Explorer", "Complete the Bank Portal showcase game", "🚪");
    setIsNewHighScore(saveHighScore("bank-portal", earned));
    setGamePhase("over");
    setFeedback(null);
    setCardState("idle");
    setShowToast(true);
    setWaveMessage(earned > 0 ? "Nice run! Check out how you did." : "Time's up! Give it another shot.");
    setWaveExpression("celebrate");
  }

  function startCountdown() {
    stopCountdown();
    timerRef.current = setInterval(() => {
      gRef.current.timeLeft -= 1;
      setTimeLeft(gRef.current.timeLeft);
      if (gRef.current.timeLeft <= 0) finishGame();
    }, 1000);
  }

  function startGame() {
    clearTimers();

    const g   = gRef.current;
    g.phase    = "playing";
    g.queue    = shuffle(BANK_PORTAL_STATEMENTS);
    g.current  = g.queue.shift() ?? null;
    g.timeLeft = TOTAL_TIME;
    g.score    = 0;
    g.total    = 0;
    g.xp       = 0;
    g.locked   = false;

    setGamePhase("playing");
    setTimeLeft(TOTAL_TIME);
    setScore(0);
    setTotal(0);
    setXp(0);
    setCardText(g.current?.text ?? "");
    setCardKey(k => k + 1);
    setCardState("entering");
    setFeedback(null);
    setDragX(0);
    setShowToast(false);
    setWaveMessage("Swipe right if you'd TRUST the portal's answer, left if it's a RISKY GUESS.");
    setWaveExpression("default");

    startCountdown();
  }

  const answer = useCallback((wentRight: boolean) => {
    const g = gRef.current;
    if (g.locked || g.phase !== "playing" || !g.current) return;
    g.locked = true;

    const card    = g.current;
    const correct = wentRight === card.isFact;
    g.score += correct ? 1 : 0;
    g.total += 1;
    g.xp     = Math.max(0, g.xp + (correct ? XP_PER_CORRECT : XP_PER_WRONG));

    setScore(g.score);
    setTotal(g.total);
    setXp(g.xp);
    setDragX(0);

    setCardState(wentRight ? "flying-right" : "flying-left");

    t1.current = setTimeout(() => {
      setFeedback({ correct, why: card.why, isFact: card.isFact });
      setWaveMessage(correct ? "Good instinct!" : "Not quite — check the explanation below.");
      setWaveExpression(correct ? "celebrate" : "hint");
    }, FLY_MS + 30);

    t2.current = setTimeout(() => {
      const g2 = gRef.current;
      if (g2.timeLeft <= 0 || g2.queue.length === 0) {
        finishGame();
        return;
      }
      g2.current = g2.queue.shift() ?? null;
      g2.locked  = false;

      setFeedback(null);
      setCardText(g2.current?.text ?? "");
      setCardKey(k => k + 1);
      setDragX(0);
    }, FEEDBACK_MS);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") answer(true);
      if (e.key === "ArrowLeft")  answer(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [answer]);

  useEffect(() => () => clearTimers(), []);

  const canDrag = cardState === "idle" && feedback === null;

  function onPointerDown(e: React.PointerEvent) {
    if (!canDrag) return;
    dragging.current  = true;
    dragStart.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragging.current || dragStart.current === null) return;
    setDragX(e.clientX - dragStart.current);
  }

  function onPointerUp(e: React.PointerEvent) {
    if (!dragging.current || dragStart.current === null) return;
    dragging.current  = false;
    const dx          = e.clientX - dragStart.current;
    dragStart.current = null;
    if (Math.abs(dx) > 90) answer(dx > 0);
    else setDragX(0);
  }

  const timerPct   = (timeLeft / TOTAL_TIME) * 100;
  const timerColor = timerPct > 50 ? "#4ade80" : timerPct > 25 ? "#fbbf24" : "#ff6b6b";

  const isFlying = cardState === "flying-right" || cardState === "flying-left";

  const cardTransform =
    cardState === "entering"     ? "scale(0.82) translateY(32px)" :
    cardState === "flying-right" ? "translateX(660px) rotate(22deg)" :
    cardState === "flying-left"  ? "translateX(-660px) rotate(-22deg)" :
    `translateX(${dragX}px) rotate(${dragX / 15}deg)`;

  const cardOpacity =
    cardState === "entering" ? 0 :
    isFlying                 ? 0 :
    1;

  const cardTransition =
    cardState === "entering"           ? "none" :
    isFlying                           ? `transform ${FLY_MS}ms cubic-bezier(0.25,0.46,0.45,0.94), opacity ${FLY_MS}ms ease` :
    dragging.current                   ? "none" :
    "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.35s ease";

  const showTrustBadge = cardState === "idle" && dragX > 30;
  const showRiskyBadge = cardState === "idle" && dragX < -30;

  const cardBgTint =
    dragX > 30  ? `rgba(74,222,128,${Math.min(0.22, dragX / 450)})` :
    dragX < -30 ? `rgba(255,107,107,${Math.min(0.22, -dragX / 450)})` :
    undefined;

  const accuracy      = total > 0 ? Math.round((score / total) * 100) : 0;
  const finalXP       = Math.max(0, xp);
  const accuracyEmoji = accuracy >= 80 ? "🏅" : accuracy >= 60 ? "🙂" : "📚";

  if (gamePhase === "idle") {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#12100c" }}>
        <GameHeader title="The Bank Portal" />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-sm text-center">
            <div className="text-7xl mb-6">🚪</div>
            <h2 className="text-3xl font-bold mb-3" style={{ color: "#ffffff" }}>
              The Bank Portal
            </h2>
            <p className="mb-2 text-sm font-semibold" style={{ color: ACCENT }}>
              A showcase concept — the world of Grand Globe
            </p>
            <p className="mb-8 text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              A hole in the wall at the town bank answers any question — sometimes right, sometimes not.
              Swipe <strong style={{ color: "#4ade80" }}>right = TRUST IT</strong>, swipe{" "}
              <strong style={{ color: "#ff6b6b" }}>left = RISKY GUESS</strong>.
              <br />
              <span className="text-sm mt-2 block" style={{ color: "rgba(255,255,255,0.35)" }}>
                60 seconds on the clock. How many can you get?
              </span>
            </p>
            <button
              onClick={startGame}
              className="w-full py-4 rounded-2xl text-lg font-bold hover:opacity-90 transition-opacity"
              style={{ backgroundColor: ACCENT, color: "#ffffff" }}
            >
              Step Through the Portal 🚪
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gamePhase === "over") {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#12100c" }}>
        <GameHeader title="The Bank Portal" />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-sm">
            <div
              className="rounded-3xl p-8 text-center shadow-2xl"
              style={{ backgroundColor: "#211c14", border: `1px solid ${ACCENT}4d` }}
            >
              <div className="text-6xl mb-4">{accuracyEmoji}</div>
              <h2 className="text-2xl font-bold mb-1" style={{ color: "#ffffff" }}>Time's Up!</h2>
              <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.45)" }}>Here's how you did</p>
              {isNewHighScore ? (
                <div className="mb-4 px-4 py-2 rounded-xl text-sm font-bold" style={{ backgroundColor: "rgba(251,191,36,0.15)", color: "#fbbf24" }}>
                  🏆 New high score!
                </div>
              ) : getHighScore("bank-portal") > 0 && (
                <div className="mb-4 text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Best: {getHighScore("bank-portal")} XP
                </div>
              )}

              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { value: finalXP,            label: "XP earned", color: "#fbbf24", bg: "rgba(251,191,36,0.12)" },
                  { value: `${score}/${total}`, label: "correct",   color: "#4ade80", bg: "rgba(74,222,128,0.1)"  },
                  { value: `${accuracy}%`,      label: "accuracy",  color: ACCENT,    bg: "rgba(217,119,6,0.12)" },
                ].map((s, i) => (
                  <div key={i} className="rounded-2xl p-3" style={{ backgroundColor: s.bg }}>
                    <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="rounded-full h-2 mb-6 overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
                <div className="h-full rounded-full" style={{ width: `${accuracy}%`, backgroundColor: timerColor }} />
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={startGame}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold hover:opacity-90"
                  style={{ backgroundColor: ACCENT, color: "#ffffff" }}
                >
                  <RotateCcw size={18} /> Play Again
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
    <div className="min-h-screen flex flex-col select-none" style={{ backgroundColor: "#12100c" }}>
      <GameHeader title="The Bank Portal" xp={xp} showXP />

      <main className="flex-1 flex flex-col items-center px-4 pb-6 max-w-sm mx-auto w-full">
        <div className="w-full mb-4">
          <div className="flex justify-between text-xs mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>
            <span>{score}/{total} correct</span>
            <span style={{ color: timerColor, fontWeight: 700 }}>{timeLeft}s</span>
          </div>
          <div className="rounded-full h-2 overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${timerPct}%`, backgroundColor: timerColor }}
            />
          </div>
        </div>

        <div className="relative w-full flex-1 flex items-center justify-center" style={{ minHeight: 260 }}>
          <div className="absolute rounded-3xl"
            style={{ width: "88%", height: 230, backgroundColor: "#211c14",
              border: `1px solid ${ACCENT}20`, top: 14, opacity: 0.45, transform: "scale(0.95)" }} />
          <div className="absolute rounded-3xl"
            style={{ width: "92%", height: 230, backgroundColor: "#211c14",
              border: `1px solid ${ACCENT}30`, top: 7, opacity: 0.65, transform: "scale(0.975)" }} />

          <div
            key={cardKey}
            className="absolute w-full rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-2xl"
            style={{
              height: 230,
              backgroundColor: "#211c14",
              border: `1px solid ${ACCENT}4d`,
              transform:  cardTransform,
              transition: cardTransition,
              opacity:    cardOpacity,
              cursor: canDrag ? "grab" : "default",
              userSelect: "none",
              backgroundImage: cardBgTint
                ? `radial-gradient(circle at center, ${cardBgTint}, transparent 70%)`
                : undefined,
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
          >
            {showTrustBadge && (
              <div
                className="absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-bold border-2"
                style={{
                  color: "#4ade80", borderColor: "#4ade80",
                  backgroundColor: "rgba(74,222,128,0.15)",
                  opacity: Math.min(1, dragX / 90),
                  transform: "rotate(12deg)",
                }}
              >
                TRUST IT
              </div>
            )}
            {showRiskyBadge && (
              <div
                className="absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-bold border-2"
                style={{
                  color: "#ff6b6b", borderColor: "#ff6b6b",
                  backgroundColor: "rgba(255,107,107,0.15)",
                  opacity: Math.min(1, -dragX / 90),
                  transform: "rotate(-12deg)",
                }}
              >
                RISKY GUESS
              </div>
            )}

            <div className="text-4xl mb-4">🚪</div>
            <p className="text-base font-semibold leading-snug" style={{ color: "#ffffff" }}>
              {cardText}
            </p>
          </div>

          {feedback && (
            <div
              className="absolute w-full rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-2xl"
              style={{
                height: 230,
                backgroundColor: feedback.correct ? "rgba(74,222,128,0.1)" : "rgba(255,107,107,0.1)",
                border: `2px solid ${feedback.correct ? "#4ade80" : "#ff6b6b"}`,
                animation: "feedbackEnter 0.28s ease both",
              }}
            >
              <div className="text-4xl mb-2">{feedback.correct ? "✅" : "❌"}</div>
              <p className="font-bold text-base mb-1"
                style={{ color: feedback.correct ? "#4ade80" : "#ff6b6b" }}>
                {feedback.correct ? `Correct! +${XP_PER_CORRECT} XP` : `Not quite! ${XP_PER_WRONG} XP`}
              </p>
              <p className="text-sm font-semibold mb-2" style={{ color: "rgba(255,255,255,0.7)" }}>
                The portal was{" "}
                <span style={{ color: feedback.isFact ? "#4ade80" : "#ff6b6b" }}>
                  {feedback.isFact ? "TRUSTWORTHY" : "A RISKY GUESS"}
                </span>
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                {feedback.why}
              </p>
            </div>
          )}
        </div>

        <p className="text-xs mb-3" style={{ color: "rgba(255,255,255,0.22)" }}>
          Drag the card or use ← → keys
        </p>

        <div className="flex gap-3 w-full">
          <button
            onClick={() => answer(false)}
            disabled={!canDrag}
            className="flex-1 py-4 rounded-2xl font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-30"
            style={{ backgroundColor: "rgba(255,107,107,0.15)", color: "#ff6b6b", border: "1px solid rgba(255,107,107,0.3)" }}
          >
            ← RISKY
          </button>
          <button
            onClick={() => answer(true)}
            disabled={!canDrag}
            className="flex-1 py-4 rounded-2xl font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-30"
            style={{ backgroundColor: "rgba(74,222,128,0.12)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.3)" }}
          >
            TRUST →
          </button>
        </div>
      </main>

      <style>{`
        @keyframes feedbackEnter {
          from { opacity: 0; transform: scale(0.88) translateY(14px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
      `}</style>

      <Link
        to="/choose-character"
        className="fixed top-24 right-6 z-40 block hover:opacity-80 transition-opacity"
        title="Change your character"
      >
        <CharacterMascot character={getUserData()?.selectedCharacter} size={64} equipped={getEquippedItemIds()} />
      </Link>

      <FloatingWave message={waveMessage} expression={waveExpression} />
    </div>
  );
}
