"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function SplitHeading({
  text,
  as: Tag = "h2",
  className,
}: {
  text: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = ref.current;
    if (!el || reduced) return;

    const lines = text.split(". ").map((l, i, arr) =>
      i < arr.length - 1 ? `${l}.` : l,
    );

    el.innerHTML = lines
      .map(
        (line) =>
          `<span class="block overflow-hidden"><span class="inline-block split-line">${line}</span></span>`,
      )
      .join("");

    gsap.from(".split-line", {
      yPercent: 110,
      duration: 0.9,
      stagger: 0.12,
      ease: "power3.out",
    });
  }, [text]);

  return (
    <Tag ref={ref as never} className={className}>
      {text}
    </Tag>
  );
}
