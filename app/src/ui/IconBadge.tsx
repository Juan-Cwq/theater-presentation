import * as Icons from "lucide-react";
import type { LucideProps } from "lucide-react";

/**
 * Gold circular icon badge. Looks up a lucide-react icon by name so content
 * data can reference icons as plain strings.
 */
export function IconBadge({
  name,
  size = 30,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const Icon =
    (Icons as unknown as Record<string, React.ComponentType<LucideProps>>)[
      name
    ] ?? Icons.Sparkles;

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold shadow-gold-glow ${className}`}
      style={{ width: size * 2, height: size * 2 }}
    >
      <Icon size={size} strokeWidth={1.6} aria-hidden />
    </span>
  );
}
