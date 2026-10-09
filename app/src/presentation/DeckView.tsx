import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ACTS, FRAME_H, FRAME_W } from "../canvas/geometry";
import { FRAMES, TOTAL_FRAMES } from "../content/frames";
import type { Frame } from "../content/types";
import { FrameRenderer } from "../frames/FrameRenderer";
import { FrameTransition } from "../frames/FrameTransition";
import { registerDeckScroller, usePresentation } from "./presentationStore";

/**
 * The deck is a native vertical scroll-snap container: one full-viewport
 * section per frame. The presenter drives the pacing with the **arrow keys /
 * space**:
 *   • each frame opens "in the dark" — lights dimmed, its big year glowing —
 *     and lingers there for as long as you like;
 *   • the next press raises the lights (a curtain parts at the start of a new
 *     act, otherwise the dim simply clears) and the panel rises in;
 *   • further presses introduce the columns one at a time.
 * Scrolling is a quick jump between frames (landing them already lit).
 *
 * Performance: only the one or two sections in view paint, the dim/curtain/year
 * use opacity+transform only (composited), and only the active frame animates.
 */

/** Fit the 1600×900 card into the viewport, leaving room for the year + dock. */
function fitScale() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  return Math.max(0.1, Math.min((vw * 0.9) / FRAME_W, (vh * 0.62) / FRAME_H));
}

/** Frames that open a new act get a curtain-parting reveal. */
const ACT_STARTS = new Set(ACTS.map((a) => a.from));

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

const EASE = [0.22, 1, 0.36, 1] as const;
const CURTAIN_EASE = [0.65, 0, 0.35, 1] as const;

/** Resting state of the year: faded, pinned up top. Dark state: bright, centred. */
const YEAR_REST = { opacity: 0.17, scale: 1, y: 0 } as const;
const YEAR_DARK = { opacity: 0.95, scale: 1.18, y: 150 } as const;

const velvet =
  "repeating-linear-gradient(90deg, #6f1626 0px, #93223a 11px, #6f1626 23px)," +
  "linear-gradient(#8a1f32, #531120)";

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
  const dark = isActive && step < 0; // in the dark, year glowing, waiting
  const lit = isActive && step >= 0; // lights up, panel + columns
  const isActStart = ACT_STARTS.has(frame.n);
  const showHint = isActive && step < frame.reveals;

  return (
    <section
      data-frame={frame.n}
      className="relative flex h-screen w-full snap-start flex-col items-center justify-center gap-1 overflow-hidden px-4"
    >
      {/* Big year — glows bright in the dark, then settles faded above the card */}
      {frame.year && (
        <motion.div
          aria-hidden
          className="pointer-events-none z-30 select-none text-center font-display font-bold leading-none text-pale-gold"
          initial={false}
          animate={dark ? YEAR_DARK : YEAR_REST}
          transition={{ duration: 0.8, ease: EASE }}
          style={{
            fontSize: yearFontSize(frame.year),
            letterSpacing: "-0.02em",
            whiteSpace: "nowrap",
            textShadow: "0 0 44px rgba(217,170,63,0.3)",
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
          <FrameTransition effect={frame.transition} active={lit}>
            <FrameRenderer
              frame={frame}
              activeCount={isActive ? Math.max(0, step) : Number.POSITIVE_INFINITY}
              instant={!isActive}
            />
          </FrameTransition>
        </div>
      </div>

      {/* The "lights" — a curtain at the start of a new act, else a dim veil */}
      {isActStart ? (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-20 w-1/2"
            style={{ background: velvet, boxShadow: "inset -30px 0 60px rgba(0,0,0,0.55)" }}
            initial={false}
            animate={{ x: lit ? "-100%" : "0%" }}
            transition={{ duration: 0.9, ease: CURTAIN_EASE }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-20 w-1/2"
            style={{ background: velvet, boxShadow: "inset 30px 0 60px rgba(0,0,0,0.55)" }}
            initial={false}
            animate={{ x: lit ? "100%" : "0%" }}
            transition={{ duration: 0.9, ease: CURTAIN_EASE }}
          />
        </>
      ) : (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20"
          initial={false}
          animate={{ opacity: dark ? 1 : 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{
            background:
              "radial-gradient(130% 90% at 50% 46%, rgba(6,4,9,0.74), rgba(6,4,9,0.97) 75%)",
          }}
        />
      )}

      {/* Hint */}
      {showHint && (
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-16 left-1/2 z-30 -translate-x-1/2 text-[12px] uppercase tracking-[0.22em] text-muted-text/70"
        >
          {dark ? (
            <>
              Press <span className="text-gold">→</span>{" "}
              {isActStart ? "to raise the curtain" : "to begin"}
            </>
          ) : (
            <>
              Press <span className="text-gold">→</span> to reveal
            </>
          )}
        </div>
      )}
    </section>
  );
}
