import { useEffect, useRef } from "react";
import { usePresentation } from "./presentationStore";
import { frameByNumber, TOTAL_FRAMES } from "../content/frames";

/**
 * Auto-play / recording mode. When enabled, scrolls to the next frame after a
 * delay paced by each frame's own `duration`. Stops at the end and calls
 * `onFinish`.
 */
export function useAutoplay(enabled: boolean, onFinish: () => void) {
  const index = usePresentation((s) => s.index);
  const step = usePresentation((s) => s.step);

  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  useEffect(() => {
    if (!enabled) return;
    const frame = frameByNumber(index);
    if (index >= TOTAL_FRAMES && step >= frame.reveals) {
      onFinishRef.current();
      return;
    }
    // Pace each slot (dark beat + title + columns) by a share of the duration.
    const slots = frame.reveals + 2;
    const delay = Math.max(1200, (frame.duration ?? 5000) / slots);
    const id = window.setTimeout(() => usePresentation.getState().next(), delay);
    return () => window.clearTimeout(id);
  }, [enabled, index, step]);
}
