"use client";

import Image from "next/image";
import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export type GalleryImage = {
  src: string;
  alt: string;
};

type GalleryGridProps = {
  images: GalleryImage[];
  className?: string;
};

export function GalleryGrid({ images, className }: GalleryGridProps) {
  const [active, setActive] = useState<GalleryImage | null>(null);

  if (!images.length) return null;

  return (
    <>
      <div
        className={cn(
          "grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4",
          className,
        )}
      >
        {images.map((image, i) => (
          <button
            key={`${image.src}-${i}`}
            type="button"
            onClick={() => setActive(image)}
            className={cn(
              "group relative aspect-square overflow-hidden rounded-xl bg-charcoal/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-red",
              i % 7 === 0 && "sm:col-span-2 sm:aspect-[16/10]",
            )}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-near-black/0 transition group-hover:bg-near-black/20" />
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-near-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={active.alt}
          onClick={() => setActive(null)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full border border-warm-ivory/30 p-2 text-warm-ivory"
            onClick={() => setActive(null)}
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
          <div
            className="relative h-[70vh] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={active.src}
              alt={active.alt}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}
