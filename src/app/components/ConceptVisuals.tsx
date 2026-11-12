import type { ReactNode } from "react";

/**
 * Two small diagram pages used inside the module lessons:
 *  - ProcessStep: a numbered row of stages (how a GenAI model learns).
 *  - FrameworkTableStep: three coloured columns of related skills (what GenAI literacy covers).
 */

function PageHeader({ data, colors }: { data: any; colors: any }) {
  return (
    <div>
      <span
        className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-2"
        style={{ backgroundColor: "rgba(232,84,122,0.2)", color: colors.accentPink }}
      >
        Section {data.section}
      </span>
      <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
        {data.title}
      </h2>
      {data.subtitle && (
        <p className="text-sm" style={{ color: colors.textSecondary }}>
          {data.subtitle}
        </p>
      )}
    </div>
  );
}

function SourceLinks({ links, colors }: { links?: { label: string; url: string }[]; colors: any }) {
  if (!links || links.length === 0) return null;
  return (
    <ul className="space-y-1 text-sm break-all list-none p-0 m-0">
      {links.map((l) => (
        <li key={l.url}>
          <a href={l.url} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: colors.accentGold }}>
            {l.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

// Same ASU-palette tones as the web map, so the diagrams look like they belong together.
const STAGE_COLORS = ["#8B1A2E", "#D6396A", "#23909F", "#B97A00", "#1D4E9E"];

export function ProcessStep({ data, colors }: { data: any; colors: any }) {
  const steps: string[] = data.steps ?? [];
  return (
    <div className="space-y-5 mx-auto" style={{ maxWidth: 940 }}>
      <PageHeader data={data} colors={colors} />
      <ol className="list-none p-0 m-0 flex flex-col md:flex-row md:items-stretch gap-2 md:gap-1">
        {steps.map((title, i) => (
          <li key={title} className="flex flex-col md:flex-row md:flex-1 items-stretch gap-2 md:gap-1">
            <div
              className="flex-1 rounded-2xl px-4 py-4 text-center flex flex-col items-center justify-center gap-2"
              style={{ backgroundColor: colors.cardBackground, border: `2px solid ${STAGE_COLORS[i % STAGE_COLORS.length]}` }}
            >
              <span
                className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-extrabold text-white"
                style={{ backgroundColor: STAGE_COLORS[i % STAGE_COLORS.length] }}
                aria-hidden
              >
                {i + 1}
              </span>
              <span className="font-bold leading-snug" style={{ color: colors.textPrimary }}>
                {title}
              </span>
            </div>
            {i < steps.length - 1 && (
              <span className="text-center text-2xl font-bold md:px-0.5 md:self-center" style={{ color: colors.accentGold }} aria-hidden>
                <span className="md:hidden">↓</span>
                <span className="hidden md:inline">→</span>
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

const TABLE_TONES: Record<string, { bg: string; text: string }> = {
  maroon: { bg: "#8B1A2E", text: "#FFFFFF" },
  grey: { bg: "#7A7F85", text: "#FFFFFF" },
  gold: { bg: "#FFC627", text: "#1A1A1A" },
};

export function FrameworkTableStep({ data, colors }: { data: any; colors: any }) {
  const columns: { title: string; tone: string; items: string[] }[] = data.columns ?? [];
  const body = (children: ReactNode) => (
    <div className="space-y-5 mx-auto" style={{ maxWidth: 940 }}>
      <PageHeader data={data} colors={colors} />
      {children}
      <SourceLinks links={data.links} colors={colors} />
    </div>
  );

  return body(
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {columns.map((col) => {
        const tone = TABLE_TONES[col.tone] ?? TABLE_TONES.gold;
        return (
          <div key={col.title} className="flex flex-col gap-2">
            <div
              className="px-4 pt-4 pb-9 text-center font-bold leading-snug"
              style={{
                backgroundColor: tone.bg,
                color: tone.text,
                clipPath: "polygon(0 0, 100% 0, 100% 78%, 50% 100%, 0 78%)",
              }}
            >
              {col.title}
            </div>
            {col.items.map((item) => (
              <div
                key={item}
                className="rounded-lg px-3 py-3 text-center text-sm"
                style={{ backgroundColor: colors.cardBackground, border: "1px solid rgba(255,198,39,0.2)", color: colors.textPrimary }}
              >
                {item}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
