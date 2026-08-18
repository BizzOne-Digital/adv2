"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowDown } from "lucide-react";
import type { CtaLink } from "@/types";

const DEFAULT_BG = "/images/hero-background.png";

type HomeHeroProps = {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  primaryCta?: CtaLink;
  secondaryCta?: CtaLink;
  backgroundImage?: string;
  backgroundImageAlt?: string;
};

export function HomeHero({
  eyebrow = "Ontario, Canada  •  Supporting every new beginning",
  heading = "A brighter beginning starts here.",
  subheading = "Guidance, community and practical support for immigrants building a new life in Canada.",
  primaryCta = { label: "Get Support", href: "/contact" },
  secondaryCta = { label: "Explore our services", href: "/services" },
  backgroundImage = DEFAULT_BG,
  backgroundImageAlt = "Immigrant families looking toward the Toronto skyline at sunset",
}: HomeHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        mediaRef.current,
        { scale: 1.08 },
        { scale: 1, duration: 2.2, ease: "power2.out" },
      );

      gsap.fromTo(
        ".hero-fade",
        { autoAlpha: 0, y: 34 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          stagger: 0.12,
          ease: "power3.out",
          delay: 0.25,
        },
      );

      gsap.fromTo(
        ".hero-rail",
        { scaleY: 0, transformOrigin: "top center" },
        { scaleY: 1, duration: 1.2, ease: "power2.out", delay: 0.1 },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] w-full max-w-full overflow-hidden bg-near-black text-warm-ivory"
    >
      {/* Background photograph */}
      <div ref={mediaRef} className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt={backgroundImageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[72%_center] md:object-center"
        />
      </div>

      {/* Cinematic grading: dark on the left so type stays legible */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-near-black via-near-black/80 to-transparent"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-near-black/85 via-transparent to-near-black/65"
        aria-hidden
      />
      <div className="grain-overlay absolute inset-0 opacity-25" aria-hidden />

      {/* Left rail with vertical journey label */}
      <div
        className="absolute inset-y-0 left-6 z-10 hidden w-px lg:block xl:left-10"
        aria-hidden
      >
        <div className="hero-rail h-full w-px bg-gradient-to-b from-transparent via-warm-ivory/25 to-transparent" />
      </div>
      <div
        className="absolute left-6 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 lg:block xl:left-10"
        aria-hidden
      >
        <p
          className="whitespace-nowrap bg-near-black px-1 py-4 text-[10px] font-semibold uppercase tracking-[0.42em] text-accent-gold/70"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          Arrive • Belong • Thrive
        </p>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full min-w-0 max-w-7xl flex-col justify-center px-4 pb-28 pt-28 sm:px-6 sm:pb-32 sm:pt-32 lg:px-8">
        <div ref={contentRef} className="min-w-0 max-w-2xl">
          <p className="hero-fade mb-6 text-[10px] font-semibold uppercase tracking-[0.3em] text-accent-gold sm:text-[11px]">
            {eyebrow}
          </p>

          <h1 className="hero-fade font-hero text-[2rem] font-bold uppercase leading-[1.05] tracking-[0.03em] text-warm-ivory sm:text-5xl sm:leading-[1.02] sm:tracking-[0.04em] lg:text-[4.5rem]">
            {heading}
          </h1>

          <div className="hero-fade mt-9 max-w-md border border-warm-ivory/20 bg-near-black/35 px-6 py-5 backdrop-blur-[2px]">
            <p className="text-[0.95rem] leading-relaxed text-warm-ivory/85">
              {subheading}
            </p>
          </div>

          <div className="hero-fade mt-9 flex flex-wrap gap-4">
            <Link
              href={primaryCta.href}
              className="inline-flex items-center justify-center rounded-md bg-signal-red px-8 py-4 text-[11px] font-bold uppercase tracking-[0.16em] text-white shadow-[0_10px_40px_rgba(226,29,46,0.35)] transition hover:bg-deep-crimson"
            >
              {primaryCta.label}
            </Link>
            <Link
              href={secondaryCta.href}
              className="inline-flex items-center justify-center rounded-md border border-warm-ivory/50 px-8 py-4 text-[11px] font-bold uppercase tracking-[0.16em] text-warm-ivory transition hover:border-warm-ivory hover:bg-warm-ivory/10"
            >
              {secondaryCta.label}
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <a
        href="#home-content"
        className="absolute bottom-20 left-4 z-20 flex size-11 items-center justify-center rounded-full border border-warm-ivory/30 text-warm-ivory/75 transition hover:border-signal-red hover:text-signal-red sm:bottom-24 sm:left-6 lg:bottom-28"
        aria-label="Scroll to content"
      >
        <ArrowDown className="size-4" />
      </a>

      {/* Slide counter */}
      <div className="absolute bottom-20 right-4 z-20 flex items-center gap-3 sm:bottom-24 sm:right-6 lg:bottom-28">
        <span className="font-display text-xl font-bold text-signal-red">01</span>
        <span className="h-px w-10 bg-signal-red/70" aria-hidden />
      </div>

    </section>
  );
}
