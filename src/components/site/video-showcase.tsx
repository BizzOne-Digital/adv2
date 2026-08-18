"use client";

import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import type { MediaRef } from "@/types";
import { SITE_VIDEOS, type SiteVideo } from "@/lib/media/site-assets";

type VideoShowcaseProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  videos?: SiteVideo[] | MediaRef[];
  theme?: "light" | "dark";
  className?: string;
};

function normalizeVideos(videos?: SiteVideo[] | MediaRef[]): SiteVideo[] {
  if (!videos?.length) return SITE_VIDEOS;
  return videos.map((item, i) => {
    if ("title" in item && typeof item.title === "string") {
      return item as SiteVideo;
    }
    const media = item as MediaRef;
    return {
      src: media.src,
      alt: media.alt,
      title: media.caption ?? `Community video ${i + 1}`,
    };
  });
}

export function VideoShowcase({
  eyebrow = "See us in action",
  title = "Moments from our community",
  subtitle = "Highlights from programs, welcome days, and gatherings across Ontario.",
  videos,
  theme = "light",
  className,
}: VideoShowcaseProps) {
  const items = normalizeVideos(videos);
  const isDark = theme === "dark";

  return (
    <section
      className={cn(
        isDark ? "section-dark" : "section-ivory",
        "py-12 sm:py-16 lg:py-24",
        className,
      )}
    >
      <Container>
        <RevealOnScroll animation="fade">
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            subtitle={subtitle}
            theme={isDark ? "dark" : "light"}
            align="center"
          />
        </RevealOnScroll>
      <div className="mt-12 grid min-w-0 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((video, i) => (
            <RevealOnScroll key={video.src} animation="stagger" delay={i * 0.08}>
              <article className="overflow-hidden rounded-2xl border border-border bg-near-black/5">
                <div className="relative aspect-video bg-near-black">
                  <video
                    src={video.src}
                    controls
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover"
                    aria-label={video.alt}
                  />
                </div>
                <div className="p-4">
                  <h3
                    className={cn(
                      "font-display text-lg font-bold",
                      isDark ? "text-warm-ivory" : "text-near-black",
                    )}
                  >
                    {video.title}
                  </h3>
                  <p
                    className={cn(
                      "mt-1 text-sm",
                      isDark ? "text-warm-ivory/70" : "text-muted",
                    )}
                  >
                    {video.alt}
                  </p>
                </div>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </Container>
    </section>
  );
}
