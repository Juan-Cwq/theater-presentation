/**
 * World-space geometry: where each frame sits, and how the Acts carve the
 * canvas into zones. Centralised so the minimap, overview, act backdrops and
 * spotlight path all agree on one source of truth.
 */
import type { CameraGoal } from "./math";

export const FRAME_W = 1600;
export const FRAME_H = 900;

/** Horizontal distance between successive frame centres. */
const STEP_X = FRAME_W + 620;
/** Vertical sway of the winding timeline path. */
const SWAY = 560;

export type ActId = "overture" | "act1" | "act2" | "act3" | "finale";

export interface ActDef {
  id: ActId;
  label: string;
  /** Short label used in the progress bar ("Overture", "Act II", …). */
  shortLabel: string;
  /** 1-based inclusive frame range. */
  from: number;
  to: number;
}

export const ACTS: ActDef[] = [
  { id: "overture", label: "Overture", shortLabel: "Overture", from: 1, to: 2 },
  { id: "act1", label: "Act I · Origins", shortLabel: "Act I", from: 3, to: 4 },
  {
    id: "act2",
    label: "Act II · The Golden Age",
    shortLabel: "Act II",
    from: 5,
    to: 7,
  },
  {
    id: "act3",
    label: "Act III · The Contemporary Musical",
    shortLabel: "Act III",
    from: 8,
    to: 11,
  },
  { id: "finale", label: "Finale · Today", shortLabel: "Finale", from: 12, to: 13 },
];

export const FRAME_COUNT = 13;

export interface FramePlacement {
  /** 1-based frame number. */
  n: number;
  /** Top-left corner of the frame card, in world units. */
  x: number;
  y: number;
  /** Centre of the frame card, in world units. */
  cx: number;
  cy: number;
  act: ActId;
}

/**
 * Lay the frames out along a gently winding path running left→right through
 * history. A low-frequency sine gives the timeline its "spotlight path" sway.
 */
function computePlacements(): FramePlacement[] {
  const out: FramePlacement[] = [];
  for (let i = 0; i < FRAME_COUNT; i++) {
    const n = i + 1;
    const cx = i * STEP_X;
    const cy = Math.sin(i * 0.62) * SWAY;
    out.push({
      n,
      cx,
      cy,
      x: cx - FRAME_W / 2,
      y: cy - FRAME_H / 2,
      act: actForFrame(n),
    });
  }
  return out;
}

export function actForFrame(n: number): ActId {
  const a = ACTS.find((act) => n >= act.from && n <= act.to);
  return a ? a.id : "finale";
}

export const PLACEMENTS: FramePlacement[] = computePlacements();

export function placementOf(n: number): FramePlacement {
  return PLACEMENTS[Math.min(Math.max(1, n), FRAME_COUNT) - 1];
}

/** Camera goal that nicely frames a single card with a little breathing room. */
export function goalForFrame(n: number, viewport: { width: number; height: number }): CameraGoal {
  const p = placementOf(n);
  // Choose a scale that fits the card within the viewport with margin.
  const margin = 1.18;
  const scale = Math.min(
    viewport.width / (FRAME_W * margin),
    viewport.height / (FRAME_H * margin),
  );
  return { cx: p.cx, cy: p.cy, scale };
}

export interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

/** Axis-aligned bounds enclosing a set of frames (with padding). */
export function boundsForFrames(ns: number[], pad = 0): Bounds {
  const ps = ns.map(placementOf);
  const minX = Math.min(...ps.map((p) => p.x)) - pad;
  const minY = Math.min(...ps.map((p) => p.y)) - pad;
  const maxX = Math.max(...ps.map((p) => p.x + FRAME_W)) + pad;
  const maxY = Math.max(...ps.map((p) => p.y + FRAME_H)) + pad;
  return { minX, minY, maxX, maxY };
}

/** Bounds of the entire canvas (all frames). */
export function worldBounds(pad = 900): Bounds {
  return boundsForFrames(
    PLACEMENTS.map((p) => p.n),
    pad,
  );
}

/** Act zone bounds in world units (used for faint act titles + overview). */
export function actBounds(act: ActId, pad = 420): Bounds {
  const def = ACTS.find((a) => a.id === act)!;
  const ns: number[] = [];
  for (let n = def.from; n <= def.to; n++) ns.push(n);
  return boundsForFrames(ns, pad);
}

/** Camera goal that frames an arbitrary bounds rectangle. */
export function goalForBounds(
  b: Bounds,
  viewport: { width: number; height: number },
  margin = 1.1,
): CameraGoal {
  const w = b.maxX - b.minX;
  const h = b.maxY - b.minY;
  const scale = Math.min(
    viewport.width / (w * margin),
    viewport.height / (h * margin),
  );
  return { cx: (b.minX + b.maxX) / 2, cy: (b.minY + b.maxY) / 2, scale };
}
