import { motion } from "framer-motion";
import { usePresentation } from "./presentationStore";
import { TOTAL_FRAMES } from "../content/frames";

/** A hairline progress bar across the very top of the stage. */
export function ProgressBar() {
  const index = usePresentation((s) => s.index);
  const pct = (index / TOTAL_FRAMES) * 100;
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-30 h-[3px] bg-white/5"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={TOTAL_FRAMES}
      aria-valuenow={index}
      aria-label="Presentation progress"
    >
      <motion.div
        className="h-full bg-gradient-to-r from-gold/60 via-gold to-pale-gold"
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ type: "spring", stiffness: 180, damping: 28 }}
        style={{ boxShadow: "0 0 12px rgba(217,170,63,0.6)" }}
      />
    </div>
  );
}
