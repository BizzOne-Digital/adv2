import { getPublishedPage } from "@/services/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { HeroCinematic } from "@/components/site/hero-cinematic";
import { GalleryGrid } from "@/components/site/gallery-grid";
import { VideoShowcase } from "@/components/site/video-showcase";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { allGalleryImages } from "@/lib/media/site-assets";

export async function generateMetadata() {
  const page = await getPublishedPage("gallery");
  const seo = page?.seo as { metaTitle?: string; metaDescription?: string } | undefined;
  return buildMetadata({
    title: seo?.metaTitle ?? "Gallery",
    description: seo?.metaDescription,
    path: "/gallery",
  });
}

export default async function GalleryPage() {
  const page = await getPublishedPage("gallery");
  const hero = page?.hero as Record<string, string> | undefined;
  const images = allGalleryImages();

  return (
    <>
      <HeroCinematic
        eyebrow={hero?.eyebrow ?? "Community gallery"}
        heading={hero?.heading ?? "Moments of connection and celebration"}
        subheading={
          hero?.subheading ??
          "Photos and videos from programs, welcome days, workshops, and volunteer initiatives across Ontario."
        }
        compact
      />

      <section className="section-ivory py-16 lg:py-20">
        <Container>
          <SectionHeading
            eyebrow="Photo gallery"
            title="Community in focus"
            subtitle="Browse real moments from Light for Immigrants programs and gatherings."
          />
          <GalleryGrid images={images} className="mt-12" />
        </Container>
      </section>

      <VideoShowcase
        eyebrow="Video highlights"
        title="Stories in motion"
        subtitle="Watch highlights from welcome days, workshops, and community events."
        theme="dark"
      />
    </>
  );
}
