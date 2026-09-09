import { useNavigate } from "react-router-dom";
import { Zap, RotateCcw, ArrowLeft } from "lucide-react";

interface CompletionModalProps {
  xpEarned: number;
  message: string;
  onPlayAgain: () => void;
}

export function CompletionModal({ xpEarned, message, onPlayAgain }: CompletionModalProps) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.75)" }}>
      <div
        className="w-full max-w-sm rounded-3xl p-8 text-center shadow-2xl"
        style={{ backgroundColor: "#1a1a2e", border: "1px solid rgba(212,83,126,0.3)" }}
      >
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: "#ffffff" }}>
          {message}
        </h2>

        <div
          className="flex items-center justify-center gap-2 text-3xl font-bold my-6 py-4 rounded-2xl"
          style={{ backgroundColor: "rgba(251,191,36,0.15)", color: "#fbbf24" }}
        >
          <Zap size={28} />
          +{xpEarned} XP
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onPlayAgain}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#d4537e", color: "#ffffff" }}
          >
            <RotateCcw size={18} />
            Play Again
          </button>
          <button
            onClick={() => navigate("/games")}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold transition-opacity hover:opacity-80"
            style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)" }}
          >
            <ArrowLeft size={18} />
            Back to Games
          </button>
        </div>
      </div>
    </div>
  );
}
