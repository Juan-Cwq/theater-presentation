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

  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  useEffect(() => {
    if (!enabled) return;
    if (index >= TOTAL_FRAMES) {
      onFinishRef.current();
      return;
    }
    const frame = frameByNumber(index);
    const delay = Math.max(2600, frame.duration ?? 4000);
    const id = window.setTimeout(() => usePresentation.getState().next(), delay);
    return () => window.clearTimeout(id);
  }, [enabled, index]);
}
