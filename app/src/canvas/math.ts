/**
 * Pure camera math for the infinite canvas.
 *
 * Coordinate model
 * ----------------
 * The world is rendered inside a single element with the CSS transform:
 *   translate(cam.x, cam.y) scale(cam.scale)
 *
 * So a world point `w` maps to a screen point `s` by:
 *   s = w * scale + offset
 * and back:
 *   w = (s - offset) / scale
 *
 * Keeping this math pure (no DOM, no React) makes it trivially unit-testable,
 * which is where all the subtle bugs in pan/zoom engines live.
 */

export interface Vec2 {
  x: number;
  y: number;
}

/** The camera is the translate/scale pair applied to the world container. */
export interface Camera {
  /** Screen-space x offset of the world origin, in px. */
  x: number;
  /** Screen-space y offset of the world origin, in px. */
  y: number;
  /** Uniform zoom factor. */
  scale: number;
}

/** A higher-level description of "what the camera is looking at". */
export interface CameraGoal {
  /** World coordinate that should sit at the viewport centre. */
  cx: number;
  cy: number;
  /** Desired zoom factor. */
  scale: number;
}

export interface Size {
  width: number;
  height: number;
}

/**
 * Zoom limits. The brief asks for 0.1×–4×, but 13 non-overlapping 1600px-wide
 * frames on one winding timeline span ~28k world units, so a true full-board
 * overview needs to zoom out further than 0.1×. We therefore keep 4× as the max
 * and lower the floor so "see every frame" actually fits. (Noted deviation.)
 */
export const MIN_SCALE = 0.02;
export const MAX_SCALE = 4;

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function clampScale(scale: number): number {
  return clamp(scale, MIN_SCALE, MAX_SCALE);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Smooth, non-bouncy ease used for programmatic camera moves. */
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function screenToWorld(screen: Vec2, cam: Camera): Vec2 {
  return {
    x: (screen.x - cam.x) / cam.scale,
    y: (screen.y - cam.y) / cam.scale,
  };
}

export function worldToScreen(world: Vec2, cam: Camera): Vec2 {
  return {
    x: world.x * cam.scale + cam.x,
    y: world.y * cam.scale + cam.y,
  };
}

/**
 * Zoom toward a fixed screen point (e.g. the cursor).
 * The world point currently under `screenPoint` stays glued to that pixel.
 */
export function applyZoomAtPoint(
  cam: Camera,
  screenPoint: Vec2,
  nextScale: number,
): Camera {
  const scale = clampScale(nextScale);
  // World point under the cursor before zooming.
  const worldPoint = screenToWorld(screenPoint, cam);
  // Recompute offset so that worldPoint maps back to the same screen pixel.
  return {
    scale,
    x: screenPoint.x - worldPoint.x * scale,
    y: screenPoint.y - worldPoint.y * scale,
  };
}

/** Multiply the current zoom by `factor`, anchored at a screen point. */
export function zoomBy(cam: Camera, factor: number, screenPoint: Vec2): Camera {
  return applyZoomAtPoint(cam, screenPoint, cam.scale * factor);
}

/** Build a concrete camera that centres `goal` within a viewport of `size`. */
export function cameraForGoal(goal: CameraGoal, size: Size): Camera {
  const scale = clampScale(goal.scale);
  return {
    scale,
    x: size.width / 2 - goal.cx * scale,
    y: size.height / 2 - goal.cy * scale,
  };
}

/** Recover the goal (viewport-centre world point + scale) from a camera. */
export function goalFromCamera(cam: Camera, size: Size): CameraGoal {
  const centre = screenToWorld({ x: size.width / 2, y: size.height / 2 }, cam);
  return { cx: centre.x, cy: centre.y, scale: cam.scale };
}

/**
 * Interpolate a cinematic "fly-to" between two goals.
 *
 * The centre is eased linearly in world space while the scale is interpolated
 * in *log* space (so zooming feels perceptually uniform) and dipped slightly
 * mid-flight — the camera pulls back, then eases in, like a Keynote move.
 *
 * @param dip 0 = no pullback, 0.25 = noticeable pull back at the midpoint.
 */
export function interpolateFly(
  from: CameraGoal,
  to: CameraGoal,
  t: number,
  size: Size,
  dip = 0.18,
): Camera {
  const e = easeInOutCubic(clamp(t, 0, 1));
  const cx = lerp(from.cx, to.cx, e);
  const cy = lerp(from.cy, to.cy, e);

  // Log-space scale interpolation.
  const logScale = lerp(Math.log(from.scale), Math.log(to.scale), e);
  // sin() arch peaks at the midpoint; subtracting it in log space zooms out.
  const pullback = dip * Math.sin(Math.PI * clamp(t, 0, 1));
  const scale = clampScale(Math.exp(logScale - pullback));

  return cameraForGoal({ cx, cy, scale }, size);
}
