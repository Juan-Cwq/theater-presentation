/**
 * Ambient "stage lighting" that fills the backdrop so the deck never reads as a
 * flat void. Dim golden-brown washes plus two soft spotlight beams angled from
 * above. Pure static CSS gradients painted once behind the scrolling deck — no
 * per-frame work, so it costs nothing while slides move.
 */
export function StageLights() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Warm golden-brown floor wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 55% at 50% 118%, rgba(140,92,34,0.30), transparent 70%)," +
            "radial-gradient(60% 50% at 18% 8%, rgba(110,72,26,0.22), transparent 65%)," +
            "radial-gradient(60% 50% at 82% 8%, rgba(120,80,30,0.22), transparent 65%)," +
            "radial-gradient(90% 70% at 50% 40%, rgba(70,46,20,0.18), transparent 75%)",
        }}
      />

      {/* Two spotlight beams raking down from the top corners (static) */}
      <div
        className="absolute -top-1/4 left-[8%] h-[150%] w-[42%]"
        style={{
          background:
            "linear-gradient(176deg, rgba(217,170,63,0.16), rgba(217,170,63,0.05) 40%, transparent 72%)",
          clipPath: "polygon(38% 0, 62% 0, 100% 100%, 0% 100%)",
          filter: "blur(18px)",
        }}
      />
      <div
        className="absolute -top-1/4 right-[8%] h-[150%] w-[42%]"
        style={{
          background:
            "linear-gradient(184deg, rgba(179,40,63,0.12), rgba(179,40,63,0.04) 40%, transparent 72%)",
          clipPath: "polygon(38% 0, 62% 0, 100% 100%, 0% 100%)",
          filter: "blur(18px)",
        }}
      />

      {/* Subtle warm haze across the middle */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(0deg, rgba(90,58,24,0.14), transparent 45%)",
        }}
      />
    </div>
  );
}
