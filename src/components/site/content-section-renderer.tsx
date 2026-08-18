"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import type { AnimationPreset, ContentSection, CtaLink, MediaRef } from "@/types";
import { allGalleryImages, SITE_VIDEOS } from "@/lib/media/site-assets";
import { VideoShowcase } from "@/components/site/video-showcase";
import { GalleryGrid } from "@/components/site/gallery-grid";

type ContentSectionRendererProps = {
  sections: Array<Record<string, unknown> | ContentSection>;
  className?: string;
};

function asSection(section: Record<string, unknown> | ContentSection): ContentSection {
  return section as ContentSection;
}

function SectionShell({
  section,
  children,
  className,
}: {
  section: ContentSection;
  children: React.ReactNode;
  className?: string;
}) {
  const theme = section.theme ?? "light";
  const themeClass =
    theme === "dark"
      ? "section-dark"
      : theme === "red"
        ? "section-red"
        : "section-ivory";

  return (
    <RevealOnScroll
      animation={(section.animation as AnimationPreset) ?? "fade"}
      className={cn(themeClass, "w-full min-w-0 overflow-x-clip py-12 sm:py-16 lg:py-24", className)}
    >
      <Container>{children}</Container>
    </RevealOnScroll>
  );
}

function CtaButtons({
  primary,
  secondary,
  theme,
  centered = false,
}: {
  primary?: CtaLink;
  secondary?: CtaLink;
  theme?: "light" | "dark" | "red";
  centered?: boolean;
}) {
  const onColored = theme === "dark" || theme === "red";
  if (!primary && !secondary) return null;
  return (
    <div
      className={cn(
        "mt-8 flex flex-wrap gap-4",
        centered && "items-center justify-center",
      )}
    >
      {primary && (
        <Button asChild>
          <Link href={primary.href}>{primary.label}</Link>
        </Button>
      )}
      {secondary && (
        <Button asChild variant={onColored ? "outlineLight" : "secondary"}>
          <Link href={secondary.href}>{secondary.label}</Link>
        </Button>
      )}
    </div>
  );
}

function parseTrustItems(html?: string): { value: string; label: string }[] {
  if (!html) {
    return [
      { value: "15+", label: "Years serving newcomers" },
      { value: "2,500+", label: "Families supported annually" },
      { value: "40+", label: "Community partners" },
    ];
  }
  try {
    const parsed = JSON.parse(html) as { value: string; label: string }[];
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // fall through to plain-text fallback
  }
  return [{ value: "—", label: html.replace(/<[^>]*>/g, "") }];
}

function parseValues(html?: string): { title: string; description: string }[] {
  if (!html) {
    return [
      { title: "Dignity", description: "Every person deserves respect and agency in their journey." },
      { title: "Belonging", description: "We build bridges between newcomers and host communities." },
      { title: "Light", description: "Guidance that illuminates pathways to stability and hope." },
    ];
  }
  try {
    const parsed = JSON.parse(html) as { title: string; description: string }[];
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // fall through to plain-text fallback
  }
  return [{ title: "Our values", description: html.replace(/<[^>]*>/g, "") }];
}

function MediaBlock({ media, className }: { media: MediaRef; className?: string }) {
  if (media.type === "video") {
    return (
      <div className={cn("relative aspect-[4/3] overflow-hidden rounded-2xl bg-near-black", className)}>
        <video
          src={media.src}
          controls
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
          aria-label={media.alt}
        />
      </div>
    );
  }

  return (
    <div className={cn("relative aspect-[4/3] overflow-hidden rounded-2xl", className)}>
      <Image
        src={media.src}
        alt={media.alt}
        fill
        className="object-cover"
        sizes="(max-width:1024px) 100vw, 50vw"
      />
    </div>
  );
}

function TrustStrip({ section }: { section: ContentSection }) {
  const items = parseTrustItems(section.bodyHtml);
  return (
    <SectionShell section={{ ...section, theme: "dark" }}>
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 text-center sm:gap-x-10">
        {items.map((item) => (
          <div key={item.label} className="min-w-[8rem]">
            <p className="font-display text-3xl font-bold text-signal-red">{item.value}</p>
            <p className="mt-1 text-sm text-warm-ivory/70">{item.label}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function ValuesGrid({ section }: { section: ContentSection }) {
  const items = parseValues(section.bodyHtml);
  return (
    <SectionShell section={section}>
      <SectionHeading
        eyebrow={section.eyebrow}
        title={section.heading ?? section.internalLabel}
        subtitle={section.subheading}
      />
      {section.media && section.media.length > 0 && (
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {section.media.slice(0, 2).map((item, i) => (
            <MediaBlock key={i} media={item} />
          ))}
        </div>
      )}
      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-border bg-clean-white/60 p-6 backdrop-blur-sm"
          >
            <h3 className="font-display text-xl font-bold">{item.title}</h3>
            <p className="text-muted mt-3 text-sm leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function SplitSection({ section }: { section: ContentSection }) {
  const media = section.media?.[0] as MediaRef | undefined;
  const reversed = section.layout === "media-right";

  return (
    <SectionShell section={section}>
        <div
        className={cn(
          "grid min-w-0 items-center gap-10 lg:grid-cols-2 lg:gap-16",
          reversed && "lg:[&>*:first-child]:order-2",
        )}
      >
        <div>
          <SectionHeading
            eyebrow={section.eyebrow}
            title={section.heading ?? section.internalLabel}
            subtitle={section.subheading}
            theme={section.theme === "dark" ? "dark" : "light"}
          />
          {section.bodyHtml && (
            <div
              className={cn(
                "prose-lfi mt-6",
                section.theme === "dark" && "prose-on-colored",
              )}
              dangerouslySetInnerHTML={{ __html: section.bodyHtml }}
            />
          )}
          <CtaButtons
            primary={section.primaryCta}
            secondary={section.secondaryCta}
            theme={section.theme === "dark" ? "dark" : section.theme === "red" ? "red" : "light"}
          />
        </div>
        {media && <MediaBlock media={media} />}
      </div>
    </SectionShell>
  );
}

function CtaBanner({ section }: { section: ContentSection }) {
  const sectionTheme = section.theme ?? "red";
  const isColored = sectionTheme !== "light";
  return (
    <SectionShell section={{ ...section, theme: sectionTheme }}>
      <div className="mx-auto max-w-3xl text-center">
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.heading ?? section.internalLabel}
          subtitle={section.subheading}
          theme={isColored ? "dark" : "light"}
          align="center"
        />
        {section.bodyHtml && (
          <div
            className="prose-lfi prose-on-colored mx-auto mt-4"
            dangerouslySetInnerHTML={{ __html: section.bodyHtml }}
          />
        )}
        <CtaButtons
          primary={section.primaryCta}
          secondary={section.secondaryCta}
          theme={sectionTheme === "dark" ? "dark" : sectionTheme === "red" ? "red" : "light"}
          centered
        />
      </div>
    </SectionShell>
  );
}

function GenericSection({ section }: { section: ContentSection }) {
  const sectionTheme = section.theme ?? "light";
  const isColored = sectionTheme === "dark" || sectionTheme === "red";

  return (
    <SectionShell section={section}>
      <SectionHeading
        eyebrow={section.eyebrow}
        title={section.heading ?? section.internalLabel}
        subtitle={section.subheading}
        theme={isColored ? "dark" : "light"}
      />
      {section.bodyHtml && (
        <div
          className={cn("prose-lfi mt-8", isColored && "prose-on-colored")}
          dangerouslySetInnerHTML={{ __html: section.bodyHtml }}
        />
      )}
      {section.media && section.media.length > 0 && (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {section.media.map((item, i) => (
            <MediaBlock key={i} media={item} className="aspect-[4/3]" />
          ))}
        </div>
      )}
      <CtaButtons
        primary={section.primaryCta}
        secondary={section.secondaryCta}
        theme={sectionTheme === "dark" ? "dark" : sectionTheme === "red" ? "red" : "light"}
      />
    </SectionShell>
  );
}

function GalleryMosaicSection({ section }: { section: ContentSection }) {
  const fromMedia =
    section.media?.map((item) => ({ src: item.src, alt: item.alt })) ?? [];
  const images = fromMedia.length > 0 ? fromMedia : allGalleryImages().slice(0, 12);

  return (
    <SectionShell section={section}>
      <SectionHeading
        eyebrow={section.eyebrow}
        title={section.heading ?? section.internalLabel}
        subtitle={section.subheading}
        theme={section.theme === "dark" ? "dark" : "light"}
      />
      <GalleryGrid images={images} className="mt-10" />
      <CtaButtons
        primary={section.primaryCta}
        secondary={section.secondaryCta}
        theme={section.theme === "dark" ? "dark" : section.theme === "red" ? "red" : "light"}
      />
    </SectionShell>
  );
}

function VideoShowcaseSection({ section }: { section: ContentSection }) {
  const isDark = section.theme === "dark";
  return (
    <VideoShowcase
      eyebrow={section.eyebrow}
      title={section.heading ?? section.internalLabel}
      subtitle={section.subheading}
      videos={section.media?.length ? section.media : SITE_VIDEOS}
      theme={isDark ? "dark" : "light"}
    />
  );
}

function renderSection(section: ContentSection) {
  if (section.isVisible === false) return null;

  const key = section.key;
  const type = section.type;

  if (key === "trust-strip" || type === "trust-strip" || type === "stats") {
    return <TrustStrip key={key} section={section} />;
  }
  if (key === "core-values" || type === "values" || type === "cards") {
    return <ValuesGrid key={key} section={section} />;
  }
  if (key === "who-we-are" || type === "split" || type === "split-media" || type === "split-editorial" || type === "mission-vision") {
    return <SplitSection key={key} section={section} />;
  }
  if (
    key === "gallery-preview" ||
    type === "gallery-mosaic" ||
    type === "gallery-masonry"
  ) {
    return <GalleryMosaicSection key={key} section={section} />;
  }
  if (type === "video-showcase" || type === "video-grid") {
    return <VideoShowcaseSection key={key} section={section} />;
  }
  if (key === "cta-final" || type === "cta" || type === "cta-band" || type === "banner") {
    return <CtaBanner key={key} section={section} />;
  }
  if (type === "impact-metrics" || key === "impact-metrics") {
    return <TrustStrip key={key} section={section} />;
  }

  return <GenericSection key={key} section={section} />;
}

export function ContentSectionRenderer({
  sections,
  className,
}: ContentSectionRendererProps) {
  const visible = sections
    .map(asSection)
    .filter((s) => s.isVisible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  if (!visible.length) return null;

  return (
    <div className={className}>
      {visible.map((section) => renderSection(section))}
    </div>
  );
}
