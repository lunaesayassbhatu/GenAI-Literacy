import { useEffect, useRef } from "react";

// The city picture with a short looping video on top, so the people, the rider, the waterwheel and the clouds move.
// The video is the same scene as the picture (it was made from it). The camera drifts a little as it plays, so the
// page gets `onFrame` every frame and moves the clickable spots along with it (see data/argoniaCityTracks.ts).
// The still picture stays underneath: it shows while the video loads, hides the jump when the video loops, and is
// all that people who prefer reduced motion see.

const FADE_IN = 0.3; // seconds
const FADE_OUT = 0.45;

interface Props {
  src: string;
  poster: string;
  /** Called every frame with the video time (seconds) and how much of the video is showing (0 = only the still picture, 1 = only the video). */
  onFrame?: (time: number, show: number) => void;
}

export function ArgoniaCityVideo({ src, poster, onFrame }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameCb = useRef(onFrame);
  frameCb.current = onFrame;
  const reduce = typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    let raf = 0;
    const tick = () => {
      const d = v.duration;
      const t = v.currentTime;
      // fade out near the end and back in after the restart, so the loop never visibly jumps
      const show = !v.paused && d > 0 ? Math.max(0, Math.min(1, t / FADE_IN, (d - t) / FADE_OUT)) : 0;
      v.style.opacity = String(show);
      frameCb.current?.(t, show);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      frameCb.current?.(0, 0);
    };
  }, [reduce]);

  return (
    // the video has thin black bars at the sides, so the layer is scaled up a hair to hide them
    <div className="absolute inset-0" style={{ transform: "scale(1.012)" }}>
      <img src={poster} alt="The city of Argonia" className="w-full h-full object-cover block" />
      {!reduce && (
        <video
          ref={videoRef}
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0 }}
        />
      )}
    </div>
  );
}
