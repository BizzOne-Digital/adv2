"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import type { AnimationPreset } from "@/types";

gsap.registerPlugin(ScrollTrigger);

const presetMap: Record<
  AnimationPreset,
  { from: gsap.TweenVars; to: gsap.TweenVars }
> = {
  none: { from: {}, to: {} },
  fade: {
    from: { autoAlpha: 0 },
    to: { autoAlpha: 1, duration: 0.8 },
  },
  "from-left": {
    from: { autoAlpha: 0, x: -48 },
    to: { autoAlpha: 1, x: 0, duration: 0.9 },
  },
  "from-right": {
    from: { autoAlpha: 0, x: 48 },
    to: { autoAlpha: 1, x: 0, duration: 0.9 },
  },
  "from-top": {
    from: { autoAlpha: 0, y: -40 },
    to: { autoAlpha: 1, y: 0, duration: 0.9 },
  },
  "from-bottom": {
    from: { autoAlpha: 0, y: 40 },
    to: { autoAlpha: 1, y: 0, duration: 0.9 },
  },
  stagger: {
    from: { autoAlpha: 0, y: 24 },
    to: { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08 },
  },
  "mask-reveal": {
    from: { clipPath: "inset(0 100% 0 0)" },
    to: { clipPath: "inset(0 0% 0 0)", duration: 1 },
  },
};

type RevealOnScrollProps = {
  children: React.ReactNode;
  animation?: AnimationPreset;
  delay?: number;
  className?: string;
  once?: boolean;
};

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function RevealOnScroll({
  children,
  animation = "fade",
  delay = 0,
  className,
  once = true,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || animation === "none") return;

    if (prefersReducedMotion()) {
      gsap.set(el, { autoAlpha: 1, clearProps: "all" });
      return;
    }

    const preset = presetMap[animation] ?? presetMap.fade;
    const targets =
      animation === "stagger"
        ? (() => {
            const items = el.querySelectorAll("[data-reveal-item]");
            return items.length ? items : el;
          })()
        : el;

    const ctx = gsap.context(() => {
      gsap.set(targets, preset.from);
      gsap.to(targets, {
        ...preset.to,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once,
        },
      });
    }, el);

    const fallbackTimer = window.setTimeout(() => {
      gsap.set(el, { autoAlpha: 1, clearProps: "clipPath,x,y,transform" });
      if (targets instanceof Element) {
        gsap.set(targets, { autoAlpha: 1, clearProps: "clipPath,x,y,transform" });
      } else {
        gsap.set(targets, { autoAlpha: 1, clearProps: "clipPath,x,y,transform" });
      }
    }, 2500);

    return () => {
      window.clearTimeout(fallbackTimer);
      ctx.revert();
    };
  }, [animation, delay, once]);

  return (
    <div ref={ref} className={cn("min-w-0", className)}>
      {children}
    </div>
  );
}
