import Link from "next/link";
import * as React from "react";
import { cn } from "@/lib/utils";
import { SplitHeading } from "@/components/motion/split-heading";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  theme?: "light" | "dark";
  align?: "left" | "center";
  animated?: boolean;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  theme = "light",
  align = "left",
  animated = false,
  className,
}: SectionHeadingProps) {
  const isDark = theme === "dark";

  return (
    <div
      className={cn(
        "max-w-3xl min-w-0",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "mb-3 text-xs font-semibold uppercase tracking-[0.2em]",
            isDark ? "text-accent-gold" : "text-signal-red",
          )}
        >
          {eyebrow}
        </p>
      )}
      {animated ? (
        <SplitHeading
          as="h2"
          text={title}
          className={cn(
            "font-display text-balance text-2xl font-bold tracking-tight sm:text-3xl md:text-5xl",
            isDark ? "text-warm-ivory" : "text-near-black",
          )}
        />
      ) : (
        <h2
          className={cn(
            "font-display text-balance text-2xl font-bold tracking-tight sm:text-3xl md:text-5xl",
            isDark ? "text-warm-ivory" : "text-near-black",
          )}
        >
          {title}
        </h2>
      )}
      {subtitle && (
        <p
          className={cn(
            "mt-4 text-lg leading-relaxed",
            isDark ? "text-warm-ivory/75" : "text-muted",
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
