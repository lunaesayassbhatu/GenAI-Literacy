import { useCallback, useRef, useState } from "react";
import { Check, Eye, EyeOff, Search, X, ScrollText } from "lucide-react";
import { GameHeader } from "./GameHeader";
import { ArgoniaCityScene } from "./ArgoniaCityScene";
import { ArgoniaCity3D } from "./ArgoniaCity3D";
import { ArgoniaCityLife } from "./ArgoniaCityLife";
import { ArgoniaCityVideo } from "./ArgoniaCityVideo";
import { ArgoniaCityTour, ArgoniaCityTourPanel } from "./ArgoniaCityTour";
import { addXP } from "../../utils/userData";
import {
  CITY_BACKGROUND_IMAGE,
  CITY_BACKGROUND_VIDEO,
  IMAGE_SPOT_POSITIONS,
  CITY_SPOTS,
  XP_LOOK,
  XP_CORRECT,
  loadCityProgress,
  saveCityProgress,
  type CitySpot,
} from "../../data/argoniaCityData";
import { CITY_TRACK_DT, CITY_TRACKS } from "../../data/argoniaCityTracks";

// Explore the City: one picture of the whole of Argonia. Click people, objects and places to hear their story,
// learn the idea behind them and answer a quick question. All text lives in data/argoniaCityData.ts.

const ACCENT = "#8b5cf6";
const GOLD = "#FFC627";

/** How far a spot has drifted from its resting place at video time `t` (percent of the picture), from the tracking data. */
function trackOffset(id: string, t: number): [number, number] {
  const track = CITY_TRACKS[id];
  if (!track) return [0, 0];
  const f = Math.max(0, t / CITY_TRACK_DT);
  const i = Math.min(Math.floor(f), track.length - 1);
  const j = Math.min(i + 1, track.length - 1);
  const k = f - Math.floor(f);
  return [track[i][0] + (track[j][0] - track[i][0]) * k, track[i][1] + (track[j][1] - track[i][1]) * k];
}

function SpotPanel({
  spot, picked, onPick, onClose,
}: {
  spot: CitySpot;
  picked: number | null;
  onPick: (i: number) => void;
  onClose: () => void;
}) {
  const q = spot.question;
  const answered = picked !== null;
  return (
    <div className="rounded-3xl p-5 md:p-6 shadow-2xl" style={{ background: "rgba(27,15,46,0.97)", border: `2px solid ${ACCENT}` }} role="dialog" aria-label={spot.name}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{spot.emoji}</div>
          <div>
            <h3 className="text-xl font-bold" style={{ color: "#ffffff" }}>{spot.name}</h3>
            <div className="text-xs font-semibold" style={{ color: GOLD }}>
              {spot.moduleNumber > 0 ? `Module ${spot.moduleNumber} · ${spot.module}` : "A clue for the mystery"}
            </div>
          </div>
        </div>
        <button onClick={onClose} aria-label="Close" className="p-2 rounded-lg hover:bg-white/10" style={{ color: "rgba(255,255,255,0.7)" }}>
          <X size={20} />
        </button>
      </div>

      <p className="leading-relaxed mb-3" style={{ color: "rgba(255,255,255,0.88)", fontFamily: "Georgia, serif", fontSize: 16 }}>{spot.story}</p>

      <div className="rounded-xl p-3 mb-3 text-sm" style={{ backgroundColor: "rgba(255,198,39,0.1)", border: "1px solid rgba(255,198,39,0.35)", color: "rgba(255,255,255,0.88)" }}>
        <span className="font-bold" style={{ color: GOLD }}>The idea: </span>{spot.idea}
      </div>

      {spot.clue && (
        <div className="rounded-xl p-3 mb-3 text-sm flex gap-2" style={{ backgroundColor: "rgba(139,92,246,0.18)", border: `1px solid ${ACCENT}88`, color: "#ffffff" }}>
          <ScrollText size={18} className="flex-shrink-0 mt-0.5" style={{ color: GOLD }} />
          <span><span className="font-bold" style={{ color: GOLD }}>Clue added: </span>{spot.clue}</span>
        </div>
      )}

      {q && (
        <div>
          <h4 className="font-bold mb-2" style={{ color: "#ffffff" }}>{q.prompt}</h4>
          <div className="space-y-2">
            {q.options.map((o, i) => {
              const isPicked = picked === i;
              const show = answered && (isPicked || o.good);
              const color = show ? (o.good ? "#22c55e" : "#ef4444") : "rgba(255,255,255,0.2)";
              return (
                <button
                  key={i}
                  onClick={() => !answered && onPick(i)}
                  disabled={answered}
                  className="w-full text-left rounded-xl p-3 text-sm transition-colors"
                  style={{ border: `2px solid ${color}`, backgroundColor: show ? `${color}22` : "rgba(255,255,255,0.05)", color: "#ffffff", cursor: answered ? "default" : "pointer" }}
                >
                  <div className="flex items-start gap-2">
                    <span className="flex-1">{o.text}</span>
                    {show && (o.good ? <Check size={18} style={{ color }} /> : <X size={18} style={{ color }} />)}
                  </div>
                  {isPicked && <div className="mt-2 text-xs" style={{ color: "rgba(255,255,255,0.85)" }}>{o.feedback}</div>}
                </button>
              );
            })}
          </div>
          {answered && !q.options[picked].good && (
            <div className="mt-2 text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>
              The right answer is marked in green: {q.options.find((o) => o.good)?.feedback}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function ArgoniaCityGame() {
  const [progress, setProgress] = useState(loadCityProgress);
  const [openId, setOpenId] = useState<string | null>(null);
  const [picks, setPicks] = useState<Record<string, number>>({});
  const [showAll, setShowAll] = useState(false);
  const [view, setView] = useState<"tour" | "3d" | "picture">(CITY_BACKGROUND_IMAGE ? "picture" : "3d");
  const tourRef = useRef<HTMLVideoElement>(null);
  const [tourTime, setTourTime] = useState(0);
  const markerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [hover, setHover] = useState<{ id: string; x: number; y: number } | null>(null);

  const total = CITY_SPOTS.length;
  const found = progress.found.length;
  const spot = CITY_SPOTS.find((s) => s.id === openId) ?? null;

  // the video's camera drifts slowly, so the clickable spots are moved along with it (and eased back to rest as the loop restarts)
  const followVideo = useCallback((t: number, show: number) => {
    for (const s of CITY_SPOTS) {
      const el = markerRefs.current[s.id];
      if (!el) continue;
      const rest = IMAGE_SPOT_POSITIONS[s.id] ?? s;
      const [dx, dy] = trackOffset(s.id, t);
      el.style.left = `${rest.x + dx * show}%`;
      el.style.top = `${rest.y + dy * show}%`;
    }
  }, []);

  function commit(next: typeof progress) {
    setProgress(next);
    saveCityProgress(next);
  }

  function open(s: CitySpot) {
    setOpenId(s.id);
    if (!progress.found.includes(s.id)) {
      addXP(XP_LOOK);
      commit({ ...progress, found: [...progress.found, s.id] });
    }
  }

  function pick(s: CitySpot, i: number) {
    setPicks((p) => ({ ...p, [s.id]: i }));
    const good = s.question?.options[i].good;
    if (good && !progress.answered.includes(s.id)) {
      addXP(XP_CORRECT);
      commit({ ...progress, answered: [...progress.answered, s.id] });
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #120a1f 0%, #1b0f2e 60%, #1A0A0F 100%)" }}>
      <GameHeader title="Explore the City" subtitle="Argonia" />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: "#ffffff" }}>The city of Argonia</h2>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
              {view === "tour"
                ? "Watch the guided tour with music, or jump to a place."
                : view === "3d"
                  ? "Click the places, people and objects to explore. Drag to turn the city and scroll to zoom."
                  : "Click the places, people and objects in the picture to explore."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold" style={{ backgroundColor: "rgba(255,198,39,0.15)", color: GOLD, border: "1px solid rgba(255,198,39,0.4)" }}>
              <Search size={16} /> {found} of {total} found
            </div>
            <div className="flex rounded-xl overflow-hidden text-sm font-semibold" style={{ border: "1px solid rgba(255,255,255,0.25)" }} role="group" aria-label="View">
              {(["tour", "picture", "3d"] as const).map((v) => (
                <button key={v} onClick={() => setView(v)} aria-pressed={view === v} className="px-3 py-2" style={{ backgroundColor: view === v ? GOLD : "rgba(255,255,255,0.08)", color: view === v ? "#0D0508" : "#ffffff" }}>
                  {v === "tour" ? "Tour" : v === "3d" ? "3D city" : "Picture"}
                </button>
              ))}
            </div>
            {view !== "tour" && (
              <button
                onClick={() => setShowAll((v) => !v)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold"
                style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "#ffffff", border: "1px solid rgba(255,255,255,0.25)" }}
                aria-pressed={showAll}
              >
                {showAll ? <EyeOff size={16} /> : <Eye size={16} />} {showAll ? "Hide hotspots" : "Show hotspots"}
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px] items-start">
          {/* the picture */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl" style={{ border: `2px solid ${ACCENT}`, aspectRatio: view === "tour" ? "16 / 9" : "3 / 2" }}>
            {view === "tour" ? (
              <ArgoniaCityTour videoRef={tourRef} onTime={setTourTime} />
            ) : view === "3d" ? (
              <ArgoniaCity3D
                seen={progress.found}
                openId={openId}
                showAll={showAll}
                onPick={(id) => { const sp = CITY_SPOTS.find((x) => x.id === id); if (sp) open(sp); }}
                onHover={(id, x, y) => setHover(id ? { id, x, y } : null)}
              />
            ) : CITY_BACKGROUND_IMAGE && CITY_BACKGROUND_VIDEO ? (
              <ArgoniaCityVideo src={CITY_BACKGROUND_VIDEO} poster={CITY_BACKGROUND_IMAGE} onFrame={followVideo} />
            ) : CITY_BACKGROUND_IMAGE ? (
              <img src={CITY_BACKGROUND_IMAGE} alt="The city of Argonia" className="w-full h-full object-cover block" />
            ) : (
              <ArgoniaCityScene />
            )}
            {view === "picture" && CITY_BACKGROUND_IMAGE && !CITY_BACKGROUND_VIDEO && <ArgoniaCityLife />}
            {view === "3d" && hover && (
              <div className="pointer-events-none absolute rounded-md px-2 py-1 text-xs font-semibold whitespace-nowrap" style={{ left: hover.x + 12, top: hover.y + 12, backgroundColor: "rgba(13,5,8,0.92)", color: "#ffffff", zIndex: 4 }}>
                {CITY_SPOTS.find((x) => x.id === hover.id)?.name}
              </div>
            )}
            {view === "picture" && CITY_SPOTS.map((s) => {
              const seen = progress.found.includes(s.id);
              const active = s.id === openId;
              return (
                <button
                  key={s.id}
                  ref={(el) => { markerRefs.current[s.id] = el; }}
                  onClick={() => open(s)}
                  aria-label={`${s.name}${seen ? " (explored)" : ""}`}
                  title={s.name}
                  className="group absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full"
                  style={{ left: `${(CITY_BACKGROUND_IMAGE ? IMAGE_SPOT_POSITIONS[s.id]?.x : undefined) ?? s.x}%`, top: `${(CITY_BACKGROUND_IMAGE ? IMAGE_SPOT_POSITIONS[s.id]?.y : undefined) ?? s.y}%`, width: 44, height: 44, zIndex: active ? 3 : 2 }}
                >
                  <span
                    className="rounded-full flex items-center justify-center text-sm font-bold transition-all group-hover:scale-125 group-focus-visible:scale-125"
                    style={{
                      width: seen ? 24 : 28,
                      height: seen ? 24 : 28,
                      backgroundColor: seen ? "rgba(34,197,94,0.92)" : "rgba(255,198,39,0.95)",
                      color: "#0D0508",
                      border: active ? "3px solid #ffffff" : "2px solid rgba(13,5,8,0.7)",
                      boxShadow: seen ? "none" : "0 0 0 6px rgba(255,198,39,0.3)",
                      opacity: showAll || seen || active ? 1 : 0.0,
                      animation: !seen && showAll ? "argPulse 1.6s ease-in-out infinite" : undefined,
                    }}
                  >
                    {seen ? <Check size={14} /> : "?"}
                  </span>
                  <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-1 text-xs font-semibold opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity" style={{ backgroundColor: "rgba(13,5,8,0.92)", color: "#ffffff" }}>
                    {s.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* the panel */}
          <div className="lg:sticky lg:top-4">
            {view === "tour" ? (
              <ArgoniaCityTourPanel videoRef={tourRef} time={tourTime} />
            ) : spot ? (
              <SpotPanel spot={spot} picked={picks[spot.id] ?? null} onPick={(i) => pick(spot, i)} onClose={() => setOpenId(null)} />
            ) : (
              <div className="rounded-3xl p-6" style={{ background: "rgba(139,92,246,0.12)", border: `1px solid ${ACCENT}66`, color: "rgba(255,255,255,0.85)" }}>
                <div className="text-3xl mb-2">🔎</div>
                <h3 className="text-lg font-bold mb-2" style={{ color: "#ffffff" }}>What will you find?</h3>
                <p className="text-sm leading-relaxed mb-3">
                  The whole city is in the picture. Hover over a building, a person or an object, then click it. Each one has a story, an idea to take away, and often a quick question.
                </p>
                <ul className="text-sm space-y-1" style={{ color: "rgba(255,255,255,0.75)" }}>
                  <li>+{XP_LOOK} XP the first time you look at something</li>
                  <li>+{XP_CORRECT} XP for your first correct answer</li>
                  <li>Some spots hold clues to where the king went</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
      <style>{`@keyframes argPulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.1); } }`}</style>
    </div>
  );
}
