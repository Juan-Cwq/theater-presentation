import { useEffect, useState, type ReactNode } from "react";
import {
  motion,
  useAnimationControls,
  type TargetAndTransition,
  type Transition,
} from "framer-motion";
import type { TransitionId } from "../content/types";
import { prefersReducedMotion } from "../canvas/cameraStore";

/**
 * Per-slide entrance transitions. Each frame declares a unique `transition`;
 * when the frame becomes the active (presented) frame, that animation plays
 * once. Non-active frames simply render in their resting state, so the map and
 * overview stay cheap — only the current frame ever animates.
 *
 * Two kinds of effect:
 *  • content — a transform/clip/opacity animation on the frame itself.
 *  • overlay — extra theatrical elements (curtains, blown leaves, a light
 *    sweep…) that mount only while the transition plays and remove themselves.
 */

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const EASE_INOUT = [0.65, 0, 0.35, 1] as const;

interface ContentSpec {
  from: TargetAndTransition;
  to: TargetAndTransition;
  transition: Transition;
  origin?: string;
}

const CONTENT: Record<TransitionId, ContentSpec> = {
  curtain: {
    from: { opacity: 0, scale: 0.985 },
    to: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, delay: 0.34, ease: EASE_OUT },
  },
  rise: {
    from: { opacity: 0, y: 80 },
    to: { opacity: 1, y: 0 },
    transition: { type: "spring", stiffness: 120, damping: 18 },
  },
  iris: {
    from: { clipPath: "circle(0% at 50% 50%)" },
    to: { clipPath: "circle(140% at 50% 50%)" },
    transition: { duration: 0.75, ease: EASE_OUT },
  },
  leaves: {
    from: { opacity: 0, x: -90, filter: "blur(8px)" },
    to: { opacity: 1, x: 0, filter: "blur(0px)" },
    transition: { duration: 0.7, ease: EASE_OUT },
  },
  shutter: {
    from: { opacity: 0 },
    to: { opacity: 1 },
    transition: { duration: 0.4, delay: 0.38 },
  },
  unfold: {
    from: { opacity: 0, scaleY: 0.02 },
    to: { opacity: 1, scaleY: 1 },
    transition: { duration: 0.6, ease: EASE_OUT },
    origin: "top center",
  },
  "zoom-focus": {
    from: { opacity: 0, scale: 1.14, filter: "blur(12px)" },
    to: { opacity: 1, scale: 1, filter: "blur(0px)" },
    transition: { duration: 0.6, ease: "easeOut" },
  },
  flip: {
    from: { opacity: 0, rotateX: 88 },
    to: { opacity: 1, rotateX: 0 },
    transition: { duration: 0.7, ease: EASE_OUT },
    origin: "center top",
  },
  "slide-left": {
    from: { opacity: 0, x: 120 },
    to: { opacity: 1, x: 0 },
    transition: { type: "spring", stiffness: 110, damping: 18 },
  },
  sweep: {
    from: { opacity: 0.15 },
    to: { opacity: 1 },
    transition: { duration: 0.5, delay: 0.12 },
  },
  split: {
    from: { clipPath: "inset(0 50% 0 50%)" },
    to: { clipPath: "inset(0% 0% 0% 0%)" },
    transition: { duration: 0.6, ease: EASE_OUT },
  },
  "blur-in": {
    from: { opacity: 0, filter: "blur(18px)", scale: 1.03 },
    to: { opacity: 1, filter: "blur(0px)", scale: 1 },
    transition: { duration: 0.7, ease: "easeOut" },
  },
  "finale-bow": {
    from: { opacity: 0, y: 90, scale: 0.96 },
    to: { opacity: 1, y: 0, scale: 1 },
    transition: { type: "spring", stiffness: 120, damping: 20 },
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
  const [overlayKey, setOverlayKey] = useState(0);
  const [playingOverlay, setPlayingOverlay] = useState<TransitionId | null>(null);

  const spec = effect ? CONTENT[effect] : undefined;

  useEffect(() => {
    if (!effect || !spec) return;

    // Non-active (and reduced-motion) frames simply rest fully visible so they
    // read correctly while scrolling past.
    if (!active || prefersReducedMotion()) {
      controls.set(REST);
      return;
    }

    // Play the unique entrance. We intentionally (re)run the full set→start on
    // every `active` activation — including StrictMode's double effect pass — so
    // the animation is never orphaned mid-flight and left stuck at `from`.
    let cancelled = false;
    controls.set(spec.from);
    if (OVERLAYS[effect]) {
      setPlayingOverlay(effect);
      setOverlayKey((k) => k + 1);
    }
    controls.start({ ...spec.to, transition: spec.transition }).then(() => {
      if (!cancelled) controls.set(REST);
    });
    return () => {
      cancelled = true;
    };
  }, [active, effect, spec, controls]);

  const Overlay = playingOverlay ? OVERLAYS[playingOverlay] : undefined;

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

      {Overlay && (
        <Overlay key={overlayKey} onDone={() => setPlayingOverlay(null)} />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Overlay effects                                                     */
/* ------------------------------------------------------------------ */

type OverlayProps = { onDone: () => void };

const velvet =
  "repeating-linear-gradient(90deg, #7d1a2b 0px, #a4263c 10px, #7d1a2b 22px), linear-gradient(#8f2033, #5c1322)";

function CurtainOverlay({ onDone }: OverlayProps) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[32px]">
      <motion.div
        className="absolute inset-y-0 left-0 w-1/2"
        style={{ background: velvet, boxShadow: "inset -24px 0 40px rgba(0,0,0,0.5)" }}
        initial={{ x: 0 }}
        animate={{ x: "-100%" }}
        transition={{ duration: 0.85, ease: EASE_INOUT }}
        onAnimationComplete={onDone}
      />
      <motion.div
        className="absolute inset-y-0 right-0 w-1/2"
        style={{ background: velvet, boxShadow: "inset 24px 0 40px rgba(0,0,0,0.5)" }}
        initial={{ x: 0 }}
        animate={{ x: "100%" }}
        transition={{ duration: 0.85, ease: EASE_INOUT }}
      />
    </div>
  );
}

function LeavesOverlay({ onDone }: OverlayProps) {
  const leaves = Array.from({ length: 11 });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[32px]">
      {leaves.map((_, i) => {
        const size = 26 + (i % 4) * 10;
        const hue = i % 2 ? "#C58A3A" : "#9C6B2E";
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              top: `${6 + ((i * 37) % 86)}%`,
              left: -60,
              width: size,
              height: size,
              background: `linear-gradient(135deg, ${hue}, #6f4a1f)`,
              borderRadius: "0 100% 0 100%",
            }}
            initial={{ x: -60, opacity: 0, rotate: -30 }}
            animate={{ x: 1760, opacity: [0, 1, 1, 0], rotate: 220 }}
            transition={{
              duration: 0.85 + (i % 3) * 0.14,
              delay: i * 0.045,
              ease: "easeOut",
              times: [0, 0.12, 0.75, 1],
            }}
            onAnimationComplete={i === leaves.length - 1 ? onDone : undefined}
          />
        );
      })}
    </div>
  );
}

function ShutterOverlay({ onDone }: OverlayProps) {
  const bars = 9;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[32px]">
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute left-0 w-full"
          style={{
            top: `${(i * 100) / bars}%`,
            height: `${100 / bars + 0.5}%`,
            background: "linear-gradient(180deg, #2a1f30, #171120)",
            transformOrigin: "top",
          }}
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          transition={{ duration: 0.5, delay: i * 0.055, ease: EASE_INOUT }}
          onAnimationComplete={i === bars - 1 ? onDone : undefined}
        />
      ))}
    </div>
  );
}

function SweepOverlay({ onDone }: OverlayProps) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[32px]">
      <motion.div
        className="absolute inset-y-[-20%]"
        style={{
          width: "45%",
          background:
            "linear-gradient(100deg, transparent, rgba(217,170,63,0.55), transparent)",
          filter: "blur(6px)",
          transform: "skewX(-12deg)",
        }}
        initial={{ x: "-80%", opacity: 0 }}
        animate={{ x: "200%", opacity: [0, 1, 1, 0] }}
        transition={{ duration: 0.8, ease: "easeInOut", times: [0, 0.2, 0.8, 1] }}
        onAnimationComplete={onDone}
      />
    </div>
  );
}

function FinaleOverlay({ onDone }: OverlayProps) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[32px]">
      <motion.div
        className="absolute inset-x-0 top-0 h-full"
        style={{ background: velvet, boxShadow: "inset 0 -30px 60px rgba(0,0,0,0.55)" }}
        initial={{ y: 0 }}
        animate={{ y: "-100%" }}
        transition={{ duration: 0.95, ease: EASE_INOUT }}
        onAnimationComplete={onDone}
      />
    </div>
  );
}

const OVERLAYS: Partial<Record<TransitionId, (p: OverlayProps) => ReactNode>> = {
  curtain: CurtainOverlay,
  leaves: LeavesOverlay,
  shutter: ShutterOverlay,
  sweep: SweepOverlay,
  "finale-bow": FinaleOverlay,
};
