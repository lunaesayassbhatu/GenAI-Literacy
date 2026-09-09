import { Link } from "react-router-dom";
import { Header } from "./Header";
import { useTheme } from "../utils/themeContext";
import { getHighScore } from "../utils/userData";
import { motion } from "motion/react";
import { Gamepad2, Puzzle, Brain, Target, Zap, Wand2, Trophy } from "lucide-react";

const GAME_OPTIONS = [
  {
    id: "ethics",
    name: "AI Ethics Matching",
    description: "Match AI scenarios with their ethical concerns in a card-flip memory game",
    icon: <Puzzle size={40} />,
    color: "#E8547A",
    xpReward: 50,
    path: "/games/ethics",
    difficulty: "Easy",
    available: true,
  },
  {
    id: "fact-or-myth",
    name: "Fact or Myth",
    description: "Swipe right for facts, left for myths — 60 seconds on the clock",
    icon: <Brain size={40} />,
    color: "#4AB7C4",
    xpReward: 75,
    path: "/games/fact-or-myth",
    difficulty: "Medium",
    available: true,
  },
  {
    id: "build-a-prompt",
    name: "Build-a-Prompt",
    description: "Assemble the perfect AI prompt from pieces and watch the output improve",
    icon: <Target size={40} />,
    color: "#FFC627",
    xpReward: 100,
    path: "/games/build-a-prompt",
    difficulty: "Hard",
    available: true,
  },
  {
    id: "sandbox",
    name: "Prompt Sandbox",
    description: "Write your own prompt and get scored on clarity, audience, and format",
    icon: <Wand2 size={40} />,
    color: "#FF8A50",
    xpReward: 150,
    path: "/games/sandbox",
    difficulty: "Expert",
    available: true,
  },
];

export function Games() {
  const { colors } = useTheme();

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: colors.textPrimary }}>
            Learning Games
          </h1>
          <p style={{ color: colors.textSecondary }}>
            Test your knowledge and earn XP through interactive games
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {GAME_OPTIONS.map((game, idx) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={game.available ? { scale: 1.02 } : {}}
            >
              {game.available ? (
                <Link
                  to={game.path}
                  className="block rounded-xl shadow-lg p-8 transition-all hover:shadow-2xl"
                  style={{
                    backgroundColor: colors.cardBackground,
                    border: `2px solid ${game.color}`,
                  }}
                >
                  <div className="flex items-start gap-6">
                    <div
                      className="w-20 h-20 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${game.color}20`, color: game.color }}
                    >
                      {game.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="text-2xl font-semibold" style={{ color: colors.textPrimary }}>
                          {game.name}
                        </h3>
                        <span
                          className="px-3 py-1 rounded-full text-xs uppercase tracking-wider font-semibold flex-shrink-0"
                          style={{ backgroundColor: `${game.color}20`, color: game.color }}
                        >
                          {game.difficulty}
                        </span>
                      </div>
                      <p className="mb-4" style={{ color: colors.textSecondary }}>
                        {game.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2" style={{ color: colors.accentGold }}>
                          <Zap size={18} />
                          <span className="font-semibold">+{game.xpReward} XP</span>
                        </div>
                        {getHighScore(game.id) > 0 && (
                          <div className="flex items-center gap-1 text-sm font-semibold" style={{ color: colors.textSecondary }}>
                            <Trophy size={14} />
                            <span>Best: {getHighScore(game.id)} XP</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-6" style={{ borderTop: `1px solid ${colors.cardBorder}` }}>
                    <div
                      className="flex items-center justify-center gap-2 py-3 rounded-lg font-semibold"
                      style={{ backgroundColor: game.color, color: "#FFFFFF" }}
                    >
                      <Gamepad2 size={20} />
                      <span>Play Now</span>
                    </div>
                  </div>
                </Link>
              ) : (
                <div
                  className="rounded-xl shadow-lg p-8 opacity-50"
                  style={{
                    backgroundColor: colors.cardBackground,
                    border: `1px solid ${colors.cardBorder}`,
                  }}
                >
                  <div className="flex items-start gap-6">
                    <div
                      className="w-20 h-20 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "rgba(122,90,98,0.2)", color: colors.textSecondary }}
                    >
                      {game.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="text-2xl font-semibold" style={{ color: colors.textPrimary }}>
                          {game.name}
                        </h3>
                        <span
                          className="px-3 py-1 rounded-full text-xs uppercase tracking-wider font-semibold flex-shrink-0"
                          style={{ backgroundColor: "rgba(122,90,98,0.2)", color: colors.textSecondary }}
                        >
                          {game.difficulty}
                        </span>
                      </div>
                      <p className="mb-4" style={{ color: colors.textSecondary }}>
                        {game.description}
                      </p>
                      <div className="flex items-center gap-2" style={{ color: colors.textSecondary }}>
                        <Zap size={18} />
                        <span className="font-semibold">+{game.xpReward} XP</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-6" style={{ borderTop: `1px solid ${colors.cardBorder}` }}>
                    <div
                      className="flex items-center justify-center gap-2 py-3 rounded-lg font-semibold"
                      style={{ backgroundColor: "rgba(122,90,98,0.2)", color: colors.textSecondary }}
                    >
                      <span>🔒 Coming Soon</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Info Box */}
        <div
          className="mt-12 rounded-xl shadow-lg p-6"
          style={{
            backgroundColor: colors.hintBoxBg,
            border: `1px solid ${colors.hintBoxBorder}`,
          }}
        >
          <p style={{ color: colors.textPrimary }}>
            💡 <strong style={{ color: colors.accentGold }}>Tip:</strong> Complete learning modules
            first to maximize your game performance and XP earnings!
          </p>
        </div>
      </main>
    </div>
  );
}
