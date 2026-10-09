import { useEffect, type ReactNode } from "react";
import {
  motion,
  useAnimationControls,
  type TargetAndTransition,
  type Transition,
} from "framer-motion";
import type { TransitionId } from "../content/types";
import { prefersReducedMotion } from "../canvas/cameraStore";

/**
 * Per-slide entrance for the frame *panel*. When a frame becomes active it
 * settles in with a gentle, unique motion (rise, slide, iris, flip…). The
 * theatrical "lights dim → year glows → brighten" wake is handled one level up
 * in the deck, and the staggered content is driven by the reveal step, so this
 * stays deliberately small: just the panel's own entrance.
 */

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

interface ContentSpec {
  from: TargetAndTransition;
  to: TargetAndTransition;
  transition: Transition;
  origin?: string;
}

const CONTENT: Record<TransitionId, ContentSpec> = {
  curtain: {
    from: { opacity: 0, y: 26, scale: 0.985 },
    to: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.7, ease: EASE_OUT },
  },
  rise: {
    from: { opacity: 0, y: 48 },
    to: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: EASE_OUT },
  },
  iris: {
    from: { clipPath: "circle(0% at 50% 50%)" },
    to: { clipPath: "circle(140% at 50% 50%)" },
    transition: { duration: 0.8, ease: EASE_OUT },
  },
  leaves: {
    from: { opacity: 0, x: -60, filter: "blur(6px)" },
    to: { opacity: 1, x: 0, filter: "blur(0px)" },
    transition: { duration: 0.7, ease: EASE_OUT },
  },
  shutter: {
    from: { opacity: 0, scaleY: 0.8 },
    to: { opacity: 1, scaleY: 1 },
    transition: { duration: 0.65, ease: EASE_OUT },
    origin: "center top",
  },
  unfold: {
    from: { opacity: 0, scaleY: 0.06 },
    to: { opacity: 1, scaleY: 1 },
    transition: { duration: 0.7, ease: EASE_OUT },
    origin: "top center",
  },
  "zoom-focus": {
    from: { opacity: 0, scale: 1.08, filter: "blur(10px)" },
    to: { opacity: 1, scale: 1, filter: "blur(0px)" },
    transition: { duration: 0.7, ease: "easeOut" },
  },
  flip: {
    from: { opacity: 0, rotateX: 42 },
    to: { opacity: 1, rotateX: 0 },
    transition: { duration: 0.75, ease: EASE_OUT },
    origin: "center top",
  },
  "slide-left": {
    from: { opacity: 0, x: 70 },
    to: { opacity: 1, x: 0 },
    transition: { duration: 0.7, ease: EASE_OUT },
  },
  sweep: {
    from: { opacity: 0, x: -40 },
    to: { opacity: 1, x: 0 },
    transition: { duration: 0.7, ease: EASE_OUT },
  },
  split: {
    from: { clipPath: "inset(0 50% 0 50%)" },
    to: { clipPath: "inset(0% 0% 0% 0%)" },
    transition: { duration: 0.7, ease: EASE_OUT },
  },
  "blur-in": {
    from: { opacity: 0, filter: "blur(14px)", scale: 1.03 },
    to: { opacity: 1, filter: "blur(0px)", scale: 1 },
    transition: { duration: 0.75, ease: "easeOut" },
  },
  "finale-bow": {
    from: { opacity: 0, y: 60, scale: 0.97 },
    to: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.8, ease: EASE_OUT },
  },
};

/** Neutral resting state applied after a transition so nothing lingers clipped. */
const REST: TargetAndTransition = {
  opacity: 1,
  x: 0,
  y: 0,
  scale: 1,
  scaleY: 1,
  rotateX: 0,
  clipPath: "none",
  filter: "none",
};

export function FrameTransition({
  effect,
  active,
  children,
}: {
  effect?: TransitionId;
  active: boolean;
  children: ReactNode;
}) {
  const controls = useAnimationControls();
  const spec = effect ? CONTENT[effect] : undefined;

  useEffect(() => {
    if (!effect || !spec) return;

    // Non-active (and reduced-motion) frames simply rest fully visible.
    if (!active || prefersReducedMotion()) {
      controls.set(REST);
      return;
    }

    // Re-run the full set→start on every activation (incl. StrictMode's double
    // pass) so the animation is never orphaned mid-flight and left at `from`.
    let cancelled = false;
    controls.set(spec.from);
    controls.start({ ...spec.to, transition: spec.transition }).then(() => {
      if (!cancelled) controls.set(REST);
    });
    return () => {
      cancelled = true;
    };
  }, [active, effect, spec, controls]);

  return (
    <div
      className="relative h-full w-full"
      style={effect === "flip" ? { perspective: 2000 } : undefined}
    >
      <motion.div
        className="h-full w-full"
        initial={false}
        animate={controls}
        style={{ transformOrigin: spec?.origin ?? "center center" }}
      >
        {children}
      </motion.div>
    </div>
  );
}
