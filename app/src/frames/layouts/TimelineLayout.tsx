import type { TimelineBlocks } from "../../content/types";
import { Reveal } from "../reveal";

/** Frame 4 — a horizontal timeline with 4 year nodes along a spine. */
export function TimelineLayout({ blocks }: { blocks: TimelineBlocks }) {
  return (
    <div className="relative flex h-full w-full items-center">
      {/* Spine */}
      <div
        aria-hidden
        className="absolute left-0 right-0 top-[64px] h-[3px]"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(217,170,63,0.5) 12%, rgba(217,170,63,0.5) 88%, transparent)",
        }}
      />
      <div className="grid w-full grid-cols-4 gap-6">
        {blocks.nodes.map((node, i) => (
          <Reveal key={node.year} order={i} className="flex flex-col">
            {/* Node dot sits on the spine (top:64 - here aligned) */}
            <div className="relative h-[128px]">
              <div className="flex items-start gap-4">
                <span
                  className="mt-[52px] h-6 w-6 shrink-0 rounded-full border-4 border-gold bg-bg shadow-gold-glow"
                  aria-hidden
                />
                <span
                  className="font-display leading-none text-gold"
                  style={{ fontSize: 58 }}
                >
                  {node.year}
                </span>
              </div>
            </div>
            <h3
              className="font-display text-pale-gold"
              style={{ fontSize: 30 }}
            >
              {node.title}
            </h3>
            <p
              className="mt-3 text-muted-text leading-relaxed"
              style={{ fontSize: 22 }}
            >
              {node.text}
            </p>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
