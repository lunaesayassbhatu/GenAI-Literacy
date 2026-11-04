/**
 * A lesson page that plays one YouTube video. It uses the privacy-friendly
 * youtube-nocookie.com player, and keeps a plain link underneath for anyone
 * whose school network or browser blocks embedded video.
 */
export function VideoStep({ data, colors }: { data: any; colors: any }) {
  const embedUrl = `https://www.youtube-nocookie.com/embed/${data.videoId}?rel=0`;
  const watchUrl = `https://www.youtube.com/watch?v=${data.videoId}`;

  return (
    <div className="space-y-4 mx-auto" style={{ maxWidth: 760 }}>
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
        <p className="text-sm" style={{ color: colors.textSecondary }}>
          {data.subtitle}
        </p>
      </div>

      <div
        className="relative w-full overflow-hidden rounded-2xl"
        style={{ aspectRatio: "16 / 9", backgroundColor: "#000", border: `2px solid ${colors.accentGold}` }}
      >
        <iframe
          className="absolute inset-0 w-full h-full"
          src={embedUrl}
          title={data.videoTitle ?? data.title}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>

      <p className="text-sm" style={{ color: colors.textSecondary }}>
        Video not playing?{" "}
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline"
          style={{ color: colors.accentGold }}
        >
          Watch it on YouTube
        </a>
        .
      </p>
    </div>
  );
}
