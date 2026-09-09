import { useState, useEffect } from "react";
import { GameHeader } from "./GameHeader";
import { CompletionModal } from "./CompletionModal";
import { XPToast } from "./XPToast";
import { ETHICS_PAIRS } from "../../data/gameData";
import { addXP, awardBadge, saveHighScore } from "../../utils/userData";

const XP_REWARD = 50;

interface Card {
  uid: string;
  pairId: string;
  label: string;
  type: "scenario" | "concern";
  flipped: boolean;
  matched: boolean;
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
  const [cards, setCards] = useState<Card[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [locked, setLocked] = useState(false);
  const [done, setDone] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    reset();
  }, []);

  function reset() {
    setCards(buildCards());
    setSelected([]);
    setLocked(false);
    setDone(false);
    setShowToast(false);
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
    const c1 = cards.find((c) => c.uid === uid1)!;
    const c2 = cards.find((c) => c.uid === uid2)!;
    // Also need the just-flipped card data
    const card2 = { ...card };

    const isMatch = c1.pairId === card2.pairId || c2.pairId === card2.pairId
      ? (uid1 === uid ? c2.pairId === card2.pairId : c1.pairId === card2.pairId)
      : false;

    // Re-derive: match if both share same pairId
    const a = cards.find((c) => c.uid === uid1) ?? card;
    const b = uid2 === uid ? card : cards.find((c) => c.uid === uid2)!;
    const matched = a.pairId === b.pairId;

    if (matched) {
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
          const allDone = prev.every((c) => c.matched || c.uid === uid1 || c.uid === uid2);
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
      // No match — flip back after 900ms
      setTimeout(() => {
        setCards((prev) =>
          prev.map((c) =>
            c.uid === uid1 || c.uid === uid2
              ? { ...c, flipped: false }
              : c
          )
        );
        setLocked(false);
      }, 900);
    }
  }

  function cardBg(card: Card) {
    if (card.matched) return "rgba(74,222,128,0.12)";
    if (card.flipped) return card.type === "scenario" ? "rgba(212,83,126,0.18)" : "rgba(251,191,36,0.15)";
    return "#1a1a2e";
  }

  function cardBorder(card: Card) {
    if (card.matched) return "2px solid #4ade80";
    if (card.flipped) return card.type === "scenario" ? "2px solid #d4537e" : "2px solid #fbbf24";
    return "1px solid rgba(212,83,126,0.2)";
  }

  function cardTextColor(card: Card) {
    if (card.matched) return "#4ade80";
    if (card.flipped) return card.type === "scenario" ? "#f472b6" : "#fbbf24";
    return "rgba(255,255,255,0.3)";
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
              className="relative rounded-2xl p-3 min-h-[110px] flex items-center justify-center text-center text-sm font-medium transition-all duration-300"
              style={{
                background: cardBg(card),
                border: cardBorder(card),
                color: cardTextColor(card),
                cursor: card.matched ? "default" : "pointer",
                transform: card.flipped && !card.matched ? "scale(1.04)" : "scale(1)",
              }}
            >
              {card.flipped || card.matched ? (
                <span style={{ lineHeight: 1.3 }}>{card.label}</span>
              ) : (
                <span className="text-2xl select-none">?</span>
              )}
            </button>
          ))}
        </div>

        {/* Progress */}
        <div className="mt-6 text-center text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
          {cards.filter((c) => c.matched).length / 2} / {ETHICS_PAIRS.length} pairs matched
        </div>
      </main>

      <XPToast amount={XP_REWARD} visible={showToast} />

      {done && (
        <CompletionModal
          xpEarned={XP_REWARD}
          message="All pairs matched!"
          onPlayAgain={reset}
        />
      )}
    </div>
  );
}
