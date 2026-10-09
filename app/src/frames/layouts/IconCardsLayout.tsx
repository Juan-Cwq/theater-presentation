import type { IconCardsBlocks } from "../../content/types";
import { Reveal } from "../reveal";
import { IconBadge } from "../../ui/IconBadge";

/** Frame 3 — four icon cards (Greece, Shakespeare, Molière, Asia). */
export function IconCardsLayout({ blocks }: { blocks: IconCardsBlocks }) {
  return (
    <div className="grid h-full w-full grid-cols-4 gap-7">
      {blocks.cards.map((card, i) => (
        <Reveal
          key={card.label}
          order={i}
          className="flex flex-col rounded-3xl border border-gold/15 bg-elevated/50 p-9"
        >
          <IconBadge name={card.icon} size={26} />
          <h3
            className="mt-7 font-display text-pale-gold"
            style={{ fontSize: 38 }}
          >
            {card.label}
          </h3>
          <p
            className="mt-4 text-muted-text leading-relaxed"
            style={{ fontSize: 23 }}
          >
            {card.text}
          </p>
        </Reveal>
      ))}
    </div>
  );
}
