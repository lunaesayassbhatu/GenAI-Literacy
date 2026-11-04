/**
 * A framed portrait of a character, cropped to the head and shoulders.
 * The picture is a tall full-length portrait, so it is zoomed in on the face and upper body.
 */
export function ArgoniaPortrait({ src, alt, width = 150, height = 190 }: { src: string; alt: string; width?: number; height?: number }) {
  return (
    <div
      className="flex-shrink-0 overflow-hidden rounded-2xl shadow-lg"
      style={{ width, height, border: "2px solid #FFC627", backgroundColor: "#1b0f2e" }}
    >
      <img
        src={src}
        alt={alt}
        className="block w-full h-full"
        style={{ objectFit: "cover", objectPosition: "50% 8%", transform: "scale(2.1)", transformOrigin: "50% 17%" }}
      />
    </div>
  );
}
