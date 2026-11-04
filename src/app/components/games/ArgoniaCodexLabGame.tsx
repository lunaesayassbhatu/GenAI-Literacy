import { useState, type ReactNode } from "react";
import { Lightbulb, Send } from "lucide-react";
import { addXP, saveHighScore } from "../../utils/userData";
import {
  LAB as L,
  BOOKS,
  SOURCES_EXPLAIN,
  answerLeg,
  answerHousehold,
  answerSources,
  loadInvestigationProgress,
  saveInvestigationDone,
  type AnswerResult,
} from "../../data/argoniaInvestigations";
import {
  ACCENT,
  GOLD,
  XP_GOOD_CHOICE,
  Shell,
  Card,
  StepBar,
  Heading,
  Story,
  Speaker,
  NextButton,
  ChoiceList,
  ResultCard,
} from "./ArgoniaShared";
import { ArgoniaFigure3D } from "./ArgoniaFigure3D";

// The Professor's Lab: a scripted "feed the codex" simulator (no AI is called).
// The player feeds the codex books and asks it questions. Each answer is written ahead of time and chosen by
// simple rules from which books are loaded, so the player sees how training material shapes the answer.
// All the words and rules live in data/argoniaInvestigations.ts.

const STAGES = ["arrive", "worry", "explain", "demo", "leg", "household", "sources", "reflect", "outro"] as const;
type Stage = (typeof STAGES)[number];

const XP_DEMO = 5;
const XP_FLAG_RIGHT = 10;
const XP_FLAG_WRONG = -5;
const PROFESSOR = { name: "The Professor", emoji: "🎓" };

const sameSet = (a: string[], b: string[]) => a.length === b.length && a.every((x) => b.includes(x));
const sig = (ids: string[]) => [...ids].sort().join("|");

// ─── the bench: the codex, the shelf of books and the question ────────────────

function Bench({
  loaded,
  onToggle,
  question,
  asked,
  onAsk,
  askLabel = "Ask the codex",
  askDisabled,
  askNote,
  children,
}: {
  loaded: string[];
  onToggle: (id: string) => void;
  question: string;
  asked: boolean;
  onAsk: () => void;
  askLabel?: string;
  askDisabled?: boolean;
  askNote?: string;
  children?: ReactNode;
}) {
  const [inspect, setInspect] = useState<string | null>(null);
  const shown = BOOKS.find((b) => b.id === inspect);

  return (
    <div className="max-w-4xl mx-auto rounded-3xl p-6 shadow-2xl" style={{ backgroundColor: "rgba(255,255,255,0.05)", border: `1px solid ${ACCENT}55`, animation: "argEnter 0.35s ease both" }}>
      <div className="grid md:grid-cols-[230px_minmax(0,1fr)] gap-6">
        {/* the codex and what it has been fed */}
        <div className="text-center">
          <div className="rounded-2xl inline-block" style={{ background: "radial-gradient(circle at 50% 70%, rgba(139,92,246,0.28), rgba(139,92,246,0) 70%)" }}>
            <ArgoniaFigure3D kind="codex" width={200} height={150} talking={asked} />
          </div>
          <div className="text-xs font-bold tracking-widest uppercase mt-2 mb-2" style={{ color: GOLD }}>Fed to the codex</div>
          {loaded.length === 0 ? (
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Nothing yet. Its book slot is empty.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5 justify-center">
              {loaded.map((id) => {
                const b = BOOKS.find((x) => x.id === id)!;
                return (
                  <span key={id} className="text-[11px] font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: `${b.color}66`, color: "#ffffff", border: `1px solid ${b.color}` }}>
                    {b.emoji} {b.title}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* the shelf, the question, the answer */}
        <div className="min-w-0">
          <div className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: GOLD }}>The shelf · tap a book to feed it, tap again to take it out</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
            {BOOKS.map((b) => {
              const on = loaded.includes(b.id);
              return (
                <button
                  key={b.id}
                  onClick={() => { onToggle(b.id); setInspect(b.id); }}
                  onMouseEnter={() => setInspect(b.id)}
                  onFocus={() => setInspect(b.id)}
                  aria-pressed={on}
                  title={b.about}
                  className="text-left rounded-xl p-2.5 border-2 transition-all hover:scale-[1.03]"
                  style={{ backgroundColor: on ? `${b.color}55` : "rgba(255,255,255,0.04)", borderColor: on ? b.color : "rgba(255,255,255,0.15)", color: "#ffffff" }}
                >
                  <div className="text-xl">{b.emoji}</div>
                  <div className="text-xs font-bold leading-tight">{b.title}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: on ? GOLD : "rgba(255,255,255,0.45)" }}>{on ? "✓ fed" : "on the shelf"}</div>
                </button>
              );
            })}
          </div>
          <p className="text-xs mb-4 min-h-[2.5rem]" style={{ color: "rgba(255,255,255,0.65)" }}>
            {shown ? <><span className="font-bold" style={{ color: GOLD }}>{shown.title}: </span>{shown.about}</> : "Point at a book to see where it came from."}
          </p>

          <div className="rounded-xl p-3 mb-3" style={{ backgroundColor: "rgba(245,235,215,0.08)", border: "1px solid rgba(245,235,215,0.2)" }}>
            <div className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: "rgba(245,235,215,0.6)" }}>Your question</div>
            <div style={{ color: "#F5EBD7", fontFamily: "Georgia, serif", fontSize: 17 }}>“{question}”</div>
          </div>
          <button
            onClick={onAsk}
            disabled={askDisabled}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold hover:scale-105 transition-transform disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{ backgroundColor: GOLD, color: "#0D0508" }}
          >
            <Send size={16} /> {askLabel}
          </button>
          {askNote && <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.55)" }}>{askNote}</p>}
          {children}
        </div>
      </div>
    </div>
  );
}

/** The printed slip of paper with the codex's answer, and the professor's note on it. */
function Answer({ result, stale, coachTitle = "The professor's note" }: { result: AnswerResult; stale: boolean; coachTitle?: string }) {
  return (
    <div className="mt-4" style={{ animation: "argEnter 0.3s ease both" }}>
      <div className="rounded-xl p-4 space-y-2" style={{ backgroundColor: "rgba(245,235,215,0.1)", border: "1px solid rgba(245,235,215,0.25)", opacity: stale ? 0.45 : 1 }}>
        <div className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "rgba(245,235,215,0.6)" }}>The codex prints</div>
        {result.lines.map((l, i) => (
          <p key={i} style={{ color: "#F5EBD7", fontFamily: "Georgia, serif", fontSize: 16, lineHeight: 1.55 }}>{l.text}</p>
        ))}
      </div>
      {stale ? (
        <p className="text-sm mt-2 font-semibold" style={{ color: GOLD }}>You changed the books. Ask again to see the new answer.</p>
      ) : (
        result.coach && (
          <div className="rounded-xl p-3 mt-3 text-sm" style={{ backgroundColor: "rgba(139,92,246,0.12)", border: `1px solid ${ACCENT}55`, color: "rgba(255,255,255,0.85)" }}>
            <span className="font-bold" style={{ color: ACCENT }}>{coachTitle}: </span>
            {result.coach}
          </div>
        )
      )}
    </div>
  );
}

// ─── the game ────────────────────────────────────────────────────────────────

export function ArgoniaCodexLabGame() {
  const [idx, setIdx] = useState(0);
  const [awarded, setAwarded] = useState<number | null>(null);
  const [bonus, setBonus] = useState(0); // demo, reflection and flag points
  const [loaded, setLoaded] = useState<string[]>(["chronicle"]);

  const [demoAsked, setDemoAsked] = useState<string[]>([]);

  // Task 1 (the leg)
  const [leg, setLeg] = useState<{ result: AnswerResult; with: string[] } | null>(null);
  const [legBest, setLegBest] = useState(0);
  // Task 2 (the household)
  const [house, setHouse] = useState<{ result: AnswerResult; with: string[] } | null>(null);
  const [houseSigs, setHouseSigs] = useState<string[]>([]);
  // Task 3 (the sources)
  const [src, setSrc] = useState<{ result: ReturnType<typeof answerSources>; with: string[] } | null>(null);
  const [doubt, setDoubt] = useState<number[]>([]);
  const [srcDone, setSrcDone] = useState(false);
  const [srcPoints, setSrcPoints] = useState(0);

  const [pickReflect, setPickReflect] = useState<number | null>(null);
  const [hint, setHint] = useState(false);

  const stage: Stage = STAGES[idx];
  const isLast = idx === STAGES.length - 1;
  const houseSolved = houseSigs.length >= 2;
  const xp = bonus + legBest + (houseSolved ? 20 : 0) + srcPoints;

  const canContinue =
    stage === "arrive" ||
    stage === "worry" ||
    stage === "explain" ||
    stage === "outro" ||
    (stage === "demo" && demoAsked.length === L.demo.questions.length) ||
    (stage === "leg" && legBest > 0) ||
    (stage === "household" && houseSolved) ||
    (stage === "sources" && srcDone) ||
    (stage === "reflect" && pickReflect !== null);

  const toggleBook = (id: string) => setLoaded((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id]));

  const finish = () => {
    const firstTime = !loadInvestigationProgress().includes(L.id);
    const gain = firstTime ? xp : 0;
    if (gain > 0) addXP(gain);
    saveHighScore(`argonia-${L.id}`, xp);
    saveInvestigationDone(L.id);
    setAwarded(gain);
  };

  const next = () => {
    if (isLast) return finish();
    setHint(false);
    setIdx((i) => i + 1);
  };

  const askDemo = (id: string) => {
    if (demoAsked.includes(id)) return;
    setDemoAsked((d) => [...d, id]);
    setBonus((b) => b + XP_DEMO);
  };

  const askLeg = () => {
    const result = answerLeg(loaded);
    setLeg({ result, with: loaded });
    setLegBest((best) => Math.max(best, result.xp));
  };

  const askHouse = () => {
    const result = answerHousehold(loaded);
    setHouse({ result, with: loaded });
    const s = sig(loaded);
    if (loaded.length > 0 && !houseSigs.includes(s)) setHouseSigs((h) => [...h, s]);
  };

  const askSources = () => setSrc({ result: answerSources(loaded), with: loaded });

  // the codex lists its sources in a fixed, mixed-up order
  const sourceOrder = [1, 0, 2];
  const submitDoubts = () => {
    if (!src) return;
    let gain = 0;
    sourceOrder.forEach((si, slot) => {
      if (doubt.includes(slot)) gain += src.result.sources[si].real ? XP_FLAG_WRONG : XP_FLAG_RIGHT;
    });
    setSrcPoints(Math.max(0, gain));
    setSrcDone(true);
  };

  const pickReflection = (i: number) => {
    if (pickReflect !== null) return;
    setPickReflect(i);
    if (L.reflect.options[i].good) setBonus((b) => b + XP_GOOD_CHOICE);
  };

  const replay = () => {
    setIdx(0);
    setAwarded(null);
    setBonus(0);
    setLoaded(["chronicle"]);
    setDemoAsked([]);
    setLeg(null);
    setLegBest(0);
    setHouse(null);
    setHouseSigs([]);
    setSrc(null);
    setDoubt([]);
    setSrcDone(false);
    setSrcPoints(0);
    setPickReflect(null);
    setHint(false);
  };

  const wave =
    stage === "leg" || stage === "household" || stage === "sources"
      ? "Try different books and ask again. Seeing the answer change is the whole point."
      : stage === "demo"
        ? "Notice what the codex does when it has no information on a topic."
        : "Take your time. Think about what you'd be able to check afterwards.";

  if (awarded !== null) {
    return (
      <Shell title={L.title} subtitle="A text investigation" wave="You've seen how a codex learns. What it reads shapes everything it says.">
        <ResultCard gameTitle={L.title} score={xp} awarded={awarded} clue={L.clue} takeaway={L.takeaway} onReplay={replay} nextTo="/games/argonia" nextLabel="Back to the quest map" />
      </Shell>
    );
  }

  const taskIndex = stage === "leg" ? 0 : stage === "household" ? 1 : 2;
  const task = L.tasks[taskIndex];

  return (
    // Wave stays off the hands-on steps: its bubble would sit on top of the shelf and the answer.
    <Shell title={L.title} subtitle={`Module ${L.moduleNumber} · ${L.module}`} wave={wave} showWave={stage !== "leg" && stage !== "household" && stage !== "sources"}>
      <StepBar index={idx} total={STAGES.length} />

      {stage === "arrive" && (
        <Card k={stage}>
          <Heading figure="professor">
            <Story title={L.arrive.title} text={L.arrive.text} />
          </Heading>
        </Card>
      )}

      {stage === "worry" && (
        <Card k={stage}>
          <Heading figure="professor" talking>
            <Speaker {...PROFESSOR} />
            <Story title={L.worry.title} text={L.worry.text} />
          </Heading>
        </Card>
      )}

      {stage === "explain" && (
        <Card k={stage}>
          <Heading figure="professor" talking>
            <Speaker {...PROFESSOR} />
            <Story title={L.explain.title} text={L.explain.text} />
          </Heading>
        </Card>
      )}

      {stage === "demo" && (
        <Card k={stage}>
          <Heading figure="codex" talking={demoAsked.length > 0}>
            <h3 className="text-lg font-bold mb-1" style={{ color: "#ffffff" }}>{L.demo.prompt}</h3>
            <p className="text-xs mb-3" style={{ color: "rgba(255,255,255,0.55)" }}>Fed so far: 👑 Royal Chronicle</p>
          </Heading>
          <div className="space-y-3 mt-3">
            {L.demo.questions.map((q) => {
              const asked = demoAsked.includes(q.id);
              return (
                <div key={q.id}>
                  <button
                    onClick={() => askDemo(q.id)}
                    disabled={asked}
                    className="w-full text-left p-3 rounded-xl border-2 transition-all disabled:cursor-default"
                    style={{ color: "#ffffff", backgroundColor: asked ? "rgba(139,92,246,0.12)" : "rgba(255,255,255,0.04)", borderColor: asked ? ACCENT : "rgba(255,255,255,0.18)" }}
                  >
                    ❓ “{q.text}”
                  </button>
                  {asked && (
                    <div className="mt-2 ml-3 space-y-1" style={{ animation: "argEnter 0.3s ease both" }}>
                      <p className="rounded-lg p-3" style={{ backgroundColor: "rgba(245,235,215,0.1)", border: "1px solid rgba(245,235,215,0.25)", color: "#F5EBD7", fontFamily: "Georgia, serif" }}>{q.answer}</p>
                      <p className="text-xs px-1" style={{ color: "rgba(255,255,255,0.7)" }}>{q.note}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {demoAsked.length === L.demo.questions.length ? (
            <p className="mt-4 leading-relaxed" style={{ color: "rgba(255,255,255,0.88)", fontFamily: "Georgia, serif", fontSize: 16 }}>{L.demo.afterwards}</p>
          ) : (
            <p className="text-sm mt-4" style={{ color: "rgba(255,255,255,0.5)" }}>Ask all three to move on.</p>
          )}
        </Card>
      )}

      {stage === "leg" && (
        <>
          <p className="max-w-4xl mx-auto text-sm mb-3" style={{ color: "rgba(255,255,255,0.8)" }}>{task.intro}</p>
          <Bench loaded={loaded} onToggle={toggleBook} question={task.question} asked={leg !== null} onAsk={askLeg}>
            {leg && <Answer result={leg.result} stale={!sameSet(leg.with, loaded)} />}
            {!legBest && (
              <div className="mt-3">
                <button onClick={() => setHint(true)} className="flex items-center gap-2 text-sm font-semibold hover:opacity-80" style={{ color: GOLD }}>
                  <Lightbulb size={16} /> Need a hint?
                </button>
                {hint && <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.75)" }}>{task.hint}</p>}
              </div>
            )}
          </Bench>
        </>
      )}

      {stage === "household" && (
        <>
          <p className="max-w-4xl mx-auto text-sm mb-3" style={{ color: "rgba(255,255,255,0.8)" }}>{task.intro}</p>
          <Bench
            loaded={loaded}
            onToggle={toggleBook}
            question={task.question}
            asked={house !== null}
            onAsk={askHouse}
            askNote={`Different book sets tried: ${houseSigs.length} of 2`}
          >
            {house && <Answer result={house.result} stale={!sameSet(house.with, loaded)} />}
            {!houseSolved && (
              <div className="mt-3">
                <button onClick={() => setHint(true)} className="flex items-center gap-2 text-sm font-semibold hover:opacity-80" style={{ color: GOLD }}>
                  <Lightbulb size={16} /> Need a hint?
                </button>
                {hint && <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.75)" }}>{task.hint}</p>}
              </div>
            )}
          </Bench>
        </>
      )}

      {stage === "sources" && (
        <>
          <p className="max-w-4xl mx-auto text-sm mb-3" style={{ color: "rgba(255,255,255,0.8)" }}>{task.intro}</p>
          <Bench
            loaded={loaded}
            onToggle={(id) => { if (!srcDone) { toggleBook(id); setSrc(null); setDoubt([]); } }}
            question={task.question}
            asked={src !== null}
            onAsk={askSources}
            askDisabled={loaded.length < 2 || srcDone}
            askNote={loaded.length < 2 ? task.hint : undefined}
          >
            {src && src.result.sources.length > 0 && (
              <div className="mt-4" style={{ animation: "argEnter 0.3s ease both" }}>
                <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(245,235,215,0.1)", border: "1px solid rgba(245,235,215,0.25)" }}>
                  <div className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(245,235,215,0.6)" }}>The codex prints: “My sources were…”</div>
                  <div className="space-y-2">
                    {sourceOrder.map((si, slot) => {
                      const s = src.result.sources[si];
                      const flagged = doubt.includes(slot);
                      const verdict = srcDone ? (s.real ? "real" : "fake") : null;
                      return (
                        <div key={slot}>
                          <button
                            onClick={() => !srcDone && setDoubt((d) => (d.includes(slot) ? d.filter((x) => x !== slot) : [...d, slot]))}
                            disabled={srcDone}
                            className="w-full text-left p-3 rounded-lg border-2 transition-all disabled:cursor-default"
                            style={{
                              color: "#F5EBD7",
                              fontFamily: "Georgia, serif",
                              backgroundColor: flagged ? "rgba(251,191,36,0.14)" : "transparent",
                              borderColor: verdict === "fake" ? (flagged ? "#4ade80" : "#ff6b6b") : verdict === "real" ? (flagged ? "#ff6b6b" : "#4ade80") : flagged ? GOLD : "rgba(245,235,215,0.15)",
                            }}
                          >
                            {flagged && !srcDone ? "🚩 " : ""}📖 {s.text}
                          </button>
                          {srcDone && (
                            <p className="text-xs mt-1 px-1" style={{ color: s.real ? "#4ade80" : flagged ? "#4ade80" : "#ff6b6b" }}>
                              {s.real ? "✅ A book you really fed it." : flagged ? "✅ You never gave it this book. It invented the source." : "❌ You never gave it this book. It invented the source."}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                {!srcDone && (
                  <>
                    <p className="text-sm mt-3" style={{ color: "rgba(255,255,255,0.7)" }}>Which of these did you never feed it? Tap them, then submit.</p>
                    <button onClick={submitDoubts} className="mt-3 px-5 py-2 rounded-xl font-bold hover:opacity-90" style={{ backgroundColor: GOLD, color: "#0D0508" }}>Submit</button>
                  </>
                )}
                {srcDone && (
                  <div className="mt-3 space-y-3">
                    {src.result.forgotten.length > 0 && (
                      <p className="text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>
                        It also left out books you did feed it: {src.result.forgotten.map((id) => BOOKS.find((b) => b.id === id)?.title).join(", ")}.
                      </p>
                    )}
                    <p className="rounded-xl p-3 text-sm leading-relaxed" style={{ backgroundColor: "rgba(139,92,246,0.12)", border: `1px solid ${ACCENT}55`, color: "rgba(255,255,255,0.88)", fontFamily: "Georgia, serif" }}>{SOURCES_EXPLAIN}</p>
                  </div>
                )}
              </div>
            )}
          </Bench>
        </>
      )}

      {stage === "reflect" && (
        <Card k={stage}>
          <Heading figure="professor" talking>
            <h3 className="text-lg font-bold mb-4" style={{ color: "#ffffff" }}>{L.reflect.prompt}</h3>
          </Heading>
          <ChoiceList options={L.reflect.options} picked={pickReflect} onPick={pickReflection} />
        </Card>
      )}

      {stage === "outro" && (
        <Card k={stage}>
          <Heading figure="professor" talking>
            <Speaker {...PROFESSOR} />
            <Story title={L.outro.title} text={L.outro.text} />
          </Heading>
        </Card>
      )}

      <NextButton onClick={next} disabled={!canContinue} wide={stage === "leg" || stage === "household" || stage === "sources"}>
        {isLast ? "Finish" : "Continue"}
      </NextButton>
    </Shell>
  );
}
