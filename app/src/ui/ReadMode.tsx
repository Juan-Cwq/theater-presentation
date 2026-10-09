import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { FRAMES } from "../content/frames";
import { FRAME_H, FRAME_W, ACTS, actForFrame } from "../canvas/geometry";
import { FrameRenderer } from "../frames/FrameRenderer";

const MAX_W = 1000;

/**
 * Read mode: a linear, vertically scrolling article version of the deck for
 * accessibility and quick reading. Reuses the exact frame layouts (fully
 * revealed, non-animated) scaled down to the column width.
 */
export function ReadMode({ open, onClose }: { open: boolean; onClose: () => void }) {
  const colRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(MAX_W);

  useEffect(() => {
    if (!open) return;
    const el = colRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(Math.min(MAX_W, el.clientWidth)));
    ro.observe(el);
    setWidth(Math.min(MAX_W, el.clientWidth));
    return () => ro.disconnect();
  }, [open]);

  const scale = width / FRAME_W;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute inset-0 z-50 overflow-y-auto bg-bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-label="Read mode"
        >
          {/* Sticky header */}
          <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/5 bg-bg/85 px-6 py-4 backdrop-blur-md">
            <div>
              <span className="kicker text-gold">Read mode</span>
              <h2 className="font-serif text-xl text-off-white">
                The American Musical Theatre
              </h2>
            </div>
            <button
              onClick={onClose}
              className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-muted-text transition-colors hover:text-white"
              aria-label="Close read mode"
            >
              <X size={16} /> Close
            </button>
          </header>

          <div ref={colRef} className="mx-auto w-full max-w-[1000px] px-5 py-10">
            {FRAMES.map((frame) => {
              const act = ACTS.find((a) => a.id === actForFrame(frame.n))!;
              return (
                <section key={frame.id} className="mb-12">
                  <div className="mb-3 text-[12px] uppercase tracking-[0.18em] text-muted-text">
                    {act.shortLabel} · Frame {frame.n}
                  </div>
                  {/* Scaled, fully-revealed frame */}
                  <div
                    className="overflow-hidden rounded-[24px] border border-white/5 shadow-card"
                    style={{ width, height: FRAME_H * scale }}
                  >
                    <div
                      style={{
                        width: FRAME_W,
                        height: FRAME_H,
                        transform: `scale(${scale})`,
                        transformOrigin: "top left",
                      }}
                    >
                      <FrameRenderer frame={frame} instant />
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
