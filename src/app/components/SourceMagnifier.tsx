import { useState } from "react";
import { motion } from "motion/react";
import { Search } from "lucide-react";

/** *word* becomes italic (book and journal titles in a citation). Only ever used on text we wrote ourselves. */
function italicize(text: string): string {
  return text.replace(/\*(.*?)\*/g, "<em>$1</em>");
}

interface SourceMagnifierProps {
  /** A web page: the magnifier opens it in a new tab. */
  link?: string;
  /** A source that has no web page (a book, say): the magnifier opens a small box showing it. */
  citation?: string;
  colors: any;
  /** Which side of the magnifier the box opens on. Use "above" near the bottom of a pop-up. */
  placement?: "below" | "above";
}

/**
 * The pink magnifying glass that sits beside a message and points to where its information came from.
 * Give it a `link` (opens the page) or a `citation` (shows the reference in a box on hover, focus or click).
 */
export function SourceMagnifier({ link, citation, colors, placement = "below" }: SourceMagnifierProps) {
  const [open, setOpen] = useState(false);
  if (!link && !citation) return null;

  const circle = (
    <motion.div
      animate={{ scale: [1, 1.12, 1] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      className="w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
      style={{
        backgroundColor: colors.accentPink,
        border: "2px solid #FFFFFF",
        boxShadow: `0 0 14px ${colors.accentPink}, 0 0 28px ${colors.accentPink}66`,
      }}
    >
      <Search size={24} color="#FFFFFF" strokeWidth={3} />
    </motion.div>
  );

  const boxPosition = placement === "above" ? "bottom-full mb-2" : "top-full mt-2";

  if (link) {
    return (
      <div className="group relative">
        <a href={link} target="_blank" rel="noopener noreferrer" className="relative block" aria-label="More information available">
          {circle}
          <div
            className={`pointer-events-none absolute right-0 ${boxPosition} opacity-0 group-hover:opacity-100 transition-opacity rounded-lg px-3 py-2 text-xs font-semibold shadow-lg`}
            style={{ backgroundColor: colors.cardBackground, border: `1px solid ${colors.accentPink}`, color: colors.textPrimary, width: 200 }}
          >
            Want to learn more? Click <span style={{ textDecoration: "underline", color: colors.accentPink }}>here</span> for more information!
          </div>
        </a>
      </div>
    );
  }

  return (
    <div className="group relative">
      <button
        type="button"
        className="relative block"
        aria-label="Show the source"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setOpen(false)}
      >
        {circle}
      </button>
      <div
        role="note"
        className={`pointer-events-none absolute right-0 ${boxPosition} transition-opacity rounded-lg px-3 py-2 text-xs shadow-lg text-left ${
          open ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
        }`}
        style={{ backgroundColor: colors.cardBackground, border: `1px solid ${colors.accentPink}`, color: colors.textPrimary, width: 280 }}
      >
        <span className="block font-extrabold tracking-wider mb-1" style={{ color: colors.accentPink }}>SOURCE</span>
        <span className="leading-snug" dangerouslySetInnerHTML={{ __html: italicize(citation ?? "") }} />
      </div>
    </div>
  );
}
