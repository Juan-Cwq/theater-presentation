import type { YearColumnsBlocks } from "../../content/types";
import { Reveal } from "../reveal";

/** Frame 6 — three big-year columns marking the golden age. */
export function YearColumnsLayout({ blocks }: { blocks: YearColumnsBlocks }) {
  return (
    <div className="grid h-full w-full grid-cols-3 gap-10">
      {blocks.columns.map((col, i) => (
        <Reveal
          key={col.year}
          order={i}
          className="flex flex-col justify-center border-l border-gold/20 pl-9"
        >
          <span
            className="font-display leading-none text-gold"
            style={{ fontSize: 110 }}
          >
            {col.year}
          </span>
          <h3
            className="mt-6 font-display text-pale-gold"
            style={{ fontSize: 40 }}
          >
            {col.title}
          </h3>
          <p
            className="mt-5 text-muted-text leading-relaxed"
            style={{ fontSize: 24 }}
          >
            {col.text}
          </p>
        </Reveal>
      ))}
    </div>
  );
}
