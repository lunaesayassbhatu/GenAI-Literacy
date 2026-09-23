import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "./Header";
import { CharacterMascot } from "./CharacterMascot";
import { getUserData, updateUserData } from "../utils/userData";
import { CHARACTERS } from "../data/charactersData";
import { useTheme } from "../utils/themeContext";
import { motion } from "motion/react";
import { BookOpen, Gamepad2, Target, Lightbulb, Users, Award, ArrowRight } from "lucide-react";

export function HomePage() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const [, setVersion] = useState(0);
  const userData = getUserData();

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.background }}
    >
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12">
          {/* Main Title Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="rounded-2xl p-10 mb-8 text-center"
            style={{
              background: '#6B1530'
            }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ color: '#FFC627' }}>
              ASU GenAI Lab
            </h1>
            <p className="text-xl font-medium max-w-2xl mx-auto" style={{ color: '#F0E0E4' }}>
              Master the art of using GenAI tools responsibly and effectively
            </p>
          </motion.div>
        </section>

        {/* Framed content: Our Aim + Why Learn + How It Works, styled as an unrolled scroll */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mb-12"
        >
          <div
            className="p-8 md:p-12 relative overflow-hidden"
            style={{
              borderLeft: `1px solid ${colors.cardBorder}`,
              borderRight: `1px solid ${colors.cardBorder}`,
            }}
          >
            {/* Built With Purpose */}
            <div className="mb-10">
              <h2 className="text-3xl font-bold mb-3 text-center" style={{ color: colors.textPrimary }}>
                Built With Purpose
              </h2>
              <p className="text-lg text-center max-w-3xl mx-auto" style={{ color: colors.textPrimary }}>
                Generative AI is now part of everyday academic life, but many people hold real misconceptions
                about how it works, where it gets things wrong, and how to use it responsibly. ASU GenAI Lab
                was built to close that gap. Through short, interactive lessons and games, we help ASU
                students, faculty, and staff build practical GenAI literacy: not just how to write a prompt,
                but how to think critically about what comes back.
              </p>
            </div>

            <hr className="mb-10" style={{ borderColor: colors.cardBorder }} />

            {/* Why Learn */}
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-center mb-3" style={{ color: colors.textPrimary }}>
                Why Learn with ASU GenAI Lab?
              </h2>
              <p className="text-center mb-8" style={{ color: colors.textSecondary }}>
                Built specifically for the ASU community
              </p>

              <div className="grid md:grid-cols-2 gap-6">
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

            <hr className="mb-10" style={{ borderColor: colors.cardBorder }} />

            {/* How It Works */}
            <div>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-3" style={{ color: colors.textPrimary }}>
                  How It Works
                </h2>
                <p className="text-lg" style={{ color: colors.textSecondary }}>
                  Your journey to becoming a GenAI expert in three simple steps
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Step 1 */}
                <Link to="/learning-lab" style={{ textDecoration: "none", display: "block" }}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="rounded-xl shadow-lg p-6 relative overflow-hidden cursor-pointer h-full"
                    style={{
                      backgroundColor: '#FFFBEF',
                      border: `2px solid ${colors.accentPink}`
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: 'rgba(232,84,122,0.2)' }}
                      >
                        <BookOpen size={32} style={{ color: colors.accentPink }} />
                      </div>
                      <h3 className="text-xl font-bold" style={{ color: '#111827' }}>
                        Learn the Modules
                      </h3>
                    </div>
                    <p style={{ color: '#4B5563' }}>
                      Complete interactive learning modules covering AI ethics, prompt engineering, and responsible use
                    </p>
                  </motion.div>
                </Link>

                {/* Step 2 */}
                <Link to="/games" style={{ textDecoration: "none", display: "block" }}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="rounded-xl shadow-lg p-6 relative overflow-hidden cursor-pointer h-full"
                    style={{
                      backgroundColor: '#FFFBEF',
                      border: `2px solid ${colors.accentGold}`
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: 'rgba(255,198,39,0.2)' }}
                      >
                        <Gamepad2 size={32} style={{ color: colors.accentGold }} />
                      </div>
                      <h3 className="text-xl font-bold" style={{ color: '#111827' }}>
                        Play Educational Games
                      </h3>
                    </div>
                    <p style={{ color: '#4B5563' }}>
                      Reinforce your learning through fun, interactive games that test your knowledge
                    </p>
                  </motion.div>
                </Link>

                {/* Step 3 */}
                <Link to="/profile" style={{ textDecoration: "none", display: "block" }}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="rounded-xl shadow-lg p-6 relative overflow-hidden cursor-pointer h-full"
                    style={{
                      backgroundColor: '#FFFBEF',
                      border: `2px solid ${colors.accentTeal}`
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: 'rgba(75,183,196,0.2)' }}
                      >
                        <Award size={32} style={{ color: colors.accentTeal }} />
                      </div>
                      <h3 className="text-xl font-bold" style={{ color: '#111827' }}>
                        Earn XP & Badges
                      </h3>
                    </div>
                    <p style={{ color: '#4B5563' }}>
                      Level up, earn badges, and track your progress as you master GenAI tools
                    </p>
                  </motion.div>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Character selection */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-2" style={{ color: colors.textPrimary }}>
            Choose Your Character
          </h2>
          <p className="text-lg mb-8" style={{ color: colors.textSecondary }}>
            Pick who you'll play as through the Learning Lab and Games
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {CHARACTERS.map((c) => {
              const isSelected = userData?.selectedCharacter === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    updateUserData({ selectedCharacter: c.id });
                    setVersion((v) => v + 1);
                  }}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl transition-all"
                  style={{
                    border: isSelected ? `3px solid ${c.color}` : `2px solid ${colors.cardBorder}`,
                    boxShadow: isSelected ? `0 0 0 4px ${c.color}33` : undefined,
                  }}
                >
                  <CharacterMascot character={c.id} size={100} animate={isSelected} />
                  <div className="flex flex-col items-center text-center gap-1">
                    <span className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                      {c.name}
                    </span>
                    <span className="text-sm" style={{ color: colors.textSecondary }}>
                      {c.tagline}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => navigate("/learning-lab")}
            disabled={!userData?.selectedCharacter}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: colors.accentGold, color: '#0D0508' }}
          >
            <span>Next</span>
            <ArrowRight size={20} />
          </button>
        </motion.section>
      </main>

      {/* Help & documentation footer */}
      <footer
        className="mt-16 border-t"
        style={{ borderColor: colors.cardBorder, backgroundColor: colors.cardBackground }}
      >
        <div className="max-w-6xl mx-auto px-4 py-10 grid sm:grid-cols-3 gap-8 text-sm">
          <div>
            <h4 className="font-bold mb-2" style={{ color: colors.textPrimary }}>Need Help?</h4>
            <p style={{ color: colors.textSecondary }}>
              Click <strong>Ask Wave</strong> in the bottom-left corner of any page for instant answers
              about GenAI concepts, or reach the support team directly:
            </p>
            {/* PLACEHOLDER — replace with the real support contact */}
            <a href="mailto:help@example.asu.edu" className="underline" style={{ color: colors.accentTeal }}>
              help@example.asu.edu
            </a>
          </div>
          <div>
            <h4 className="font-bold mb-2" style={{ color: colors.textPrimary }}>LEI Contact</h4>
            <p style={{ color: colors.textSecondary }}>
              Questions about the Learning Experience Innovation team's involvement in this project:
            </p>
            {/* PLACEHOLDER — replace with the real LEI contact */}
            <a href="mailto:lei@example.asu.edu" className="underline" style={{ color: colors.accentTeal }}>
              lei@example.asu.edu
            </a>
          </div>
          <div>
            <h4 className="font-bold mb-2" style={{ color: colors.textPrimary }}>Module Citations</h4>
            {/* PLACEHOLDER — replace with the real citation list once finalized */}
            <p style={{ color: colors.textSecondary }}>
              Learning module content draws on peer-reviewed GenAI literacy research and ASU curriculum
              guidelines. Full citations available on request from the LEI team above.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}