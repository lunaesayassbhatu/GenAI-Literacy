import { useState } from "react";
import { GameHeader } from "./GameHeader";
import { XPToast } from "./XPToast";
import { CharacterMascot } from "../CharacterMascot";
import { BUILD_SCENARIOS, BuildScenario, PromptPiece } from "../../data/gameData";
import { addXP, awardBadge, saveHighScore, getHighScore, getUserData } from "../../utils/userData";
import { getEquippedItemIds } from "../../utils/itemsSystem";
import { Link, useNavigate } from "react-router-dom";
import { RotateCcw, ArrowLeft, XCircle } from "lucide-react";

function randomScenario(): BuildScenario {
  return BUILD_SCENARIOS[Math.floor(Math.random() * BUILD_SCENARIOS.length)];
}

interface ResultInfo {
  xp: number;
  message: string;
  missingPieces: PromptPiece[];
  newHigh: boolean;
}

export function BuildAPromptGame() {
  const navigate = useNavigate();
  const [scenario, setScenario] = useState<BuildScenario>(randomScenario);
  const [placed, setPlaced] = useState<PromptPiece[]>([]);
  const [result, setResult] = useState<ResultInfo | null>(null);
  const [showToast, setShowToast] = useState(false);

  function reset() {
    setScenario(randomScenario());
    setPlaced([]);
    setResult(null);
    setShowToast(false);
  }

  function addPiece(piece: PromptPiece) {
    if (placed.find((p) => p.id === piece.id)) return;
    setPlaced((prev) => [...prev, piece]);
  }

  function removePiece(piece: PromptPiece) {
    setPlaced((prev) => prev.filter((p) => p.id !== piece.id));
  }

  function submit() {
    if (placed.length < 3) return;

    // count how many required pieces are placed
    const requiredTotal = scenario.pieces.filter((p) => p.required).length;
    const requiredPlaced = placed.filter((p) => p.required).length;
    const missing = scenario.pieces.filter((p) => p.required && !placed.find((pl) => pl.id === p.id));

    let xp: number;
    let message: string;

    if (requiredPlaced === requiredTotal) {
      xp = 100;
      message = "Perfect prompt! 🎯";
    } else if (requiredPlaced >= Math.ceil(requiredTotal / 2)) {
      xp = 60;
      message = "Good start! 👍";
    } else {
      xp = 20;
      message = "Needs more detail. 📝";
    }

    addXP(xp);
    awardBadge("prompt-builder", "Prompt Builder", "Complete the Build-a-Prompt game", "✍️");
    const newHigh = saveHighScore("build-a-prompt", xp);
    setResult({ xp, message, missingPieces: missing, newHigh });
    setShowToast(true);
  }

  // output preview: based on number of placed pieces, capped at 6
  const outputKey = Math.min(placed.length, 6) as keyof typeof scenario.outputs;
  const outputPreview = scenario.outputs[outputKey];

  if (result) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#0f0f12" }}>
        <GameHeader title="Build-a-Prompt" />
        <main className="max-w-lg mx-auto px-4 pb-10">
          <div
            className="rounded-3xl p-8 text-center shadow-2xl mb-6"
            style={{ backgroundColor: "#1a1a2e", border: "1px solid rgba(212,83,126,0.3)" }}
          >
            <div className="text-5xl mb-3">
              {result.xp === 100 ? "🎯" : result.xp === 60 ? "👍" : "📝"}
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: "#ffffff" }}>
              {result.message}
            </h2>
            <div
              className="inline-flex items-center gap-2 text-2xl font-bold px-5 py-2 rounded-2xl my-4"
              style={{ backgroundColor: "rgba(251,191,36,0.15)", color: "#fbbf24" }}
            >
              +{result.xp} XP
            </div>
            {result.newHigh ? (
              <div className="mb-2 text-sm font-bold" style={{ color: "#fbbf24" }}>🏆 New high score!</div>
            ) : getHighScore("build-a-prompt") > 0 && (
              <div className="mb-2 text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>Best: {getHighScore("build-a-prompt")} XP</div>
            )}

            {result.missingPieces.length > 0 && (
              <div className="text-left mt-4">
                <p className="text-sm font-semibold mb-2" style={{ color: "rgba(255,255,255,0.55)" }}>
                  You missed these key pieces:
                </p>
                <ul className="space-y-2">
                  {result.missingPieces.map((p) => (
                    <li
                      key={p.id}
                      className="flex items-center gap-2 text-sm px-3 py-2 rounded-xl"
                      style={{ backgroundColor: "rgba(255,107,107,0.1)", color: "#ff6b6b" }}
                    >
                      <XCircle size={14} />
                      {p.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={reset}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold"
              style={{ backgroundColor: "#d4537e", color: "#ffffff" }}
            >
              <RotateCcw size={18} />
              Try Another
            </button>
            <button
              onClick={() => navigate("/games")}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold"
              style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)" }}
            >
              <ArrowLeft size={18} />
              Back to Games
            </button>
          </div>
        </main>
        <XPToast amount={result.xp} visible={showToast} />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0f0f12" }}>
      <GameHeader title="Build-a-Prompt" subtitle="Tap pieces to build the best prompt" />

      <main className="max-w-lg mx-auto px-4 pb-10 space-y-5">
        {/* Goal banner */}
        <div
          className="rounded-2xl px-5 py-4"
          style={{ backgroundColor: "rgba(212,83,126,0.12)", border: "1px solid rgba(212,83,126,0.3)" }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#d4537e" }}>
            Your goal
          </p>
          <p className="font-semibold" style={{ color: "#ffffff" }}>
            {scenario.goal}
          </p>
        </div>

        {/* Drop zone */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>
            Your prompt
          </p>
          <div
            className="min-h-[72px] rounded-2xl px-4 py-3 flex flex-wrap gap-2 items-start"
            style={{
              border: "2px dashed rgba(212,83,126,0.35)",
              backgroundColor: "rgba(212,83,126,0.04)",
            }}
          >
            {placed.length === 0 ? (
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>
                Tap pieces below to add them here…
              </p>
            ) : (
              placed.map((p) => (
                <button
                  key={p.id}
                  onClick={() => removePiece(p)}
                  className="px-3 py-1 rounded-full text-sm font-medium transition-opacity hover:opacity-70"
                  style={{
                    backgroundColor: p.required ? "rgba(212,83,126,0.25)" : "rgba(251,191,36,0.15)",
                    color: p.required ? "#f472b6" : "#fbbf24",
                    border: `1px solid ${p.required ? "rgba(212,83,126,0.4)" : "rgba(251,191,36,0.3)"}`,
                  }}
                >
                  {p.text} ✕
                </button>
              ))
            )}
          </div>
        </div>

        {/* AI output preview */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>
            AI output preview
          </p>
          <div
            className="rounded-2xl px-4 py-3 text-sm italic leading-relaxed min-h-[52px] transition-all"
            style={{
              backgroundColor: "#1a1a2e",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.65)",
            }}
          >
            {outputPreview}
          </div>
        </div>

        {/* Piece chips */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>
            Available pieces
          </p>
          <div className="flex flex-wrap gap-2">
            {scenario.pieces.map((p) => {
              const isUsed = !!placed.find((pl) => pl.id === p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => !isUsed && addPiece(p)}
                  disabled={isUsed}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                  style={{
                    backgroundColor: isUsed
                      ? "rgba(255,255,255,0.04)"
                      : p.required
                      ? "rgba(212,83,126,0.15)"
                      : "rgba(251,191,36,0.1)",
                    color: isUsed
                      ? "rgba(255,255,255,0.2)"
                      : p.required
                      ? "#f472b6"
                      : "#fbbf24",
                    border: isUsed
                      ? "1px solid rgba(255,255,255,0.08)"
                      : `1px solid ${p.required ? "rgba(212,83,126,0.35)" : "rgba(251,191,36,0.25)"}`,
                    cursor: isUsed ? "default" : "pointer",
                  }}
                >
                  {p.text}
                </button>
              );
            })}
          </div>
          <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.25)" }}>
            Pink = required · Gold = optional · Tap placed chips to remove
          </p>
        </div>

        {/* Submit */}
        <button
          onClick={submit}
          disabled={placed.length < 3}
          className="w-full py-4 rounded-2xl font-bold text-base transition-opacity hover:opacity-90 disabled:opacity-30"
          style={{ backgroundColor: "#d4537e", color: "#ffffff" }}
        >
          Submit Prompt ({placed.length} piece{placed.length !== 1 ? "s" : ""})
        </button>
      </main>

      {/* Player's chosen character */}
      <Link
        to="/choose-character"
        className="fixed top-24 right-6 z-40 block hover:opacity-80 transition-opacity"
        title="Change your character"
      >
        <CharacterMascot character={getUserData()?.selectedCharacter} size={64} equipped={getEquippedItemIds()} />
      </Link>
    </div>
  );
}
