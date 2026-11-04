import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, X } from "lucide-react";
import { StudentBust } from "./HeroStudent";
import type { StudentId } from "../data/studentsData";

interface AvatarPreviewProps {
  student?: StudentId;
  equipped: string[];
  colors: any;
  /** Size of the picture at 1x zoom, in px. */
  baseSize?: number;
  /** Height of the window the picture is shown in, in px. */
  viewportHeight?: number;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.25;

/**
 * A big picture of the student wearing whatever is equipped, with a zoom slider (the picture grows and the
 * window scrolls).
 */
export function AvatarPreview({ student, equipped, colors, baseSize = 240, viewportHeight = 320 }: AvatarPreviewProps) {
  const [zoom, setZoom] = useState(1);
  const viewport = useRef<HTMLDivElement>(null);

  // After zooming, keep the head in view: start at the top, centred sideways.
  useEffect(() => {
    const el = viewport.current;
    if (!el) return;
    el.scrollTop = 0;
    el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
  }, [zoom]);

  const size = Math.round(baseSize * zoom);
  const setClamped = (value: number) => setZoom(Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(value * 100) / 100)));

  return (
    <div>
      <div
        ref={viewport}
        className="rounded-2xl overflow-auto"
        style={{
          height: viewportHeight,
          background: "radial-gradient(circle at 50% 30%, #A02450 0%, #7A1736 55%, #5A1228 100%)",
          border: "2px solid rgba(255,198,39,0.45)",
        }}
        aria-label="Zoomable preview of your avatar"
      >
        {student ? (
          // the picture is resized (not just scaled) so the window can scroll around it
          <div style={{ width: Math.max(size, 1), minWidth: "100%", minHeight: "100%", display: "flex", justifyContent: "center", alignItems: "flex-end" }}>
            <StudentBust student={student} size={size} equipped={equipped} />
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center gap-2 p-4 text-center" style={{ color: "#F0E0E4" }}>
            <p className="text-sm font-semibold">Choose a student to see your avatar here.</p>
            <Link to="/choose-character" className="text-sm font-bold underline" style={{ color: "#FFC627" }}>
              Choose my student
            </Link>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mt-3">
        <button
          type="button"
          onClick={() => setClamped(zoom - ZOOM_STEP)}
          disabled={zoom <= MIN_ZOOM}
          aria-label="Zoom out"
          className="p-1.5 rounded-full transition-opacity disabled:opacity-30"
          style={{ border: `1px solid ${colors.cardBorder}`, color: colors.textPrimary }}
        >
          <Minus size={16} />
        </button>
        <input
          type="range"
          min={MIN_ZOOM}
          max={MAX_ZOOM}
          step={ZOOM_STEP}
          value={zoom}
          onChange={(e) => setClamped(Number(e.target.value))}
          aria-label="Zoom"
          className="flex-1"
          style={{ accentColor: colors.accentGold }}
        />
        <button
          type="button"
          onClick={() => setClamped(zoom + ZOOM_STEP)}
          disabled={zoom >= MAX_ZOOM}
          aria-label="Zoom in"
          className="p-1.5 rounded-full transition-opacity disabled:opacity-30"
          style={{ border: `1px solid ${colors.cardBorder}`, color: colors.textPrimary }}
        >
          <Plus size={16} />
        </button>
        <span className="text-xs font-bold w-10 text-right" style={{ color: colors.textSecondary }}>
          {Math.round(zoom * 100)}%
        </span>
      </div>
    </div>
  );
}

/** The same preview in a pop-up, opened by clicking the profile picture. */
export function AvatarZoomModal({ open, onClose, ...preview }: { open: boolean; onClose: () => void } & AvatarPreviewProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  const { colors } = preview;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Your avatar"
    >
      <div
        className="w-full max-w-md rounded-2xl p-5 shadow-2xl"
        style={{ backgroundColor: colors.cardBackground, border: `1px solid ${colors.cardBorder}` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>Your avatar</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="p-1 rounded-full hover:opacity-70" style={{ color: colors.textSecondary }}>
            <X size={20} />
          </button>
        </div>
        <AvatarPreview {...preview} baseSize={300} viewportHeight={400} />
        <div className="mt-4 text-center">
          <Link to="/choose-character" className="text-sm font-bold hover:underline" style={{ color: colors.accentGold }}>
            Change my student
          </Link>
        </div>
      </div>
    </div>
  );
}
