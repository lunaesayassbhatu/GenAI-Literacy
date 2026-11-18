import { useState } from "react";
import { motion } from "motion/react";
import { Search } from "lucide-react";

/** *word* becomes italic (book and journal titles in a citation). Only ever used on text we wrote ourselves. */
function italicize(text: string): string {
  return text.replace(/\*(.*?)\*/g, "<em>$1</em>");
}

interface SourceMagnifierProps {
  /** A web page. On its own, the magnifier simply opens it in a new tab. */
  link?: string;
  /** The reference for the source (a book, a paper, an article). On its own, the magnifier opens a small box showing it. */
  citation?: string;
  colors: any;
  /** Which side of the magnifier the box opens on. Use "above" near the bottom of a pop-up. */
  placement?: "below" | "above";
}

/**
 * The pink magnifying glass that sits beside a message and points to where its information came from.
 *  - `link` only: click to open the page.
 *  - `citation` only: hover, focus or click to read the reference in a box.
 *  - both: the box shows the reference, with a button that opens the page.
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

  // The box hangs off a wrapper with padding (not a margin) so the pointer can travel from the magnifier into the box without it closing.
  const boxWrapPosition = placement === "above" ? "bottom-full pb-2" : "top-full pt-2";

  if (link && !citation) {
    return (
      <div className="group relative">
        <a href={link} target="_blank" rel="noopener noreferrer" className="relative block" aria-label="More information available">
          {circle}
          <div
            className={`pointer-events-none absolute right-0 ${placement === "above" ? "bottom-full mb-2" : "top-full mt-2"} opacity-0 group-hover:opacity-100 transition-opacity rounded-lg px-3 py-2 text-xs font-semibold shadow-lg`}
            style={{ backgroundColor: colors.cardBackground, border: `1px solid ${colors.accentPink}`, color: colors.textPrimary, width: 200 }}
          >
            Want to learn more? Click <span style={{ textDecoration: "underline", color: colors.accentPink }}>here</span> for more information!
          </div>
        </a>
      </div>
    );
  }

  const visible = open ? "opacity-100" : "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto";

  return (
    <div className="group relative">
      <button
        type="button"
        className="relative block"
        aria-label="Show the source"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onBlur={(e) => {
          // Keep the box open while focus moves to the "Open the source" link inside it.
          if (!e.currentTarget.parentElement?.contains(e.relatedTarget as Node | null)) setOpen(false);
        }}
      >
        {circle}
      </button>
      <div className={`absolute right-0 ${boxWrapPosition} transition-opacity ${visible}`} style={{ width: 300 }}>
        <div
          role="note"
          className="rounded-lg px-3 py-2 text-xs shadow-lg text-left"
          style={{ backgroundColor: colors.cardBackground, border: `1px solid ${colors.accentPink}`, color: colors.textPrimary }}
        >
          <span className="block font-extrabold tracking-wider mb-1" style={{ color: colors.accentPink }}>SOURCE</span>
          <span className="leading-snug block" dangerouslySetInnerHTML={{ __html: italicize(citation ?? "") }} />
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 font-bold underline"
              style={{ color: colors.accentPink }}
            >
              Open the source ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
