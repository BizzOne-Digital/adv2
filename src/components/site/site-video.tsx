"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type SiteVideoProps = {
  src: string;
  alt: string;
  poster?: string;
  className?: string;
};

export function SiteVideo({ src, alt, poster, className }: SiteVideoProps) {
  const [error, setError] = useState(false);

  return (
    <div
      className={cn("relative aspect-video bg-near-black", className)}
      data-lenis-prevent
    >
      {error ? (
        <div className="flex h-full min-h-[12rem] flex-col items-center justify-center gap-3 p-6 text-center">
          <p className="text-sm text-warm-ivory/70">This video could not be loaded in the browser.</p>
          <Link
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-signal-red underline underline-offset-2"
          >
            Open video file
          </Link>
        </div>
      ) : (
        <video
          controls
          playsInline
          preload="metadata"
          poster={poster}
          className="absolute inset-0 h-full w-full object-cover pointer-events-auto"
          aria-label={alt}
          onError={() => setError(true)}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
