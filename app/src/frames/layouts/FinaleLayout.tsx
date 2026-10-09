import type { FinaleBlocks } from "../../content/types";
import { Reveal } from "../reveal";
import { MarqueeBulbs } from "../../ui/MarqueeBulbs";

/**
 * Frame 13 — the final bow: three numbered takeaways, an interactive prompt that
 * drops a sticky note onto the whiteboard, and a source footer.
 *
 * The prompt is decoupled from the whiteboard via a DOM CustomEvent so this
 * layout has no dependency on the whiteboard store.
 */
export function FinaleLayout({ blocks }: { blocks: FinaleBlocks }) {
  const dropSticky = () => {
    window.dispatchEvent(
      new CustomEvent("amt:drop-sticky", {
        detail: { text: blocks.prompt },
      }),
    );
  };

  return (
    <div className="flex h-full w-full flex-col">
      <Reveal order={0}>
        <MarqueeBulbs count={20} />
      </Reveal>

      {/* Numbered takeaways */}
      <div className="mt-6 flex flex-1 flex-col justify-center gap-5">
        {blocks.takeaways.map((t, i) => (
          <Reveal
            key={i}
            order={i + 1}
            className="flex items-center gap-6"
          >
            <span
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-gold/50 bg-gold/10 font-display text-gold"
              style={{ fontSize: 34 }}
            >
              {i + 1}
            </span>
            <span
              className="font-serif text-off-white"
              style={{ fontSize: 32 }}
            >
              {t}
            </span>
          </Reveal>
        ))}
      </div>

      {/* Interactive prompt + footer */}
      <Reveal order={4} className="mt-6 flex items-center justify-between gap-6">
        <button
          type="button"
          onClick={dropSticky}
          className="rounded-full border border-gold bg-gold/15 px-8 py-4 font-serif text-pale-gold transition-colors hover:bg-gold/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          style={{ fontSize: 24 }}
        >
          {blocks.prompt}
          <span className="ml-3 text-gold">＋ add a sticky</span>
        </button>
        <span
          className="shrink-0 text-muted-text"
          style={{ fontSize: 18 }}
        >
          {blocks.footer}
        </span>
      </Reveal>
    </div>
  );
}
