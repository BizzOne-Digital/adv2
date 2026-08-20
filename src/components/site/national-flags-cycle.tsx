"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { flagImageUrl, NATIONAL_FLAGS } from "@/lib/media/national-flags";

const ROTATE_MS = 4500;

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type NationalFlagsCycleProps = {
  onIndexChange?: (index: number) => void;
  className?: string;
};

export function NationalFlagsCycle({ onIndexChange, className }: NationalFlagsCycleProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback(
    (next: number) => {
      const total = NATIONAL_FLAGS.length;
      const wrapped = ((next % total) + total) % total;
      setIndex(wrapped);
      onIndexChange?.(wrapped);
    },
    [onIndexChange],
  );

  useEffect(() => {
    onIndexChange?.(0);
  }, [onIndexChange]);

  useEffect(() => {
    if (paused || prefersReducedMotion()) return;
    const id = window.setInterval(() => {
      goTo(index + 1);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [index, paused, goTo]);

  const active = NATIONAL_FLAGS[index];

  return (
    <div
      className={cn("flex flex-col items-center", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <p className="mb-4 text-center text-[10px] font-semibold uppercase tracking-[0.28em] text-accent-gold">
        All nations are welcome
      </p>

      <div className="relative flex size-36 items-center justify-center rounded-full border border-warm-ivory/20 bg-near-black/40 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-sm sm:size-44 lg:size-52">
        {NATIONAL_FLAGS.map((flag, i) => (
          <div
            key={flag.code}
            className={cn(
              "absolute inset-3 overflow-hidden rounded-full transition-all duration-700 ease-out",
              i === index ? "scale-100 opacity-100" : "scale-90 opacity-0 pointer-events-none",
            )}
            aria-hidden={i !== index}
          >
            <Image
              src={flagImageUrl(flag.code, 320)}
              alt={`${flag.name} flag`}
              fill
              className="object-cover"
              sizes="208px"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      <p className="mt-5 font-display text-lg font-bold text-warm-ivory sm:text-xl">
        {active.name}
      </p>
      <p className="mt-1 text-center text-sm text-warm-ivory/70">{active.welcome}</p>

      <div
        className="mt-6 flex flex-wrap justify-center gap-2"
        role="tablist"
        aria-label="National flags"
      >
        {NATIONAL_FLAGS.map((flag, i) => (
          <button
            key={flag.code}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Show ${flag.name} flag`}
            className={cn(
              "relative size-9 overflow-hidden rounded-full border-2 transition sm:size-10",
              i === index
                ? "border-signal-red scale-110 shadow-[0_0_12px_rgba(226,29,46,0.45)]"
                : "border-warm-ivory/25 opacity-70 hover:opacity-100",
            )}
            onClick={() => goTo(i)}
          >
            <Image
              src={flagImageUrl(flag.code, 80)}
              alt=""
              fill
              className="object-cover"
              sizes="40px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export function NationalFlagsMarquee() {
  if (prefersReducedMotion()) {
    return (
      <div className="flex flex-wrap justify-center gap-2 px-4">
        {NATIONAL_FLAGS.map((flag) => (
          <div
            key={flag.code}
            className="relative size-8 overflow-hidden rounded-full border border-warm-ivory/20"
          >
            <Image
              src={flagImageUrl(flag.code, 80)}
              alt={`${flag.name} flag`}
              fill
              className="object-cover"
              sizes="32px"
            />
          </div>
        ))}
      </div>
    );
  }

  const doubled = [...NATIONAL_FLAGS, ...NATIONAL_FLAGS];

  return (
    <div className="relative w-full overflow-hidden border-t border-warm-ivory/10 bg-near-black/50 py-3">
      <div className="flex animate-flag-marquee gap-4">
        {doubled.map((flag, i) => (
          <div
            key={`${flag.code}-${i}`}
            className="relative size-8 shrink-0 overflow-hidden rounded-full border border-warm-ivory/20"
            title={flag.name}
          >
            <Image
              src={flagImageUrl(flag.code, 80)}
              alt={`${flag.name} flag`}
              fill
              className="object-cover"
              sizes="32px"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
