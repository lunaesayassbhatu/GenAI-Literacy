import { Play } from "lucide-react";
import type { RefObject } from "react";
import { CITY_TOUR } from "../../data/argoniaCityData";

// The guided tour of Argonia: a short film with music that climbs the city one place at a time and ends with the queen.
// The video fills the picture area; the chapter list (a separate piece, below) jumps to any place in it.
// It never starts by itself: sound only plays after the learner presses play.

const GOLD = "#FFC627";
const ACCENT = "#8b5cf6";

export function ArgoniaCityTour({ videoRef, onTime }: { videoRef: RefObject<HTMLVideoElement | null>; onTime: (t: number) => void }) {
  return (
    <video
      ref={videoRef}
      className="absolute inset-0 w-full h-full object-contain bg-black"
      src={CITY_TOUR.video}
      poster={CITY_TOUR.poster}
      controls
      playsInline
      preload="metadata"
      onTimeUpdate={(e) => onTime(e.currentTarget.currentTime)}
      aria-label="Guided tour of the city of Argonia, with music. It visits the Eastgate, the lake, the workshop, the market, the road, the clock tower, the castle and ends with the queen."
    >
      Your browser can't play this video.
    </video>
  );
}

export function ArgoniaCityTourPanel({ videoRef, time }: { videoRef: RefObject<HTMLVideoElement | null>; time: number }) {
  const chapters = CITY_TOUR.chapters;
  // the chapter being shown: the last one that has started
  let current = 0;
  chapters.forEach((c, i) => { if (time >= c.at - 0.2) current = i; });

  function jump(at: number) {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = at;
    void v.play().catch(() => { /* the browser may ask the learner to press play first */ });
  }

  return (
    <div className="rounded-3xl p-5 md:p-6" style={{ background: "rgba(139,92,246,0.12)", border: `1px solid ${ACCENT}66`, color: "rgba(255,255,255,0.85)" }}>
      <div className="text-3xl mb-2">🎬</div>
      <h3 className="text-lg font-bold mb-1" style={{ color: "#ffffff" }}>The tour of Argonia</h3>
      <p className="text-sm leading-relaxed mb-3">
        About a minute and a quarter, with music. It visits one place at a time and ends with the queen. Press play, or jump to a place:
      </p>
      <ol className="grid grid-cols-1 gap-1.5">
        {chapters.map((c, i) => (
          <li key={c.label}>
            <button
              onClick={() => jump(c.at)}
              aria-current={i === current ? "true" : undefined}
              className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold transition-colors"
              style={{
                backgroundColor: i === current ? "rgba(255,198,39,0.18)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${i === current ? GOLD : "rgba(255,255,255,0.15)"}`,
                color: i === current ? GOLD : "#ffffff",
              }}
            >
              <Play size={14} aria-hidden="true" />
              <span className="flex-1">{c.label}</span>
              <span className="text-xs font-normal" style={{ color: "rgba(255,255,255,0.55)" }}>{Math.floor(c.at / 60)}:{String(Math.floor(c.at % 60)).padStart(2, "0")}</span>
            </button>
          </li>
        ))}
      </ol>
      <p className="text-xs mt-3" style={{ color: "rgba(255,255,255,0.5)" }}>{CITY_TOUR.credit}</p>
    </div>
  );
}
