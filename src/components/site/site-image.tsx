"use client";

import Image from "next/image";
import { useState } from "react";
import { siteImageFallbackSrcs } from "@/lib/media/site-assets";

type SiteImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

export function SiteImage({
  src,
  alt,
  fill = true,
  className,
  sizes,
  priority,
}: SiteImageProps) {
  const fallbacks = siteImageFallbackSrcs(src);
  const [index, setIndex] = useState(0);
  const currentSrc = fallbacks[index] ?? src;

  return (
    <Image
      key={currentSrc}
      src={currentSrc}
      alt={alt}
      fill={fill}
      className={className}
      sizes={sizes}
      priority={priority}
      onError={() => {
        if (index < fallbacks.length - 1) setIndex(index + 1);
      }}
    />
  );
}
