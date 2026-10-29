import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Header } from "./Header";
import { useTheme } from "../utils/themeContext";
import { getHighScore } from "../utils/userData";
import { motion } from "motion/react";
import { Gamepad2, Puzzle, Brain, Target, Zap, Wand2, Trophy, Scale, EyeOff, Leaf } from "lucide-react";
import { CITY_SPOTS, loadCityProgress } from "../data/argoniaCityData";

export interface GameOption {
  id: string;
  name: string;
  description: string;
  icon: ReactNode;
  color: string;
  xpReward: number;
  path: string;
  difficulty: string;
  available: boolean;
  /** Badge id awarded on completion — the source of truth for "is this game done". */
  badgeId: string;
}

export const GAME_OPTIONS: GameOption[] = [
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
    badgeId: "ethics-expert",
  },
  {
    id: "black-box",
    name: "Black Box Matching",
    description: "Match AI situations to what they actually mean for you, card-flip style",
    icon: <EyeOff size={40} />,
    color: "#06B6D4",
    xpReward: 60,
    path: "/games/black-box",
    difficulty: "Easy",
    available: true,
    badgeId: "black-box-skeptic",
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
    badgeId: "fact-or-myth-master",
  },
  {
    id: "bias",
    name: "AI Bias Matching",
    description: "Match real-world scenarios to the type of bias they reveal",
    icon: <Scale size={40} />,
    color: "#9D4EDD",
    xpReward: 60,
    path: "/games/bias",
    difficulty: "Medium",
    available: true,
    badgeId: "bias-detective",
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
    badgeId: "prompt-builder",
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
    badgeId: "prompt-engineer",
  },
  {
    id: "environment",
    name: "Environmental Impact",
    description: "Swipe right for facts, left for myths about AI's real energy and water cost",
    icon: <Leaf size={40} />,
    color: "#2E7D32",
    xpReward: 75,
    path: "/games/environment",
    difficulty: "Medium",
    available: true,
    badgeId: "eco-conscious",
  },
];

// Narrative-world concept demos — not part of GAME_OPTIONS since no world has
// been chosen yet. Shown in their own section so they stay out of progression,
// badges, and the Journey Map.
interface ShowcaseOption {
  id: string;
  name: string;
  world: string;
  description: string;
  color: string;
  path: string;
}

const SHOWCASE_GAMES: ShowcaseOption[] = [
  {
    id: "bank-portal",
    name: "The Bank Portal",
    world: "Grand Globe",
    description: "Swipe to decide if the portal's answer is trustworthy or a risky guess to verify.",
    color: "#d97706",
    path: "/showcase/bank-portal",
  },
  {
    id: "kings-notebook",
    name: "The King's Notebook",
    world: "Argonia",
    description: "Swipe to decide if the notebook's entry is reliable or needs verifying first.",
    color: "#7c3aed",
    path: "/showcase/kings-notebook",
  },
  {
    id: "dungeon-crawl",
    name: "Dungeon Crawl",
    world: "Mechanic Demo",
    description: "Walk around a dungeon with arrow keys/WASD — fight through creatures with FACT-or-MYTH claims.",
    color: "#eab308",
    path: "/showcase/dungeon-crawl",
  },
];

function CityFeature() {
  const found = loadCityProgress().found.length;
  const total = CITY_SPOTS.length;
  return (
    <Link
      to="/games/argonia/city"
      className="block mb-10 rounded-3xl p-5 md:p-6 transition-transform hover:scale-[1.01] shadow-xl"
      style={{ background: "linear-gradient(135deg, #1b2a5e 0%, #3a2a86 55%, #8c3a5a 100%)", border: "2px solid #8b5cf6" }}
    >
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="text-5xl">🏙️</div>
        <div className="flex-1">
          <div className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "#FFC627" }}>Click to explore · New</div>
          <h3 className="text-xl md:text-2xl font-bold mb-1" style={{ color: "#ffffff" }}>Explore the City of Argonia</h3>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>
            Take a guided tour of the whole city, then click its buildings, people and objects to find stories, clues and quick questions.
          </p>
          <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.7)" }}>{found} of {total} found</span>
        </div>
        <div className="px-6 py-3 rounded-xl font-bold flex-shrink-0 text-center" style={{ backgroundColor: "#FFC627", color: "#0D0508" }}>
          {found === 0 ? "Start exploring" : "Keep exploring"}
        </div>
      </div>
    </Link>
  );
}

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

        {/* Explore the city */}
        <CityFeature />

        <h2 className="text-xl font-semibold mb-4" style={{ color: colors.textPrimary }}>Practice games</h2>

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

        {/* Showcase — narrative-world concept demos, not decided/final */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-1" style={{ color: colors.textPrimary }}>
            Showcase Concepts
          </h2>
          <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
            Early demos exploring possible game worlds — not final, no world has been chosen yet.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {SHOWCASE_GAMES.map((game, idx) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Link
                  to={game.path}
                  className="block rounded-xl shadow-lg p-6 transition-all hover:shadow-2xl"
                  style={{
                    backgroundColor: colors.cardBackground,
                    border: `2px dashed ${game.color}`,
                  }}
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-xl font-semibold" style={{ color: colors.textPrimary }}>
                      {game.name}
                    </h3>
                    <span
                      className="px-3 py-1 rounded-full text-xs uppercase tracking-wider font-semibold flex-shrink-0"
                      style={{ backgroundColor: `${game.color}20`, color: game.color }}
                    >
                      {game.world}
                    </span>
                  </div>
                  <p style={{ color: colors.textSecondary }}>{game.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
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
