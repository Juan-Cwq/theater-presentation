/** Whiteboard tools. Laser is ephemeral (never persisted). */
export type Tool = "pen" | "highlighter" | "sticky" | "text" | "laser" | "eraser";

/** The three pen colours and two sizes from the design system. */
export const PEN_COLORS = ["#EBD9A8", "#B3283F", "#8FD3C7"] as const;
export const PEN_SIZES = { thin: 4, thick: 10 } as const;
export type PenSize = keyof typeof PEN_SIZES;

export interface StrokeElement {
  id: string;
  type: "stroke";
  /** 1-based frame this annotation belongs to (deck is per-slide). */
  frame: number;
  kind: "pen" | "highlighter";
  color: string;
  size: number;
  /** Screen-space points relative to the viewport: [x, y, pressure?]. */
  points: number[][];
}

export interface StickyElement {
  id: string;
  type: "sticky";
  frame: number;
  x: number;
  y: number;
  text: string;
  color: string;
}

export interface TextElement {
  id: string;
  type: "text";
  frame: number;
  x: number;
  y: number;
  text: string;
  color: string;
}

export type WbElement = StrokeElement | StickyElement | TextElement;
