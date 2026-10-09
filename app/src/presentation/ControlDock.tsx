import {
  ChevronLeft,
  ChevronRight,
  StickyNote,
  Play,
  Pause,
  Pencil,
  Keyboard,
  BookOpenText,
} from "lucide-react";
import { usePresentation } from "./presentationStore";
import { ACTS, FRAME_COUNT } from "../canvas/geometry";
import { TOTAL_FRAMES, frameByNumber } from "../content/frames";
import { IconButton } from "../ui/IconButton";

interface DockProps {
  onToggleNotes: () => void;
  notesOpen: boolean;
  onToggleAutoplay: () => void;
  autoplayOn: boolean;
  onToggleWhiteboard: () => void;
  whiteboardOn: boolean;
  onToggleHelp: () => void;
  onToggleRead: () => void;
}

/**
 * The floating bottom control dock: frame counter + act label, a clickable
 * segmented progress bar, prev/next, and the presenter tool toggles.
 */
export function ControlDock(props: DockProps) {
  const index = usePresentation((s) => s.index);
  const next = usePresentation((s) => s.next);
  const prev = usePresentation((s) => s.prev);
  const goTo = usePresentation((s) => s.goTo);

  const act = ACTS.find((a) => a.id === frameByNumber(index).act);

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-5 z-30 flex justify-center px-4">
      <div className="pointer-events-auto flex max-w-full items-center gap-4 rounded-full border border-gold/20 bg-panel/85 px-4 py-2.5 shadow-card backdrop-blur-md">
        {/* Counter */}
        <div className="hidden min-w-[104px] shrink-0 flex-col leading-tight sm:flex">
          <span className="font-display text-pale-gold" style={{ fontSize: 18 }}>
            {index} <span className="text-muted-text">/ {TOTAL_FRAMES}</span>
          </span>
          <span className="kicker" style={{ fontSize: 10 }}>
            {act?.shortLabel}
          </span>
        </div>

        {/* Prev */}
        <IconButton label="Previous (←)" onClick={prev}>
          <ChevronLeft size={20} />
        </IconButton>

        {/* Segmented progress */}
        <div
          className="flex items-center gap-1"
          role="group"
          aria-label="Frame progress"
        >
          {Array.from({ length: FRAME_COUNT }).map((_, i) => {
            const n = i + 1;
            const done = n <= index;
            const isCurrent = n === index;
            return (
              <button
                key={n}
                type="button"
                aria-label={`Go to frame ${n}`}
                aria-current={isCurrent ? "step" : undefined}
                onClick={() => goTo(n)}
                className="group relative h-6 py-2"
              >
                <span
                  className={`block rounded-full transition-all ${
                    isCurrent
                      ? "w-7 bg-gold"
                      : done
                        ? "w-2.5 bg-gold/70"
                        : "w-2.5 bg-white/15 group-hover:bg-white/30"
                  }`}
                  style={{ height: 6 }}
                />
              </button>
            );
          })}
        </div>

        {/* Next */}
        <IconButton label="Next (→)" onClick={next}>
          <ChevronRight size={20} />
        </IconButton>

        <span className="mx-1 h-6 w-px bg-white/10" aria-hidden />

        {/* Presenter tools */}
        <div className="flex items-center gap-1.5">
          <IconButton
            label="Speaker notes (N)"
            active={props.notesOpen}
            onClick={props.onToggleNotes}
          >
            <StickyNote size={18} />
          </IconButton>
          <IconButton
            label={props.autoplayOn ? "Pause auto-play (P)" : "Auto-play (P)"}
            active={props.autoplayOn}
            onClick={props.onToggleAutoplay}
          >
            {props.autoplayOn ? <Pause size={18} /> : <Play size={18} />}
          </IconButton>
          <IconButton
            label="Whiteboard (W)"
            active={props.whiteboardOn}
            onClick={props.onToggleWhiteboard}
          >
            <Pencil size={18} />
          </IconButton>
          <IconButton label="Read mode (R)" onClick={props.onToggleRead}>
            <BookOpenText size={18} />
          </IconButton>
          <IconButton label="Keyboard shortcuts (?)" onClick={props.onToggleHelp}>
            <Keyboard size={18} />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
