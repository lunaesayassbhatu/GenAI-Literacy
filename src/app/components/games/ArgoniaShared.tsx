import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, RotateCcw, Zap } from "lucide-react";
import { GameHeader } from "./GameHeader";
import { ArgoniaFigure3D, type FigureKind } from "./ArgoniaFigure3D";
import { CharacterMascot } from "../CharacterMascot";
import { FloatingWave } from "../FloatingWave";
import { getUserData } from "../../utils/userData";
import { getEquippedItemIds } from "../../utils/itemsSystem";
import type { Clue } from "../../data/argoniaInvestigations";

// Pieces shared by the two Argonia investigation games (the Engineer's Workshop and the Professor's Lab).

export const ACCENT = "#8b5cf6";
export const GOLD = "#FFC627";
export const XP_GOOD_CHOICE = 20;

/** Page background, header, the player's character and the Wave guide. */
export function Shell({ title, subtitle, wave, showWave = true, children }: { title: string; subtitle?: string; wave: string; showWave?: boolean; children: ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #120a1f 0%, #1b0f2e 60%, #1A0A0F 100%)" }}>
      <GameHeader title={title} subtitle={subtitle} />
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>

      <style>{`@keyframes argEnter { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`}</style>

      <Link to="/choose-character" className="fixed top-24 right-6 z-40 hidden sm:block hover:opacity-80 transition-opacity" title="Change your character">
        <CharacterMascot character={getUserData()?.selectedCharacter} size={64} equipped={getEquippedItemIds()} />
      </Link>

      <FloatingWave message={wave} expression="default" show={showWave} />
    </div>
  );
}

/** The card every story step sits in. */
export function Card({ children, k }: { children: ReactNode; k: string | number }) {
  return (
    <div
      key={k}
      className="max-w-2xl mx-auto rounded-3xl p-7 shadow-2xl"
      style={{ backgroundColor: "rgba(255,255,255,0.05)", border: `1px solid ${ACCENT}55`, animation: "argEnter 0.35s ease both" }}
    >
      {children}
    </div>
  );
}

export function StepBar({ index, total }: { index: number; total: number }) {
  return (
    <div className="flex gap-1.5 max-w-2xl mx-auto mb-5" aria-label={`Step ${index + 1} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className="h-1.5 flex-1 rounded-full" style={{ backgroundColor: i <= index ? ACCENT : "rgba(255,255,255,0.12)" }} />
      ))}
    </div>
  );
}

export function Heading({ figure, talking = false, children }: { figure?: FigureKind; talking?: boolean; children: ReactNode }) {
  if (!figure) return <>{children}</>;
  const isCodex = figure === "codex";
  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-1">
      <div className="flex-shrink-0 rounded-2xl" style={{ background: "radial-gradient(circle at 50% 70%, rgba(139,92,246,0.28), rgba(139,92,246,0) 70%)" }}>
        <ArgoniaFigure3D kind={figure} width={isCodex ? 170 : 150} height={isCodex ? 150 : 190} talking={talking} />
      </div>
      <div className="flex-1 min-w-0 w-full">{children}</div>
    </div>
  );
}

export function Story({ title, text }: { title: string; text: string }) {
  return (
    <>
      <h3 className="text-xl font-bold mb-2" style={{ color: GOLD }}>{title}</h3>
      <p className="leading-relaxed" style={{ color: "rgba(255,255,255,0.88)", fontFamily: "Georgia, serif", fontSize: 17 }}>{text}</p>
    </>
  );
}

export function Speaker({ name, emoji }: { name: string; emoji: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-3" style={{ backgroundColor: "rgba(255,198,39,0.15)", color: GOLD }}>
      {emoji} {name}
    </span>
  );
}

export function NextButton({ onClick, disabled, wide, children }: { onClick: () => void; disabled?: boolean; wide?: boolean; children: ReactNode }) {
  return (
    <div className={`flex justify-end mx-auto mt-5 ${wide ? "max-w-4xl" : "max-w-2xl"}`}>
      <button
        onClick={onClick}
        disabled={disabled}
        className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:scale-100"
        style={{ backgroundColor: ACCENT, color: "#ffffff" }}
      >
        {children}
        <ArrowRight size={18} />
      </button>
    </div>
  );
}

export interface Choice { text: string; good: boolean; feedback: string }

/** A multiple-choice step: the player picks once, and sees why. */
export function ChoiceList({ options, picked, onPick }: { options: Choice[]; picked: number | null; onPick: (i: number) => void }) {
  return (
    <>
      <div className="space-y-3">
        {options.map((o, i) => {
          const chosen = picked === i;
          const revealGood = picked !== null && o.good;
          return (
            <button
              key={i}
              onClick={() => onPick(i)}
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
            backgroundColor: options[picked].good ? "rgba(74,222,128,0.1)" : "rgba(255,107,107,0.1)",
            border: `1px solid ${options[picked].good ? "#4ade80" : "#ff6b6b"}`,
          }}
        >
          <p className="font-bold mb-1" style={{ color: options[picked].good ? "#4ade80" : "#ff6b6b" }}>
            {options[picked].good ? `Good call! +${XP_GOOD_CHOICE} XP` : "Not the best move"}
          </p>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>{options[picked].feedback}</p>
        </div>
      )}
    </>
  );
}

/** The end-of-game screen: XP, the clue, what to remember. */
export function ResultCard({
  gameTitle,
  score,
  awarded,
  clue,
  takeaway,
  onReplay,
  nextTo,
  nextLabel,
}: {
  gameTitle: string;
  score: number;
  awarded: number;
  clue: Clue;
  takeaway: string;
  onReplay: () => void;
  nextTo?: string;
  nextLabel?: string;
}) {
  return (
    <div className="max-w-2xl mx-auto rounded-3xl p-8 text-center shadow-2xl" style={{ backgroundColor: "rgba(255,255,255,0.05)", border: `1px solid ${ACCENT}66`, animation: "argEnter 0.35s ease both" }}>
      <div className="text-6xl mb-3">🏆</div>
      <h2 className="text-2xl font-bold mb-1" style={{ color: "#ffffff" }}>Investigation complete!</h2>
      <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,0.6)" }}>{gameTitle}</p>
      <div className="inline-flex items-center gap-2 text-3xl font-bold py-3 px-6 rounded-2xl mb-2" style={{ backgroundColor: "rgba(251,191,36,0.15)", color: "#fbbf24" }}>
        <Zap size={26} />
        {awarded > 0 ? `+${awarded} XP` : "No new XP"}
      </div>
      <p className="text-xs mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>
        {awarded > 0 ? `You scored ${score} in this game.` : `Replays are practice only. You scored ${score} this time.`}
      </p>

      <div className="text-left rounded-xl p-4 mb-4" style={{ backgroundColor: "rgba(255,198,39,0.1)", border: `1px dashed ${GOLD}` }}>
        <div className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: GOLD }}>New clue</div>
        <div className="font-bold" style={{ color: "#ffffff" }}>📜 {clue.title}</div>
        <p className="text-sm mt-1 leading-relaxed" style={{ color: "rgba(255,255,255,0.85)" }}>{clue.text}</p>
      </div>

      <div className="text-left rounded-xl p-4 mb-6" style={{ backgroundColor: "rgba(139,92,246,0.12)", border: `1px solid ${ACCENT}55` }}>
        <div className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: ACCENT }}>What to remember</div>
        <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.85)" }}>{takeaway}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {nextTo && (
          <Link to={nextTo} className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold hover:opacity-90" style={{ backgroundColor: ACCENT, color: "#ffffff" }}>
            {nextLabel} <ArrowRight size={18} />
          </Link>
        )}
        <Link to="/games" className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold hover:opacity-90" style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "#ffffff" }}>
          <ArrowLeft size={18} /> Back to games
        </Link>
        <button onClick={onReplay} className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold hover:opacity-90" style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.8)" }}>
          <RotateCcw size={18} /> Replay
        </button>
      </div>
    </div>
  );
}
