import type { StatPanelListBlocks } from "../../content/types";
import { Reveal, useRevealActive } from "../reveal";
import { CountUp } from "../../ui/CountUp";

/** Frame 8 — a crimson stat panel beside a revealed list of choreographers. */
export function StatPanelListLayout({
  blocks,
}: {
  blocks: StatPanelListBlocks;
}) {
  const statActive = useRevealActive(0);
  return (
    <div className="grid h-full w-full grid-cols-[1fr_1.25fr] gap-12">
      {/* Crimson stat panel */}
      <Reveal
        order={0}
        className="flex flex-col justify-center rounded-3xl p-12"
      >
        <div
          className="flex h-full flex-col justify-center rounded-3xl border border-crimson/50 p-10"
          style={{
            background:
              "linear-gradient(160deg, rgba(179,40,63,0.3), rgba(179,40,63,0.07))",
          }}
        >
          <div
            className="font-display leading-none text-white"
            style={{ fontSize: 128 }}
          >
            <CountUp value={blocks.stat.value} active={statActive} />
          </div>
          <p className="mt-6 text-off-white/85" style={{ fontSize: 25 }}>
            {blocks.stat.label}
          </p>
        </div>
      </Reveal>

      {/* Choreographer list */}
      <div className="flex flex-col justify-center gap-5">
        {blocks.list.map((item, i) => (
          <Reveal
            key={item.name}
            order={i + 1}
            className="flex items-baseline gap-5 rounded-2xl border border-gold/15 bg-elevated/40 px-7 py-5"
          >
            <span
              className="font-display text-gold"
              style={{ fontSize: 30, minWidth: 260 }}
            >
              {item.name}
            </span>
            <span className="text-muted-text" style={{ fontSize: 22 }}>
              {item.text}
            </span>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
