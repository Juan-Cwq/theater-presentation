import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Shortcut {
  keys: string[];
  label: string;
}

const GROUPS: { title: string; items: Shortcut[] }[] = [
  {
    title: "Navigate",
    items: [
      { keys: ["Scroll"], label: "Move through the slides" },
      { keys: ["→", "Space"], label: "Next frame" },
      { keys: ["←"], label: "Previous frame" },
      { keys: ["PgUp", "PgDn"], label: "Clicker back / forward" },
      { keys: ["Esc"], label: "Close an open panel" },
    ],
  },
  {
    title: "Present",
    items: [
      { keys: ["N"], label: "Speaker notes + timer" },
      { keys: ["P"], label: "Auto-play (recording mode)" },
      { keys: ["R"], label: "Read mode (article)" },
      { keys: ["?"], label: "This help" },
    ],
  },
  {
    title: "Whiteboard",
    items: [
      { keys: ["W"], label: "Toggle whiteboard" },
      { keys: ["⌘Z", "Ctrl Z"], label: "Undo" },
      { keys: ["⇧⌘Z"], label: "Redo" },
    ],
  },
];

function Keycap({ children }: { children: string }) {
  return (
    <kbd className="rounded-md border border-white/15 bg-elevated px-2 py-1 font-sans text-[12px] text-off-white shadow-sm">
      {children}
    </kbd>
  );
}

export function HelpOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute inset-0 z-50 flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-bg/70 backdrop-blur-sm" />
          <motion.div
            className="relative max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-gold/20 bg-panel/95 p-8 shadow-card"
            initial={{ scale: 0.95, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            role="dialog"
            aria-modal="true"
            aria-label="Keyboard shortcuts"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="kicker text-gold">Keyboard &amp; gestures</span>
                <h2 className="mt-1 font-serif text-3xl text-off-white">
                  How to drive the show
                </h2>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-muted-text transition-colors hover:text-white"
                aria-label="Close help"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2">
              {GROUPS.map((g) => (
                <div key={g.title}>
                  <h3 className="mb-3 text-[12px] uppercase tracking-[0.18em] text-gold/80">
                    {g.title}
                  </h3>
                  <ul className="space-y-2.5">
                    {g.items.map((it) => (
                      <li
                        key={it.label}
                        className="flex items-center justify-between gap-4"
                      >
                        <span className="text-[15px] text-muted-text">{it.label}</span>
                        <span className="flex shrink-0 items-center gap-1">
                          {it.keys.map((k) => (
                            <Keycap key={k}>{k}</Keycap>
                          ))}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
