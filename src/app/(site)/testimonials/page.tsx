import { getPublishedPage, getPublishedTestimonials } from "@/services/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { HeroCinematic } from "@/components/site/hero-cinematic";
import { TestimonialCarousel } from "@/components/site/testimonial-carousel";
import { Container } from "@/components/ui/container";
import { ContentSectionRenderer } from "@/components/site/content-section-renderer";
import { Button } from "@/components/ui/button";

export async function generateMetadata() {
  const page = await getPublishedPage("testimonials");
  const seo = page?.seo as { metaTitle?: string; metaDescription?: string } | undefined;
  return buildMetadata({ title: seo?.metaTitle ?? "Testimonials", description: seo?.metaDescription, path: "/testimonials" });
}

export default async function TestimonialsPage() {
  const [page, testimonials] = await Promise.all([
    getPublishedPage("testimonials"),
    getPublishedTestimonials(),
  ]);
  const hero = page?.hero as Record<string, string> | undefined;
  const sections = ((page?.sections as Record<string, unknown>[]) ?? []).filter(
    (s) => !["testimonials-intro", "testimonials-slider"].includes(String(s.key)),
  );

  return (
    <>
      <HeroCinematic
        eyebrow={hero?.eyebrow ?? "Voices"}
        heading={hero?.heading ?? "Stories of belonging"}
        subheading={hero?.subheading}
        compact
      />
      <section className="py-16">
        <Container>
          {testimonials.length > 0 ? (
            <TestimonialCarousel testimonials={testimonials} />
          ) : (
            <p className="text-muted text-center">Testimonials will appear here once published in admin.</p>
          )}
        </Container>
      </section>
      <ContentSectionRenderer sections={sections} />
      <section className="py-16 text-center">
        <Container>
          <Button href="/contact">Share your story</Button>
        </Container>
      </section>
    </>
  );
}
