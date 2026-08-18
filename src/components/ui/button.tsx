import Link from "next/link";
import * as React from "react";
import { cn } from "@/lib/utils";

const variantStyles = {
  primary:
    "bg-signal-red text-clean-white hover:bg-deep-crimson shadow-[0_8px_30px_var(--glow-red)]",
  secondary:
    "border border-near-black/20 bg-transparent text-near-black hover:border-signal-red hover:text-signal-red",
  outlineLight:
    "border border-warm-ivory/50 bg-transparent text-warm-ivory hover:border-white hover:bg-white/10 hover:text-white",
  ghost:
    "bg-transparent text-near-black hover:bg-near-black/5 hover:text-signal-red",
} as const;

const sizeStyles = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-8 text-base",
} as const;

export type ButtonVariant = keyof typeof variantStyles;
export type ButtonSize = keyof typeof sizeStyles;

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  href?: string;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  asChild = false,
  href,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-red focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    variantStyles[variant],
    sizeStyles[size],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ className?: string }>, {
      className: cn(classes, (children as React.ReactElement<{ className?: string }>).props.className),
    });
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
