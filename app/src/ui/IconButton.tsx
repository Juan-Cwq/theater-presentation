import type { ButtonHTMLAttributes, ReactNode } from "react";

/** Small circular control-dock button with tooltip-ish title + active state. */
export function IconButton({
  children,
  label,
  active = false,
  className = "",
  ...rest
}: {
  children: ReactNode;
  label: string;
  active?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
        active
          ? "border-gold bg-gold/20 text-gold"
          : "border-white/10 text-muted-text hover:border-gold/40 hover:text-pale-gold"
      } ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
