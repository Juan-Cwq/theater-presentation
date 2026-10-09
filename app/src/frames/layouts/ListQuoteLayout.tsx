import type { ListQuoteBlocks } from "../../content/types";
import { Reveal } from "../reveal";

/** Frame 12 — a list of 21st-century shows beside a crimson quote card. */
export function ListQuoteLayout({ blocks }: { blocks: ListQuoteBlocks }) {
  return (
    <div className="grid h-full w-full grid-cols-[1.15fr_1fr] gap-12">
      {/* List */}
      <Reveal order={0} className="flex flex-col justify-center gap-4">
        {blocks.list.map((item) => (
          <div
            key={item.title}
            className="flex items-baseline gap-5 border-b border-gold/12 pb-4"
          >
            <span
              className="font-display text-gold"
              style={{ fontSize: 30, minWidth: 220 }}
            >
              {item.title}
            </span>
            <span className="text-muted-text" style={{ fontSize: 22 }}>
              {item.text}
            </span>
          </div>
        ))}
      </Reveal>

      {/* Crimson quote card */}
      <Reveal
        order={1}
        className="flex flex-col justify-center rounded-3xl border border-crimson/50 p-12"
      >
        <div
          className="flex h-full flex-col justify-center rounded-2xl p-10"
          style={{
            background:
              "linear-gradient(160deg, rgba(179,40,63,0.28), rgba(179,40,63,0.06))",
            margin: -8,
          }}
        >
          <span
            className="font-display leading-none text-crimson"
            style={{ fontSize: 96 }}
            aria-hidden
          >
            “
          </span>
          <p
            className="-mt-6 font-serif leading-snug text-off-white"
            style={{ fontSize: 32 }}
          >
            {blocks.quote}
          </p>
        </div>
      </Reveal>
    </div>
  );
}
