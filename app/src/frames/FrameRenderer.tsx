import { memo } from "react";
import type { Frame } from "../content/types";
import { FrameCard } from "./FrameCard";
import { RevealProvider } from "./reveal";
import { HeroLayout } from "./layouts/HeroLayout";
import { StatementStatLayout } from "./layouts/StatementStatLayout";
import { IconCardsLayout } from "./layouts/IconCardsLayout";
import { TimelineLayout } from "./layouts/TimelineLayout";
import { WideCrimsonLayout } from "./layouts/WideCrimsonLayout";
import { YearColumnsLayout } from "./layouts/YearColumnsLayout";
import { FlipTilesLayout } from "./layouts/FlipTilesLayout";
import { StatPanelListLayout } from "./layouts/StatPanelListLayout";
import { PlaybillChipsLayout } from "./layouts/PlaybillChipsLayout";
import { StatCardsLayout } from "./layouts/StatCardsLayout";
import { TileGridLayout } from "./layouts/TileGridLayout";
import { ListQuoteLayout } from "./layouts/ListQuoteLayout";
import { FinaleLayout } from "./layouts/FinaleLayout";

/** Dispatch to the correct layout component with a type-narrowed frame. */
function LayoutBody({ frame }: { frame: Frame }) {
  switch (frame.layout) {
    case "hero":
      return <HeroLayout blocks={frame.blocks} />;
    case "statement-stat":
      return <StatementStatLayout blocks={frame.blocks} />;
    case "icon-cards":
      return <IconCardsLayout blocks={frame.blocks} />;
    case "timeline":
      return <TimelineLayout blocks={frame.blocks} />;
    case "wide-crimson":
      return <WideCrimsonLayout blocks={frame.blocks} />;
    case "year-columns":
      return <YearColumnsLayout blocks={frame.blocks} />;
    case "flip-tiles":
      return <FlipTilesLayout blocks={frame.blocks} />;
    case "stat-panel-list":
      return <StatPanelListLayout blocks={frame.blocks} />;
    case "playbill-chips":
      return <PlaybillChipsLayout blocks={frame.blocks} />;
    case "stat-cards":
      return <StatCardsLayout blocks={frame.blocks} />;
    case "tile-grid":
      return <TileGridLayout blocks={frame.blocks} />;
    case "list-quote":
      return <ListQuoteLayout blocks={frame.blocks} />;
    case "finale":
      return <FinaleLayout blocks={frame.blocks} />;
  }
}

/**
 * Renders a single frame. `activeCount` drives in-frame reveals; defaults to all
 * visible. Memoised so panning (which never changes these props) doesn't
 * re-render frame subtrees.
 */
export const FrameRenderer = memo(function FrameRenderer({
  frame,
  activeCount = Number.POSITIVE_INFINITY,
  instant = false,
}: {
  frame: Frame;
  activeCount?: number;
  instant?: boolean;
}) {
  const isHero = frame.layout === "hero";
  const isFinale = frame.layout === "finale";

  return (
    <RevealProvider activeCount={activeCount} instant={instant}>
      <FrameCard
        frame={frame}
        showBulbs={isHero}
        emphasis={isFinale}
        titleSize={isHero ? 92 : 68}
        align={isHero ? "center" : "left"}
      >
        <LayoutBody frame={frame} />
      </FrameCard>
    </RevealProvider>
  );
});
