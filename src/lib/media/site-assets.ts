import type { MediaRef } from "@/types";

/** JPEG pics in public/images (pic55 missing from assets). */
export const GALLERY_IMAGE_NUMBERS = [
  1,
  2, 3, 4, 5, 6, 7, 8, 9, 10,
  11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
  31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
  41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
  51, 52, 53, 54, 56, 57, 58, 59, 60,
  61, 62, 63, 64, 65,
] as const;

export type SiteVideo = {
  src: string;
  alt: string;
  title: string;
  poster?: string;
};

export const SITE_VIDEOS: SiteVideo[] = [
  {
    src: "/videos/vid1.mp4",
    alt: "Community welcome and orientation event",
    title: "Welcome day highlights",
    poster: "/images/pic2.jpeg",
  },
  {
    src: "/videos/vid2.mp4",
    alt: "Program workshop with newcomers",
    title: "Workshop in action",
    poster: "/images/pic3.jpeg",
  },
  {
    src: "/videos/vid3.mp4",
    alt: "Community gathering and celebration",
    title: "Together in community",
    poster: "/images/pic4.jpeg",
  },
];

export const HERO_BACKGROUND = "/images/hero-background.png";

export function siteImagePath(n: number): string {
  return `/images/pic${n}.jpeg`;
}

/** Alternate paths when the primary JPEG URL fails (e.g. legacy assets without extension). */
export function siteImageFallbackSrcs(src: string): string[] {
  const fallbacks = [src];
  if (src.endsWith(".jpeg")) {
    const withoutExt = src.slice(0, -5);
    if (!fallbacks.includes(withoutExt)) fallbacks.push(withoutExt);
  } else if (src === "/images/pic1" && !fallbacks.includes("/images/pic1.jpeg")) {
    fallbacks.push("/images/pic1.jpeg");
  }
  return fallbacks;
}

export function siteImageRef(n: number, alt: string): MediaRef {
  return {
    src: siteImagePath(n),
    type: "image",
    alt,
  };
}

export function siteImagesFromIndices(indices: number[], altPrefix = "Community moment"): MediaRef[] {
  return indices.map((n, i) =>
    siteImageRef(n, `${altPrefix} ${i + 1}`),
  );
}

export function allGalleryImages(): Array<{ src: string; alt: string }> {
  return GALLERY_IMAGE_NUMBERS.map((n, i) => ({
    src: siteImagePath(n),
    alt: `Light for Immigrants community photo ${i + 1}`,
  }));
}

export function pickSiteImages(count: number, startIndex = 0): MediaRef[] {
  const pool = [...GALLERY_IMAGE_NUMBERS];
  return Array.from({ length: count }, (_, i) => {
    const n = pool[(startIndex + i) % pool.length];
    return siteImageRef(n, `Community program photo ${i + 1}`);
  });
}

export function siteVideosAsMedia(): MediaRef[] {
  return SITE_VIDEOS.map((video) => ({
    src: video.src,
    type: "video",
    alt: video.alt,
    caption: video.title,
  }));
}
