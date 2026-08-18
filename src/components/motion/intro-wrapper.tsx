"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { cn } from "@/lib/utils";

const INTRO_STORAGE_KEY = "lfi-intro-seen";
const WORDS = ["ARRIVE", "BELONG", "THRIVE"] as const;

type IntroWrapperProps = {
  logoSrc: string;
  children?: React.ReactNode;
};

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function IntroWrapper({ logoSrc, children }: IntroWrapperProps) {
  const [phase, setPhase] = useState<"loading" | "playing" | "done">("loading");
  const overlayRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const finishIntro = () => {
    sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
    setPhase("done");
  };

  const skipIntro = () => {
    timelineRef.current?.kill();
    gsap.set(overlayRef.current, { autoAlpha: 0, pointerEvents: "none" });
    finishIntro();
  };

  useEffect(() => {
    const seen = sessionStorage.getItem(INTRO_STORAGE_KEY);
    if (seen || prefersReducedMotion()) {
      queueMicrotask(() => setPhase("done"));
      return;
    }

    queueMicrotask(() => setPhase("playing"));

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: finishIntro,
      });
      timelineRef.current = tl;

      tl.set(overlayRef.current, { autoAlpha: 1 })
        .fromTo(
          lineRef.current,
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.8 },
        )
        .fromTo(
          lineRef.current,
          { boxShadow: "0 0 0px rgba(226,29,46,0)" },
          {
            boxShadow: "0 0 40px rgba(226,29,46,0.8)",
            duration: 0.4,
          },
          "-=0.2",
        );

      const wordEls = wordsRef.current?.querySelectorAll("[data-word]");
      if (wordEls?.length) {
        tl.fromTo(
          wordEls,
          { y: 40, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.25 },
          "-=0.1",
        );
      }

      tl.fromTo(
        logoRef.current,
        { scale: 0.85, autoAlpha: 0, filter: "blur(8px)" },
        { scale: 1, autoAlpha: 1, filter: "blur(0px)", duration: 0.7 },
        "-=0.2",
      )
        .to(overlayRef.current, {
          autoAlpha: 0,
          duration: 0.6,
          ease: "power2.inOut",
        })
        .set(overlayRef.current, { pointerEvents: "none" });
    });

    return () => {
      timelineRef.current?.kill();
      ctx.revert();
    };
  }, []);

  if (phase === "done") {
    return <>{children}</>;
  }

  return (
    <>
      <div
        ref={overlayRef}
        className={cn(
          "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-near-black",
          phase === "loading" && "invisible",
        )}
        aria-hidden
        role="presentation"
      >
        <button
          type="button"
          onClick={skipIntro}
          className="absolute right-6 top-6 z-10 rounded-full border border-warm-ivory/20 px-4 py-2 text-xs font-medium uppercase tracking-widest text-warm-ivory/80 transition hover:border-signal-red hover:text-signal-red"
        >
          Skip
        </button>

        <div className="relative flex w-full max-w-4xl flex-col items-center px-6">
          <div
            ref={lineRef}
            className="light-beam mb-16 h-px w-full origin-left opacity-90"
            aria-hidden
          />

          <div
            ref={wordsRef}
            className="mb-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
            aria-hidden
          >
            {WORDS.map((word) => (
              <span
                key={word}
                data-word
                className="font-display text-2xl font-bold tracking-[0.35em] text-warm-ivory sm:text-4xl"
              >
                {word}
              </span>
            ))}
          </div>

          <p className="sr-only">Light for Immigrants — Arrive, Belong, Thrive</p>

          <div ref={logoRef} className="relative h-16 w-48 sm:h-20 sm:w-56">
            <Image
              src={logoSrc}
              alt="Light for Immigrants"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
      {children}
    </>
  );
}
