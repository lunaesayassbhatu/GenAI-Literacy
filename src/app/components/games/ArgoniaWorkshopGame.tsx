import { useState } from "react";
import { Lightbulb } from "lucide-react";
import { addXP, saveHighScore } from "../../utils/userData";
import { WORKSHOP as W, loadInvestigationProgress, saveInvestigationDone } from "../../data/argoniaInvestigations";
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

// The Engineer's Workshop: a scripted, text-based investigation (no AI is called).
// Steps: arrive → tap her shoulder → offer help → look around → spot the difference → decide → she explains.
// All the words live in data/argoniaInvestigations.ts.

const STAGES = ["arrive", "shoulder", "talk", "investigate", "compare", "decide", "outro"] as const;
type Stage = (typeof STAGES)[number];

const XP_PER_DIFFERENCE = 10;
const ENGINEER = { name: "The Engineer", emoji: "🛠️" };

// ─── the water lift, drawn three ways ────────────────────────────────────────

const LOOKS = {
  hand: { bg: "#efe3c2", ink: "#5a3b1a", water: "#8fb8c9", accent: "#a33a2a", wobble: true },
  codex: { bg: "#0f2b4a", ink: "#cfe8ff", water: "#3b82c4", accent: "#ffd36e", wobble: false },
  built: { bg: "#2a2420", ink: "#e0a070", water: "#5b8aa6", accent: "#ff6b6b", wobble: false },
} as const;
type LookName = keyof typeof LOOKS;

/** Where each difference sits on the drawing (matches W.compare.differences order). */
const SPOTS = [
  { x: 212, y: 100, r: 24 }, // safety valve
  { x: 108, y: 170, r: 22 }, // one-way valve
  { x: 252, y: 72, r: 24 }, // pressure dial
];

function Pump({ look, flawed, name }: { look: LookName; flawed: boolean; name: string }) {
  const L = LOOKS[look];
  const fid = `wob-${name}`;
  return (
    <>
      {L.wobble && (
        <defs>
          <filter id={fid}>
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" />
          </filter>
        </defs>
      )}
      <rect width="300" height="240" fill={L.bg} />
      <g filter={L.wobble ? `url(#${fid})` : undefined} fill="none" stroke={L.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* tank */}
        <rect x="18" y="18" width="72" height="62" rx="5" fill={L.bg} />
        <path d="M20 42 q8 -5 16 0 t16 0 t16 0 V78 H20 Z" fill={L.water} opacity="0.6" stroke="none" />
        {/* pipe */}
        <path d="M54 80 V170 H170" strokeWidth="10" opacity="0.5" />
        <path d="M54 80 V170 H170" strokeWidth="5.5" stroke={L.bg} />
        {/* one-way valve */}
        <circle cx="108" cy="170" r="13" fill={L.bg} />
        <path d={flawed ? "M116 170 H100 M106 164 L99 170 L106 176" : "M100 170 H116 M110 164 L117 170 L110 176"} stroke={L.accent} strokeWidth="2.5" />
        {/* pump chamber, piston and handle */}
        <rect x="170" y="112" width="52" height="92" rx="6" fill={L.bg} />
        <rect x="173" y="150" width="46" height="51" fill={L.water} opacity="0.5" stroke="none" />
        <rect x="190" y="62" width="12" height="70" fill={L.bg} />
        <rect x="182" y="128" width="28" height="8" fill={L.ink} />
        <path d="M196 62 L150 40" strokeWidth="4" />
        <circle cx="148" cy="39" r="6" fill={L.ink} />
        {/* safety valve: a spring and cap, or just a plain cap */}
        {flawed ? (
          <rect x="204" y="106" width="16" height="6" fill={L.ink} />
        ) : (
          <>
            <path d="M212 112 V106 L206 102 L218 98 L206 94 L218 90 L212 86" />
            <rect x="204" y="80" width="16" height="6" fill={L.accent} stroke="none" />
          </>
        )}
        {/* pressure dial */}
        <path d="M233 72 H226 V112" strokeWidth="1.5" />
        <circle cx="252" cy="72" r="19" fill={L.bg} />
        {flawed ? (
          <circle cx="252" cy="72" r="2" fill={L.ink} />
        ) : (
          <>
            <path d="M239 80 L242 77 M240 70 L244 70 M244 61 L247 64 M252 55 L252 59 M260 61 L257 64 M264 70 L260 70" strokeWidth="1.5" />
            <path d="M252 72 L262 60" stroke={L.accent} strokeWidth="2.5" />
            <circle cx="252" cy="72" r="2.2" fill={L.ink} />
          </>
        )}
        {/* gears */}
        <circle cx="262" cy="150" r="17" strokeWidth="5" strokeDasharray="4.4 4.4" />
        <circle cx="262" cy="150" r="10" />
        <circle cx="262" cy="150" r="2.5" fill={L.ink} />
        <circle cx="262" cy="181" r="11" strokeWidth="5" strokeDasharray="4.3 4.3" />
        <circle cx="262" cy="181" r="5" />
      </g>
      {/* writing */}
      {look === "hand" && (
        <text x="22" y="222" fontSize="10" fontFamily="Georgia, serif" fontStyle="italic" fill={L.ink} transform="rotate(-2 22 222)">never without the relief valve!</text>
      )}
      {look === "codex" && (
        <text x="22" y="222" fontSize="9" fontFamily="monospace" fill={L.ink} opacity="0.85">WATER LIFT · REV 7 · APPROVED</text>
      )}
      {look === "built" && (
        <>
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={212 + i * 5} cy={92 - i * 14} r={5 + i * 2} fill="#ffffff" opacity={0.35 - i * 0.08} />
          ))}
          <ellipse cx="136" cy="184" rx="3" ry="5" fill={L.water} />
          <ellipse cx="150" cy="194" rx="3" ry="5" fill={L.water} />
          <ellipse cx="128" cy="198" rx="2.5" ry="4" fill={L.water} />
          <text x="22" y="222" fontSize="9" fontFamily="monospace" fill={L.accent}>BUILT · FAILED ✗</text>
        </>
      )}
    </>
  );
}

function Panel({
  label,
  look,
  flawed,
  found,
  onSpot,
}: {
  label: string;
  look: LookName;
  flawed: boolean;
  found: Set<number>;
  /** Present only on the drawing the player taps. */
  onSpot?: (i: number) => void;
}) {
  return (
    <figure className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.18)" }}>
      <svg viewBox="0 0 300 240" className="w-full block" role="img" aria-label={label}>
        <Pump look={look} flawed={flawed} name={look} />
        {SPOTS.map((s, i) => {
          const isFound = found.has(i);
          return (
            <g key={i}>
              {isFound && <circle cx={s.x} cy={s.y} r={s.r} fill="rgba(255,198,39,0.15)" stroke={GOLD} strokeWidth="3" />}
              {isFound && (
                <g>
                  <circle cx={s.x + s.r * 0.75} cy={s.y - s.r * 0.75} r="9" fill={GOLD} />
                  <text x={s.x + s.r * 0.75} y={s.y - s.r * 0.75 + 4} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0D0508">{i + 1}</text>
                </g>
              )}
              {onSpot && !isFound && (
                <circle
                  cx={s.x}
                  cy={s.y}
                  r={s.r}
                  fill="transparent"
                  style={{ cursor: "pointer" }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Something on the codex's drawing, spot ${i + 1}`}
                  onClick={() => onSpot(i)}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSpot(i)}
                />
              )}
            </g>
          );
        })}
      </svg>
      <figcaption className="text-center text-xs font-bold py-2" style={{ color: "rgba(255,255,255,0.8)", backgroundColor: "rgba(0,0,0,0.3)" }}>{label}</figcaption>
    </figure>
  );
}

// ─── the game ────────────────────────────────────────────────────────────────

export function ArgoniaWorkshopGame() {
  const [idx, setIdx] = useState(0);
  const [xp, setXp] = useState(0);
  const [awarded, setAwarded] = useState<number | null>(null);

  const [tapped, setTapped] = useState(false);
  const [pickTalk, setPickTalk] = useState<number | null>(null);
  const [seen, setSeen] = useState<string[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const [found, setFound] = useState<Set<number>>(new Set());
  const [hint, setHint] = useState(false);
  const [pickDecide, setPickDecide] = useState<number | null>(null);

  const stage: Stage = STAGES[idx];
  const isLast = idx === STAGES.length - 1;
  const allSeen = seen.length === W.investigate.items.length;
  const allFound = found.size === W.compare.differences.length;

  const canContinue =
    stage === "arrive" ||
    stage === "outro" ||
    (stage === "shoulder" && tapped) ||
    (stage === "talk" && pickTalk !== null) ||
    (stage === "investigate" && allSeen) ||
    (stage === "compare" && allFound) ||
    (stage === "decide" && pickDecide !== null);

  const finish = () => {
    const firstTime = !loadInvestigationProgress().includes(W.id);
    const gain = firstTime ? xp : 0;
    if (gain > 0) addXP(gain);
    saveHighScore(`argonia-${W.id}`, xp);
    saveInvestigationDone(W.id);
    setAwarded(gain);
  };

  const next = () => {
    if (isLast) return finish();
    setIdx((i) => i + 1);
  };

  const pick = (which: "talk" | "decide", i: number) => {
    const options = which === "talk" ? W.talk.options : W.decide.options;
    if ((which === "talk" ? pickTalk : pickDecide) !== null) return;
    (which === "talk" ? setPickTalk : setPickDecide)(i);
    if (options[i].good) setXp((v) => v + XP_GOOD_CHOICE);
  };

  const look = (id: string) => {
    setOpen(id);
    setSeen((s) => (s.includes(id) ? s : [...s, id]));
  };

  const spot = (i: number) => {
    if (found.has(i)) return;
    setFound((f) => new Set(f).add(i));
    setXp((v) => v + XP_PER_DIFFERENCE);
  };

  const replay = () => {
    setIdx(0);
    setXp(0);
    setAwarded(null);
    setTapped(false);
    setPickTalk(null);
    setSeen([]);
    setOpen(null);
    setFound(new Set());
    setHint(false);
    setPickDecide(null);
  };

  const wave =
    stage === "investigate"
      ? "Look at everything. You don't need to understand the machines, only to notice what feels off."
      : stage === "compare"
        ? "Take your time. Compare the old drawing with the codex's one, piece by piece."
        : "Take your time. Think about what you'd be able to check afterwards.";

  if (awarded !== null) {
    return (
      <Shell title={W.title} subtitle="A text investigation" wave="Nicely done. The engineer will be more careful now.">
        <ResultCard
          gameTitle={W.title}
          score={xp}
          awarded={awarded}
          clue={W.clue}
          takeaway={W.takeaway}
          onReplay={replay}
          nextTo="/games/argonia/lab"
          nextLabel="Next: The Professor's Lab"
        />
      </Shell>
    );
  }

  return (
    // Wave stays off the hands-on steps: its bubble would sit on top of the drawings.
    <Shell title={W.title} subtitle={`Module ${W.moduleNumber} · ${W.module}`} wave={wave} showWave={stage !== "compare"}>
      <StepBar index={idx} total={STAGES.length} />

      {stage === "arrive" && (
        <Card k={stage}>
          <div className="text-5xl mb-3">🛠️</div>
          <Story title={W.arrive.title} text={W.arrive.text} />
        </Card>
      )}

      {stage === "shoulder" && (
        <Card k={stage}>
          <Heading figure="engineer" talking={tapped}>
            <p className="leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.88)", fontFamily: "Georgia, serif", fontSize: 17 }}>
              {tapped ? "She jumps and turns around, pencil in hand. “Oh! I didn't hear you come in.”" : W.shoulder.prompt}
            </p>
            {!tapped && (
              <button onClick={() => setTapped(true)} className="px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform" style={{ backgroundColor: GOLD, color: "#0D0508" }}>
                👆 {W.shoulder.button}
              </button>
            )}
          </Heading>
        </Card>
      )}

      {stage === "talk" && (
        <Card k={stage}>
          <Heading figure="engineer" talking>
            <Speaker {...ENGINEER} />
            <Story title={W.talk.title} text={W.talk.text} />
          </Heading>
          <h3 className="text-lg font-bold mt-5 mb-3" style={{ color: "#ffffff" }}>{W.talk.prompt}</h3>
          <ChoiceList options={W.talk.options} picked={pickTalk} onPick={(i) => pick("talk", i)} />
        </Card>
      )}

      {stage === "investigate" && (
        <Card k={stage}>
          <h3 className="text-lg font-bold mb-4" style={{ color: "#ffffff" }}>{W.investigate.prompt}</h3>
          <div className="grid sm:grid-cols-3 gap-3 mb-4">
            {W.investigate.items.map((it) => {
              const isSeen = seen.includes(it.id);
              const isOpen = open === it.id;
              return (
                <button
                  key={it.id}
                  onClick={() => look(it.id)}
                  className="rounded-xl p-4 text-center border-2 transition-all hover:scale-[1.03]"
                  style={{
                    color: "#ffffff",
                    backgroundColor: isOpen ? "rgba(139,92,246,0.22)" : "rgba(255,255,255,0.04)",
                    borderColor: isOpen ? ACCENT : isSeen ? "rgba(255,198,39,0.6)" : "rgba(255,255,255,0.15)",
                  }}
                >
                  <div className="text-3xl mb-1">{it.emoji}</div>
                  <div className="text-sm font-bold">{it.title}</div>
                  <div className="text-[11px] mt-1" style={{ color: isSeen ? GOLD : "rgba(255,255,255,0.5)" }}>{isSeen ? "✓ looked" : "tap to look"}</div>
                </button>
              );
            })}
          </div>
          {open ? (
            <p className="leading-relaxed rounded-xl p-4" style={{ backgroundColor: "rgba(245,235,215,0.08)", border: "1px solid rgba(245,235,215,0.2)", color: "#F5EBD7", fontFamily: "Georgia, serif", fontSize: 16 }}>
              {W.investigate.items.find((it) => it.id === open)?.text}
            </p>
          ) : (
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>Look at all three to move on.</p>
          )}
        </Card>
      )}

      {stage === "compare" && (
        <div className="max-w-4xl mx-auto" style={{ animation: "argEnter 0.35s ease both" }}>
          <div className="rounded-3xl p-6 shadow-2xl" style={{ backgroundColor: "rgba(255,255,255,0.05)", border: `1px solid ${ACCENT}55` }}>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h3 className="text-lg font-bold" style={{ color: "#ffffff" }}>{W.compare.prompt}</h3>
              <span className="text-sm font-bold px-3 py-1 rounded-full" style={{ backgroundColor: "rgba(255,198,39,0.15)", color: GOLD }}>
                Found {found.size} of {W.compare.differences.length}
              </span>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <Panel label="Old hand-written design" look="hand" flawed={false} found={new Set()} />
              <Panel label="Codex-generated design (tap here)" look="codex" flawed found={found} onSpot={spot} />
              <Panel label="The machine that was built" look="built" flawed found={found} />
            </div>

            {!allFound && (
              <div className="mt-4">
                <button onClick={() => setHint(true)} className="flex items-center gap-2 text-sm font-semibold hover:opacity-80" style={{ color: GOLD }}>
                  <Lightbulb size={16} /> Need a hint?
                </button>
                {hint && <p className="text-sm mt-2" style={{ color: "rgba(255,255,255,0.75)" }}>{W.compare.hint}</p>}
              </div>
            )}

            {found.size > 0 && (
              <ul className="mt-4 space-y-2">
                {W.compare.differences.map((d, i) =>
                  found.has(i) ? (
                    <li key={d.id} className="rounded-xl p-3 text-sm" style={{ backgroundColor: "rgba(255,198,39,0.08)", border: `1px dashed ${GOLD}`, color: "rgba(255,255,255,0.85)" }}>
                      <span className="font-bold" style={{ color: GOLD }}>{i + 1}. {d.label} · +{XP_PER_DIFFERENCE} XP.</span> {d.why}
                    </li>
                  ) : null
                )}
              </ul>
            )}
            {allFound && <p className="mt-4 text-sm font-semibold" style={{ color: "#4ade80" }}>{W.compare.footer}</p>}
          </div>
        </div>
      )}

      {stage === "decide" && (
        <Card k={stage}>
          <Heading figure="engineer">
            <h3 className="text-lg font-bold mb-4" style={{ color: "#ffffff" }}>{W.decide.prompt}</h3>
          </Heading>
          <ChoiceList options={W.decide.options} picked={pickDecide} onPick={(i) => pick("decide", i)} />
        </Card>
      )}

      {stage === "outro" && (
        <Card k={stage}>
          <Heading figure="engineer" talking>
            <Speaker {...ENGINEER} />
            <Story title={W.outro.title} text={W.outro.text} />
          </Heading>
        </Card>
      )}

      <NextButton onClick={next} disabled={!canContinue} wide={stage === "compare"}>
        {isLast ? "Finish" : "Continue"}
      </NextButton>
    </Shell>
  );
}
