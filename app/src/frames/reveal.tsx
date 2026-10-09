import { createContext, useContext, type ReactNode } from "react";
import { motion } from "framer-motion";

/**
 * In-frame staggered reveals.
 *
 * A frame exposes a number of ordered reveal "slots". The navigator drives an
 * `activeCount` (how many slots are currently shown). `<Reveal order={i}>`
 * fades/slides its children up once `activeCount > i`.
 *
 * Outside presentation mode (overview, read mode, thumbnails) we pass
 * `activeCount = Infinity` so everything is visible at once.
 */
const RevealContext = createContext<{ activeCount: number; instant: boolean }>({
  activeCount: Number.POSITIVE_INFINITY,
  instant: false,
});

export function RevealProvider({
  activeCount,
  instant = false,
  children,
}: {
  activeCount: number;
  instant?: boolean;
  children: ReactNode;
}) {
  return (
    <RevealContext.Provider value={{ activeCount, instant }}>
      {children}
    </RevealContext.Provider>
  );
}

export function useRevealActive(order: number): boolean {
  const { activeCount } = useContext(RevealContext);
  return activeCount > order;
}

export function Reveal({
  order,
  children,
  className,
  y = 22,
}: {
  order: number;
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  const { activeCount, instant } = useContext(RevealContext);
  const active = activeCount > order;

  return (
    <motion.div
      className={className}
      initial={false}
      animate={{
        opacity: active ? 1 : 0,
        y: active ? 0 : y,
        filter: active ? "blur(0px)" : "blur(6px)",
      }}
      transition={
        instant
          ? { duration: 0 }
          : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
      }
      style={{ pointerEvents: active ? "auto" : "none" }}
    >
      {children}
    </motion.div>
  );
}
