import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FRAME_H, FRAME_W } from "../canvas/geometry";
import { FRAMES, TOTAL_FRAMES } from "../content/frames";
import { FrameRenderer } from "../frames/FrameRenderer";
import { FrameTransition } from "../frames/FrameTransition";
import { registerDeckScroller, usePresentation } from "./presentationStore";

/**
 * The deck is a native vertical scroll-snap container: one full-viewport
 * section per frame. Scrolling (wheel, trackpad, touch, scrollbar, keys) moves
 * through the slides exactly like a normal website, while each frame keeps its
 * polished 1600×900 layout, big faded year watermark and unique entrance
 * animation (played when it snaps into view).
 *
 * Performance: the browser only paints the one or two sections in view, there
 * is no camera transform to re-rasterise, and only the active frame animates.
 */

/** Fit the 1600×900 card inside the viewport, leaving room for the watermark. */
function fitScale() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  return Math.max(0.1, Math.min((vw * 0.92) / FRAME_W, (vh * 0.8) / FRAME_H));
}

export function DeckView({ locked }: { locked: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(1);
  const [active, setActive] = useState(1);
  const [scale, setScale] = useState(() => fitScale());

  // Keep the card scaled to the viewport.
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
      {FRAMES.map((frame) => {
        const isActive = frame.n === active;
        return (
          <section
            key={frame.id}
            data-frame={frame.n}
            className="relative flex h-screen w-full snap-start items-center justify-center overflow-hidden"
          >
            {/* Big faded year watermark floating above the card */}
            {frame.year && (
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-[5%] z-0 -translate-x-1/2 select-none font-display font-bold leading-none text-pale-gold/[0.08]"
                style={{
                  fontSize:
                    frame.year.length > 6 ? "min(12vw, 150px)" : "min(16vw, 240px)",
                  letterSpacing: "-0.02em",
                  whiteSpace: "nowrap",
                }}
              >
                {frame.year}
              </div>
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
                  <FrameRenderer frame={frame} instant />
                </FrameTransition>
              </div>
            </div>

            {/* Scroll affordance on the first slide */}
            {frame.n === 1 && (
              <div
                aria-hidden
                className="pointer-events-none absolute bottom-16 left-1/2 z-10 -translate-x-1/2 text-center text-muted-text"
              >
                <div className="text-[12px] uppercase tracking-[0.22em]">Scroll</div>
                <div className="mt-1 animate-bounce text-xl text-gold">↓</div>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
