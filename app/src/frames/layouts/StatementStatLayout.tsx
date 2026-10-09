import type { StatementStatBlocks } from "../../content/types";
import { Reveal, useRevealActive } from "../reveal";
import { CountUp } from "../../ui/CountUp";

/** Frame 2 — a big antirealist statement paired with a count-up stat card. */
export function StatementStatLayout({
  blocks,
}: {
  blocks: StatementStatBlocks;
}) {
  const statActive = useRevealActive(2);
  return (
    <div className="grid h-full w-full grid-cols-[1.25fr_1fr] gap-14">
      {/* Left: statement + body */}
      <div className="flex flex-col justify-center">
        <Reveal order={0}>
          <p
            className="font-serif leading-[1.12] text-off-white"
            style={{ fontSize: 46 }}
          >
            <span className="text-gold">“</span>
            {blocks.statement}
            <span className="text-gold">”</span>
          </p>
        </Reveal>
        <Reveal order={1} className="mt-8">
          <p
            className="text-muted-text leading-relaxed"
            style={{ fontSize: 26 }}
          >
            {blocks.body}
          </p>
        </Reveal>
      </div>

      {/* Right: emphasis stat */}
      <Reveal
        order={2}
        className="flex flex-col justify-center rounded-3xl border border-gold/25 bg-elevated/60 p-12"
      >
        <div
          className="font-display leading-none text-gold"
          style={{ fontSize: 132 }}
        >
          <CountUp value={blocks.stat.value} active={statActive} />
        </div>
        <p className="mt-5 text-muted-text" style={{ fontSize: 24 }}>
          {blocks.stat.label}
        </p>
        <div className="mt-8 border-t border-gold/15 pt-6">
          <p className="font-serif text-pale-gold" style={{ fontSize: 28 }}>
            {blocks.subStat}
          </p>
        </div>
      </Reveal>
    </div>
  );
}
