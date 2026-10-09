import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../canvas/cameraStore";

const RADIUS = 340;

/**
 * A dim golden spotlight that follows the cursor across the stage, lighting up
 * whatever it's over (it sits above the cards and lightens via a `screen`
 * blend). Optimised: a single fixed, pre-painted radial-gradient disc moved only
 * via `transform` (GPU-composited, no repaints), eased toward the pointer with a
 * short rAF loop that idles when the cursor stops. Off under reduced-motion.
 */
export function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight * 0.4;
    let x = tx;
    let y = ty;

    const tick = () => {
      x += (tx - x) * 0.16;
      y += (ty - y) * 0.16;
      el.style.transform = `translate3d(${x - RADIUS}px, ${y - RADIUS}px, 0)`;
      if (Math.abs(tx - x) > 0.4 || Math.abs(ty - y) > 0.4) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    tick();
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: RADIUS * 2,
        height: RADIUS * 2,
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: 15,
        mixBlendMode: "screen",
        willChange: "transform",
        background:
          "radial-gradient(circle, rgba(255,214,130,0.22), rgba(217,170,63,0.08) 45%, transparent 70%)",
      }}
    />
  );
}
