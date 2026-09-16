import { useState } from "react";
import { Header } from "./Header";
import { CharacterMascot } from "./CharacterMascot";
import { MODULES } from "../utils/modulesData";
import { useTheme } from "../utils/themeContext";
import { motion } from "motion/react";
import { Lock, Zap, Clock, CheckCircle2, ArrowRight, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../utils/userData";
import {
  getCompletedLessonCount,
  loadModuleProgress,
  resetModuleProgress,
  getModuleXP,
  resetModuleXP,
  hasEverCompletedModule,
} from "../utils/moduleProgress";

export function LearningLab() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const [, setProgressVersion] = useState(0);

  const handleRestartModule = (moduleId: string) => {
    // Reset in-progress XP and step position, but keep committedModuleXP so
    // the unmount delta logic never awards less than what the user already earned.
    resetModuleXP(moduleId);
    resetModuleProgress(moduleId);
    setProgressVersion((prev) => prev + 1);
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.background }}
    >
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: colors.textPrimary }}>
            Learning Lab
          </h1>
          <p style={{ color: colors.textSecondary }}>
            Master GenAI tools through our structured learning modules
          </p>
        </div>

        {/* Modules Grid */}
        <div className="space-y-6">
          {MODULES.map((module, moduleIndex) => {
            const savedProgress = loadModuleProgress(module.id);
            const totalLessons = module.lessons.length;
            const completedLessons = getCompletedLessonCount(module.id, totalLessons);
            const moduleEarnedXP = getModuleXP(module.id);
            const progressPct = savedProgress && savedProgress.totalSteps > 0
              ? Math.round(((savedProgress.stepIndex + 1) / savedProgress.totalSteps) * 100)
              : 0;
            const isInProgress = completedLessons > 0 && completedLessons < totalLessons;
            const isCompleted = completedLessons >= totalLessons;

            return (
              <motion.div
                key={module.id}
                whileHover={!module.locked ? { scale: 1.01 } : {}}
                onClick={() => !module.locked && navigate(`/module/${module.id}`)}
                className="rounded-xl shadow-lg p-6 transition-all cursor-pointer relative"
                style={{
                  backgroundColor: colors.cardBackground,
                  border: `1px solid ${colors.cardBorder}`,
                  opacity: module.locked ? 0.5 : 1,
                  cursor: module.locked ? 'not-allowed' : 'pointer'
                }}
              >
                <div className="flex items-start gap-6">
                  {/* Icon */}
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: module.locked ? 'rgba(122,90,98,0.2)' : `${module.iconColor}20`
                    }}
                  >
                    {module.locked ? (
                      <Lock size={28} style={{ color: colors.textSecondary }} />
                    ) : (
                      <span className="text-3xl">{module.icon}</span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <span
                          className="text-xs font-bold uppercase tracking-wider"
                          style={{ color: module.locked ? colors.textSecondary : module.iconColor }}
                        >
                          Module {moduleIndex + 1}
                        </span>
                        <h3 className="text-2xl font-semibold mb-2" style={{ color: colors.textPrimary }}>
                          {module.name}
                        </h3>
                        <p style={{ color: colors.textSecondary }}>
                          {module.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        {!module.locked && (
                          <>
                            {(isInProgress || isCompleted) && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRestartModule(module.id);
                                }}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition-all hover:scale-105 border"
                                style={{
                                  color: colors.textPrimary,
                                  borderColor: colors.cardBorder,
                                  backgroundColor: "transparent"
                                }}
                              >
                                <RotateCcw size={16} />
                                <span>Restart</span>
                              </button>
                            )}
                            {(isInProgress || hasEverCompletedModule(module.id)) && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/module/${module.id}?mode=review`);
                                }}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition-all hover:scale-105 border"
                                style={{
                                  color: colors.accentTeal,
                                  borderColor: colors.accentTeal,
                                  backgroundColor: "transparent"
                                }}
                              >
                                <span>Review</span>
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(isCompleted
                                  ? `/module/${module.id}?mode=review`
                                  : `/module/${module.id}`
                                );
                              }}
                              className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105"
                              style={{
                                backgroundColor: colors.accentGold,
                                color: '#0D0508'
                              }}
                            >
                              <span>{isCompleted ? 'Review' : isInProgress ? 'Continue' : 'Start'}</span>
                              <ArrowRight size={18} />
                            </button>
                          </>
                        )}
                        {isCompleted && (
                          <span
                            className="px-3 py-1 rounded-full text-xs uppercase tracking-wider font-semibold flex items-center gap-1"
                            style={{
                              backgroundColor: 'rgba(75,183,196,0.2)',
                              color: colors.accentTeal
                            }}
                          >
                            <CheckCircle2 size={14} />
                            COMPLETED
                          </span>
                        )}
                        {isInProgress && (
                          <span
                            className="px-3 py-1 rounded-full text-xs uppercase tracking-wider font-semibold"
                            style={{
                              backgroundColor: 'rgba(232,84,122,0.2)',
                              color: colors.accentPink
                            }}
                          >
                            IN PROGRESS
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 mb-4">
                      <div className="flex items-center gap-2" style={{ color: colors.accentGold }}>
                        <Zap size={18} />
                        <span className="font-semibold">
                          {moduleEarnedXP > 0 ? `${moduleEarnedXP} / ` : "+"}{module.xpReward} XP
                        </span>
                      </div>
                      <div className="flex items-center gap-2" style={{ color: colors.textSecondary }}>
                        <Clock size={18} />
                        <span>{module.timeEstimate}</span>
                      </div>
                      <div style={{ color: colors.textSecondary }}>
                        <span className="font-semibold">{completedLessons}</span>/{totalLessons} lessons
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {!module.locked && (
                      <div
                        className="h-2 rounded-full overflow-hidden"
                        style={{ backgroundColor: colors.progressBarBg }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${isCompleted ? 100 : Math.max(0, Math.min(100, progressPct))}%`,
                            background: isCompleted
                              ? 'linear-gradient(90deg, #4AB7C4 0%, #4AB7C4 100%)'
                              : 'linear-gradient(90deg, #E8547A 0%, #FFC627 100%)'
                          }}
                        />
                      </div>
                    )}

                    {/* Lessons Preview */}
                    {!module.locked && (
                      <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${colors.cardBorder}` }}>
                        <p className="text-sm mb-2 font-semibold" style={{ color: colors.textSecondary }}>
                          LESSONS:
                        </p>
                        <div className="grid md:grid-cols-2 gap-2">
                          {module.lessons.map((lesson, lessonIdx) => {
                            const done = lessonIdx < completedLessons;
                            return (
                              <div
                                key={lesson.id}
                                className="flex items-center gap-2 text-sm"
                                style={{ color: done ? colors.accentTeal : colors.textSecondary }}
                              >
                                {done ? (
                                  <CheckCircle2 size={16} />
                                ) : (
                                  <div
                                    className="w-4 h-4 rounded-full"
                                    style={{ border: `2px solid ${colors.textSecondary}` }}
                                  />
                                )}
                                <span>{lesson.title}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Locked Message */}
                    {module.locked && (
                      <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${colors.cardBorder}` }}>
                        <p className="text-sm" style={{ color: colors.textSecondary }}>
                          🔒 Complete previous modules to unlock
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* Player's chosen character */}
      <div className="fixed top-24 right-6 z-40">
        <CharacterMascot character={getUserData()?.selectedCharacter} size={64} />
      </div>
    </div>
  );
}
