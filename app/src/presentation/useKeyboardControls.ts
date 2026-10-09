import { useEffect, useRef } from "react";
import { usePresentation } from "./presentationStore";

export interface KeyHandlers {
  onToggleNotes?: () => void;
  onToggleAutoplay?: () => void;
  onToggleWhiteboard?: () => void;
  onToggleHelp?: () => void;
  onToggleRead?: () => void;
  /** Return true to swallow Escape (e.g. to close an overlay first). */
  onEscape?: () => boolean;
}

/**
 * Global keyboard controls for presenting.
 *
 *   → ↓ Space PageDown / clicker-next  → scroll to next frame
 *   ← ↑ PageUp / clicker-prev          → scroll to previous frame
 *   Escape                             → close an open overlay
 *   N / P / W / R / ?                  → delegated to handlers
 *
 * Typing into inputs/textareas is never intercepted.
 */
export function useKeyboardControls(handlers: KeyHandlers = {}) {
  // Keep handlers in a ref so the key listener is attached exactly once for the
  // component's lifetime. Re-binding on every render (handlers is a fresh object
  // literal) previously caused transient double-listeners at mount.
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    const { next, prev } = usePresentation.getState();
    const onKey = (e: KeyboardEvent) => {
      const h = handlersRef.current;
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.isContentEditable ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA");
      if (typing) return;

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case "PageDown":
        case " ":
        case "Spacebar":
          e.preventDefault();
          next();
          break;
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
          e.preventDefault();
          prev();
          break;
        case "Escape":
          if (h.onEscape?.()) {
            e.preventDefault();
          }
          break;
        case "n":
        case "N":
          h.onToggleNotes?.();
          break;
        case "p":
        case "P":
          h.onToggleAutoplay?.();
          break;
        case "w":
        case "W":
          h.onToggleWhiteboard?.();
          break;
        case "r":
        case "R":
          h.onToggleRead?.();
          break;
        case "?":
          h.onToggleHelp?.();
          break;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // Attach once; actions are read from the store, handlers from a ref.
  }, []);
}
