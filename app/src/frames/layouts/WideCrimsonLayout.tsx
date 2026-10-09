import type { WideCrimsonBlocks } from "../../content/types";
import { Reveal, useRevealActive } from "../reveal";
import { CountUp } from "../../ui/CountUp";

/** Frame 5 — a wide "hit factory" card beside a crimson emphasis stat card. */
export function WideCrimsonLayout({ blocks }: { blocks: WideCrimsonBlocks }) {
  const crimsonActive = useRevealActive(1);
  return (
    <div className="grid h-full w-full grid-cols-[1.4fr_1fr] gap-10">
      <Reveal
        order={0}
        className="flex flex-col justify-center rounded-3xl border border-gold/15 bg-elevated/50 p-12"
      >
        <h3 className="font-display text-pale-gold" style={{ fontSize: 44 }}>
          {blocks.wide.title}
        </h3>
        <p
          className="mt-5 font-serif italic text-gold"
          style={{ fontSize: 28 }}
        >
          {blocks.wide.names}
        </p>
        <p
          className="mt-7 text-muted-text leading-relaxed"
          style={{ fontSize: 26 }}
        >
          {blocks.wide.body}
        </p>
      </Reveal>

      <Reveal
        order={1}
        className="flex flex-col justify-center rounded-3xl border border-crimson/50 p-12"
        y={28}
      >
        <div
          className="relative flex h-full flex-col justify-center rounded-2xl"
          style={{
            background:
              "linear-gradient(160deg, rgba(179,40,63,0.28), rgba(179,40,63,0.08))",
            margin: -12,
            padding: 12,
          }}
        >
          <p
            className="kicker"
            style={{ color: "var(--crimson)", fontSize: 20 }}
          >
            {blocks.crimson.title}
          </p>
          <div
            className="mt-4 font-display leading-none text-white"
            style={{ fontSize: 112 }}
          >
            <CountUp value={blocks.crimson.stat.value} active={crimsonActive} />
          </div>
          <p className="mt-4 text-off-white/85" style={{ fontSize: 23 }}>
            {blocks.crimson.stat.label}
          </p>
          <p
            className="mt-7 border-t border-white/15 pt-5 font-serif text-pale-gold"
            style={{ fontSize: 24 }}
          >
            {blocks.crimson.extra}
          </p>
        </div>
      </Reveal>
    </div>
  );
}
