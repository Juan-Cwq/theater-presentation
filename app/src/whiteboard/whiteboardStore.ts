import { create } from "zustand";
import {
  PEN_COLORS,
  PEN_SIZES,
  type PenSize,
  type Tool,
  type WbElement,
  type StrokeElement,
} from "./types";

const STORAGE_KEY = "amt-whiteboard-v2";

let uid = 0;
const newId = () => `wb-${Date.now().toString(36)}-${(uid++).toString(36)}`;

function load(): WbElement[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as WbElement[]) : [];
  } catch {
    return [];
  }
}

function persist(elements: WbElement[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(elements));
  } catch {
    /* ignore quota / private-mode errors */
  }
}

interface WhiteboardState {
  elements: WbElement[];
  tool: Tool;
  color: string;
  size: PenSize;
  /** Snapshots for undo/redo. */
  undoStack: WbElement[][];
  redoStack: WbElement[][];

  setTool: (t: Tool) => void;
  setColor: (c: string) => void;
  setSize: (s: PenSize) => void;

  /** Commit a finished freehand stroke. */
  addStroke: (stroke: Omit<StrokeElement, "id" | "type">) => void;
  addSticky: (x: number, y: number, frame: number, text?: string) => string;
  addText: (x: number, y: number, frame: number, text?: string) => string;
  updateElementText: (id: string, text: string) => void;
  moveElement: (id: string, x: number, y: number) => void;
  eraseElement: (id: string) => void;

  undo: () => void;
  redo: () => void;
  clearAll: () => void;

  exportJSON: () => string;
  importJSON: (json: string) => boolean;
}

export const useWhiteboard = create<WhiteboardState>((set, get) => {
  /** Push the current elements onto the undo stack before a mutation. */
  const commit = (next: WbElement[]) => {
    const prev = get().elements;
    set({
      elements: next,
      undoStack: [...get().undoStack, prev].slice(-100),
      redoStack: [],
    });
    persist(next);
  };

  return {
    elements: load(),
    tool: "pen",
    color: PEN_COLORS[0],
    size: "thin",
    undoStack: [],
    redoStack: [],

    setTool: (tool) => set({ tool }),
    setColor: (color) => set({ color }),
    setSize: (size) => set({ size }),

    addStroke: (stroke) =>
      commit([...get().elements, { ...stroke, id: newId(), type: "stroke" }]),

    addSticky: (x, y, frame, text = "") => {
      const id = newId();
      commit([
        ...get().elements,
        { id, type: "sticky", frame, x, y, text, color: "#EBD9A8" },
      ]);
      return id;
    },

    addText: (x, y, frame, text = "") => {
      const id = newId();
      commit([
        ...get().elements,
        { id, type: "text", frame, x, y, text, color: "#F4EEE6" },
      ]);
      return id;
    },

    updateElementText: (id, text) => {
      // Text edits mutate in place without flooding the undo stack.
      const next = get().elements.map((el) =>
        el.id === id && (el.type === "sticky" || el.type === "text")
          ? { ...el, text }
          : el,
      );
      set({ elements: next });
      persist(next);
    },

    moveElement: (id, x, y) => {
      const next = get().elements.map((el) =>
        el.id === id && el.type !== "stroke" ? { ...el, x, y } : el,
      );
      set({ elements: next });
      persist(next);
    },

    eraseElement: (id) =>
      commit(get().elements.filter((el) => el.id !== id)),

    undo: () => {
      const { undoStack, elements, redoStack } = get();
      if (undoStack.length === 0) return;
      const prev = undoStack[undoStack.length - 1];
      set({
        elements: prev,
        undoStack: undoStack.slice(0, -1),
        redoStack: [...redoStack, elements],
      });
      persist(prev);
    },

    redo: () => {
      const { undoStack, elements, redoStack } = get();
      if (redoStack.length === 0) return;
      const next = redoStack[redoStack.length - 1];
      set({
        elements: next,
        redoStack: redoStack.slice(0, -1),
        undoStack: [...undoStack, elements],
      });
      persist(next);
    },

    clearAll: () => commit([]),

    exportJSON: () => JSON.stringify(get().elements, null, 2),

    importJSON: (json) => {
      try {
        const parsed = JSON.parse(json);
        if (!Array.isArray(parsed)) return false;
        commit(parsed as WbElement[]);
        return true;
      } catch {
        return false;
      }
    },
  };
});

export { PEN_COLORS, PEN_SIZES };
