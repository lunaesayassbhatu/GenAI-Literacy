import { motion, useReducedMotion } from "motion/react";

export type WebMapTone = "maroon" | "pink" | "teal" | "gold";

export interface WebMapNode {
  /** The label split into the lines shown inside the circle. */
  lines: string[];
  tone: WebMapTone;
}

// ASU-palette circles, deepened a little so the white labels stay readable.
const TONE_COLORS: Record<WebMapTone, string> = {
  maroon: "#8B1A2E",
  pink: "#D6396A",
  teal: "#23909F",
  gold: "#B97A00",
};
const CENTER_COLOR = "#1D4E9E";

const W = 1000;
const H = 700;
const CX = W / 2;
const CY = H / 2;
const CENTER_R = 112;
const NODE_R = 84;
const RING_X = 385;
const RING_Y = 252;
const GAP = 5;

function arrowHead(tipX: number, tipY: number, ux: number, uy: number, size = 15): string {
  // Triangle whose tip sits at (tipX, tipY) and which points along (ux, uy).
  const bx = tipX - ux * size;
  const by = tipY - uy * size;
  const px = -uy * size * 0.55;
  const py = ux * size * 0.55;
  return `${tipX},${tipY} ${bx + px},${by + py} ${bx - px},${by - py}`;
}

/**
 * Web map: one main circle in the middle with a ring of circles around it, each
 * joined to the middle by a two-way arrow. Used to show how many separate
 * issues all trace back to the same thing (e.g. the ethics of Generative AI).
 */
export function WebMapStep({ data, colors }: { data: any; colors: any }) {
  const reduceMotion = useReducedMotion();
  const nodes: WebMapNode[] = data.nodes ?? [];
  const center: string = data.center ?? "";
  const plainLabel = (n: WebMapNode) => n.lines.join(" ");

  const placed = nodes.map((node, i) => {
    const angle = -Math.PI / 2 + ((i + 0.5) * 2 * Math.PI) / nodes.length;
    const x = CX + RING_X * Math.cos(angle);
    const y = CY + RING_Y * Math.sin(angle);
    const dx = x - CX;
    const dy = y - CY;
    const len = Math.hypot(dx, dy);
    const ux = dx / len;
    const uy = dy / len;
    return {
      node,
      x,
      y,
      ux,
      uy,
      x1: CX + ux * (CENTER_R + GAP),
      y1: CY + uy * (CENTER_R + GAP),
      x2: x - ux * (NODE_R + GAP),
      y2: y - uy * (NODE_R + GAP),
    };
  });

  return (
    <div
      className="rounded-2xl p-6 sm:p-8 border"
      style={{ backgroundColor: colors.cardBackground, borderColor: "rgba(255,198,39,0.13)" }}
    >
      <h3 className="text-xl font-bold text-center" style={{ color: colors.textPrimary }}>
        {data.title}
      </h3>
      {data.subtitle && (
        <p className="text-sm text-center mt-1" style={{ color: colors.textSecondary }}>
          {data.subtitle}
        </p>
      )}

      {/* Wide screens: the full web */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="hidden sm:block w-full h-auto mt-4"
        role="img"
        aria-label={`${data.title}. ${center} is connected to: ${nodes.map(plainLabel).join(", ")}.`}
      >
        {placed.map(({ node, x1, y1, x2, y2, ux, uy }, i) => {
          const color = TONE_COLORS[node.tone];
          return (
            <motion.g
              key={`arrow-${i}`}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 + i * 0.05, duration: 0.4 }}
            >
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={4} strokeLinecap="round" />
              <polygon points={arrowHead(x2, y2, ux, uy)} fill={color} />
              <polygon points={arrowHead(x1, y1, -ux, -uy)} fill={color} />
            </motion.g>
          );
        })}

        <motion.g
          initial={reduceMotion ? false : { opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 160, damping: 16 }}
        >
          <circle cx={CX} cy={CY} r={CENTER_R} fill={CENTER_COLOR} />
          <text
            x={CX}
            y={CY}
            textAnchor="middle"
            dominantBaseline="central"
            fill="#fff"
            fontSize={31}
            fontWeight={700}
          >
            {center}
          </text>
        </motion.g>

        {placed.map(({ node, x, y }, i) => {
          const lineHeight = node.lines.length > 3 ? 21 : 24;
          const fontSize = node.lines.length > 3 ? 18 : 20;
          const top = y - ((node.lines.length - 1) * lineHeight) / 2;
          return (
            <motion.g
              key={`node-${i}`}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.06 }}
              transition={{ delay: 0.1 + i * 0.06, type: "spring", stiffness: 180, damping: 15 }}
            >
              <circle cx={x} cy={y} r={NODE_R} fill={TONE_COLORS[node.tone]} />
              <text
                textAnchor="middle"
                dominantBaseline="central"
                fill="#fff"
                fontSize={fontSize}
                fontWeight={700}
              >
                {node.lines.map((line, li) => (
                  <tspan key={li} x={x} y={top + li * lineHeight}>
                    {line}
                  </tspan>
                ))}
              </text>
            </motion.g>
          );
        })}
      </svg>

      {/* Phones: the same web as a stack, since the circles would be too small to read */}
      <div className="sm:hidden mt-4">
        <div
          className="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full text-center text-lg font-bold text-white"
          style={{ backgroundColor: CENTER_COLOR }}
        >
          {center}
        </div>
        <p className="text-xs text-center mb-3" style={{ color: colors.textSecondary }}>
          ⇅ Each of these connects back to {center}
        </p>
        <ul className="grid grid-cols-2 gap-2">
          {nodes.map((node, i) => (
            <li
              key={i}
              className="rounded-xl px-3 py-3 text-center text-sm font-bold text-white"
              style={{ backgroundColor: TONE_COLORS[node.tone] }}
            >
              {plainLabel(node)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
