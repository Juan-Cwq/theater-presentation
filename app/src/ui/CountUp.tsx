import { useEffect, useState } from "react";
import { prefersReducedMotion } from "../canvas/cameraStore";

/**
 * Counts a numeric value up when it becomes active (revealed). Preserves any
 * prefix/suffix in the original string, e.g. "$6.2B", "6,137", "80%", "500+".
 * Non-numeric values (e.g. "#1", "Liftoff") render as-is.
 */
export function CountUp({
  value,
  active,
  duration = 1100,
  className = "",
}: {
  value: string;
  active: boolean;
  duration?: number;
  className?: string;
}) {
  const parsed = parseValue(value);
  const [display, setDisplay] = useState(
    parsed ? format(0, parsed) : value,
  );

  useEffect(() => {
    if (!parsed) return;
    // Not yet revealed: hold at zero.
    if (!active) {
      setDisplay(format(0, parsed));
      return;
    }
    // Reduced motion: snap to the final value.
    if (prefersReducedMotion()) {
      setDisplay(format(parsed.number, parsed));
      return;
    }

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setDisplay(format(parsed.number * eased, parsed));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // `parsed` is derived from `value`; depend on the raw inputs instead.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, value, duration]);

  return (
    <span className={className} aria-label={value}>
      {parsed ? display : value}
    </span>
  );
}

interface Parsed {
  prefix: string;
  suffix: string;
  number: number;
  decimals: number;
  grouped: boolean;
}

function parseValue(value: string): Parsed | null {
  // Match leading non-digits (prefix), the number, then trailing (suffix).
  const m = value.match(/^([^\d]*)([\d.,]+)(.*)$/);
  if (!m) return null;
  const [, prefix, numStr, suffix] = m;
  const grouped = numStr.includes(",");
  const plain = numStr.replace(/,/g, "");
  const number = parseFloat(plain);
  if (Number.isNaN(number)) return null;
  const dot = plain.indexOf(".");
  const decimals = dot === -1 ? 0 : plain.length - dot - 1;
  return { prefix, suffix, number, decimals, grouped };
}

function format(n: number, p: Parsed): string {
  const fixed = n.toFixed(p.decimals);
  const [intPart, decPart] = fixed.split(".");
  const grouped = p.grouped
    ? Number(intPart).toLocaleString("en-US")
    : intPart;
  const body = decPart ? `${grouped}.${decPart}` : grouped;
  return `${p.prefix}${body}${p.suffix}`;
}
