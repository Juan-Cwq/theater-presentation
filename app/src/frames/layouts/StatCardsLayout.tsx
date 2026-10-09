import type { StatCardsBlocks } from "../../content/types";
import { Reveal, useRevealActive } from "../reveal";
import { CountUp } from "../../ui/CountUp";

/** Frame 10 — three megamusical stat cards + a footer line. */
export function StatCardsLayout({ blocks }: { blocks: StatCardsBlocks }) {
  return (
    <div className="flex h-full w-full flex-col gap-8">
      <div className="grid flex-1 grid-cols-3 gap-8">
        {blocks.cards.map((card, i) => (
          <StatCard key={card.title} card={card} order={i} />
        ))}
      </div>
      <Reveal order={3}>
        <p
          className="text-center font-serif italic text-muted-text"
          style={{ fontSize: 24 }}
        >
          {blocks.footer}
        </p>
      </Reveal>
    </div>
  );
}

function StatCard({
  card,
  order,
}: {
  card: StatCardsBlocks["cards"][number];
  order: number;
}) {
  const active = useRevealActive(order);
  return (
    <Reveal
      order={order}
      className="flex flex-col justify-center rounded-3xl border border-gold/20 bg-elevated/50 p-10 text-center"
    >
      <div
        className="font-display leading-none text-gold"
        style={{ fontSize: 88 }}
      >
        <CountUp value={card.value} active={active} />
      </div>
      <h3
        className="mt-6 font-display text-pale-gold"
        style={{ fontSize: 32 }}
      >
        {card.title}
      </h3>
      <p
        className="mt-4 text-muted-text leading-relaxed"
        style={{ fontSize: 22 }}
      >
        {card.text}
      </p>
    </Reveal>
  );
}
