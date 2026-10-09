import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, X } from "lucide-react";
import { usePresentation } from "./presentationStore";
import { frameByNumber, TOTAL_FRAMES } from "../content/frames";
import { ACTS, actForFrame } from "../canvas/geometry";

/** Target talk-time window, in seconds (the brief asks for a 3–5 min talk). */
const TARGET_MIN = 180;
const TARGET_MAX = 300;

function fmt(total: number): string {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Presenter speaker-notes drawer with an elapsed timer + 3–5 min target band. */
export function NotesDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const index = usePresentation((s) => s.index);
  const frame = frameByNumber(index);
  const act = ACTS.find((a) => a.id === actForFrame(index))!;
  const nextFrame = index < TOTAL_FRAMES ? frameByNumber(index + 1) : null;

  // Presenter timer. Starts when the drawer first opens; survives frame changes.
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const startedOnce = useRef(false);

  useEffect(() => {
    if (open && !startedOnce.current) {
      startedOnce.current = true;
      setRunning(true);
    }
  }, [open]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const band =
    elapsed < TARGET_MIN ? "under" : elapsed <= TARGET_MAX ? "on" : "over";
  const bandColor =
    band === "on" ? "#6FCF97" : band === "over" ? "#B3283F" : "#BDB3C4";
  const bandLabel =
    band === "on" ? "On pace" : band === "over" ? "Over time" : "Warming up";

  const paragraphs = frame.notes.split("\n").filter(Boolean);

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          key="notes"
          initial={{ x: -440, opacity: 0.4 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -440, opacity: 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 40 }}
          className="absolute left-4 top-4 bottom-28 z-30 flex w-[390px] max-w-[88vw] flex-col rounded-2xl border border-gold/20 bg-panel/95 shadow-card backdrop-blur-xl sm:bottom-24"
          role="complementary"
          aria-label="Speaker notes"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-5">
            <span className="kicker text-gold">Speaker Notes</span>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-muted-text transition-colors hover:text-white"
              aria-label="Close speaker notes (N)"
            >
              <X size={18} />
            </button>
          </div>

          {/* Timer */}
          <div className="mx-6 mt-4 rounded-xl border border-white/5 bg-elevated/60 px-5 py-4">
            <div className="flex items-end justify-between">
              <div
                className="font-display text-5xl tabular-nums leading-none"
                aria-live="off"
              >
                {fmt(elapsed)}
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setRunning((r) => !r)}
                  className="rounded-full bg-white/5 p-2 text-pale-gold transition-colors hover:bg-white/10"
                  aria-label={running ? "Pause timer" : "Start timer"}
                >
                  {running ? <Pause size={16} /> : <Play size={16} />}
                </button>
                <button
                  onClick={() => {
                    setElapsed(0);
                    setRunning(true);
                  }}
                  className="rounded-full bg-white/5 p-2 text-muted-text transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Reset timer"
                >
                  <RotateCcw size={16} />
                </button>
              </div>
            </div>
            {/* Target band progress */}
            <div className="mt-3">
              <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                {/* 3–5 min "sweet spot" marker */}
                <div
                  className="absolute inset-y-0 rounded-full bg-white/10"
                  style={{
                    left: `${(TARGET_MIN / TARGET_MAX) * 100}%`,
                    right: 0,
                  }}
                />
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, (elapsed / TARGET_MAX) * 100)}%`,
                    background: bandColor,
                  }}
                />
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted-text">
                <span style={{ color: bandColor }}>{bandLabel}</span>
                <span>Target 3–5 min</span>
              </div>
            </div>
          </div>

          {/* Current frame notes */}
          <div className="mt-5 min-h-0 flex-1 overflow-y-auto px-6 pb-5">
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-text">
              Frame {index} / {TOTAL_FRAMES} · {act.shortLabel}
            </div>
            <h3 className="mt-1 font-serif text-2xl leading-tight text-off-white">
              {frame.title}
            </h3>
            <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-muted-text">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {nextFrame && (
              <div className="mt-6 border-t border-white/5 pt-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-gold/70">
                  Next up
                </div>
                <div className="mt-1 font-serif text-base text-off-white/80">
                  {nextFrame.title}
                </div>
              </div>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
