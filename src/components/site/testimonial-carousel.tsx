"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MediaRef } from "@/types";

type TestimonialCarouselProps = {
  testimonials: Array<Record<string, unknown>>;
  className?: string;
};

export function TestimonialCarousel({
  testimonials,
  className,
}: TestimonialCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 6000, stopOnInteraction: true })],
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    requestAnimationFrame(onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  if (!testimonials.length) return null;

  return (
    <div className={cn("relative w-full min-w-0 overflow-x-clip", className)}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {testimonials.map((item) => {
            const avatar = item.avatar as MediaRef | undefined;
            const name = String(item.personName ?? "Community member");
            const role = item.role ? String(item.role) : undefined;
            const quote = String(item.quote ?? "");

            return (
              <figure
                key={String(item._id ?? name)}
                className="min-w-0 flex-[0_0_100%] px-0 sm:flex-[0_0_90%] sm:px-1 lg:flex-[0_0_75%]"
              >
                <blockquote className="rounded-2xl border border-border bg-clean-white p-6 sm:p-8 lg:p-10">
                  <Quote className="size-8 text-signal-red/30" aria-hidden />
                  <p className="font-display mt-4 text-lg leading-relaxed text-near-black sm:text-xl lg:text-2xl">
                    &ldquo;{quote}&rdquo;
                  </p>
                  <figcaption className="mt-8 flex items-center gap-4">
                    <div className="relative size-12 overflow-hidden rounded-full bg-charcoal/10">
                      {avatar?.src ? (
                        <Image
                          src={avatar.src}
                          alt={avatar.alt || name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <span className="flex size-full items-center justify-center text-sm font-bold text-signal-red">
                          {name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <cite className="not-italic font-semibold text-near-black">{name}</cite>
                      {role && <p className="text-muted text-sm">{role}</p>}
                    </div>
                  </figcaption>
                </blockquote>
              </figure>
            );
          })}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <div className="flex gap-2" role="tablist" aria-label="Testimonial slides">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === selectedIndex}
              aria-label={`Go to testimonial ${i + 1}`}
              className={cn(
                "h-2 rounded-full transition-all",
                i === selectedIndex ? "w-8 bg-signal-red" : "w-2 bg-border",
              )}
              onClick={() => emblaApi?.scrollTo(i)}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className="inline-flex size-10 items-center justify-center rounded-full border border-border transition hover:border-signal-red hover:text-signal-red disabled:opacity-40"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            disabled={!canScrollNext}
            className="inline-flex size-10 items-center justify-center rounded-full border border-border transition hover:border-signal-red hover:text-signal-red disabled:opacity-40"
            aria-label="Next testimonial"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
