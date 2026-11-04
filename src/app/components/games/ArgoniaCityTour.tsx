import { Play, VolumeX } from "lucide-react";
import { useState, type MutableRefObject, type RefObject } from "react";
import { CITY_TOUR, type TourVersion, type TourVersionId } from "../../data/argoniaCityData";

// The guided tour of Argonia: a short film with music that climbs the city one place at a time and ends with the queen.
// The video fills the picture area; the panel (a separate piece, beside it) picks the music and jumps to any place.
// It never starts by itself: sound only plays after the learner presses play.

const GOLD = "#FFC627";
const ACCENT = "#8b5cf6";

/** Where to carry on after the music is changed: the same moment, playing or paused as it was. */
export type TourResume = { t: number; playing: boolean };

export function ArgoniaCityTour({
  videoRef, version, resumeRef, onTime,
}: {
  videoRef: RefObject<HTMLVideoElement | null>;
  version: TourVersion;
  resumeRef: MutableRefObject<TourResume | null>;
  onTime: (t: number) => void;
}) {
  const [started, setStarted] = useState(false);       // has the learner pressed play yet?
  const [soundOff, setSoundOff] = useState(false);     // muted, or the volume is at zero
  const check = (v: HTMLVideoElement) => setSoundOff(v.muted || v.volume === 0);

  return (
    <>
      <video
        key={version.id}
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-contain bg-black"
        src={version.video}
        poster={CITY_TOUR.poster}
        controls
        playsInline
        preload="metadata"
        onTimeUpdate={(e) => onTime(e.currentTarget.currentTime)}
        onPlay={(e) => { setStarted(true); check(e.currentTarget); }}
        onVolumeChange={(e) => check(e.currentTarget)}
        onLoadedMetadata={(e) => {
          const r = resumeRef.current;
          if (!r) return;
          resumeRef.current = null;
          const v = e.currentTarget;
          v.currentTime = Math.min(r.t, v.duration || r.t);
          if (r.playing) void v.play().catch(() => { /* the browser may ask the learner to press play again */ });
        }}
        aria-label="Guided tour of the city of Argonia, with music. It visits the Eastgate, the lake, the workshop, the market, the road, the clock tower, the castle and ends with the queen."
      >
        Your browser can't play this video.
      </video>

      {/* Browsers only allow sound after a click, so the tour waits for one. */}
      {!started && (
        <button
          onClick={() => { void videoRef.current?.play().catch(() => { /* ignore */ }); }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3 rounded-full px-6 py-4 font-bold text-lg shadow-2xl hover:scale-105 transition-transform"
          style={{ backgroundColor: GOLD, color: "#0D0508", zIndex: 5 }}
        >
          <Play size={26} aria-hidden="true" fill="currentColor" />
          Play the tour, with sound
        </button>
      )}

      {started && soundOff && (
        <div
          className="pointer-events-none absolute left-3 top-3 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold"
          style={{ backgroundColor: "rgba(13,5,8,0.88)", color: "#ffffff", border: `1px solid ${GOLD}`, zIndex: 5 }}
          role="status"
        >
          <VolumeX size={16} aria-hidden="true" /> The sound is off. Use the speaker button on the video to turn it on.
        </div>
      )}
    </>
  );
}

export function ArgoniaCityTourPanel({
  videoRef, time, versionId, onVersion,
}: {
  videoRef: RefObject<HTMLVideoElement | null>;
  time: number;
  versionId: TourVersionId;
  onVersion: (id: TourVersionId) => void;
}) {
  const chapters = CITY_TOUR.chapters;
  const version = CITY_TOUR.versions.find((v) => v.id === versionId) ?? CITY_TOUR.versions[0];
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
        About a minute and a quarter, with music and the sounds of the town. It visits one place at a time and ends with the queen. Press play, or jump to a place:
      </p>

      <div className="mb-3">
        <div className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: GOLD }}>Music</div>
        <div className="grid grid-cols-2 gap-2" role="group" aria-label="Music">
          {CITY_TOUR.versions.map((v) => {
            const on = v.id === version.id;
            return (
              <button
                key={v.id}
                onClick={() => !on && onVersion(v.id)}
                aria-pressed={on}
                className="rounded-xl px-3 py-2 text-left transition-colors"
                style={{
                  backgroundColor: on ? "rgba(255,198,39,0.18)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${on ? GOLD : "rgba(255,255,255,0.15)"}`,
                  color: on ? GOLD : "#ffffff",
                }}
              >
                <span className="block text-sm font-bold">{v.label}</span>
                <span className="block text-xs font-normal" style={{ color: "rgba(255,255,255,0.6)" }}>{v.detail}</span>
              </button>
            );
          })}
        </div>
      </div>

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
      <p className="text-xs mt-3" style={{ color: "rgba(255,255,255,0.5)" }}>{version.credit}</p>
    </div>
  );
}
