import type { ActId } from "../canvas/geometry";

/**
 * Typed content model. Each frame carries a discriminated `layout` union so the
 * renderer can pick exactly one layout component and TypeScript guarantees the
 * `blocks` shape matches.
 */

/** The unique per-slide entrance transitions (see frames/FrameTransition.tsx). */
export type TransitionId =
  | "curtain"
  | "rise"
  | "iris"
  | "leaves"
  | "shutter"
  | "unfold"
  | "zoom-focus"
  | "flip"
  | "slide-left"
  | "sweep"
  | "split"
  | "blur-in"
  | "finale-bow";

export type LayoutId =
  | "hero"
  | "statement-stat"
  | "icon-cards"
  | "timeline"
  | "wide-crimson"
  | "year-columns"
  | "flip-tiles"
  | "stat-panel-list"
  | "playbill-chips"
  | "stat-cards"
  | "tile-grid"
  | "list-quote"
  | "finale";

export interface HeroBlocks {
  subtitle: string;
  presenter: string;
}

export interface StatementStatBlocks {
  statement: string;
  body: string;
  stat: { value: string; label: string };
  subStat: string;
}

export interface IconCard {
  icon: string; // lucide-react icon name
  label: string;
  text: string;
}
export interface IconCardsBlocks {
  cards: IconCard[];
}

export interface TimelineNode {
  year: string;
  title: string;
  text: string;
}
export interface TimelineBlocks {
  nodes: TimelineNode[];
}

export interface WideCrimsonBlocks {
  wide: { title: string; names: string; body: string };
  crimson: { title: string; stat: { value: string; label: string }; extra: string };
}

export interface YearColumnsBlocks {
  columns: { year: string; title: string; text: string }[];
}

export interface FlipTile {
  name: string;
  issue: string;
}
export interface FlipTilesBlocks {
  tiles: FlipTile[];
  footer: string;
}

export interface StatPanelListBlocks {
  stat: { value: string; label: string };
  list: { name: string; text: string }[];
}

export interface PlaybillChipsBlocks {
  intro: string;
  bullets: string[];
  chips: { year: string; title: string; text: string }[];
}

export interface StatCardsBlocks {
  cards: { value: string; title: string; text: string }[];
  footer: string;
}

export interface TileGridBlocks {
  statement: string;
  tiles: { title: string; text: string }[];
}

export interface ListQuoteBlocks {
  list: { title: string; text: string }[];
  quote: string;
}

export interface FinaleBlocks {
  takeaways: string[];
  prompt: string;
  footer: string;
}

/** Map every layout id to its block payload. */
export interface LayoutBlockMap {
  hero: HeroBlocks;
  "statement-stat": StatementStatBlocks;
  "icon-cards": IconCardsBlocks;
  timeline: TimelineBlocks;
  "wide-crimson": WideCrimsonBlocks;
  "year-columns": YearColumnsBlocks;
  "flip-tiles": FlipTilesBlocks;
  "stat-panel-list": StatPanelListBlocks;
  "playbill-chips": PlaybillChipsBlocks;
  "stat-cards": StatCardsBlocks;
  "tile-grid": TileGridBlocks;
  "list-quote": ListQuoteBlocks;
  finale: FinaleBlocks;
}

/** A single frame of the presentation. */
export type Frame = {
  [K in LayoutId]: {
    id: string;
    /** 1-based frame number. */
    n: number;
    act: ActId;
    kicker: string;
    title: string;
    layout: K;
    blocks: LayoutBlockMap[K];
    /** Narration script shown in the speaker-notes drawer. */
    notes: string;
    /** Auto-play dwell time in ms. */
    duration: number;
    /**
     * Number of in-frame reveal steps AFTER the base view. The navigator presses
     * through 0..reveals before advancing to the next frame. Configurable per
     * frame; falls back to a per-layout default when omitted.
     */
    reveals: number;
    /** Optional milestone year shown as a floating marker on the path. */
    milestone?: string;
    /** Big faded year watermark shown above the frame card. */
    year?: string;
    /** Unique entrance animation played when this frame becomes active. */
    transition?: TransitionId;
  };
}[LayoutId];
