import { useEffect, useRef } from "react";
import { usePresentation } from "./presentationStore";
import { TOTAL_FRAMES } from "../content/frames";

function frameFromHash(): number | null {
  const m = window.location.hash.match(/^#frame-(\d+)$/);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  if (Number.isNaN(n) || n < 1 || n > TOTAL_FRAMES) return null;
  return n;
}

/**
 * Two-way sync between the URL hash (`#frame-6`) and the current frame.
 * - On mount, open the frame named in the hash.
 * - When the frame changes, update the hash (without adding history spam).
 * - Respond to manual hash edits / back-forward navigation.
 */
export function useDeepLink() {
  const index = usePresentation((s) => s.index);
  const goTo = usePresentation((s) => s.goTo);

  // On mount: open the deep-linked frame, or position the camera on frame 1.
  // Guarded so it runs exactly once — otherwise StrictMode's double-invoke would
  // re-read the hash we just wrote and spuriously reveal the whole frame.
  const didInit = useRef(false);
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    const n = frameFromHash();
    goTo(n ?? 1, { reveal: n ? "all" : "none", animate: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the hash in sync as the frame changes.
  useEffect(() => {
    const desired = `#frame-${index}`;
    if (window.location.hash !== desired) {
      history.replaceState(null, "", desired);
    }
  }, [index]);

  // React to user-driven hash changes (manual edit / back button).
  useEffect(() => {
    const onHash = () => {
      const n = frameFromHash();
      if (n && n !== usePresentation.getState().index) {
        goTo(n, { reveal: "all" });
      }
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [goTo]);
}
