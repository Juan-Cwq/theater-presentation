/**
 * A row (or ring) of small gold "marquee bulbs" with a slow chasing-lights
 * animation. Pure CSS via per-bulb animation-delay. Honors reduced motion
 * through the global stylesheet.
 */
export function MarqueeBulbs({
  count = 16,
  className = "",
  gap = 26,
  size = 9,
}: {
  count?: number;
  className?: string;
  gap?: number;
  size?: number;
}) {
  return (
    <div
      aria-hidden
      className={`flex items-center ${className}`}
      style={{ gap }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="rounded-full bg-gold"
          style={{
            width: size,
            height: size,
            animation: "bulb-chase 1.6s ease-in-out infinite",
            animationDelay: `${(i % 8) * 0.12}s`,
          }}
        />
      ))}
    </div>
  );
}
