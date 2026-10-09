import getStroke from "perfect-freehand";

/** Convert perfect-freehand's outline points into an SVG path `d` string. */
function outlineToPath(points: number[][]): string {
  if (points.length === 0) return "";
  const d = points.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", points[0][0], points[0][1], "Q"] as (string | number)[],
  );
  d.push("Z");
  return d.join(" ");
}

/**
 * Build a filled SVG path for a freehand stroke in world units.
 * Highlighter strokes are flatter/less tapered so they read like a marker.
 */
export function strokeToPath(
  points: number[][],
  size: number,
  highlighter = false,
): string {
  const outline = getStroke(points, {
    size,
    thinning: highlighter ? 0 : 0.6,
    smoothing: 0.5,
    streamline: 0.5,
    simulatePressure: true,
    last: true,
  });
  return outlineToPath(outline as number[][]);
}
