import { useState } from "react";
import type { FlipTilesBlocks, FlipTile } from "../../content/types";
import { Reveal } from "../reveal";

/**
 * Frame 7 — a 2×3 grid of flip tiles. Hover (desktop) or tap (touch) flips a
 * tile from the show's name to the real-world issue it tackled.
 */
export function FlipTilesLayout({ blocks }: { blocks: FlipTilesBlocks }) {
  return (
    <div className="flex h-full w-full flex-col gap-7">
      <Reveal order={0} className="grid flex-1 grid-cols-3 grid-rows-2 gap-6">
        {blocks.tiles.map((tile) => (
          <FlipTileCard key={tile.name} tile={tile} />
        ))}
      </Reveal>
      <Reveal order={1}>
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

function FlipTileCard({ tile }: { tile: FlipTile }) {
  const [tapped, setTapped] = useState(false);
  return (
    <button
      type="button"
      className="group h-full w-full [perspective:1400px] focus:outline-none"
      onClick={() => setTapped((v) => !v)}
      aria-label={`${tile.name}: ${tile.issue}`}
    >
      <div
        className="relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-focus-visible:[transform:rotateY(180deg)]"
        style={tapped ? { transform: "rotateY(180deg)" } : undefined}
      >
        {/* Front: show name */}
        <div className="absolute inset-0 flex items-center justify-center rounded-3xl border border-gold/20 bg-elevated/60 p-6 [backface-visibility:hidden]">
          <span
            className="text-center font-display text-pale-gold"
            style={{ fontSize: 34 }}
          >
            {tile.name}
          </span>
        </div>
        {/* Back: issue */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-3xl border border-crimson/50 p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]"
          style={{
            background:
              "linear-gradient(160deg, rgba(179,40,63,0.35), rgba(58,44,65,0.6))",
          }}
        >
          <span className="kicker" style={{ color: "var(--pale-gold)" }}>
            Tackles
          </span>
          <span
            className="text-center font-serif text-white"
            style={{ fontSize: 28 }}
          >
            {tile.issue}
          </span>
        </div>
      </div>
    </button>
  );
}
