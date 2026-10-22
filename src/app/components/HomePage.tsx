import { Link } from "react-router-dom";
import { Header } from "./Header";
import { HeroTitle } from "./HeroTitle";
import { HeroBeacon, HeroCircuit } from "./HeroVariants";
import { HeroStudent } from "./HeroStudent";
import { useTheme } from "../utils/themeContext";
import { getUserData } from "../utils/userData";
import { getCharacterInfo } from "../data/charactersData";
import { motion } from "motion/react";
import { BookOpen, Gamepad2, Target, Award, ArrowRight } from "lucide-react";

// Banner style: "classic" (default, the original plain card), or the vote candidates "ocean", "beacon",
// "circuit", "student". Preview any of them without editing code by opening /home?hero=beacon (etc.).
// After the banner vote, set DEFAULT_HERO_STYLE to the winner.
type HeroStyle = "classic" | "ocean" | "beacon" | "circuit" | "student";
const DEFAULT_HERO_STYLE: HeroStyle = "classic";
const HERO_SUBTITLE = "An interactive learning platform helping the ASU community use Generative AI responsibly and effectively.";

export function HomePage() {
  const { colors } = useTheme();
  const heroParam = new URLSearchParams(window.location.search).get("hero");
  const heroStyle = heroParam === "beacon" || heroParam === "circuit" || heroParam === "student" || heroParam === "ocean" || heroParam === "classic" ? heroParam : DEFAULT_HERO_STYLE;
  const selectedCharacter = getUserData()?.selectedCharacter;
  const characterName = selectedCharacter ? getCharacterInfo(selectedCharacter).name : null;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.background }}
    >
      <Header />

      <main className="max-w-6xl mx-auto px-4 pt-8 pb-2">
        {/* Hero Section */}
        <section className="mb-0">
          {/* Main Title Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="mb-4"
          >
            {heroStyle === "classic" ? (
              <div className="rounded-2xl p-10 text-center" style={{ background: "#6B1530" }}>
                <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ color: "#FFC627" }}>
                  ASU GenAI Lab
                </h1>
                <p className="text-2xl font-semibold max-w-2xl mx-auto" style={{ color: "#F0E0E4" }}>
                  {HERO_SUBTITLE}
                </p>
              </div>
            ) : heroStyle === "beacon" ? (
              <HeroBeacon subtitle={HERO_SUBTITLE} />
            ) : heroStyle === "circuit" ? (
              <HeroCircuit subtitle={HERO_SUBTITLE} />
            ) : heroStyle === "student" ? (
              <HeroStudent subtitle={HERO_SUBTITLE} character={selectedCharacter} />
            ) : (
              <HeroTitle subtitle={HERO_SUBTITLE} />
            )}
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
            className="px-8 pb-4 pt-2 md:px-12 md:pb-6 md:pt-3 relative overflow-hidden"
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
                Generative AI is part of everyday academic life, and yet there are many misconceptions about
                how it works, when it does not work, how to use it responsibly, and when one should not use
                it. Use these short lessons and games to learn everything from how to write a prompt well,
                how GenAI works, what we cannot rely on AI for, to best practices in and out of the classroom.
              </p>
            </div>

            <hr className="mb-10" style={{ borderColor: colors.cardBorder }} />

            {/* Primary CTAs — direct entry points into modules and games */}
            <div className="mb-10 grid md:grid-cols-2 gap-6">
              <Link to="/learning-lab" style={{ textDecoration: "none", display: "block" }}>
                <motion.div
                  whileHover={{ y: -3 }}
                  whileTap={{ y: 5, boxShadow: '0 1px 0 #A87800, 0 3px 8px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,0.4)' }}
                  className="rounded-2xl p-8 text-center h-full cursor-pointer"
                  style={{
                    background: 'linear-gradient(180deg, #FFDE74 0%, #FFC627 55%, #E3A700 100%)',
                    color: '#0D0508',
                    boxShadow: '0 6px 0 #A87800, 0 12px 20px rgba(0,0,0,0.45), inset 0 2px 0 rgba(255,255,255,0.55)'
                  }}
                >
                  <BookOpen size={36} className="mx-auto mb-3" />
                  <h3 className="text-2xl font-bold mb-2">Start Learning!</h3>
                  <p className="text-sm font-medium opacity-80">
                    Dive into short, interactive modules that clear up things people are often wrong or
                    unsure about when it comes to GenAI.
                  </p>
                </motion.div>
              </Link>

              <Link to="/games" style={{ textDecoration: "none", display: "block" }}>
                <motion.div
                  whileHover={{ y: -3 }}
                  whileTap={{ y: 5, boxShadow: '0 1px 0 #7A5A00, 0 3px 8px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,198,39,0.2)' }}
                  className="rounded-2xl p-8 text-center h-full cursor-pointer"
                  style={{
                    background: `linear-gradient(180deg, ${colors.cardBackground} 0%, rgba(20,6,10,0.95) 100%)`,
                    border: `2px solid ${colors.accentGold}`,
                    color: colors.textPrimary,
                    boxShadow: '0 6px 0 #7A5A00, 0 12px 20px rgba(0,0,0,0.45), inset 0 2px 0 rgba(255,198,39,0.25)'
                  }}
                >
                  <Gamepad2 size={36} className="mx-auto mb-3" style={{ color: colors.accentGold }} />
                  <h3 className="text-2xl font-bold mb-2">Play to Reinforce Learning!</h3>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    {/* TEMP placeholder names ("Lumina" the world, "the Beacon" the tech) — swap once the real names are decided */}
                    {characterName
                      ? `Go on adventures with ${characterName} to help the world of Lumina learn more about the Beacon.`
                      : "Choose a character, then go on adventures to help the world of Lumina learn more about the Beacon."}
                  </p>
                </motion.div>
              </Link>
            </div>

            <hr className="mb-10" style={{ borderColor: colors.cardBorder }} />

            {/* How It Works (merged with "Why Learn with ASU GenAI Lab?") */}
            <div>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-3" style={{ color: colors.textPrimary }}>
                  How It Works
                </h2>
                <p className="text-lg" style={{ color: colors.textSecondary }}>
                  Built specifically for the ASU community: four ways to build your GenAI skills
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    to: "/learning-lab",
                    cta: "Go to the Learning Lab",
                    title: "Practical Skills",
                    text: "Complete interactive learning modules covering AI ethics, prompt engineering, and responsible use.",
                    Icon: BookOpen,
                    tint: "rgba(232,84,122,0.2)",
                    color: colors.accentPink,
                  },
                  {
                    to: "/games",
                    cta: "Go to the Games",
                    title: "Interactive Learning",
                    text: "Reinforce your learning through fun, interactive games that test your knowledge.",
                    Icon: Gamepad2,
                    tint: "rgba(255,198,39,0.2)",
                    color: colors.accentGold,
                  },
                  {
                    to: "/profile",
                    cta: "Go to your Profile",
                    title: "Unlock Features with XP",
                    text: "Level up, earn badges, and customize your avatar as you master GenAI tools.",
                    Icon: Award,
                    tint: "rgba(75,183,196,0.2)",
                    color: colors.accentTeal,
                  },
                  {
                    to: "/map",
                    cta: "Go to Your Path",
                    title: "Track Progress",
                    text: "Monitor your growth as you complete modules and play games.",
                    Icon: Target,
                    tint: "rgba(255,138,80,0.2)",
                    color: colors.accentOrange,
                  },
                ].map(({ to, cta, title, text, Icon, tint, color }, i) => (
                  <Link key={to} to={to} className="group block rounded-xl" style={{ textDecoration: "none" }}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * i }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-start gap-4 p-6 rounded-xl shadow-lg cursor-pointer h-full"
                      style={{ backgroundColor: colors.cardBackground, border: `1px solid ${colors.cardBorder}` }}
                    >
                      <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: tint }}
                      >
                        <Icon size={32} style={{ color }} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                          {title}
                        </h3>
                        <p className="mb-2" style={{ color: colors.textSecondary }}>
                          {text}
                        </p>
                        <span
                          className="inline-flex items-center gap-1 text-sm font-bold transition-all group-hover:gap-2"
                          style={{ color }}
                        >
                          {cta}
                          <ArrowRight size={16} />
                        </span>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

      </main>

      {/* Help & documentation footer */}
      <footer
        className="mt-4 border-t"
        style={{ borderColor: colors.cardBorder, backgroundColor: colors.cardBackground }}
      >
        <div className="max-w-6xl mx-auto px-4 pt-10 pb-24 grid sm:grid-cols-3 gap-8 text-sm">
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
              For questions or concerns about the Learning Experience Institution team's involvement in this project:
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
              guidelines. Full citations are available on request from the LEI team.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}