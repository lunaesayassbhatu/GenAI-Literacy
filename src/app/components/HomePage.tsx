import { Link } from "react-router-dom";
import { Header } from "./Header";
import { getUserData } from "../utils/userData";
import { useTheme } from "../utils/themeContext";
import { motion } from "motion/react";
import { BookOpen, Gamepad2, Target, Lightbulb, Users, Award, Zap, Trophy, Star } from "lucide-react";
import { TOPICS } from "../data/topicsData";

export function HomePage() {
  const { colors } = useTheme();
  const userData = getUserData();

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.background }}
    >
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12 relative">
          {/* Welcome Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center pt-20 pb-8"
          >
            <div className="mb-4">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl"
                style={{ color: colors.textSecondary }}
              >
                {userData?.isReturningUser ? '👋 Welcome back,' : '🎉 Welcome,'}
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="text-5xl md:text-6xl font-bold mt-2"
                style={{ color: colors.accentGold }}
              >
                {userData?.username || 'Guest'}!
              </motion.h1>
            </div>
          </motion.div>

          {/* Main Title Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="rounded-2xl shadow-2xl p-12 text-center relative overflow-hidden mb-8"
            style={{
              background: 'linear-gradient(135deg, #8B1A2E 0%, #6B1530 100%)'
            }}
          >
            {/* Sparkle decorations */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-4 right-4"
            >
              <Star size={24} style={{ color: '#FFC627', opacity: 0.6 }} />
            </motion.div>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-4 left-4"
            >
              <Trophy size={28} style={{ color: '#FFC627', opacity: 0.6 }} />
            </motion.div>

            <h2 className="text-5xl md:text-6xl font-bold mb-4" style={{ color: '#FFC627' }}>
              ASU GenAI Lab
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: '#F0E0E4' }}>
              Master the art of using GenAI tools responsibly and effectively
            </p>

            {/* CTA Buttons */}
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                to="/learning-lab"
                className="group relative px-8 py-4 rounded-xl text-lg font-bold transition-all hover:scale-105 flex items-center gap-3 overflow-hidden"
                style={{
                  backgroundColor: colors.accentGold,
                  color: '#0D0508'
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20"
                  transition={{ duration: 0.3 }}
                />
                <BookOpen size={24} />
                <span>Start Learning</span>
                <Zap size={20} />
              </Link>
              <Link
                to="/games"
                className="group relative px-8 py-4 rounded-xl text-lg font-bold transition-all hover:scale-105 flex items-center gap-3"
                style={{
                  backgroundColor: 'rgba(255,198,39,0.2)',
                  border: `2px solid ${colors.accentGold}`,
                  color: '#F0E0E4'
                }}
              >
                <Gamepad2 size={24} />
                <span>Play Games</span>
                <Trophy size={20} />
              </Link>
            </div>
          </motion.div>

          {/* Topic Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="rounded-xl shadow-lg p-6"
            style={{
              backgroundColor: colors.cardBackground,
              border: `2px solid ${colors.cardBorder}`
            }}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Star size={20} style={{ color: colors.accentGold }} />
              <h3 className="text-lg font-bold uppercase tracking-wider" style={{ color: colors.textPrimary }}>
                Topics We Cover
              </h3>
              <Star size={20} style={{ color: colors.accentGold }} />
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {TOPICS.map((topic, idx) => (
                <motion.div
                  key={topic.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + idx * 0.1 }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full shadow-md cursor-pointer"
                  style={{
                    backgroundColor: colors.cardBackground,
                    border: `2px solid ${topic.color}`,
                  }}
                >
                  <span className="text-xl">{topic.icon}</span>
                  <span className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                    {topic.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* How It Works Section */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-3" style={{ color: colors.textPrimary }}>
              How It Works
            </h2>
            <p className="text-lg" style={{ color: colors.textSecondary }}>
              Your journey to becoming a GenAI expert in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="rounded-xl shadow-lg p-6 relative overflow-hidden cursor-pointer"
              style={{
                backgroundColor: colors.cardBackground,
                border: `2px solid ${colors.accentPink}`
              }}
            >
              {/* Step number badge */}
              <div
                className="absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl"
                style={{
                  backgroundColor: colors.accentPink,
                  color: '#FFFFFF'
                }}
              >
                1
              </div>
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: 'rgba(232,84,122,0.2)' }}
              >
                <BookOpen size={32} style={{ color: colors.accentPink }} />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: colors.textPrimary }}>
                Learn the Modules
              </h3>
              <p style={{ color: colors.textSecondary }}>
                Complete interactive learning modules covering AI ethics, prompt engineering, and responsible use
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="rounded-xl shadow-lg p-6 relative overflow-hidden cursor-pointer"
              style={{
                backgroundColor: colors.cardBackground,
                border: `2px solid ${colors.accentGold}`
              }}
            >
              {/* Step number badge */}
              <div
                className="absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl"
                style={{
                  backgroundColor: colors.accentGold,
                  color: '#0D0508'
                }}
              >
                2
              </div>
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: 'rgba(255,198,39,0.2)' }}
              >
                <Gamepad2 size={32} style={{ color: colors.accentGold }} />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: colors.textPrimary }}>
                Play Educational Games
              </h3>
              <p style={{ color: colors.textSecondary }}>
                Reinforce your learning through fun, interactive games that test your knowledge
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="rounded-xl shadow-lg p-6 relative overflow-hidden cursor-pointer"
              style={{
                backgroundColor: colors.cardBackground,
                border: `2px solid ${colors.accentTeal}`
              }}
            >
              {/* Step number badge */}
              <div
                className="absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl"
                style={{
                  backgroundColor: colors.accentTeal,
                  color: '#FFFFFF'
                }}
              >
                3
              </div>
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: 'rgba(75,183,196,0.2)' }}
              >
                <Award size={32} style={{ color: colors.accentTeal }} />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: colors.textPrimary }}>
                Earn XP & Badges
              </h3>
              <p style={{ color: colors.textSecondary }}>
                Level up, earn badges, and track your progress as you master GenAI tools
              </p>
            </motion.div>
          </div>
        </section>

        {/* Why Learn Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div
            className="rounded-2xl shadow-lg p-10 relative overflow-hidden"
            style={{
              backgroundColor: colors.cardBackground,
              border: `2px solid ${colors.accentGold}`
            }}
          >
            {/* Decorative elements */}
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-4 right-4 opacity-20"
            >
              <Trophy size={100} style={{ color: colors.accentGold }} />
            </motion.div>

            <h2 className="text-3xl font-bold text-center mb-3" style={{ color: colors.textPrimary }}>
              Why Learn with ASU GenAI Lab?
            </h2>
            <p className="text-center mb-8" style={{ color: colors.textSecondary }}>
              Built specifically for the ASU community
            </p>

            <div className="grid md:grid-cols-2 gap-6 relative z-10">
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(255,198,39,0.2)' }}
                >
                  <Target size={24} style={{ color: colors.accentGold }} />
                </div>
                <div>
                  <h3 className="font-bold mb-1" style={{ color: colors.textPrimary }}>
                    Practical Skills
                  </h3>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    Learn skills you can apply immediately in your coursework and research
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(232,84,122,0.2)' }}
                >
                  <Lightbulb size={24} style={{ color: colors.accentPink }} />
                </div>
                <div>
                  <h3 className="font-bold mb-1" style={{ color: colors.textPrimary }}>
                    Interactive Learning
                  </h3>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    Engage with content through games, quizzes, and hands-on activities
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(75,183,196,0.2)' }}
                >
                  <Users size={24} style={{ color: colors.accentTeal }} />
                </div>
                <div>
                  <h3 className="font-bold mb-1" style={{ color: colors.textPrimary }}>
                    Built for ASU
                  </h3>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    Designed specifically for ASU students, faculty, and staff
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(255,138,80,0.2)' }}
                >
                  <Award size={24} style={{ color: colors.accentOrange }} />
                </div>
                <div>
                  <h3 className="font-bold mb-1" style={{ color: colors.textPrimary }}>
                    Track Progress
                  </h3>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    Monitor your growth with XP, levels, and achievement badges
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Final CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div
            className="rounded-2xl shadow-2xl p-10"
            style={{
              background: 'linear-gradient(135deg, #8B1A2E 0%, #6B1530 100%)'
            }}
          >
            <h2 className="text-3xl font-bold mb-4" style={{ color: '#F0E0E4' }}>
              Ready to become a GenAI expert?
            </h2>
            <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: 'rgba(240,224,228,0.9)' }}>
              Join the ASU community in learning how to use AI tools responsibly and effectively
            </p>
            <Link
              to="/learning-lab"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-xl text-xl font-bold transition-all hover:scale-105 hover:shadow-2xl"
              style={{
                backgroundColor: colors.accentGold,
                color: '#0D0508'
              }}
            >
              <Zap size={24} />
              <span>Get Started Now</span>
              <Trophy size={24} />
            </Link>
          </div>
        </motion.section>
      </main>
    </div>
  );
}