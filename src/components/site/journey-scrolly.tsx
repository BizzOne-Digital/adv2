"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import type { ContentSection } from "@/types";

gsap.registerPlugin(ScrollTrigger);

type JourneyStep = {
  title: string;
  description: string;
};

const defaultSteps: JourneyStep[] = [
  {
    title: "Arrive",
    description:
      "Welcome, orientation, and the first practical steps — documents, housing, and community connections.",
  },
  {
    title: "Navigate",
    description:
      "Language support, employment coaching, and programs that help you understand systems and services.",
  },
  {
    title: "Belong",
    description:
      "Mentorship, cultural exchange, and gatherings that turn neighbours into a supportive community.",
  },
  {
    title: "Thrive",
    description:
      "Leadership pathways, advocacy, and long-term stability for you, your family, and future generations.",
  },
];

type JourneyScrollyProps = {
  section: Record<string, unknown> | ContentSection;
  className?: string;
};

function parseSteps(bodyHtml?: string): JourneyStep[] {
  if (!bodyHtml) return defaultSteps;
  try {
    const parsed = JSON.parse(bodyHtml) as JourneyStep[];
    if (Array.isArray(parsed) && parsed.length) return parsed;
  } catch {
    /* fall through */
  }
  return defaultSteps;
}

export function JourneyScrolly({ section, className }: JourneyScrollyProps) {
  const s = section as ContentSection;
  const steps = parseSteps(s.bodyHtml);
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    const progress = progressRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      el.querySelectorAll("[data-journey-step]").forEach((stepEl, index) => {
        ScrollTrigger.create({
          trigger: stepEl,
          start: "top center",
          end: "bottom center",
          onEnter: () => setActiveStep(index),
          onEnterBack: () => setActiveStep(index),
        });
      });

      if (progress) {
        gsap.to(progress, {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom center",
            scrub: true,
          },
        });
      }
    }, el);

    return () => ctx.revert();
  }, [steps.length]);

  return (
    <section
      ref={sectionRef}
      className={cn("section-dark relative w-full min-w-0 overflow-x-clip py-12 sm:py-16 lg:py-0", className)}
    >
      <Container className="relative grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="top-28 self-start lg:sticky lg:col-span-5 lg:py-24">
          <SectionHeading
            eyebrow={s.eyebrow ?? "Your Journey"}
            title={s.heading ?? "From Arrival to Belonging"}
            subtitle={s.subheading}
            theme="dark"
          />
          <div className="relative mt-10 hidden lg:block">
            <div className="absolute bottom-0 left-3 top-0 w-px bg-warm-ivory/15" />
            <div
              ref={progressRef}
              className="absolute bottom-0 left-3 top-0 w-px origin-top scale-y-0 bg-signal-red"
            />
            <ol className="space-y-6">
              {steps.map((step, i) => (
                <li
                  key={step.title}
                  className={cn(
                    "relative pl-10 transition",
                    i === activeStep ? "opacity-100" : "opacity-40",
                  )}
                >
                  <span
                    className={cn(
                      "absolute left-0 top-1 flex size-6 items-center justify-center rounded-full border text-xs font-bold",
                      i === activeStep
                        ? "border-signal-red bg-signal-red text-clean-white"
                        : "border-warm-ivory/30 text-warm-ivory",
                    )}
                  >
                    {i + 1}
                  </span>
                  <p className="font-display text-lg font-bold">{step.title}</p>
                  <p className="mt-1 text-sm text-warm-ivory/70">{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="lg:col-span-7 lg:py-24">
          {steps.map((step, i) => (
            <article
              key={step.title}
              data-journey-step
              className="mb-32 last:mb-16 sm:mb-40 lg:mb-[70vh]"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-signal-red lg:hidden">
                Step {i + 1}
              </p>
              <h3 className="font-display mt-2 text-3xl font-bold lg:hidden">
                {step.title}
              </h3>
              <p className="mt-4 max-w-lg text-lg leading-relaxed text-warm-ivory/80 lg:hidden">
                {step.description}
              </p>
              <div className="mt-8 hidden rounded-2xl border border-warm-ivory/10 bg-charcoal/40 p-8 lg:block">
                <p className="font-display text-4xl font-bold text-signal-red">
                  {step.title}
                </p>
                <p className="mt-4 max-w-md text-lg leading-relaxed text-warm-ivory/80">
                  {step.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
