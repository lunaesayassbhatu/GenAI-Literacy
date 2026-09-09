import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Zap, ArrowRight, CheckCircle2 } from "lucide-react";
import { WaveMascot } from "./WaveMascot";
import { useTheme } from "../utils/themeContext";
import { getUserData, updateUserData, awardBadge } from "../utils/userData";
import { MODULES } from "../utils/modulesData";
import { type Step, getStepsForModule, MODULE1_SECTION1_VARIANT_COUNT } from "../utils/moduleStepsData";
import {
  loadModuleProgress,
  saveModuleProgress,
  advanceVariantCounter,
  getModuleXP,
  setModuleXP,
  getCommittedModuleXP,
  setCommittedModuleXP
} from "../utils/moduleProgress";
import { DolphinMascot } from "./DolphinMascot";

type WaveMood = "default" | "thinking" | "celebrate" | "hint" | "spin";

function normalizeHintText(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim();
}

function buildKnowledgeCheckHints(data: any): string[] {
  const options = Array.isArray(data?.options) ? data.options : [];
  const wrongOptionTexts = options
    .filter((option: any) => !option?.correct)
    .map((option: any) => normalizeHintText(option?.text));

  const eliminationSignals: string[] = [];
  if (wrongOptionTexts.some((text: string) => /internet|search|google|web/i.test(text))) {
    eliminationSignals.push("internet searching");
  }
  if (wrongOptionTexts.some((text: string) => /database|wrote.*advance|prewritten|stored/i.test(text))) {
    eliminationSignals.push("database lookup");
  }
  if (wrongOptionTexts.some((text: string) => /remembered|memory|previous conversation/i.test(text))) {
    eliminationSignals.push("reusing old chats");
  }

  const eliminationHint = eliminationSignals.length
    ? `Skip choices about ${eliminationSignals.join(", ")}.`
    : "Skip choices that say AI is just pulling an existing answer.";

  return [
    "Ask yourself: did AI create this answer, or just find it somewhere?",
    eliminationHint,
    "Pick the option about generating a new answer from learned patterns."
  ];
}

function buildScenarioHints(data: any): string[] {
  const choices = Array.isArray(data?.choices) ? data.choices : [];
  const idealChoiceText = normalizeHintText(
    choices.find((choice: any) => choice?.outcome === "ideal")?.text
  );

  const conceptHints: string[] = [];
  if (/verify|check|citation|source|fact/i.test(idealChoiceText)) {
    conceptHints.push("checking facts and sources");
  }
  if (/revise|edit|own words|understand|responsib/i.test(idealChoiceText)) {
    conceptHints.push("you making the final decision");
  }
  if (/brainstorm|draft|outline|starting point/i.test(idealChoiceText)) {
    conceptHints.push("using AI as support, not the final answer");
  }

  const conceptHint = conceptHints.length
    ? `Look for the choice about ${conceptHints.join(" and ")}.`
    : "Pick the choice where the student stays responsible.";

  return [
    "The best answer uses AI for help, but keeps responsibility with the student.",
    conceptHint,
    "Avoid any choice that blindly trusts AI or skips checking."
  ];
}

function buildDragDropHints(data: any): string[] {
  const tasks = Array.isArray(data?.tasks) ? data.tasks : [];
  const goodExamples = tasks
    .filter((task: any) => task?.category === "good")
    .map((task: any) => normalizeHintText(task?.text))
    .filter(Boolean)
    .slice(0, 2);
  const verifyExamples = tasks
    .filter((task: any) => task?.category === "verify")
    .map((task: any) => normalizeHintText(task?.text))
    .filter(Boolean)
    .slice(0, 2);

  return [
    "Use this rule: if it must be factually right or safe, put it in Always Verify.",
    goodExamples.length
      ? `Works Well includes tasks like ${goodExamples.join(" and ")}.`
      : "Works Well usually means brainstorming, drafting, and explaining.",
    verifyExamples.length
      ? `Always Verify includes tasks like ${verifyExamples.join(" and ")}.`
      : "Always Verify usually means citations, stats, and medical or legal topics."
  ];
}

function buildStepHints(step: Step): string[] {
  const customHints = Array.isArray((step.data as any)?.hints)
    ? (step.data as any).hints.map(normalizeHintText).filter(Boolean)
    : [];

  if (customHints.length > 0) return customHints;

  switch (step.type) {
    case "knowledge-check":
      return buildKnowledgeCheckHints(step.data);
    case "scenario":
      return buildScenarioHints(step.data);
    case "drag-drop":
      return buildDragDropHints(step.data);
    default:
      return [];
  }
}

export function ModuleLearning() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { colors } = useTheme();
  const userData = getUserData();
  const isReviewMode = searchParams.get("mode") === "review";

  const module = MODULES.find(m => m.id === moduleId);

  // Determine which question variant to use for this run.
  // - Review mode: always use the saved variant — never advance the counter.
  // - Resuming mid-module: reuse the saved variant so the question doesn't change.
  // - Fresh start (first ever, or after completion): advance the counter to get the next variant.
  const [variantIndex] = useState<number>(() => {
    const saved = loadModuleProgress(moduleId ?? "");
    if (isReviewMode) {
      return saved?.questionVariant ?? 0;
    }
    const isCompleted = saved !== null && saved.stepIndex >= saved.totalSteps - 1;
    const isResuming = saved !== null && saved.stepIndex > 0 && !isCompleted;
    if (isResuming && saved.questionVariant !== undefined) {
      return saved.questionVariant;
    }
    return advanceVariantCounter(moduleId ?? "", MODULE1_SECTION1_VARIANT_COUNT);
  });

  const steps: Step[] = getStepsForModule(moduleId ?? "", variantIndex);

  // Resume from the last saved position, or start at 0
  const [currentStepIndex, setCurrentStepIndex] = useState(() => {
    const saved = loadModuleProgress(moduleId ?? "");
    // Don't resume on the completion step — restart the final step so they see it
    if (saved && saved.stepIndex < steps.length - 1) return saved.stepIndex;
    return 0;
  });
  const [xpEarned, setXpEarned] = useState(() =>
    isReviewMode ? 0 : getModuleXP(moduleId ?? "")
  );
  const xpEarnedRef = useRef(xpEarned);
  const [canProceed, setCanProceed] = useState(false);
  const [waveMood, setWaveMood] = useState<WaveMood>("default");
  const [waveMessage, setWaveMessage] = useState("Let's start learning! I'm here to guide you.");
  const [hintClickCount, setHintClickCount] = useState(0);
  const [showXpPopup, setShowXpPopup] = useState(false);
  const [xpPopupAmount, setXpPopupAmount] = useState(0);
  const waveMessageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);


  const totalSteps = steps.length;
  const currentStep = steps[currentStepIndex];
  const progressPercentage = ((currentStepIndex + 1) / totalSteps) * 100;
  const stepHints = useMemo(() => buildStepHints(currentStep), [currentStep]);
  const hintActionLabel =
    stepHints.length === 0
      ? undefined
      : hintClickCount === 0
        ? "Need a hint?"
        : hintClickCount < stepHints.length
          ? "Another hint"
          : "Show hint again";

  // Keep ref in sync so the unmount cleanup always sees the latest value
  useEffect(() => { xpEarnedRef.current = xpEarned; }, [xpEarned]);

  // Commit any un-committed XP to userData when leaving the module early
  useEffect(() => {
    return () => {
      if (isReviewMode || !moduleId) return;
      const latestUserData = getUserData();
      if (!latestUserData) return;
      const committedXp = getCommittedModuleXP(moduleId);
      const xpDelta = xpEarnedRef.current - committedXp;
      if (xpDelta > 0) {
        updateUserData({ xp: Math.max(0, (latestUserData.xp || 0) + xpDelta) });
        setCommittedModuleXP(moduleId, xpEarnedRef.current);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Update Wave message based on step
    updateWaveForStep(currentStep);
    // Reset proceed state
    setCanProceed(currentStep.type === "intro" || currentStep.type === "reading" || currentStep.type === "transition");
    setHintClickCount(0);
  }, [currentStepIndex]);

  useEffect(() => {
    return () => {
      if (waveMessageTimerRef.current) {
        clearTimeout(waveMessageTimerRef.current);
        waveMessageTimerRef.current = null;
      }
    };
  }, []);

  const updateWaveForStep = (step: Step) => {
    if (waveMessageTimerRef.current) {
      clearTimeout(waveMessageTimerRef.current);
      waveMessageTimerRef.current = null;
    }

    setWaveMood("thinking");
    
    waveMessageTimerRef.current = setTimeout(() => {
      waveMessageTimerRef.current = null;
      setWaveMood("default");
      
      switch (step.type) {
        case "intro":
          setWaveMessage("Ready to dive in? This module is full of important concepts!");
          break;
        case "reading":
          setWaveMessage("Take your time reading. Understanding this will help you use AI responsibly!");
          break;
        case "transition":
          setWaveMessage("Great progress! Let's move on to the next section.");
          break;
        case "scenario":
          setWaveMessage("Think carefully about what the right choice would be!");
          break;
        case "knowledge-check":
          setWaveMessage("Test your knowledge! Remember what you just learned.");
          break;
        case "drag-drop":
          setWaveMessage("Sort these carefully. Think about which tasks AI handles well!");
          break;
        case "completion":
          setWaveMessage("Amazing work! You've learned so much!");
          setWaveMood("spin");
          break;
      }
    }, 800);
  };

  const handleHintRequest = () => {
    if (stepHints.length === 0) return;

    if (waveMessageTimerRef.current) {
      clearTimeout(waveMessageTimerRef.current);
      waveMessageTimerRef.current = null;
    }

    setWaveMood("hint");
    if (hintClickCount >= stepHints.length) {
      const allHintsText = stepHints
        .map((hint, idx) => `${idx + 1}. ${hint}`)
        .join("\n");
      setWaveMessage(`All hints:\n${allHintsText}`);
      setHintClickCount(stepHints.length);
      return;
    }

    const hintIndex = Math.min(hintClickCount, stepHints.length - 1);
    setWaveMessage(stepHints[hintIndex]);
    setHintClickCount((prev) => Math.min(prev + 1, stepHints.length));
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      const next = currentStepIndex + 1;
      saveModuleProgress(moduleId ?? "", next, steps.length, variantIndex);
      setCurrentStepIndex(next);
      setCanProceed(false);
    }
  };

  const handleComplete = () => {
    const safeModuleId = moduleId ?? "";
    saveModuleProgress(safeModuleId, steps.length - 1, steps.length, variantIndex);
    awardBadge("first-module", "Module Complete", "Complete your first module", "📚");
    // Unmount effect will commit XP; navigate triggers unmount
    navigate("/learning-lab");
  };

  const awardXP = (amount: number) => {
    if (isReviewMode || !moduleId) return;
    setXpEarned((prev) => {
      const next = prev + amount;
      setModuleXP(moduleId, next);
      return next;
    });
    setXpPopupAmount(amount);
    setShowXpPopup(true);
    setTimeout(() => setShowXpPopup(false), 2000);
  };

  if (!module) {
    return <div>Module not found</div>;
  }

  // Build the list of steps the user has already seen (review mode only).
  // A step at index `idx` is considered seen when progress has advanced past it
  // (stepIndex > idx means they clicked Next off that step).
  // Includes concepts (wave-talk, reading) and questions (knowledge-check, scenario, drag-drop).
  // Excludes intro, transition, and completion since those don't carry reviewable content.
  const savedForReview = isReviewMode ? loadModuleProgress(moduleId ?? "") : null;
  const reviewContent: Array<{ step: Step; idx: number }> = savedForReview
    ? steps
        .map((step, idx) => ({ step, idx }))
        .filter(({ step, idx }) =>
          (step.type === "wave-talk" ||
           step.type === "reading" ||
           step.type === "knowledge-check" ||
           step.type === "scenario" ||
           step.type === "drag-drop") &&
          savedForReview.stepIndex > idx
        )
    : [];

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      {/* Module Nav Bar */}
      <nav
        className="sticky top-0 z-40 px-6 py-4 border-b"
        style={{
          backgroundColor: colors.background,
          borderColor: 'rgba(255,198,39,0.13)'
        }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-6">
          {/* Back Button */}
          <button
            onClick={() => navigate("/learning-lab")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all hover:border-opacity-100"
            style={{
              color: colors.textSecondary,
              borderColor: 'rgba(122,90,98,0.5)'
            }}
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Dashboard</span>
          </button>

          {/* Module Info & Progress */}
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                  {module.name}
                </span>
                <span style={{ color: colors.textSecondary }}>·</span>
                <span className="text-sm" style={{ color: isReviewMode ? colors.accentTeal : colors.textSecondary }}>
                  {isReviewMode
                    ? "Review"
                    : currentStep.type !== "intro" && currentStep.type !== "completion"
                      ? "Learning"
                      : currentStep.type === "intro" ? "Introduction" : "Complete"}
                </span>
              </div>
              <span className="text-sm font-mono" style={{ color: colors.textSecondary }}>
                {isReviewMode
                  ? `${reviewContent.length} item${reviewContent.length !== 1 ? "s" : ""}`
                  : `${currentStepIndex + 1} / ${totalSteps}`}
              </span>
            </div>
            {/* Progress Bar */}
            <div
              className="h-1 rounded-full overflow-hidden"
              style={{ backgroundColor: 'rgba(139,26,46,0.3)' }}
            >
              <motion.div
                className="h-full"
                style={{
                  background: 'linear-gradient(90deg, #8B1A2E 0%, #FFC627 100%)'
                }}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* XP Display */}
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-lg"
            style={{
              backgroundColor: 'rgba(255,198,39,0.1)',
              border: '1px solid rgba(255,198,39,0.3)'
            }}
          >
            <Zap size={16} style={{ color: colors.accentGold }} fill={colors.accentGold} />
            <span className="font-bold text-sm" style={{ color: colors.accentGold }}>
              {(userData?.xp || 0) + xpEarned} XP
            </span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {isReviewMode ? (
          <ReviewModeContent
            questions={reviewContent}
            colors={colors}
            onDone={() => navigate("/learning-lab")}
          />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {currentStep.type === "intro" && (
                <IntroStep
                  data={currentStep.data}
                  colors={colors}
                  onNext={handleNext}
                />
              )}

              {currentStep.type === "reading" && (
                <ReadingStep
                  data={currentStep.data}
                  colors={colors}
                  onNext={handleNext}
                />
              )}

              {currentStep.type === "transition" && (
                <TransitionStep
                  data={currentStep.data}
                  colors={colors}
                  onNext={handleNext}
                />
              )}

              {currentStep.type === "scenario" && (
                <ScenarioStep
                  data={currentStep.data}
                  colors={colors}
                  onProceed={() => setCanProceed(true)}
                  onAwardXP={awardXP}
                  onWaveReaction={(mood: WaveMood) => setWaveMood(mood)}
                />
              )}

              {currentStep.type === "knowledge-check" && (
                <KnowledgeCheckStep
                  data={currentStep.data}
                  colors={colors}
                  onProceed={() => setCanProceed(true)}
                  onAwardXP={awardXP}
                  onWaveReaction={(mood: WaveMood) => setWaveMood(mood)}
                />
              )}

              {currentStep.type === "drag-drop" && (
                <DragDropStep
                  data={currentStep.data}
                  colors={colors}
                  onProceed={() => setCanProceed(true)}
                  onAwardXP={awardXP}
                  onWaveReaction={(mood: WaveMood) => setWaveMood(mood)}
                />
              )}

              {currentStep.type === "wave-talk" && (
                <WaveTalkStep
                  data={currentStep.data}
                  colors={colors}
                  onNext={handleNext}
                />
              )}

              {currentStep.type === "completion" && (
                <CompletionStep
                  data={currentStep.data}
                  colors={colors}
                  totalXP={xpEarned}
                  onComplete={handleComplete}
                />
              )}

              {/* Next Button — hidden for steps that manage their own navigation */}
              {currentStep.type !== "intro" &&
                currentStep.type !== "completion" &&
                currentStep.type !== "wave-talk" && (
                <div className="flex justify-end mt-8">
                  <button
                    onClick={handleNext}
                    disabled={!canProceed}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105"
                    style={{
                      backgroundColor: canProceed ? colors.accentGold : '#7A5A62',
                      color: canProceed ? '#0D0508' : '#F0E0E4'
                    }}
                  >
                    <span>Next</span>
                    <ArrowRight size={20} />
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {/* Corner mascot — hidden in review mode and during wave-talk */}
      {!isReviewMode && currentStep.type !== "wave-talk" && (
        <WaveMascot
          message={waveMessage}
          mood={waveMood}
          actionLabel={hintActionLabel}
          onActionClick={stepHints.length > 0 ? handleHintRequest : undefined}
          compactHintMode={stepHints.length > 0}
        />
      )}

      {/* XP Popup — hidden in review mode */}
      <AnimatePresence>
        {!isReviewMode && showXpPopup && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-32 right-8 px-6 py-3 rounded-full font-bold text-lg shadow-lg z-50"
            style={{
              backgroundColor: colors.accentGold,
              color: '#0D0508'
            }}
          >
            +{xpPopupAmount} XP
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Individual Step Components
function IntroStep({ data, colors, onNext }: any) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="text-7xl">{data.emoji}</div>
        <div
          className="inline-block px-4 py-1 rounded-full text-sm font-bold"
          style={{
            backgroundColor: 'rgba(232,84,122,0.2)',
            color: colors.accentPink
          }}
        >
          + {data.badge}
        </div>
        <h1 className="text-4xl font-bold" style={{ color: colors.textPrimary }}>
          {data.title.split(data.highlightWord)[0]}
          <span className="italic" style={{ color: colors.accentPink }}>
            {data.highlightWord}
          </span>
        </h1>
        <p className="text-lg" style={{ color: colors.textSecondary }}>
          {data.subtitle}
        </p>
      </div>

      <div
        className="rounded-2xl p-8 border"
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: 'rgba(255,198,39,0.13)'
        }}
      >
        <h3 className="font-bold mb-4 text-lg" style={{ color: colors.textPrimary }}>
          What You'll Learn:
        </h3>
        <div className="space-y-3">
          {data.learningPoints.map((point: string, idx: number) => (
            <div key={idx} className="flex items-start gap-3">
              <span className="text-lg">{point.split(' ')[0]}</span>
              <span style={{ color: colors.textPrimary }}>
                {point.split(' ').slice(1).join(' ')}
              </span>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-6 flex-wrap">
          <div
            className="px-4 py-2 rounded-lg text-sm"
            style={{
              backgroundColor: 'rgba(255,198,39,0.1)',
              color: colors.textSecondary
            }}
          >
            ⏱️ {data.info.time}
          </div>
          <div
            className="px-4 py-2 rounded-lg text-sm"
            style={{
              backgroundColor: 'rgba(255,198,39,0.1)',
              color: colors.textSecondary
            }}
          >
            📖 {data.info.sections} sections
          </div>
          <div
            className="px-4 py-2 rounded-lg text-sm"
            style={{
              backgroundColor: 'rgba(255,198,39,0.1)',
              color: colors.textSecondary
            }}
          >
            ⚡ Up to {data.info.maxXp}
          </div>
          <div
            className="px-4 py-2 rounded-lg text-sm"
            style={{
              backgroundColor: 'rgba(255,198,39,0.1)',
              color: colors.textSecondary
            }}
          >
            🏅 {data.info.badges} badges
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all hover:scale-105"
          style={{
            backgroundColor: colors.accentGold,
            color: '#0D0508'
          }}
        >
          <span>Start Learning</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}

function ReadingStep({ data, colors, onNext }: any) {
  return (
    <div className="space-y-6">
      <div>
        <div
          className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3"
          style={{
            backgroundColor: 'rgba(232,84,122,0.2)',
            color: colors.accentPink
          }}
        >
          Section {data.section}
        </div>
        <h2 className="text-3xl font-bold mb-2" style={{ color: colors.textPrimary }}>
          {data.title.split(data.highlightWord)[0]}
          <span className="italic" style={{ color: colors.accentPink }}>
            {data.highlightWord}
          </span>
          {data.title.split(data.highlightWord)[1]}
        </h2>
        <p style={{ color: colors.textSecondary }}>{data.subtitle}</p>
      </div>

      <div
        className="rounded-2xl p-8 border space-y-6"
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: 'rgba(255,198,39,0.13)'
        }}
      >
        <div
          className="text-xs font-bold tracking-widest mb-4"
          style={{ color: colors.accentGold }}
        >
          {data.label}
        </div>

        {data.content.map((paragraph: string, idx: number) => (
          <p
            key={idx}
            className="leading-relaxed"
            style={{ color: colors.textPrimary, lineHeight: 1.75 }}
            dangerouslySetInnerHTML={{
              __html: paragraph
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            }}
          />
        ))}

        {data.comparison && (
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div
              className="p-4 rounded-xl border"
              style={{
                backgroundColor: 'rgba(232,84,122,0.05)',
                borderColor: 'rgba(232,84,122,0.3)'
              }}
            >
              <div className="font-bold mb-2" style={{ color: colors.accentPink }}>
                {data.comparison.left.label}
              </div>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                {data.comparison.left.text}
              </p>
            </div>
            <div
              className="p-4 rounded-xl border"
              style={{
                backgroundColor: 'rgba(75,183,196,0.05)',
                borderColor: 'rgba(75,183,196,0.3)'
              }}
            >
              <div className="font-bold mb-2" style={{ color: colors.accentTeal }}>
                {data.comparison.right.label}
              </div>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                {data.comparison.right.text}
              </p>
            </div>
          </div>
        )}

        {data.hint && (
          <div
            className="p-4 rounded-xl border mt-6"
            style={{
              backgroundColor: 'rgba(75,183,196,0.05)',
              borderColor: 'rgba(75,183,196,0.3)'
            }}
          >
            <p className="text-sm" style={{ color: colors.accentTeal }}>
              {data.hint}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function TransitionStep({ data, colors, onNext }: any) {
  return (
    <div
      className="rounded-2xl p-12 text-center space-y-6"
      style={{
        background: 'linear-gradient(135deg, rgba(139,26,46,0.3) 0%, rgba(139,26,46,0.1) 100%)',
        backgroundColor: colors.cardBackground,
        border: `2px solid rgba(255,198,39,0.13)`
      }}
    >
      <div
        className="text-xs font-bold tracking-widest"
        style={{ color: colors.accentPink }}
      >
        SECTION {data.section}
      </div>
      <h2 className="text-4xl font-bold" style={{ color: colors.textPrimary }}>
        {data.title.split(data.highlightWord)[0]}
        <span className="italic" style={{ color: colors.accentPink }}>
          {data.highlightWord}
        </span>
        {data.title.split(data.highlightWord)[1]}
      </h2>
      <p className="text-lg" style={{ color: colors.textSecondary }}>
        {data.subtitle}
      </p>
      <button
        onClick={onNext}
        className="px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 mt-4"
        style={{
          backgroundColor: colors.accentGold,
          color: '#0D0508'
        }}
      >
        Continue →
      </button>
    </div>
  );
}

function ScenarioStep({ data, colors, onProceed, onAwardXP, onWaveReaction }: any) {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answerRevealed, setAnswerRevealed] = useState(false);

  const handleChoice = (choiceId: string) => {
    if (selectedChoice) return;
    
    setSelectedChoice(choiceId);
    setShowFeedback(true);
    onProceed();

    const choice = data.choices.find((c: any) => c.id === choiceId);
    
    if (choice.outcome === "ideal") {
      onWaveReaction("celebrate");
      if (choice.xpReward) {
        onAwardXP(choice.xpReward);
      }
    } else if (choice.outcome === "poor") {
      onWaveReaction("hint");
    } else {
      if (choice.xpReward) {
        onAwardXP(choice.xpReward);
      }
    }
  };

  const handleRevealAnswer = () => {
    if (selectedChoice) return;

    const idealChoice = data.choices.find((c: any) => c.outcome === "ideal");
    if (!idealChoice) return;

    setSelectedChoice(idealChoice.id);
    setShowFeedback(true);
    setAnswerRevealed(true);
    onProceed();
    onWaveReaction("hint");
  };

  const getChoiceStyle = (choiceId: string, outcome: string) => {
    if (!selectedChoice) return {};
    
    if (choiceId === selectedChoice) {
      if (outcome === "ideal") {
        return {
          backgroundColor: 'rgba(75,183,196,0.2)',
          borderColor: colors.accentTeal
        };
      } else if (outcome === "poor") {
        return {
          backgroundColor: 'rgba(232,84,122,0.2)',
          borderColor: colors.accentPink
        };
      } else {
        return {
          backgroundColor: 'rgba(255,198,39,0.2)',
          borderColor: colors.accentGold
        };
      }
    }
    
    // Highlight correct answer if wrong choice was made
    if (outcome === "ideal" && selectedChoice) {
      const selectedOutcome = data.choices.find((c: any) => c.id === selectedChoice)?.outcome;
      if (selectedOutcome !== "ideal") {
        return {
          backgroundColor: 'rgba(75,183,196,0.15)',
          borderColor: 'rgba(75,183,196,0.5)'
        };
      }
    }
    
    return {};
  };

  const getCircleStyle = (choiceId: string, outcome: string) => {
    if (choiceId === selectedChoice) {
      if (outcome === "ideal") return { backgroundColor: colors.accentTeal };
      if (outcome === "poor") return { backgroundColor: colors.accentPink };
      return { backgroundColor: colors.accentGold };
    }
    return {};
  };

  return (
    <div
      className="rounded-2xl p-8 border space-y-6"
      style={{
        background: 'linear-gradient(135deg, rgba(139,26,46,0.2) 0%, rgba(139,26,46,0.05) 100%)',
        backgroundColor: colors.cardBackground,
        borderColor: 'rgba(255,198,39,0.13)'
      }}
    >
      <div
        className="text-sm font-bold"
        style={{ color: colors.accentPink }}
      >
        💬 Choose Your Path — {data.title}
      </div>

      <div>
        <span className="font-bold text-lg" style={{ color: colors.accentGold }}>
          {data.character}
        </span>
        <p className="mt-3 leading-relaxed" style={{ color: colors.textPrimary }}>
          {data.scenario}
        </p>
      </div>

      <div
        className="text-xs font-bold tracking-widest"
        style={{ color: colors.textSecondary }}
      >
        WHAT SHOULD {data.character.toUpperCase()} DO?
      </div>

      <div className="space-y-3">
        {data.choices.map((choice: any) => (
          <button
            key={choice.id}
            onClick={() => handleChoice(choice.id)}
            disabled={selectedChoice !== null}
            className="w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left disabled:cursor-not-allowed hover:border-opacity-100"
            style={{
              backgroundColor: colors.cardBackground,
              borderColor: selectedChoice ? 'rgba(255,198,39,0.13)' : 'rgba(122,90,98,0.3)',
              ...getChoiceStyle(choice.id, choice.outcome)
            }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0 border-2"
              style={{
                borderColor: colors.textSecondary,
                color: colors.textSecondary,
                ...getCircleStyle(choice.id, choice.outcome)
              }}
            >
              {choice.id}
            </div>
            <span style={{ color: colors.textPrimary }}>{choice.text}</span>
          </button>
        ))}
      </div>

      {!selectedChoice && (
        <div className="flex justify-end">
          <button
            onClick={handleRevealAnswer}
            className="px-4 py-2 rounded-lg font-semibold border transition-all hover:scale-105"
            style={{
              color: colors.textPrimary,
              borderColor: colors.cardBorder,
              backgroundColor: "transparent"
            }}
          >
            Reveal Answer
          </button>
        </div>
      )}

      {showFeedback && selectedChoice && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-6 border-2"
          style={{
            backgroundColor: (() => {
              const outcome = data.choices.find((c: any) => c.id === selectedChoice)?.outcome;
              if (outcome === "ideal") return 'rgba(75,183,196,0.1)';
              if (outcome === "poor") return 'rgba(232,84,122,0.1)';
              return 'rgba(255,198,39,0.1)';
            })(),
            borderColor: (() => {
              const outcome = data.choices.find((c: any) => c.id === selectedChoice)?.outcome;
              if (outcome === "ideal") return colors.accentTeal;
              if (outcome === "poor") return colors.accentPink;
              return colors.accentGold;
            })()
          }}
        >
          <div className="font-bold mb-2" style={{ color: colors.textPrimary }}>
            {(() => {
              if (answerRevealed) return "💡 Answer revealed";
              const outcome = data.choices.find((c: any) => c.id === selectedChoice)?.outcome;
              if (outcome === "ideal") return "🎉 Exactly right!";
              if (outcome === "poor") return "⚠️ Not quite";
              return "🟡 That could work, but...";
            })()}
          </div>
          <p style={{ color: colors.textSecondary }}>
            {data.choices.find((c: any) => c.id === selectedChoice)?.feedback}
          </p>
          {answerRevealed && (
            <p className="mt-2 text-sm" style={{ color: colors.textSecondary }}>
              Revealed answers do not award XP.
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}

function KnowledgeCheckStep({ data, colors, onProceed, onAwardXP, onWaveReaction }: any) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answerRevealed, setAnswerRevealed] = useState(false);

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    setShowFeedback(true);
    onProceed();

    const isCorrect = data.options[index].correct;
    
    if (isCorrect) {
      onWaveReaction("celebrate");
      onAwardXP(data.xpReward);
    } else {
      onWaveReaction("hint");
    }
  };

  const handleRevealAnswer = () => {
    if (selectedAnswer !== null) return;

    const correctIndex = data.options.findIndex((option: any) => option.correct);
    if (correctIndex < 0) return;

    setSelectedAnswer(correctIndex);
    setShowFeedback(true);
    setAnswerRevealed(true);
    onProceed();
    onWaveReaction("hint");
  };

  return (
    <div
      className="rounded-2xl p-8 border space-y-6"
      style={{
        backgroundColor: colors.cardBackground,
        borderColor: 'rgba(255,198,39,0.13)'
      }}
    >
      <div
        className="text-sm font-bold"
        style={{ color: colors.accentGold }}
      >
        ☑️ Knowledge Check {data.number} · Section {data.section}
      </div>

      <h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
        {data.question}
      </h3>

      <div className="space-y-3">
        {data.options.map((option: any, index: number) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = option.correct;
          const showAsCorrect = selectedAnswer !== null && isCorrect;
          
          return (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={selectedAnswer !== null}
              className="w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left disabled:cursor-not-allowed hover:border-opacity-100"
              style={{
                backgroundColor: colors.cardBackground,
                borderColor: (() => {
                  if (isSelected && isCorrect) return '#10B981';
                  if (isSelected && !isCorrect) return colors.accentPink;
                  if (showAsCorrect) return 'rgba(75,183,196,0.6)';
                  return 'rgba(122,90,98,0.3)';
                })(),
                ...(() => {
                  if (isSelected && isCorrect) return { backgroundColor: 'rgba(16,185,129,0.1)' };
                  if (isSelected && !isCorrect) return { backgroundColor: 'rgba(232,84,122,0.1)' };
                  if (showAsCorrect) return { backgroundColor: 'rgba(75,183,196,0.1)' };
                  return {};
                })()
              }}
            >
              <div
                className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                style={{
                  borderColor: (() => {
                    if (isSelected && isCorrect) return '#10B981';
                    if (isSelected && !isCorrect) return colors.accentPink;
                    if (showAsCorrect) return colors.accentTeal;
                    return colors.textSecondary;
                  })(),
                  backgroundColor: (() => {
                    if (isSelected && isCorrect) return '#10B981';
                    if (isSelected && !isCorrect) return colors.accentPink;
                    if (showAsCorrect) return colors.accentTeal;
                    return 'transparent';
                  })()
                }}
              >
                {(isSelected || showAsCorrect) && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              <span style={{ color: colors.textPrimary }}>{option.text}</span>
            </button>
          );
        })}
      </div>

      {selectedAnswer === null && (
        <div className="flex justify-end">
          <button
            onClick={handleRevealAnswer}
            className="px-4 py-2 rounded-lg font-semibold border transition-all hover:scale-105"
            style={{
              color: colors.textPrimary,
              borderColor: colors.cardBorder,
              backgroundColor: "transparent"
            }}
          >
            Reveal Answer
          </button>
        </div>
      )}

      {showFeedback && selectedAnswer !== null && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-6 border-2"
          style={{
            backgroundColor: answerRevealed
              ? 'rgba(75,183,196,0.1)'
              : data.options[selectedAnswer].correct
                ? 'rgba(16,185,129,0.1)'
                : 'rgba(232,84,122,0.1)',
            borderColor: answerRevealed
              ? colors.accentTeal
              : data.options[selectedAnswer].correct
                ? '#10B981'
                : colors.accentPink
          }}
        >
          <p style={{ color: colors.textPrimary }}>
            {answerRevealed
              ? `💡 Answer revealed: ${data.correctFeedback}`
              : data.options[selectedAnswer].correct
                ? data.correctFeedback
                : data.wrongFeedback}
          </p>
          {answerRevealed && (
            <p className="mt-2 text-sm" style={{ color: colors.textSecondary }}>
              Revealed answers do not award XP.
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}

function DragDropStep({ data, colors, onProceed, onAwardXP, onWaveReaction }: any) {
  const [poolItems, setPoolItems] = useState(data.tasks);
  const [goodZone, setGoodZone] = useState<any[]>([]);
  const [verifyZone, setVerifyZone] = useState<any[]>([]);
  const [checked, setChecked] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [answerRevealed, setAnswerRevealed] = useState(false);

  const handleDragStart = (e: React.DragEvent, item: any, source: string) => {
    setDraggedItem(item.id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("item", JSON.stringify(item));
    e.dataTransfer.setData("source", source);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, target: string) => {
    e.preventDefault();
    const item = JSON.parse(e.dataTransfer.getData("item"));
    const source = e.dataTransfer.getData("source");
    
    // Remove from source
    if (source === "pool") {
      setPoolItems(poolItems.filter((i: any) => i.id !== item.id));
    } else if (source === "good") {
      setGoodZone(goodZone.filter((i: any) => i.id !== item.id));
    } else if (source === "verify") {
      setVerifyZone(verifyZone.filter((i: any) => i.id !== item.id));
    }
    
    // Add to target
    if (target === "pool") {
      setPoolItems([...poolItems, item]);
    } else if (target === "good") {
      setGoodZone([...goodZone, item]);
    } else if (target === "verify") {
      setVerifyZone([...verifyZone, item]);
    }
    
    setDraggedItem(null);
  };

  const handleCheck = () => {
    setChecked(true);
    onProceed();
    
    let correct = 0;
    const total = data.tasks.length;
    
    goodZone.forEach((item: any) => {
      if (item.category === "good") correct++;
    });
    
    verifyZone.forEach((item: any) => {
      if (item.category === "verify") correct++;
    });
    
    const percentage = (correct / total) * 100;
    
    if (percentage === 100) {
      onWaveReaction("celebrate");
      onAwardXP(data.xpRewards.perfect);
    } else if (percentage >= 50) {
      onAwardXP(data.xpRewards.partial);
    } else {
      onWaveReaction("hint");
      onAwardXP(data.xpRewards.low);
    }
  };

  const handleRevealAnswer = () => {
    if (checked) return;

    setPoolItems([]);
    setGoodZone(data.tasks.filter((item: any) => item.category === "good"));
    setVerifyZone(data.tasks.filter((item: any) => item.category === "verify"));
    setChecked(true);
    setAnswerRevealed(true);
    onProceed();
    onWaveReaction("hint");
  };

  const getItemStyle = (item: any, zone?: string) => {
    if (!checked) return {};
    
    const isCorrect = 
      (zone === "good" && item.category === "good") ||
      (zone === "verify" && item.category === "verify");
    
    if (isCorrect) {
      return {
        backgroundColor: 'rgba(75,183,196,0.3)',
        borderColor: colors.accentTeal
      };
    } else {
      return {
        backgroundColor: 'rgba(232,84,122,0.3)',
        borderColor: colors.accentPink
      };
    }
  };

  const allItemsPlaced = poolItems.length === 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2" style={{ color: colors.textPrimary }}>
          {data.title.split(data.highlightWord)[0]}
          <span className="italic" style={{ color: colors.accentPink }}>
            {data.highlightWord}
          </span>
        </h2>
        <p style={{ color: colors.textSecondary }}>{data.subtitle}</p>
      </div>

      {/* Pool */}
      <div
        className="rounded-xl p-6 border-2 min-h-24"
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: 'rgba(122,90,98,0.3)',
          borderStyle: 'dashed'
        }}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, "pool")}
      >
        <div className="text-sm font-bold mb-3" style={{ color: colors.textSecondary }}>
          Available Tasks
        </div>
        <div className="flex flex-wrap gap-2">
          {poolItems.map((item: any) => (
            <div
              key={item.id}
              draggable={!checked}
              onDragStart={(e) => handleDragStart(e, item, "pool")}
              className="px-4 py-2 rounded-lg border cursor-move transition-all hover:scale-105"
              style={{
                backgroundColor: draggedItem === item.id ? 'rgba(255,198,39,0.1)' : colors.cardBackground,
                borderColor: 'rgba(255,198,39,0.3)',
                color: colors.textPrimary,
                opacity: draggedItem === item.id ? 0.5 : 1,
                ...getItemStyle(item)
              }}
            >
              {item.text}
            </div>
          ))}
        </div>
      </div>

      {/* Drop Zones */}
      <div className="grid md:grid-cols-2 gap-4">
        <div
          className="rounded-xl p-6 border-2 min-h-48"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: draggedItem ? colors.accentGold : 'rgba(75,183,196,0.3)',
            borderStyle: 'dashed'
          }}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "good")}
        >
          <div className="font-bold mb-4" style={{ color: data.zones.good.color }}>
            {data.zones.good.label}
          </div>
          <div className="space-y-2">
            {goodZone.map((item: any) => (
              <div
                key={item.id}
                draggable={!checked}
                onDragStart={(e) => handleDragStart(e, item, "good")}
                className="px-4 py-2 rounded-lg border cursor-move"
                style={{
                  backgroundColor: colors.cardBackground,
                  borderColor: 'rgba(75,183,196,0.3)',
                  color: colors.textPrimary,
                  opacity: draggedItem === item.id ? 0.5 : 1,
                  ...getItemStyle(item, "good")
                }}
              >
                {item.text}
              </div>
            ))}
          </div>
        </div>

        <div
          className="rounded-xl p-6 border-2 min-h-48"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: draggedItem ? colors.accentGold : 'rgba(255,138,80,0.3)',
            borderStyle: 'dashed'
          }}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "verify")}
        >
          <div className="font-bold mb-4" style={{ color: data.zones.verify.color }}>
            {data.zones.verify.label}
          </div>
          <div className="space-y-2">
            {verifyZone.map((item: any) => (
              <div
                key={item.id}
                draggable={!checked}
                onDragStart={(e) => handleDragStart(e, item, "verify")}
                className="px-4 py-2 rounded-lg border cursor-move"
                style={{
                  backgroundColor: colors.cardBackground,
                  borderColor: 'rgba(255,138,80,0.3)',
                  color: colors.textPrimary,
                  opacity: draggedItem === item.id ? 0.5 : 1,
                  ...getItemStyle(item, "verify")
                }}
              >
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {!checked && (
        <div className="flex justify-center gap-3 flex-wrap">
          <button
            onClick={handleRevealAnswer}
            className="px-5 py-4 rounded-xl font-bold transition-all border hover:scale-105"
            style={{
              color: colors.textPrimary,
              borderColor: colors.cardBorder,
              backgroundColor: "transparent"
            }}
          >
            Reveal Answer
          </button>
          <button
            onClick={handleCheck}
            disabled={!allItemsPlaced}
            className="px-8 py-4 rounded-xl font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105"
            style={{
              backgroundColor: allItemsPlaced ? colors.accentGold : '#7A5A62',
              color: allItemsPlaced ? '#0D0508' : '#F0E0E4'
            }}
          >
            Check My Answers
          </button>
        </div>
      )}

      {checked && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-6 border-2"
          style={{
            backgroundColor: (() => {
              if (answerRevealed) return 'rgba(75,183,196,0.1)';
              const correct = [...goodZone, ...verifyZone].filter((item: any) => 
                (goodZone.includes(item) && item.category === "good") ||
                (verifyZone.includes(item) && item.category === "verify")
              ).length;
              const percentage = (correct / data.tasks.length) * 100;
              if (percentage === 100) return 'rgba(16,185,129,0.1)';
              if (percentage >= 50) return 'rgba(255,198,39,0.1)';
              return 'rgba(232,84,122,0.1)';
            })(),
            borderColor: (() => {
              if (answerRevealed) return colors.accentTeal;
              const correct = [...goodZone, ...verifyZone].filter((item: any) => 
                (goodZone.includes(item) && item.category === "good") ||
                (verifyZone.includes(item) && item.category === "verify")
              ).length;
              const percentage = (correct / data.tasks.length) * 100;
              if (percentage === 100) return '#10B981';
              if (percentage >= 50) return colors.accentGold;
              return colors.accentPink;
            })()
          }}
        >
          <p className="font-bold mb-2" style={{ color: colors.textPrimary }}>
            {(() => {
              if (answerRevealed) return "💡 Answer revealed";
              const correct = [...goodZone, ...verifyZone].filter((item: any) => 
                (goodZone.includes(item) && item.category === "good") ||
                (verifyZone.includes(item) && item.category === "verify")
              ).length;
              const percentage = (correct / data.tasks.length) * 100;
              if (percentage === 100) return "🎉 Perfect!";
              if (percentage >= 50) return "🟡 Good effort!";
              return "💭 Keep learning!";
            })()}
          </p>
          <p style={{ color: colors.textSecondary }}>
            {answerRevealed ? (
              "Wave placed each task in the correct category for you."
            ) : (
              <>
                You got {[...goodZone, ...verifyZone].filter((item: any) => 
                  (goodZone.includes(item) && item.category === "good") ||
                  (verifyZone.includes(item) && item.category === "verify")
                ).length} out of {data.tasks.length} correct.
              </>
            )}
          </p>
          {answerRevealed && (
            <p className="mt-2 text-sm" style={{ color: colors.textSecondary }}>
              Revealed answers do not award XP.
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}

function CompletionStep({ data, colors, totalXP, onComplete }: any) {
  return (
    <div
      className="rounded-2xl p-12 text-center space-y-8 border-2"
      style={{
        backgroundColor: colors.cardBackground,
        borderColor: colors.accentGold,
        boxShadow: `0 0 40px ${colors.accentGold}40`
      }}
    >
      <div className="text-7xl">{data.emoji}</div>
      
      <div>
        <h1 className="text-4xl font-bold mb-3" style={{ color: colors.textPrimary }}>
          {data.title.split(data.highlightWord)[0]}
          <span className="italic" style={{ color: colors.accentGold }}>
            {data.highlightWord}
          </span>
        </h1>
        <p className="text-lg" style={{ color: colors.textSecondary }}>
          {data.subtitle}
        </p>
      </div>

      <div
        className="inline-block px-8 py-4 rounded-2xl"
        style={{
          backgroundColor: 'rgba(255,198,39,0.2)',
          border: `2px solid ${colors.accentGold}`
        }}
      >
        <div className="text-sm mb-1" style={{ color: colors.textSecondary }}>
          XP Earned
        </div>
        <div className="text-4xl font-bold" style={{ color: colors.accentGold }}>
          +{totalXP} XP
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        {data.badges.map((badge: any, idx: number) => (
          <div
            key={idx}
            className="w-24 h-24 rounded-2xl flex items-center justify-center border-2"
            style={{
              backgroundColor: 'rgba(255,198,39,0.1)',
              borderColor: colors.accentGold
            }}
          >
            <div className="text-center">
              <div className="text-3xl mb-1">{badge.emoji}</div>
              <div className="text-xs font-bold" style={{ color: colors.textSecondary }}>
                {badge.name}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        className="rounded-xl p-6 text-left"
        style={{
          backgroundColor: 'rgba(122,90,98,0.2)'
        }}
      >
        <div className="font-bold mb-3 flex items-center gap-2" style={{ color: colors.textPrimary }}>
          <CheckCircle2 size={20} style={{ color: colors.accentGold }} />
          Key Takeaways
        </div>
        <ul className="space-y-2">
          {data.takeaways.map((takeaway: string, idx: number) => (
            <li key={idx} className="flex items-start gap-3">
              <span style={{ color: colors.accentGold }}>•</span>
              <span style={{ color: colors.textSecondary }}>{takeaway}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={onComplete}
        className="px-10 py-5 rounded-xl font-bold text-xl transition-all hover:scale-105"
        style={{
          backgroundColor: colors.accentGold,
          color: '#0D0508'
        }}
      >
        Back to Learning Lab →
      </button>
    </div>
  );
}



// ── WaveTalkStep ──────────────────────────────────────────────────────────────
// Wave appears at the same level as the active bubble, slides in from the left,
// and faces right toward the speech bubble. Previous bubbles stack above faded.
function WaveTalkStep({ data, colors, onNext }: { data: any; colors: any; onNext: () => void }) {
  const [msgIndex, setMsgIndex] = useState(0);
  const messages: { text: string; mood: string }[] = data.messages;
  const isLast = msgIndex === messages.length - 1;
  const current = messages[msgIndex];

  // Width of the dolphin column — used to indent previous messages so they align
  const DOLPHIN_COL = "w-28"; // ~112 px

  const advance = () => {
    if (!isLast) setMsgIndex(i => i + 1);
    else onNext();
  };

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div>
        <span
          className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3"
          style={{ backgroundColor: 'rgba(232,84,122,0.2)', color: colors.accentPink }}
        >
          Section {data.section}
        </span>
        <h2 className="text-3xl font-bold mb-1" style={{ color: colors.textPrimary }}>
          {data.title}
        </h2>
        <p style={{ color: colors.textSecondary }}>{data.subtitle}</p>
      </div>

      {/* Chat thread */}
      <div className="space-y-3">

        {/* Previous messages — full brightness so users can read what came before */}
        {messages.slice(0, msgIndex).map((msg, idx) => (
          <div key={idx} className="flex gap-4">
            <div className={`${DOLPHIN_COL} flex-shrink-0`} /> {/* spacer */}
            <div
              className="flex-1 rounded-2xl px-5 py-3"
              style={{ border: `1px solid rgba(255,198,39,0.25)` }}
            >
              <p
                className="text-sm leading-relaxed"
                style={{ color: colors.textPrimary }}
                dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*(.*?)\*/g, '<em>$1</em>') }}
              />
            </div>
          </div>
        ))}

        {/* Active row — dolphin bounces in, bubble fades up smoothly */}
        <AnimatePresence mode="wait">
          <div key={msgIndex} className="flex items-center gap-4">

            {/* Dolphin — flipped so it faces right toward the bubble */}
            <motion.div
              className={`${DOLPHIN_COL} flex-shrink-0 flex flex-col items-center`}
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
            >
              {/* scaleX(-1) flips the SVG horizontally without mirroring the label */}
              <div style={{ transform: 'scaleX(-1)' }}>
                <DolphinMascot
                  size={100}
                  animate
                  expression={
                    current.mood === "celebrate" ? "celebrate"
                    : current.mood === "hint" ? "hint"
                    : "default"
                  }
                />
              </div>
              <p className="text-xs font-bold tracking-wider mt-1" style={{ color: colors.accentGold }}>
                WAVE
              </p>
            </motion.div>

            {/* Speech bubble */}
            <motion.div
              className="flex-1 relative rounded-2xl px-5 py-4"
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                backgroundColor: colors.cardBackground,
                border: `2px solid ${colors.accentGold}`,
                boxShadow: `0 0 24px rgba(255,198,39,0.08)`
              }}
            >
              {/* Pointer pointing left toward Wave */}
              <div
                className="absolute -left-[9px] top-6 w-4 h-4 rotate-45"
                style={{
                  backgroundColor: colors.cardBackground,
                  borderLeft: `2px solid ${colors.accentGold}`,
                  borderBottom: `2px solid ${colors.accentGold}`
                }}
              />
              <p
                className="leading-relaxed"
                style={{ color: colors.textPrimary }}
                dangerouslySetInnerHTML={{ __html: current.text.replace(/\*(.*?)\*/g, '<em>$1</em>') }}
              />
            </motion.div>
          </div>
        </AnimatePresence>

        {/* Progress dots + advance button — aligned with bubble column */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-2 items-center" style={{ marginLeft: 'calc(7rem + 1rem)' }}>
            {messages.map((_, idx) => (
              <motion.div
                key={idx}
                animate={{ width: idx === msgIndex ? 20 : 8 }}
                transition={{ duration: 0.3 }}
                className="h-2 rounded-full"
                style={{
                  backgroundColor: idx <= msgIndex ? colors.accentGold : 'rgba(255,198,39,0.2)'
                }}
              />
            ))}
          </div>
          <button
            onClick={advance}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all hover:scale-105"
            style={{ backgroundColor: colors.accentGold, color: '#0D0508' }}
          >
            <span>{isLast ? "Got it!" : "Continue"}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Review Mode ───────────────────────────────────────────────────────────────

function ReviewModeContent({
  questions,
  colors,
  onDone
}: {
  questions: Array<{ step: Step; idx: number }>;
  colors: any;
  onDone: () => void;
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const total = questions.length;

  if (total === 0) {
    return (
      <div className="text-center py-20 space-y-6">
        <div className="text-6xl">📋</div>
        <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
          Nothing to review yet
        </h2>
        <p style={{ color: colors.textSecondary }}>
          Complete at least one step to see it here.
        </p>
        <button
          onClick={onDone}
          className="px-6 py-3 rounded-xl font-bold transition-all hover:scale-105"
          style={{ backgroundColor: colors.accentGold, color: '#0D0508' }}
        >
          Back to Learning Lab
        </button>
      </div>
    );
  }

  const { step } = questions[currentIdx];
  const isConceptStep = step.type === "wave-talk" || step.type === "reading";

  return (
    <div className="space-y-6">
      {/* Review header */}
      <div>
        <span
          className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3"
          style={{ backgroundColor: 'rgba(75,183,196,0.2)', color: colors.accentTeal }}
        >
          📋 REVIEW MODE
        </span>
        <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
          Reviewing Module Content
        </h2>
        <p className="mt-1" style={{ color: colors.textSecondary }}>
          {currentIdx + 1} of {total} — {isConceptStep ? "concept" : "question"}
        </p>
      </div>

      {/* Progress dots — gold for concepts, teal for questions */}
      <div className="flex gap-2 items-center">
        {questions.map(({ step: s }, idx) => {
          const isConcept = s.type === "wave-talk" || s.type === "reading";
          const isActive = idx === currentIdx;
          const isPast = idx < currentIdx;
          return (
            <button
              key={idx}
              onClick={() => setCurrentIdx(idx)}
              className="h-2 rounded-full transition-all"
              style={{
                width: isActive ? 24 : 8,
                backgroundColor: isActive || isPast
                  ? (isConcept ? colors.accentGold : colors.accentTeal)
                  : 'rgba(122,90,98,0.3)'
              }}
            />
          );
        })}
      </div>

      {/* Content card */}
      <motion.div
        key={currentIdx}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {step.type === "wave-talk" && (
          <ReviewWaveTalk data={step.data} colors={colors} />
        )}
        {step.type === "reading" && (
          <ReviewReading data={step.data} colors={colors} />
        )}
        {step.type === "knowledge-check" && (
          <ReviewKnowledgeCheck data={step.data} colors={colors} />
        )}
        {step.type === "scenario" && (
          <ReviewScenario data={step.data} colors={colors} />
        )}
        {step.type === "drag-drop" && (
          <ReviewDragDrop data={step.data} colors={colors} />
        )}
      </motion.div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setCurrentIdx(i => i - 1)}
          disabled={currentIdx === 0}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold border transition-all disabled:opacity-30 hover:scale-105"
          style={{ color: colors.textPrimary, borderColor: colors.cardBorder, backgroundColor: 'transparent' }}
        >
          ← Previous
        </button>
        {currentIdx < total - 1 ? (
          <button
            onClick={() => setCurrentIdx(i => i + 1)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all hover:scale-105"
            style={{ backgroundColor: colors.accentTeal, color: '#0D0508' }}
          >
            Next →
          </button>
        ) : (
          <button
            onClick={onDone}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all hover:scale-105"
            style={{ backgroundColor: colors.accentGold, color: '#0D0508' }}
          >
            Done Reviewing →
          </button>
        )}
      </div>
    </div>
  );
}

// Concept review: wave-talk displayed as a clean summary card (no dolphin/animation)
function ReviewWaveTalk({ data, colors }: { data: any; colors: any }) {
  return (
    <div
      className="rounded-2xl border-2 overflow-hidden"
      style={{ backgroundColor: colors.cardBackground, borderColor: 'rgba(255,198,39,0.35)' }}
    >
      {/* Header strip */}
      <div
        className="px-8 py-4 flex items-center gap-3"
        style={{ backgroundColor: 'rgba(255,198,39,0.08)', borderBottom: '1px solid rgba(255,198,39,0.15)' }}
      >
        <span className="text-lg">💡</span>
        <div>
          <div className="text-xs font-bold tracking-widest mb-0.5" style={{ color: colors.accentGoldText }}>
            KEY CONCEPTS · {data.section ? `SECTION ${data.section}` : ""}
          </div>
          <h3 className="font-bold text-lg leading-tight" style={{ color: colors.textPrimary }}>
            {data.title}
          </h3>
          {data.subtitle && (
            <p className="text-sm mt-0.5" style={{ color: colors.textSecondary }}>{data.subtitle}</p>
          )}
        </div>
      </div>

      {/* Messages as a clean bullet-style list */}
      <div className="px-8 py-6 space-y-4">
        {data.messages.map((msg: { text: string }, i: number) => (
          <div key={i} className="flex gap-3">
            <span
              className="mt-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ backgroundColor: 'rgba(232,84,122,0.15)', color: colors.accentPink }}
            >
              {i + 1}
            </span>
            <p
              className="leading-relaxed flex-1"
              style={{ color: colors.textPrimary }}
              dangerouslySetInnerHTML={{
                __html: msg.text.replace(/\*(.*?)\*/g, '<em>$1</em>')
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Concept review: reading step displayed as a clean summary card
function ReviewReading({ data, colors }: { data: any; colors: any }) {
  return (
    <div
      className="rounded-2xl border-2 overflow-hidden"
      style={{ backgroundColor: colors.cardBackground, borderColor: 'rgba(255,198,39,0.35)' }}
    >
      {/* Header strip */}
      <div
        className="px-8 py-4 flex items-center gap-3"
        style={{ backgroundColor: 'rgba(255,198,39,0.08)', borderBottom: '1px solid rgba(255,198,39,0.15)' }}
      >
        <span className="text-lg">📖</span>
        <div>
          <div className="text-xs font-bold tracking-widest mb-0.5" style={{ color: colors.accentGoldText }}>
            READING · {data.label ?? `SECTION ${data.section}`}
          </div>
          <h3 className="font-bold text-lg leading-tight" style={{ color: colors.textPrimary }}>
            {data.title}
          </h3>
          {data.subtitle && (
            <p className="text-sm mt-0.5" style={{ color: colors.textSecondary }}>{data.subtitle}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-6 space-y-4">
        {data.content?.map((paragraph: string, idx: number) => (
          <p
            key={idx}
            className="leading-relaxed"
            style={{ color: colors.textPrimary, lineHeight: 1.75 }}
            dangerouslySetInnerHTML={{
              __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            }}
          />
        ))}

        {data.comparison && (
          <div className="grid md:grid-cols-2 gap-4 mt-2">
            <div
              className="p-4 rounded-xl border"
              style={{ backgroundColor: 'rgba(232,84,122,0.05)', borderColor: 'rgba(232,84,122,0.3)' }}
            >
              <div className="font-bold mb-2 text-sm" style={{ color: colors.accentPink }}>
                {data.comparison.left.label}
              </div>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                {data.comparison.left.text}
              </p>
            </div>
            <div
              className="p-4 rounded-xl border"
              style={{ backgroundColor: 'rgba(75,183,196,0.05)', borderColor: 'rgba(75,183,196,0.3)' }}
            >
              <div className="font-bold mb-2 text-sm" style={{ color: colors.accentTeal }}>
                {data.comparison.right.label}
              </div>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                {data.comparison.right.text}
              </p>
            </div>
          </div>
        )}

        {data.hint && (
          <div
            className="p-4 rounded-xl border mt-2"
            style={{ backgroundColor: 'rgba(75,183,196,0.05)', borderColor: 'rgba(75,183,196,0.3)' }}
          >
            <p className="text-sm" style={{ color: colors.accentTeal }}>{data.hint}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ReviewKnowledgeCheck({ data, colors }: { data: any; colors: any }) {
  return (
    <div
      className="rounded-2xl p-8 border-2 space-y-6"
      style={{ backgroundColor: colors.cardBackground, borderColor: 'rgba(75,183,196,0.35)' }}
    >
      <div className="text-sm font-bold" style={{ color: colors.accentTeal }}>
        ☑️ Knowledge Check · Section {data.section}
      </div>

      <h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
        {data.question}
      </h3>

      <div className="space-y-3">
        {data.options.map((option: any, index: number) => {
          const isCorrect = option.correct;
          return (
            <div
              key={index}
              className="flex items-start gap-4 p-4 rounded-xl border-2"
              style={{
                backgroundColor: isCorrect ? 'rgba(16,185,129,0.1)' : colors.cardBackground,
                borderColor: isCorrect ? '#10B981' : 'rgba(122,90,98,0.2)'
              }}
            >
              <div
                className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{
                  borderColor: isCorrect ? '#10B981' : 'rgba(122,90,98,0.3)',
                  backgroundColor: isCorrect ? '#10B981' : 'transparent'
                }}
              >
                {isCorrect && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <div className="flex-1">
                <span style={{ color: isCorrect ? colors.textPrimary : colors.textSecondary }}>
                  {option.text}
                </span>
                {isCorrect && (
                  <div className="mt-1 text-xs font-bold" style={{ color: '#10B981' }}>
                    ✓ Correct Answer
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="rounded-xl p-4 border"
        style={{ backgroundColor: 'rgba(16,185,129,0.07)', borderColor: 'rgba(16,185,129,0.3)' }}
      >
        <p className="text-sm" style={{ color: colors.textSecondary }}>{data.correctFeedback}</p>
      </div>
    </div>
  );
}

function ReviewScenario({ data, colors }: { data: any; colors: any }) {
  const idealChoice = data.choices.find((c: any) => c.outcome === "ideal");
  return (
    <div
      className="rounded-2xl p-8 border-2 space-y-6"
      style={{ backgroundColor: colors.cardBackground, borderColor: 'rgba(75,183,196,0.35)' }}
    >
      <div className="text-sm font-bold" style={{ color: colors.accentTeal }}>
        💬 Scenario — {data.title}
      </div>

      <div>
        <span className="font-bold text-lg" style={{ color: colors.accentGold }}>
          {data.character}
        </span>
        <p className="mt-3 leading-relaxed" style={{ color: colors.textPrimary }}>
          {data.scenario}
        </p>
      </div>

      <div className="space-y-3">
        {data.choices.map((choice: any) => {
          const isIdeal = choice.outcome === "ideal";
          return (
            <div
              key={choice.id}
              className="flex items-start gap-4 p-4 rounded-xl border-2"
              style={{
                backgroundColor: isIdeal ? 'rgba(75,183,196,0.1)' : colors.cardBackground,
                borderColor: isIdeal ? colors.accentTeal : 'rgba(122,90,98,0.2)'
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0 border-2"
                style={{
                  borderColor: isIdeal ? colors.accentTeal : 'rgba(122,90,98,0.3)',
                  color: isIdeal ? colors.accentTeal : colors.textSecondary,
                  backgroundColor: isIdeal ? 'rgba(75,183,196,0.2)' : 'transparent'
                }}
              >
                {choice.id}
              </div>
              <div className="flex-1">
                <span style={{ color: isIdeal ? colors.textPrimary : colors.textSecondary }}>
                  {choice.text}
                </span>
                {isIdeal && (
                  <div className="mt-1 text-xs font-bold" style={{ color: colors.accentTeal }}>
                    ✓ Best Choice
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {idealChoice?.feedback && (
        <div
          className="rounded-xl p-4 border"
          style={{ backgroundColor: 'rgba(75,183,196,0.07)', borderColor: 'rgba(75,183,196,0.3)' }}
        >
          <p className="text-sm" style={{ color: colors.textSecondary }}>{idealChoice.feedback}</p>
        </div>
      )}
    </div>
  );
}

function ReviewDragDrop({ data, colors }: { data: any; colors: any }) {
  const goodItems = data.tasks.filter((t: any) => t.category === "good");
  const verifyItems = data.tasks.filter((t: any) => t.category === "verify");

  return (
    <div
      className="rounded-2xl p-8 border-2 space-y-6"
      style={{ backgroundColor: colors.cardBackground, borderColor: 'rgba(75,183,196,0.35)' }}
    >
      <div className="text-sm font-bold" style={{ color: colors.accentTeal }}>
        🗂️ Sort the Tasks
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
          {data.title}
        </h2>
        <p style={{ color: colors.textSecondary }}>{data.subtitle}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div
          className="rounded-xl p-6 border-2"
          style={{ backgroundColor: 'rgba(75,183,196,0.05)', borderColor: 'rgba(75,183,196,0.4)' }}
        >
          <div className="font-bold mb-3" style={{ color: data.zones.good.color }}>
            {data.zones.good.label}
          </div>
          <div className="space-y-2">
            {goodItems.map((item: any) => (
              <div
                key={item.id}
                className="px-4 py-2 rounded-lg border"
                style={{
                  backgroundColor: 'rgba(75,183,196,0.12)',
                  borderColor: 'rgba(75,183,196,0.4)',
                  color: colors.textPrimary
                }}
              >
                {item.text}
              </div>
            ))}
          </div>
        </div>

        <div
          className="rounded-xl p-6 border-2"
          style={{ backgroundColor: 'rgba(255,138,80,0.05)', borderColor: 'rgba(255,138,80,0.4)' }}
        >
          <div className="font-bold mb-3" style={{ color: data.zones.verify.color }}>
            {data.zones.verify.label}
          </div>
          <div className="space-y-2">
            {verifyItems.map((item: any) => (
              <div
                key={item.id}
                className="px-4 py-2 rounded-lg border"
                style={{
                  backgroundColor: 'rgba(255,138,80,0.12)',
                  borderColor: 'rgba(255,138,80,0.4)',
                  color: colors.textPrimary
                }}
              >
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
