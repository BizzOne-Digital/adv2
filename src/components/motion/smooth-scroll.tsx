"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { cn } from "@/lib/utils";

type SmoothScrollProps = {
  children: React.ReactNode;
  className?: string;
};

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function SmoothScroll({ children, className }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    rootRef.current?.classList.add("lenis-smooth");
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    document.documentElement.classList.add("lenis");

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      document.documentElement.classList.remove("lenis");
      rootRef.current?.classList.remove("lenis-smooth");
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <div ref={rootRef} className={cn(className)}>
      {children}
    </div>
  );
}
