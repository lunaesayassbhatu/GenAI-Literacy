import { useState } from "react";
import { GameHeader } from "./GameHeader";
import { XPToast } from "./XPToast";
import { CharacterMascot } from "../CharacterMascot";
import { MISSIONS, Mission } from "../../data/gameData";
import { addXP, awardBadge, saveHighScore, getHighScore, getUserData } from "../../utils/userData";
import { getEquippedItemIds } from "../../utils/itemsSystem";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";

interface CheckResult {
  key: string;
  label: string;
  passed: boolean;
}

interface ScoreResult {
  results: CheckResult[];
  passed: number;
  total: number;
  xp: number;
  tier: string;
}

function scorePrompt(prompt: string, checks: Mission["checks"]): ScoreResult {
  const lower = prompt.toLowerCase();
  const results: CheckResult[] = Object.entries(checks).map(([key, check]) => ({
    key,
    label: check.label,
    passed: check.keywords.some((kw) => lower.includes(kw)),
  }));
  const passed = results.filter((r) => r.passed).length;
  const total = results.length;

  let xp: number;
  let tier: string;
  if (passed === 3) {
    xp = 150;
    tier = "Excellent prompt! 🎯";
  } else if (passed === 2) {
    xp = 100;
    tier = "Good prompt! Almost there 👍";
  } else if (passed === 1) {
    xp = 50;
    tier = "Getting there — needs more detail 📝";
  } else {
    xp = 0;
    tier = "Too vague — try again 🤔";
  }

  return { results, passed, total, xp, tier };
}

export function PromptSandboxGame() {
  const navigate = useNavigate();
  const [missionIdx, setMissionIdx] = useState(0);
  const [prompt, setPrompt] = useState("");
  const [score, setScore] = useState<ScoreResult | null>(null);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const mission = MISSIONS[missionIdx];

  function submit() {
    if (prompt.trim().length < 10) return;
    const result = scorePrompt(prompt, mission.checks);
    addXP(result.xp);
    awardBadge("prompt-engineer", "Prompt Engineer", "Complete the Prompt Sandbox game", "🧪");
    setIsNewHighScore(saveHighScore("sandbox", result.xp));
    setScore(result);
    setShowToast(true);
  }

  function nextMission() {
    setMissionIdx((prev) => (prev + 1) % MISSIONS.length);
    setPrompt("");
    setScore(null);
    setShowToast(false);
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0f0f12" }}>
      <GameHeader title="Prompt Sandbox" subtitle={`Mission ${missionIdx + 1} of ${MISSIONS.length}`} />

      <main className="max-w-lg mx-auto px-4 pb-10 space-y-5">
        {/* Mission card */}
        <div
          className="rounded-2xl p-5"
          style={{ backgroundColor: "#1a1a2e", border: "1px solid rgba(212,83,126,0.25)" }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#d4537e" }}>
            Mission
          </p>
          <h2 className="text-lg font-bold mb-2" style={{ color: "#ffffff" }}>
            {mission.title}
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
            {mission.description}
          </p>
        </div>

        {/* Tip */}
        <div
          className="rounded-xl px-4 py-3 text-sm"
          style={{ backgroundColor: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)", color: "rgba(255,255,255,0.55)" }}
        >
          💡 Remember: <strong style={{ color: "#fbbf24" }}>who is the audience?</strong> What's the topic? What format do you want?
        </div>

        {/* Textarea */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>
            Your prompt
          </label>
          <textarea
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={!!score}
            placeholder="Type your prompt here…"
            className="w-full rounded-2xl p-4 text-sm resize-none outline-none transition-colors"
            style={{
              backgroundColor: "#1a1a2e",
              border: "1px solid rgba(212,83,126,0.25)",
              color: "#ffffff",
              opacity: score ? 0.6 : 1,
            }}
          />
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>
            {prompt.length} characters
          </p>
        </div>

        {/* Submit button */}
        {!score && (
          <button
            onClick={submit}
            disabled={prompt.trim().length < 10}
            className="w-full py-4 rounded-2xl font-bold text-base transition-opacity hover:opacity-90 disabled:opacity-30"
            style={{ backgroundColor: "#d4537e", color: "#ffffff" }}
          >
            Submit Prompt
          </button>
        )}

        {/* Results */}
        {score && (
          <div
            className="rounded-3xl p-6 space-y-4"
            style={{ backgroundColor: "#1a1a2e", border: "1px solid rgba(212,83,126,0.3)" }}
          >
            {/* Checklist */}
            <div className="space-y-2">
              {score.results.map((r) => (
                <div
                  key={r.key}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium"
                  style={{
                    backgroundColor: r.passed ? "rgba(74,222,128,0.1)" : "rgba(255,107,107,0.08)",
                    color: r.passed ? "#4ade80" : "#ff6b6b",
                  }}
                >
                  {r.passed ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                  {r.label}
                </div>
              ))}
            </div>

            {/* Tier */}
            <div className="text-center py-2">
              <p className="text-xl font-bold" style={{ color: "#ffffff" }}>
                {score.tier}
              </p>
              {score.xp > 0 && (
                <p className="text-2xl font-bold mt-1" style={{ color: "#fbbf24" }}>
                  +{score.xp} XP
                </p>
              )}
              {isNewHighScore ? (
                <p className="text-sm font-bold mt-1" style={{ color: "#fbbf24" }}>🏆 New high score!</p>
              ) : getHighScore("sandbox") > 0 && (
                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>Best: {getHighScore("sandbox")} XP</p>
              )}
            </div>

            {/* Better version */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>
                A better version would be:
              </p>
              <div
                className="rounded-xl px-4 py-3 text-sm italic leading-relaxed"
                style={{ backgroundColor: "rgba(212,83,126,0.08)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(212,83,126,0.2)" }}
              >
                "{mission.examplePrompt}"
              </div>
            </div>

            {/* Why */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>
                Why this works:
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                {mission.why}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-2">
              {missionIdx < MISSIONS.length - 1 ? (
                <button
                  onClick={nextMission}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold"
                  style={{ backgroundColor: "#d4537e", color: "#ffffff" }}
                >
                  Try Next Mission
                  <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  onClick={nextMission}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold"
                  style={{ backgroundColor: "#d4537e", color: "#ffffff" }}
                >
                  Start Over
                </button>
              )}
              <button
                onClick={() => navigate("/games")}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold"
                style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)" }}
              >
                Back to Games
              </button>
            </div>
          </div>
        )}
      </main>

      <XPToast amount={score?.xp ?? 0} visible={showToast} />

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
