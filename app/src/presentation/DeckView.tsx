import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { FRAME_H, FRAME_W } from "../canvas/geometry";
import { prefersReducedMotion } from "../canvas/cameraStore";
import { FRAMES, TOTAL_FRAMES } from "../content/frames";
import type { Frame } from "../content/types";
import { FrameRenderer } from "../frames/FrameRenderer";
import { FrameTransition } from "../frames/FrameTransition";
import { registerDeckScroller, usePresentation } from "./presentationStore";

/**
 * The deck is a native vertical scroll-snap container: one full-viewport
 * section per frame. Scrolling moves between frames; the **arrow keys / space**
 * introduce each frame's columns one at a time so the presenter controls the
 * pacing. Every frame shows a big visible year above its card, and when it
 * becomes active the "lights dim", the year glows out of the dark, and the
 * panel brightens into place — like the stage waking up.
 *
 * Performance: the browser only paints the one or two sections in view, the
 * wake uses opacity/transform only (composited), and only the active frame
 * animates.
 */

/** Fit the 1600×900 card into the viewport, leaving room for the year + dock. */
function fitScale() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  return Math.max(0.1, Math.min((vw * 0.9) / FRAME_W, (vh * 0.62) / FRAME_H));
}

export function DeckView({ locked }: { locked: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(1);
  const [active, setActive] = useState(1);
  const [scale, setScale] = useState(() => fitScale());
  const step = usePresentation((s) => s.step);

  useLayoutEffect(() => {
    const onResize = () => setScale(fitScale());
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Let the store (keyboard / dock / deep links / auto-play) drive scrolling.
  useEffect(() => {
    registerDeckScroller((n, smooth = true) => {
      const el = scrollRef.current;
      if (!el) return;
      el.scrollTo({
        top: (n - 1) * el.clientHeight,
        behavior: smooth ? "smooth" : "auto",
      });
    });
    return () => registerDeckScroller(null);
  }, []);

  // Sync the active frame from the scroll position (throttled to one rAF).
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const h = el.clientHeight || 1;
        const n = Math.min(TOTAL_FRAMES, Math.max(1, Math.round(el.scrollTop / h) + 1));
        if (n !== activeRef.current) {
          activeRef.current = n;
          setActive(n);
          usePresentation.getState().setIndex(n);
        }
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={scrollRef}
      className={
        "h-full w-full " +
        (locked
          ? "overflow-hidden"
          : "snap-y snap-mandatory overflow-y-auto overflow-x-hidden")
      }
      style={{ scrollBehavior: "smooth" }}
    >
      {FRAMES.map((frame) => (
        <SlideSection
          key={frame.id}
          frame={frame}
          scale={scale}
          isActive={frame.n === active}
          step={step}
        />
      ))}
    </div>
  );
}

const yearFontSize = (year: string) =>
  year.length > 6 ? "min(9vw, 128px)" : "min(13vw, 196px)";

/** Resting state of the big background year: visible but faded, pinned up top. */
const YEAR_REST = { opacity: 0.17, scale: 1, y: 0, filter: "blur(0px)" } as const;

function SlideSection({
  frame,
  scale,
  isActive,
  step,
}: {
  frame: Frame;
  scale: number;
  isActive: boolean;
  step: number;
}) {
  const yearC = useAnimationControls();
  const veilC = useAnimationControls();
  const hasMore = isActive && step < frame.reveals;

  // The "wake": dim veil clears while the year glows bright out of the dark and
  // settles up into its faded resting spot. Runs whenever the frame activates.
  useEffect(() => {
    if (!isActive || prefersReducedMotion()) {
      yearC.set(YEAR_REST);
      veilC.set({ opacity: 0 });
      return;
    }
    let cancelled = false;
    veilC.set({ opacity: 0.8 });
    yearC.set({ opacity: 0.92, scale: 1.14, y: 150, filter: "blur(0px)" });
    veilC.start({
      opacity: 0,
      transition: { duration: 0.6, ease: "easeOut", delay: 0.12 },
    });
    yearC
      .start({
        ...YEAR_REST,
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
      })
      .then(() => {
        if (!cancelled) yearC.set(YEAR_REST);
      });
    return () => {
      cancelled = true;
    };
  }, [isActive, yearC, veilC]);

  return (
    <section
      data-frame={frame.n}
      className="relative flex h-screen w-full snap-start flex-col items-center justify-center gap-1 overflow-hidden px-4"
    >
      {/* Big visible year, floating above the card */}
      {frame.year && (
        <motion.div
          aria-hidden
          className="pointer-events-none z-30 select-none text-center font-display font-bold leading-none text-pale-gold"
          initial={false}
          animate={yearC}
          style={{
            fontSize: yearFontSize(frame.year),
            letterSpacing: "-0.02em",
            whiteSpace: "nowrap",
            textShadow: "0 0 40px rgba(217,170,63,0.25)",
          }}
        >
          {frame.year}
        </motion.div>
      )}

      {/* Scaled, full-fidelity frame card */}
      <div
        className="relative z-10"
        style={{ width: FRAME_W * scale, height: FRAME_H * scale }}
      >
        <div
          style={{
            width: FRAME_W,
            height: FRAME_H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <FrameTransition effect={frame.transition} active={isActive}>
            <FrameRenderer
              frame={frame}
              activeCount={isActive ? step : Number.POSITIVE_INFINITY}
              instant={!isActive}
            />
          </FrameTransition>
        </div>
      </div>

      {/* The "lights dim" veil — darkens, then clears as the frame wakes */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20"
        initial={false}
        animate={veilC}
        style={{
          background:
            "radial-gradient(130% 90% at 50% 46%, rgba(6,4,9,0.72), rgba(6,4,9,0.96) 75%)",
        }}
      />

      {/* Hints */}
      {frame.n === 1 && !hasMore && (
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-16 left-1/2 z-30 -translate-x-1/2 text-center text-muted-text"
        >
          <div className="text-[12px] uppercase tracking-[0.22em]">Scroll</div>
          <div className="mt-1 animate-bounce text-xl text-gold">↓</div>
        </div>
      )}
      {hasMore && (
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-16 left-1/2 z-30 -translate-x-1/2 text-[12px] uppercase tracking-[0.22em] text-muted-text/70"
        >
          Press <span className="text-gold">→</span> to reveal
        </div>
      )}
    </section>
  );
}
