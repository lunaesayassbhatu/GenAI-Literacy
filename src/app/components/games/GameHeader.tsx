import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Zap } from "lucide-react";

interface GameHeaderProps {
  title: string;
  subtitle?: string;
  xp?: number;
  showXP?: boolean;
}

export function GameHeader({ title, subtitle, xp = 0, showXP = false }: GameHeaderProps) {
  const navigate = useNavigate();

  return (
    <div
      className="flex items-center justify-between gap-4 px-4 py-4 max-w-4xl mx-auto w-full"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
    >
      <Link to="/home" className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0">
        <span className="hidden sm:inline text-sm font-bold" style={{ color: "#FFC627" }}>
          ASU GenAI Lab
        </span>
      </Link>

      <button
        onClick={() => navigate("/games")}
        className="flex items-center gap-2 px-3 py-2 rounded-xl transition-colors flex-shrink-0"
        style={{ color: "rgba(255,255,255,0.55)", backgroundColor: "rgba(255,255,255,0.06)" }}
      >
        <ArrowLeft size={18} />
        <span className="text-sm font-medium hidden sm:inline">Games</span>
      </button>

      <div className="text-center flex-1 min-w-0">
        <h1 className="text-lg font-bold truncate" style={{ color: "#ffffff" }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.45)" }}>
            {subtitle}
          </p>
        )}
      </div>

      <div
        className="flex items-center gap-1 px-3 py-2 rounded-xl flex-shrink-0"
        style={{
          backgroundColor: showXP ? "rgba(251,191,36,0.15)" : "transparent",
          color: showXP ? "#fbbf24" : "transparent",
          minWidth: 64,
          justifyContent: "center",
        }}
      >
        {showXP && (
          <>
            <Zap size={16} />
            <span className="text-sm font-bold">{xp} XP</span>
          </>
        )}
      </div>
    </div>
  );
}
