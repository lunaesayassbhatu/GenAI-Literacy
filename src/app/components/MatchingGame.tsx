import { useState, useEffect } from "react";
import { Header } from "./Header";
import { DolphinMascot } from "./DolphinMascot";
import { FloatingWave } from "./FloatingWave";
import { CharacterMascot } from "./CharacterMascot";
import { CheckCircle2, XCircle, RotateCcw, Trophy } from "lucide-react";
import { awardBadge, addXP, saveHighScore, getUserData } from "../utils/userData";
import { motion } from "motion/react";
import confetti from "canvas-confetti";
import { useTheme } from "../utils/themeContext";

interface GameCard {
  id: string;
  text: string;
  category: "appropriate" | "inappropriate";
  matched: boolean;
}

const GAME_CARDS: Omit<GameCard, "matched">[] = [
  {
    id: "1",
    text: "Use AI to write your entire essay",
    category: "inappropriate"
  },
  {
    id: "2",
    text: "Ask AI for help brainstorming ideas",
    category: "appropriate"
  },
  {
    id: "3",
    text: "Copy AI-generated code without understanding it",
    category: "inappropriate"
  },
  {
    id: "4",
    text: "Use AI to check grammar and spelling",
    category: "appropriate"
  },
  {
    id: "5",
    text: "Submit AI-generated work as your own",
    category: "inappropriate"
  },
  {
    id: "6",
    text: "Use AI to explain difficult concepts",
    category: "appropriate"
  },
  {
    id: "7",
    text: "Ask AI to do your research without verification",
    category: "inappropriate"
  },
  {
    id: "8",
    text: "Use AI to create study outlines",
    category: "appropriate"
  }
];

export function MatchingGame() {
  const [cards, setCards] = useState<GameCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "correct" | "incorrect"; message: string } | null>(null);
  const [waveMessage, setWaveMessage] = useState("Let's go! Match the cards by category.");
  const [waveExpression, setWaveExpression] = useState<"default" | "celebrate" | "hint">("default");
  const { theme } = useTheme();

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    const shuffled = [...GAME_CARDS]
      .map(card => ({ ...card, matched: false }))
      .sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setSelectedCard(null);
    setScore(0);
    setAttempts(0);
    setGameComplete(false);
    setFeedback(null);
    setWaveMessage("Let's go! Match the cards by category.");
    setWaveExpression("default");
  };

  const handleCardClick = (cardId: string, category: "appropriate" | "inappropriate") => {
    if (!selectedCard) {
      setSelectedCard(cardId);
      return;
    }

    if (selectedCard === cardId) {
      setSelectedCard(null);
      return;
    }

    const firstCard = cards.find(c => c.id === selectedCard);
    const secondCard = cards.find(c => c.id === cardId);

    if (!firstCard || !secondCard) return;

    setAttempts(prev => prev + 1);

    if (firstCard.category === secondCard.category) {
      // Correct match
      const earnedXP = 30;
      setScore(prev => prev + 10);
      addXP(earnedXP);
      
      setCards(prev =>
        prev.map(c =>
          c.id === firstCard.id || c.id === secondCard.id
            ? { ...c, matched: true }
            : c
        )
      );

      setFeedback({
        type: "correct",
        message: `Great job! Both are ${category === "appropriate" ? "appropriate" : "inappropriate"} uses of AI.`
      });

      setWaveMessage(`🎉 Yes! You've got it — +${earnedXP} XP earned!`);
      setWaveExpression("celebrate");

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });

      // Check if game is complete
      const remainingCards = cards.filter(c => c.id !== firstCard.id && c.id !== secondCard.id && !c.matched);
      if (remainingCards.length === 0) {
        setGameComplete(true);
        awardBadge("game-master", "Game Master", "Completed the matching game", "🎮");
        const completeXP = 100;
        const totalXP = (score + 10) * 3 + completeXP;
        setIsNewHighScore(saveHighScore("matching", totalXP));
        addXP(completeXP);
        setWaveMessage(`Amazing work! You just leveled up your AI literacy! +${completeXP} XP!`);
        setWaveExpression("celebrate");
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.6 }
        });
      }
    } else {
      // Incorrect match
      setFeedback({
        type: "incorrect",
        message: "Not quite! Try to match cards from the same category."
      });
      setWaveMessage("No worries! Think about what makes a use appropriate or inappropriate.");
      setWaveExpression("hint");
    }

    setTimeout(() => {
      setSelectedCard(null);
      setFeedback(null);
      if (!gameComplete) {
        setWaveMessage("Let's go! Match the cards by category.");
        setWaveExpression("default");
      }
    }, 2000);
  };

  const getCardStyle = (card: GameCard) => {
    if (card.matched) {
      return {
        backgroundColor: card.category === "appropriate" ? "rgba(75,183,196,0.2)" : "rgba(232,84,122,0.2)",
        borderColor: card.category === "appropriate" ? "#4AB7C4" : "#E8547A",
        opacity: 0.6
      };
    }

    if (selectedCard === card.id) {
      return {
        backgroundColor: "rgba(255,198,39,0.2)",
        borderColor: "#FFC627",
        transform: "scale(1.05)"
      };
    }

    return {
      backgroundColor: "#1A0C10",
      borderColor: "rgba(255,198,39,0.13)"
    };
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#0D0508" }}
    >
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Game Header */}
        <div
          className="rounded-2xl shadow-lg p-8 mb-8"
          style={{
            backgroundColor: "#1A0C10",
            border: "1px solid rgba(255,198,39,0.13)"
          }}
        >
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-4">
              <DolphinMascot size={80} />
              <div>
                <h1 className="text-3xl mb-2" style={{ color: '#F0E0E4' }}>
                  AI Usage Matching Game 🎮
                </h1>
                <p style={{ color: '#7A5A62' }}>
                  Match appropriate uses together and inappropriate uses together!
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div
                className="text-center p-4 rounded-lg"
                style={{ backgroundColor: 'rgba(255,198,39,0.1)' }}
              >
                <div className="text-2xl mb-1" style={{ color: '#FFC627' }}>
                  {score}
                </div>
                <div className="text-sm" style={{ color: '#7A5A62' }}>Score</div>
              </div>
              <div
                className="text-center p-4 rounded-lg"
                style={{ backgroundColor: 'rgba(139,26,46,0.2)' }}
              >
                <div className="text-2xl mb-1" style={{ color: '#E8547A' }}>
                  {attempts}
                </div>
                <div className="text-sm" style={{ color: '#7A5A62' }}>Attempts</div>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg flex items-center gap-3`}
            style={{
              backgroundColor: feedback.type === "correct" ? "rgba(75,183,196,0.2)" : "rgba(232,84,122,0.2)",
              border: `1px solid ${feedback.type === "correct" ? "#4AB7C4" : "#E8547A"}`
            }}
          >
            {feedback.type === "correct" ? (
              <CheckCircle2 style={{ color: '#4AB7C4' }} size={24} />
            ) : (
              <XCircle style={{ color: '#E8547A' }} size={24} />
            )}
            <span style={{ color: feedback.type === "correct" ? '#4AB7C4' : '#E8547A' }}>
              {feedback.message}
            </span>
          </motion.div>
        )}

        {/* Game Complete */}
        {gameComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-8 rounded-lg text-center"
            style={{
              background: 'linear-gradient(135deg, #8B1A2E 0%, #6B1530 100%)'
            }}
          >
            <Trophy size={48} className="mx-auto mb-4" style={{ color: '#FFC627' }} />
            <h2 className="text-3xl mb-2" style={{ color: '#F0E0E4' }}>Congratulations! 🎉</h2>
            <p className="text-lg mb-4" style={{ color: '#F0E0E4' }}>
              You've completed the game with a score of {score}!
            </p>
            <p className="mb-4" style={{ color: '#FFC627' }}>You've earned the "Game Master" badge! 🎮</p>
            <button
              onClick={resetGame}
              className="px-6 py-3 rounded-lg flex items-center gap-2 mx-auto transition-all hover:shadow-lg"
              style={{ backgroundColor: '#FFC627', color: '#0D0508' }}
            >
              <RotateCcw size={20} />
              <span>Play Again</span>
            </button>
          </motion.div>
        )}

        {/* Instructions */}
        <div
          className="rounded-2xl shadow-lg p-6 mb-8"
          style={{
            backgroundColor: "#1A0C10",
            border: "1px solid rgba(255,198,39,0.13)"
          }}
        >
          <h3 className="text-lg mb-3" style={{ color: '#F0E0E4' }}>
            📖 How to Play
          </h3>
          <ol className="space-y-2" style={{ color: '#7A5A62' }}>
            <li>1. Click on a card to select it</li>
            <li>2. Click on another card to try to match it</li>
            <li>
              3. Match <strong style={{ color: '#4AB7C4' }}>appropriate uses together</strong> and{" "}
              <strong style={{ color: '#E8547A' }}>inappropriate uses together</strong>
            </li>
            <li>4. Clear all cards to win the game!</li>
          </ol>
        </div>

        {/* Game Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {cards.map((card) => (
            <motion.button
              key={card.id}
              onClick={() => !card.matched && handleCardClick(card.id, card.category)}
              disabled={card.matched}
              className="p-6 rounded-xl border-2 transition-all min-h-[140px] flex items-center justify-center text-center disabled:cursor-not-allowed"
              style={getCardStyle(card)}
              whileHover={!card.matched ? { scale: 1.05 } : {}}
              whileTap={!card.matched ? { scale: 0.95 } : {}}
            >
              <p style={{ color: '#F0E0E4' }}>{card.text}</p>
            </motion.button>
          ))}
        </div>

        {/* Learning Points */}
        <div
          className="rounded-2xl shadow-lg p-8"
          style={{
            backgroundColor: "#1A0C10",
            border: "1px solid rgba(255,198,39,0.13)"
          }}
        >
          <h3 className="text-xl mb-4" style={{ color: '#F0E0E4' }}>
            🧠 Key Learning Points
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="flex items-center gap-2 mb-3" style={{ color: '#4AB7C4' }}>
                <CheckCircle2 size={20} />
                Appropriate AI Use
              </h4>
              <ul className="space-y-2 text-sm" style={{ color: '#7A5A62' }}>
                <li>• Brainstorming and ideation</li>
                <li>• Grammar and spell checking</li>
                <li>• Explaining difficult concepts</li>
                <li>• Creating study outlines</li>
                <li>• Getting feedback on drafts</li>
              </ul>
            </div>
            <div>
              <h4 className="flex items-center gap-2 mb-3" style={{ color: '#E8547A' }}>
                <XCircle size={20} />
                Inappropriate AI Use
              </h4>
              <ul className="space-y-2 text-sm" style={{ color: '#7A5A62' }}>
                <li>• Writing entire assignments</li>
                <li>• Copying without understanding</li>
                <li>• Plagiarizing AI content</li>
                <li>• Replacing your own thinking</li>
                <li>• Unverified research claims</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Wave Mascot */}
      <FloatingWave message={waveMessage} expression={waveExpression} />

      {/* Player's chosen character */}
      <div className="fixed top-24 right-6 z-40">
        <CharacterMascot character={getUserData()?.selectedCharacter} size={64} />
      </div>
    </div>
  );
}