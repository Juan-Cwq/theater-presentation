import type { ReactNode } from "react";
import type { Frame } from "../content/types";
import { FRAME_H, FRAME_W } from "../canvas/geometry";
import { MarqueeBulbs } from "../ui/MarqueeBulbs";

/**
 * The visual shell every frame shares: a fixed 1600×900 card with a consistent
 * header (kicker + title) and a body slot the layout fills. Hero / finale frames
 * get marquee bulbs along the top edge.
 */
export function FrameCard({
  frame,
  children,
  showBulbs = false,
  emphasis = false,
  titleSize = 68,
  align = "left",
  showHeader = true,
}: {
  frame: Frame;
  children: ReactNode;
  showBulbs?: boolean;
  emphasis?: boolean;
  titleSize?: number;
  align?: "left" | "center";
  showHeader?: boolean;
}) {
  return (
    <section
      aria-label={`Frame ${frame.n}: ${frame.title}`}
      className="relative flex flex-col overflow-hidden rounded-[32px] border bg-panel shadow-card"
      style={{
        width: FRAME_W,
        height: FRAME_H,
        padding: 88,
        borderColor: emphasis ? "rgba(179,40,63,0.5)" : "rgba(217,170,63,0.22)",
      }}
    >
      {/* Soft inner top glow for depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-48"
        style={{
          background:
            "radial-gradient(120% 100% at 50% 0%, rgba(217,170,63,0.12), transparent 70%)",
        }}
      />

      {showBulbs && (
        <MarqueeBulbs
          count={24}
          className="pointer-events-none absolute left-1/2 top-7 -translate-x-1/2"
        />
      )}

      {/* Header */}
      {showHeader && (
        <header
          className={`relative z-10 mb-8 shrink-0 ${
            align === "center" ? "text-center" : ""
          }`}
        >
          <p className="kicker" style={{ fontSize: 22 }}>
            {frame.kicker}
          </p>
          <h2
            className="mt-3 font-display leading-[1.02] text-off-white"
            style={{ fontSize: titleSize }}
          >
            {frame.title}
          </h2>
        </header>
      )}

      {/* Body */}
      <div className="relative z-10 flex min-h-0 flex-1">{children}</div>
    </section>
  );
}
