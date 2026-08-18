"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { SplitHeading } from "@/components/motion/split-heading";
import type { CtaLink } from "@/types";

type HeroCinematicProps = {
  eyebrow?: string;
  heading: string;
  subheading?: string;
  bodyHtml?: string;
  backgroundVideo?: string;
  theme?: "dark" | "light";
  primaryCta?: CtaLink;
  secondaryCta?: CtaLink;
  compact?: boolean;
};

export function HeroCinematic({
  eyebrow,
  heading,
  subheading,
  bodyHtml,
  backgroundVideo,
  theme = "dark",
  primaryCta,
  secondaryCta,
  compact = false,
}: HeroCinematicProps) {
  const heroRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isDark = theme === "dark";

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (mediaRef.current) {
        gsap.to(mediaRef.current, {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          { autoAlpha: 0, y: 32 },
          { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.2 },
        );
      }
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className={cn(
        "relative overflow-hidden w-full max-w-full",
        compact ? "min-h-[55vh]" : "min-h-screen",
        isDark ? "text-warm-ivory" : "text-near-black",
      )}
    >
      <div ref={mediaRef} className="absolute inset-0">
        {backgroundVideo ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="size-full object-cover"
            aria-hidden
          >
            <source src={backgroundVideo} type="video/mp4" />
          </video>
        ) : (
          <>
            <div className="hero-brand-gradient absolute inset-0" aria-hidden />
            <div className="hero-brand-gradient-glow absolute inset-0" aria-hidden />
            <div
              className="absolute inset-0 bg-gradient-to-t from-near-black/90 via-near-black/40 to-transparent"
              aria-hidden
            />
          </>
        )}
        <div className="grain-overlay absolute inset-0 opacity-30" aria-hidden />
        <div
          className="pointer-events-none absolute bottom-[22%] left-0 right-0 z-[1] h-[2px] opacity-80"
          aria-hidden
        >
          <div className="light-beam h-full w-full shadow-[0_0_40px_rgba(226,29,46,0.5)]" />
        </div>
        <div
          className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-signal-red to-transparent opacity-80"
          aria-hidden
        />
      </div>

      <Container className="relative z-10 flex min-h-[inherit] items-end pb-16 pt-32 sm:pb-20 sm:pt-36">
        <div ref={contentRef} className="max-w-3xl">
          {eyebrow && (
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-accent-gold">
              {eyebrow}
            </p>
          )}
          <SplitHeading
            as="h1"
            text={heading}
            className="font-display text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
          />
          {subheading && (
            <p
              className={cn(
                "mt-6 max-w-2xl text-lg leading-relaxed sm:text-xl",
                isDark ? "text-warm-ivory/80" : "text-muted",
              )}
            >
              {subheading}
            </p>
          )}
          {bodyHtml && (
            <div
              className="prose-lfi prose-on-colored mt-4 text-base"
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />
          )}
          {(primaryCta || secondaryCta) && (
            <div className="mt-8 flex flex-wrap gap-4">
              {primaryCta && (
                <Button asChild size="lg">
                  <Link href={primaryCta.href}>{primaryCta.label}</Link>
                </Button>
              )}
              {secondaryCta && (
                <Button asChild variant="outlineLight" size="lg">
                  <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
