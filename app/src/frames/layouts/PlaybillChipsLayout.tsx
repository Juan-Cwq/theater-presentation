import type { PlaybillChipsBlocks } from "../../content/types";
import { Reveal } from "../reveal";

/** Frame 9 — Sondheim: intro + bullets on the left, stacked playbill chips right. */
export function PlaybillChipsLayout({
  blocks,
}: {
  blocks: PlaybillChipsBlocks;
}) {
  return (
    <div className="grid h-full w-full grid-cols-[1fr_1.1fr] gap-12">
      {/* Left: intro + bullets */}
      <div className="flex flex-col justify-center">
        <Reveal order={0}>
          <p
            className="font-serif leading-snug text-off-white"
            style={{ fontSize: 30 }}
          >
            {blocks.intro}
          </p>
        </Reveal>
        <Reveal order={1} className="mt-8 flex flex-col gap-4">
          {blocks.bullets.map((b) => (
            <div key={b} className="flex items-start gap-4">
              <span
                className="mt-3 h-2.5 w-2.5 shrink-0 rounded-full bg-gold"
                aria-hidden
              />
              <span className="text-muted-text" style={{ fontSize: 24 }}>
                {b}
              </span>
            </div>
          ))}
        </Reveal>
      </div>

      {/* Right: stacked playbill chips */}
      <Reveal order={2} className="flex flex-col justify-center gap-4">
        {blocks.chips.map((chip) => (
          <div
            key={chip.title}
            className="flex items-center gap-6 rounded-2xl border border-gold/20 bg-elevated/50 px-7 py-5"
          >
            <span
              className="font-display text-gold"
              style={{ fontSize: 38, minWidth: 96 }}
            >
              {chip.year}
            </span>
            <div className="border-l border-gold/20 pl-6">
              <h4
                className="font-display text-pale-gold"
                style={{ fontSize: 28 }}
              >
                {chip.title}
              </h4>
              <p className="mt-1 text-muted-text" style={{ fontSize: 21 }}>
                {chip.text}
              </p>
            </div>
          </div>
        ))}
      </Reveal>
    </div>
  );
}
