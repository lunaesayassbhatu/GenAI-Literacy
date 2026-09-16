import { useState } from "react";
import { GameHeader } from "./GameHeader";
import { CompletionModal } from "./CompletionModal";
import { XPToast } from "./XPToast";
import { CharacterMascot } from "../CharacterMascot";
import { FloatingWave } from "../FloatingWave";
import { ETHICS_PAIRS } from "../../data/gameData";
import { addXP, awardBadge, saveHighScore, getUserData } from "../../utils/userData";

const XP_REWARD = 50;

interface Card {
  uid: string;
  pairId: string;
  label: string;
  type: "scenario" | "concern";
  flipped: boolean;
  matched: boolean;
}

// One distinct color per matched pair, cycling if there are more pairs than colors,
// so both halves of a pair always share a color no other pair uses at the same time.
const PAIR_COLORS = [
  { text: "#60a5fa", border: "#60a5fa", bg: "rgba(96,165,250,0.16)" },
  { text: "#c084fc", border: "#c084fc", bg: "rgba(192,132,252,0.16)" },
  { text: "#34d399", border: "#34d399", bg: "rgba(52,211,153,0.16)" },
  { text: "#fb923c", border: "#fb923c", bg: "rgba(251,146,60,0.16)" },
  { text: "#f472b6", border: "#f472b6", bg: "rgba(244,114,182,0.16)" },
  { text: "#facc15", border: "#facc15", bg: "rgba(250,204,21,0.16)" },
  { text: "#22d3ee", border: "#22d3ee", bg: "rgba(34,211,238,0.16)" },
  { text: "#a3e635", border: "#a3e635", bg: "rgba(163,230,53,0.16)" },
];

function pairColor(pairId: string) {
  const idx = ETHICS_PAIRS.findIndex((p) => p.id === pairId);
  return PAIR_COLORS[Math.max(0, idx) % PAIR_COLORS.length];
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildCards(): Card[] {
  const cards: Card[] = [];
  for (const pair of ETHICS_PAIRS) {
    cards.push({
      uid: `${pair.id}-scenario`,
      pairId: pair.id,
      label: pair.scenario,
      type: "scenario",
      flipped: false,
      matched: false,
    });
    cards.push({
      uid: `${pair.id}-concern`,
      pairId: pair.id,
      label: pair.concern,
      type: "concern",
      flipped: false,
      matched: false,
    });
  }
  return shuffle(cards);
}

export function EthicsMatchingGame() {
  const [phase, setPhase] = useState<"idle" | "playing">("idle");
  const [cards, setCards] = useState<Card[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [locked, setLocked] = useState(false);
  const [pendingFlipBack, setPendingFlipBack] = useState<[string, string] | null>(null);
  const [done, setDone] = useState(false);
  const [resultsHidden, setResultsHidden] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [waveMessage, setWaveMessage] = useState("Match each scenario to its ethical concern.");
  const [waveExpression, setWaveExpression] = useState<"default" | "celebrate" | "hint">("default");

  function startGame() {
    setPhase("playing");
    reset();
  }

  function reset() {
    setCards(buildCards());
    setSelected([]);
    setLocked(false);
    setPendingFlipBack(null);
    setDone(false);
    setResultsHidden(false);
    setShowToast(false);
    setWaveMessage("Match each scenario to its ethical concern.");
    setWaveExpression("default");
  }

  function handleClick(uid: string) {
    if (locked) return;
    const card = cards.find((c) => c.uid === uid);
    if (!card || card.flipped || card.matched) return;

    const next = [...selected, uid];

    // Flip this card
    setCards((prev) =>
      prev.map((c) => (c.uid === uid ? { ...c, flipped: true } : c))
    );

    if (next.length < 2) {
      setSelected(next);
      return;
    }

    // Two cards selected — check match
    setLocked(true);
    setSelected([]);

    const [uid1, uid2] = next;
    const a = cards.find((c) => c.uid === uid1) ?? card;
    const b = uid2 === uid ? card : cards.find((c) => c.uid === uid2)!;
    const matched = a.pairId === b.pairId;

    if (matched) {
      setWaveMessage("Nice match!");
      setWaveExpression("celebrate");
      setCards((prev) =>
        prev.map((c) =>
          c.uid === uid1 || c.uid === uid2
            ? { ...c, flipped: true, matched: true }
            : c
        )
      );

      // Check all matched
      setTimeout(() => {
        setCards((prev) => {
          const updatedPrev = prev.map((c) =>
            c.uid === uid1 || c.uid === uid2 ? { ...c, matched: true } : c
          );
          const allMatched = updatedPrev.every((c) => c.matched);
          if (allMatched) {
            addXP(XP_REWARD);
            awardBadge("ethics-expert", "Ethics Expert", "Complete the Ethics Matching game", "⚖️");
            saveHighScore("ethics", XP_REWARD);
            setShowToast(true);
            setTimeout(() => setDone(true), 1200);
          }
          return updatedPrev;
        });
        setLocked(false);
      }, 400);
    } else {
      // No match — wait for the user to tap Continue instead of an automatic timer,
      // so there's no rush to read both cards before they flip back.
      setWaveMessage("Not quite a pair — take another look, then hit Continue.");
      setWaveExpression("hint");
      setPendingFlipBack([uid1, uid2]);
    }
  }

  function resolvePendingFlipBack() {
    if (!pendingFlipBack) return;
    const [uid1, uid2] = pendingFlipBack;
    setCards((prev) =>
      prev.map((c) =>
        c.uid === uid1 || c.uid === uid2 ? { ...c, flipped: false } : c
      )
    );
    setPendingFlipBack(null);
    setLocked(false);
    setWaveMessage("Match each scenario to its ethical concern.");
    setWaveExpression("default");
  }

  function cardBg(card: Card) {
    if (card.matched) return pairColor(card.pairId).bg;
    if (card.flipped) return card.type === "scenario" ? "rgba(212,83,126,0.18)" : "rgba(251,191,36,0.15)";
    return "#1a1a2e";
  }

  function cardBorder(card: Card) {
    if (card.matched) return `2px solid ${pairColor(card.pairId).border}`;
    if (card.flipped) return card.type === "scenario" ? "2px solid #d4537e" : "2px solid #fbbf24";
    return "1px solid rgba(212,83,126,0.2)";
  }

  function cardTextColor(card: Card) {
    if (card.matched) return pairColor(card.pairId).text;
    if (card.flipped) return card.type === "scenario" ? "#f472b6" : "#fbbf24";
    return "rgba(255,255,255,0.3)";
  }

  if (phase === "idle") {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#0f0f12" }}>
        <GameHeader title="AI Ethics Matching" />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-sm text-center">
            <div className="text-7xl mb-6">⚖️</div>
            <h2 className="text-3xl font-bold mb-3" style={{ color: "#ffffff" }}>
              AI Ethics Matching
            </h2>
            <p className="mb-8 text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              Match each scenario to its ethical concern. Pay attention to each card as it
              will flip back over after an incorrect match!
            </p>
            <button
              onClick={startGame}
              className="w-full py-4 rounded-2xl text-lg font-bold hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#d4537e", color: "#ffffff" }}
            >
              Let's Go! 🚀
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0f0f12" }}>
      <GameHeader
        title="AI Ethics Matching"
        subtitle="Match each scenario to its ethical concern"
      />

      <main className="max-w-2xl mx-auto px-4 pb-10">
        {/* Legend */}
        <div className="flex gap-4 justify-center mb-6">
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{ backgroundColor: "rgba(212,83,126,0.18)", color: "#f472b6" }}
          >
            Scenario
          </span>
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{ backgroundColor: "rgba(251,191,36,0.15)", color: "#fbbf24" }}
          >
            Ethical Concern
          </span>
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{ backgroundColor: "rgba(74,222,128,0.12)", color: "#4ade80" }}
          >
            Matched
          </span>
        </div>

        {/* Card Grid — 2×4 */}
        <div className="grid grid-cols-4 gap-3">
          {cards.map((card) => (
            <button
              key={card.uid}
              onClick={() => handleClick(card.uid)}
              disabled={card.matched || locked}
              className="relative rounded-2xl p-3 min-h-[130px] flex items-center justify-center text-center text-base font-medium transition-all duration-300"
              style={{
                background: cardBg(card),
                border: cardBorder(card),
                color: cardTextColor(card),
                cursor: card.matched ? "default" : "pointer",
                transform: card.flipped && !card.matched ? "scale(1.04)" : "scale(1)",
              }}
            >
              {card.flipped || card.matched ? (
                <span style={{ lineHeight: 1.35 }}>{card.label}</span>
              ) : (
                <span className="text-2xl select-none">?</span>
              )}
            </button>
          ))}
        </div>

        {/* Manual continue after an incorrect match */}
        {pendingFlipBack && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={resolvePendingFlipBack}
              className="px-6 py-3 rounded-xl font-bold transition-all hover:scale-105"
              style={{ backgroundColor: "#fbbf24", color: "#1a1a2e" }}
            >
              Continue →
            </button>
          </div>
        )}

        {/* Progress */}
        <div className="mt-6 text-center text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
          {cards.filter((c) => c.matched).length / 2} / {ETHICS_PAIRS.length} pairs matched
        </div>
      </main>

      <XPToast amount={XP_REWARD} visible={showToast} />

      {done && !resultsHidden && (
        <CompletionModal
          xpEarned={XP_REWARD}
          message="All pairs matched!"
          onPlayAgain={reset}
          onClose={() => setResultsHidden(true)}
        />
      )}

      {done && resultsHidden && (
        <button
          onClick={() => setResultsHidden(false)}
          className="fixed bottom-8 right-1/2 translate-x-1/2 z-40 px-4 py-2 rounded-full text-sm font-bold shadow-lg transition-all hover:scale-105"
          style={{ backgroundColor: "#fbbf24", color: "#1a1a2e" }}
        >
          🏆 View Results
        </button>
      )}

      <FloatingWave message={waveMessage} expression={waveExpression} />

      {/* Player's chosen character */}
      <div className="fixed top-24 right-6 z-40">
        <CharacterMascot character={getUserData()?.selectedCharacter} size={64} />
      </div>
    </div>
  );
}
