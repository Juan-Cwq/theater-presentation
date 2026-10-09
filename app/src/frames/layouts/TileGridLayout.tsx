import type { TileGridBlocks } from "../../content/types";
import { Reveal } from "../reveal";

/** Frame 11 — a statement above a 2×3 grid of crossover-musical tiles. */
export function TileGridLayout({ blocks }: { blocks: TileGridBlocks }) {
  return (
    <div className="flex h-full w-full flex-col gap-8">
      <Reveal order={0}>
        <p
          className="font-serif leading-snug text-off-white"
          style={{ fontSize: 30 }}
        >
          {blocks.statement}
        </p>
      </Reveal>
      <Reveal order={1} className="grid flex-1 grid-cols-3 grid-rows-2 gap-6">
        {blocks.tiles.map((tile) => (
          <div
            key={tile.title}
            className="flex flex-col justify-center rounded-3xl border border-gold/15 bg-elevated/50 p-7"
          >
            <h3
              className="font-display text-pale-gold"
              style={{ fontSize: 27 }}
            >
              {tile.title}
            </h3>
            <p className="mt-2 text-muted-text" style={{ fontSize: 21 }}>
              {tile.text}
            </p>
          </div>
        ))}
      </Reveal>
    </div>
  );
}
