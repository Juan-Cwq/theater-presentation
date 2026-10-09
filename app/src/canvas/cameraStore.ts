import { create } from "zustand";
import {
  applyZoomAtPoint,
  cameraForGoal,
  clampScale,
  goalFromCamera,
  interpolateFly,
  type Camera,
  type CameraGoal,
  type Size,
  type Vec2,
} from "./math";

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true
  );
}

interface FlyOptions {
  /** Flight duration in ms (ignored under reduced motion). */
  duration?: number;
  /** Mid-flight zoom-out amount. */
  dip?: number;
  onComplete?: () => void;
}

interface CameraState {
  cam: Camera;
  viewport: Size;
  /** True while a programmatic fly-to is in progress (suppresses input nudges). */
  isFlying: boolean;

  setViewport: (size: Size) => void;
  /** Replace the camera directly (used by pan / inertia). Cancels any flight. */
  setCamera: (cam: Camera, opts?: { interrupt?: boolean }) => void;
  panBy: (dx: number, dy: number) => void;
  zoomAtPoint: (screenPoint: Vec2, nextScale: number) => void;
  zoomByAtPoint: (factor: number, screenPoint: Vec2) => void;
  /** Smoothly fly the camera so `goal` is centred. Returns when started. */
  flyTo: (goal: CameraGoal, opts?: FlyOptions) => void;
  cancelFlight: () => void;
}

// Module-level handle to the active rAF flight so it can be cancelled cleanly.
let flightRaf: number | null = null;

export const useCameraStore = create<CameraState>((set, get) => ({
  cam: { x: 0, y: 0, scale: 1 },
  viewport: {
    width: typeof window !== "undefined" ? window.innerWidth : 1280,
    height: typeof window !== "undefined" ? window.innerHeight : 720,
  },
  isFlying: false,

  setViewport: (size) => set({ viewport: size }),

  setCamera: (cam, opts) => {
    if (opts?.interrupt !== false) cancelActiveFlight(set);
    set({ cam });
  },

  panBy: (dx, dy) => {
    cancelActiveFlight(set);
    const { cam } = get();
    set({ cam: { ...cam, x: cam.x + dx, y: cam.y + dy } });
  },

  zoomAtPoint: (screenPoint, nextScale) => {
    cancelActiveFlight(set);
    set({ cam: applyZoomAtPoint(get().cam, screenPoint, clampScale(nextScale)) });
  },

  zoomByAtPoint: (factor, screenPoint) => {
    cancelActiveFlight(set);
    const { cam } = get();
    set({ cam: applyZoomAtPoint(cam, screenPoint, cam.scale * factor) });
  },

  flyTo: (goal, opts = {}) => {
    const { viewport } = get();
    cancelActiveFlight(set);

    // Reduced motion: jump straight to the target (crossfades handled by frames).
    if (prefersReducedMotion()) {
      set({ cam: cameraForGoal(goal, viewport), isFlying: false });
      opts.onComplete?.();
      return;
    }

    const from = goalFromCamera(get().cam, viewport);
    const to: CameraGoal = { ...goal, scale: clampScale(goal.scale) };
    const duration = opts.duration ?? 900;
    const dip = opts.dip ?? 0.18;
    const start = performance.now();

    set({ isFlying: true });

    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // Viewport may change mid-flight (resize); re-read it each frame.
      const vp = get().viewport;
      set({ cam: interpolateFly(from, to, t, vp, dip) });
      if (t < 1) {
        flightRaf = requestAnimationFrame(step);
      } else {
        flightRaf = null;
        set({ isFlying: false });
        opts.onComplete?.();
      }
    };
    flightRaf = requestAnimationFrame(step);
  },

  cancelFlight: () => cancelActiveFlight(set),
}));

function cancelActiveFlight(set: (partial: Partial<CameraState>) => void) {
  if (flightRaf !== null) {
    cancelAnimationFrame(flightRaf);
    flightRaf = null;
    set({ isFlying: false });
  }
}
