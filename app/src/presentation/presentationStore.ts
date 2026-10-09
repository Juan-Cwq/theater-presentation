import { create } from "zustand";
import { FRAMES, TOTAL_FRAMES, frameByNumber } from "../content/frames";

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

/**
 * When advancing/retreating by *key*, the next frame should arrive "in the
 * dark" (step -1: lights dimmed, year glowing) and wait for the presenter. A
 * plain scroll instead lands the frame already lit (step 0).
 */
let arriveDark = false;

/** DeckView registers a scroll function so the store can drive navigation. */
export function registerDeckScroller(fn: Scroller | null) {
  scroller = fn;
}

interface PresentationState {
  /** 1-based current frame (the one snapped into view). */
  index: number;
  /**
   * The presenter-driven progress within the current frame:
   *   -1          → "in the dark": lights dimmed, big year glowing, panel hidden
   *    0          → lit, title/kicker shown (no columns yet)
   *    1..reveals → that many columns revealed
   * Keys step through this (space / arrows) so the presenter controls the whole
   * pacing — including how long the dark "year" beat lingers before the lights
   * come up. Scrolling lands a frame lit (step 0).
   */
  step: number;

  /** Reveal the next column; at the end of a frame, scroll to the next one. */
  next: () => void;
  /** Hide the last column; at the start of a frame, scroll to the previous one. */
  prev: () => void;
  /** Jump straight to a frame. `animate: false` scrolls instantly (deep links). */
  goTo: (n: number, opts?: { reveal?: "all" | "none"; animate?: boolean }) => void;
  /** Sync the active index from the scroll position (called by DeckView). */
  setIndex: (n: number) => void;
}

const clamp = (n: number) => Math.min(TOTAL_FRAMES, Math.max(1, n));

export const usePresentation = create<PresentationState>((set, get) => ({
  index: 1,
  step: 0,

  next: () => {
    const { index, step } = get();
    const reveals = frameByNumber(index).reveals;
    // -1 (dark) → 0 (raise lights) → 1..reveals (columns).
    if (step < reveals) {
      set({ step: step + 1 });
      return;
    }
    const n = clamp(index + 1);
    if (n !== index) {
      arriveDark = true; // the next frame opens in the dark
      scroller?.(n, true);
    }
  },

  prev: () => {
    const { index, step } = get();
    if (step > -1) {
      set({ step: step - 1 });
      return;
    }
    const n = clamp(index - 1);
    if (n !== index) {
      arriveDark = true;
      scroller?.(n, true);
    }
  },

  goTo: (n, opts) => {
    const target = clamp(n);
    set({ index: target, step: 0 });
    scroller?.(target, opts?.animate !== false);
  },

  setIndex: (n) => {
    const next = clamp(n);
    if (next !== get().index) {
      set({ index: next, step: arriveDark ? -1 : 0 });
      arriveDark = false;
    }
  },
}));

export { FRAMES };
