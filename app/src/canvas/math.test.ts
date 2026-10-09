import { describe, it, expect } from "vitest";
import {
  applyZoomAtPoint,
  cameraForGoal,
  clamp,
  clampScale,
  goalFromCamera,
  interpolateFly,
  lerp,
  screenToWorld,
  worldToScreen,
  MIN_SCALE,
  MAX_SCALE,
  type Camera,
} from "./math";

const SIZE = { width: 1000, height: 600 };

describe("clamp / clampScale", () => {
  it("clamps within bounds", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(99, 0, 10)).toBe(10);
  });

  it("clamps scale to the allowed zoom range", () => {
    expect(clampScale(0.01)).toBe(MIN_SCALE);
    expect(clampScale(999)).toBe(MAX_SCALE);
    expect(clampScale(1.5)).toBe(1.5);
  });
});

describe("lerp", () => {
  it("interpolates endpoints", () => {
    expect(lerp(0, 10, 0)).toBe(0);
    expect(lerp(0, 10, 1)).toBe(10);
    expect(lerp(0, 10, 0.5)).toBe(5);
  });
});

describe("screenToWorld / worldToScreen round-trip", () => {
  it("is an exact inverse", () => {
    const cam: Camera = { x: 120, y: -40, scale: 1.75 };
    const world = { x: 320, y: 210 };
    const screen = worldToScreen(world, cam);
    const back = screenToWorld(screen, cam);
    expect(back.x).toBeCloseTo(world.x, 10);
    expect(back.y).toBeCloseTo(world.y, 10);
  });
});

describe("applyZoomAtPoint (zoom-to-cursor)", () => {
  it("keeps the world point under the cursor fixed on screen", () => {
    const cam: Camera = { x: 0, y: 0, scale: 1 };
    const cursor = { x: 400, y: 300 };
    const worldUnder = screenToWorld(cursor, cam);

    const zoomed = applyZoomAtPoint(cam, cursor, 2.5);
    const screenAfter = worldToScreen(worldUnder, zoomed);

    expect(zoomed.scale).toBe(2.5);
    expect(screenAfter.x).toBeCloseTo(cursor.x, 8);
    expect(screenAfter.y).toBeCloseTo(cursor.y, 8);
  });

  it("respects zoom limits while anchoring", () => {
    const cam: Camera = { x: 0, y: 0, scale: 1 };
    const cursor = { x: 100, y: 100 };
    const worldUnder = screenToWorld(cursor, cam);

    const clampedIn = applyZoomAtPoint(cam, cursor, 999);
    expect(clampedIn.scale).toBe(MAX_SCALE);
    const s = worldToScreen(worldUnder, clampedIn);
    expect(s.x).toBeCloseTo(cursor.x, 8);
    expect(s.y).toBeCloseTo(cursor.y, 8);
  });
});

describe("cameraForGoal / goalFromCamera", () => {
  it("places the goal centre at the viewport centre", () => {
    const cam = cameraForGoal({ cx: 800, cy: 450, scale: 1.2 }, SIZE);
    const centreWorld = screenToWorld(
      { x: SIZE.width / 2, y: SIZE.height / 2 },
      cam,
    );
    expect(centreWorld.x).toBeCloseTo(800, 8);
    expect(centreWorld.y).toBeCloseTo(450, 8);
  });

  it("round-trips through goalFromCamera", () => {
    const goal = { cx: 123, cy: -456, scale: 0.8 };
    const cam = cameraForGoal(goal, SIZE);
    const recovered = goalFromCamera(cam, SIZE);
    expect(recovered.cx).toBeCloseTo(goal.cx, 8);
    expect(recovered.cy).toBeCloseTo(goal.cy, 8);
    expect(recovered.scale).toBeCloseTo(goal.scale, 8);
  });
});

describe("interpolateFly", () => {
  const from = { cx: 0, cy: 0, scale: 1 };
  const to = { cx: 1600, cy: 400, scale: 1.5 };

  it("matches the start goal at t=0", () => {
    const cam = interpolateFly(from, to, 0, SIZE, 0.2);
    const g = goalFromCamera(cam, SIZE);
    expect(g.cx).toBeCloseTo(from.cx, 6);
    expect(g.cy).toBeCloseTo(from.cy, 6);
    expect(g.scale).toBeCloseTo(from.scale, 6);
  });

  it("matches the end goal at t=1", () => {
    const cam = interpolateFly(from, to, 1, SIZE, 0.2);
    const g = goalFromCamera(cam, SIZE);
    expect(g.cx).toBeCloseTo(to.cx, 6);
    expect(g.cy).toBeCloseTo(to.cy, 6);
    expect(g.scale).toBeCloseTo(to.scale, 6);
  });

  it("pulls the zoom back at the midpoint (cinematic dip)", () => {
    const dip = 0.25;
    const mid = interpolateFly(from, to, 0.5, SIZE, dip);
    const g = goalFromCamera(mid, SIZE);
    // With a dip, mid-flight scale is below the linear-in-log midpoint.
    const logMid = Math.exp(
      (Math.log(from.scale) + Math.log(to.scale)) / 2,
    );
    expect(g.scale).toBeLessThan(logMid);
  });

  it("never exceeds zoom limits during flight", () => {
    for (let t = 0; t <= 1.0001; t += 0.1) {
      const cam = interpolateFly(
        { cx: 0, cy: 0, scale: MAX_SCALE },
        { cx: 10, cy: 10, scale: MAX_SCALE },
        t,
        SIZE,
        0.5,
      );
      expect(cam.scale).toBeGreaterThanOrEqual(MIN_SCALE);
      expect(cam.scale).toBeLessThanOrEqual(MAX_SCALE);
    }
  });
});
