import type { HeroBlocks } from "../../content/types";
import { Reveal } from "../reveal";
import { MarqueeBulbs } from "../../ui/MarqueeBulbs";

/** Frame 1 — the title. Big serif, centered, framed by marquee bulbs. */
export function HeroLayout({ blocks }: { blocks: HeroBlocks }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center text-center">
      <Reveal order={0}>
        <p
          className="font-serif italic text-pale-gold"
          style={{ fontSize: 40 }}
        >
          {blocks.subtitle}
        </p>
      </Reveal>

      <Reveal order={1} className="mt-12">
        <div className="flex flex-col items-center gap-5">
          <MarqueeBulbs count={18} />
          <p className="kicker" style={{ fontSize: 20 }}>
            Presented by
          </p>
          <p className="font-display text-white" style={{ fontSize: 44 }}>
            {blocks.presenter}
          </p>
        </div>
      </Reveal>
    </div>
  );
}
