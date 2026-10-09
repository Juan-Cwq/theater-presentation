import { create } from "zustand";
import { FRAMES, TOTAL_FRAMES } from "../content/frames";

/**
 * Deck navigation store.
 *
 * The show is now a vertical scroll-snap deck (see `DeckView`). Navigation is
 * driven by the browser's native scroll; this store just tracks the current
 * 1-based frame and exposes imperative helpers (keyboard, dock, deep links,
 * auto-play) that delegate to the deck's registered scroller.
 */

type Scroller = (n: number, smooth?: boolean) => void;

let scroller: Scroller | null = null;

/** DeckView registers a scroll function so the store can drive navigation. */
export function registerDeckScroller(fn: Scroller | null) {
  scroller = fn;
}

interface PresentationState {
  /** 1-based current frame (the one snapped into view). */
  index: number;

  /** Scroll to the next frame. */
  next: () => void;
  /** Scroll to the previous frame. */
  prev: () => void;
  /** Jump straight to a frame. `animate: false` scrolls instantly (deep links). */
  goTo: (n: number, opts?: { reveal?: "all" | "none"; animate?: boolean }) => void;
  /** Sync the active index from the scroll position (called by DeckView). */
  setIndex: (n: number) => void;
}

const clamp = (n: number) => Math.min(TOTAL_FRAMES, Math.max(1, n));

export const usePresentation = create<PresentationState>((set, get) => ({
  index: 1,

  next: () => {
    const n = clamp(get().index + 1);
    scroller?.(n, true);
  },

  prev: () => {
    const n = clamp(get().index - 1);
    scroller?.(n, true);
  },

  goTo: (n, opts) => {
    const target = clamp(n);
    set({ index: target });
    scroller?.(target, opts?.animate !== false);
  },

  setIndex: (n) => {
    const next = clamp(n);
    if (next !== get().index) set({ index: next });
  },
}));

export { FRAMES };
