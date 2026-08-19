import {
  getPublishedPage,
  getPublishedServices,
  getPublishedTestimonials,
  getUpcomingEvents,
} from "@/services/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { HomeHero } from "@/components/site/home-hero";
import { ContentSectionRenderer } from "@/components/site/content-section-renderer";
import { ServiceCard } from "@/components/site/service-card";
import { TestimonialCarousel } from "@/components/site/testimonial-carousel";
import { JourneyScrolly } from "@/components/site/journey-scrolly";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { pickSiteImages, siteVideosAsMedia } from "@/lib/media/site-assets";
import { BbqFestivalSection } from "@/components/site/bbq-festival-section";
import { FarmShowTripSection } from "@/components/site/farm-show-trip-section";
import { OrganizationFlyerSection } from "@/components/site/organization-flyer-section";
import { UpcomingEventsSection } from "@/components/site/upcoming-events-section";

export async function generateMetadata() {
  const page = await getPublishedPage("home");
  const seo = page?.seo as { metaTitle?: string; metaDescription?: string } | undefined;
  return buildMetadata({
    title: seo?.metaTitle ?? "Home",
    description: seo?.metaDescription,
    path: "/",
  });
}

export default async function HomePage() {
  const [page, services, testimonials, upcomingEvents] = await Promise.all([
    getPublishedPage("home"),
    getPublishedServices({ featured: true }),
    getPublishedTestimonials(6),
    getUpcomingEvents(6),
  ]);

  const hero = page?.hero as Record<string, string> | undefined;
  const sections = (page?.sections as Record<string, unknown>[]) ?? [];
  const featuredServices = services.slice(0, 6);

  const impactSection = sections.find((s) => s.key === "impact-metrics");
  const trustSection = sections.find((s) => s.key === "trust-strip");

  const gallerySection =
    sections.find((s) => s.key === "gallery-preview" && s.isVisible !== false) ?? {
      key: "gallery-preview",
      type: "gallery-mosaic",
      internalLabel: "Gallery preview",
      eyebrow: "Community moments",
      heading: "See the light in action",
      primaryCta: { label: "View gallery", href: "/gallery" },
      media: pickSiteImages(9, 3),
      theme: "dark",
      isVisible: true,
      order: 6,
    };

  const videoSection =
    sections.find((s) => s.key === "community-videos" && s.isVisible !== false) ?? {
      key: "community-videos",
      type: "video-showcase",
      internalLabel: "Community videos",
      eyebrow: "See us in action",
      heading: "Moments from our community",
      subheading: "Highlights from welcome days, workshops, and gatherings across Ontario.",
      media: siteVideosAsMedia(),
      theme: "ivory",
      isVisible: true,
      order: 7,
    };

  return (
    <>
      <HomeHero
        eyebrow={hero?.eyebrow ?? "Ontario, Canada • Supporting every new beginning"}
        heading={hero?.heading ?? "A brighter beginning starts here."}
        subheading={
          hero?.subheading ??
          "Guidance, community and practical support for immigrants building a new life in Canada."
        }
        primaryCta={{ label: "Get Support", href: "/contact" }}
        secondaryCta={{ label: "Explore our services", href: "/services" }}
        backgroundImage={hero?.backgroundImage ?? "/images/hero-background.png"}
        backgroundImageAlt={hero?.backgroundImageAlt ?? "Community looking toward Toronto skyline"}
      />

      <div id="home-content" className="home-content-anchor">
        {trustSection && <ContentSectionRenderer sections={[trustSection]} />}

        <ContentSectionRenderer
          sections={sections.filter((s) =>
            ["who-we-are", "core-values"].includes(String(s.key)),
          )}
        />

        <OrganizationFlyerSection />

        <FarmShowTripSection />

        <UpcomingEventsSection events={upcomingEvents} />

        <BbqFestivalSection />

        <section className="section-ivory py-12 sm:py-16 lg:py-24">
          <Container>
            <RevealOnScroll animation="from-left">
              <SectionHeading
                eyebrow="Programs & Services"
                title="Support tailored to your journey"
                subtitle="Explore community-led programs designed for newcomers, families, youth, and seniors."
              />
            </RevealOnScroll>
            <div className="mt-12 grid min-w-0 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {featuredServices.map((service, i) => (
                <RevealOnScroll key={String(service._id)} animation="stagger" delay={i * 0.08}>
                  <ServiceCard service={service} />
                </RevealOnScroll>
              ))}
            </div>
            <div className="mt-10">
              <Button asChild variant="secondary">
                <Link href="/services">View all services</Link>
              </Button>
            </div>
          </Container>
        </section>

        {impactSection && <ContentSectionRenderer sections={[impactSection]} />}

        <JourneyScrolly
          section={
            sections.find((s) => s.key === "journey") ?? {
              key: "journey",
              type: "journey",
              internalLabel: "Journey",
              heading: "From Arrival to Belonging",
              isVisible: true,
              order: 5,
            }
          }
        />

        <ContentSectionRenderer sections={[gallerySection, videoSection]} />

        {testimonials.length > 0 && (
          <section className="section-ivory py-12 sm:py-16 lg:py-24">
            <Container>
              <SectionHeading
                eyebrow="Voices"
                title="Stories from our community"
                subtitle="Reflections shared with permission from participants and partners."
              />
              <div className="mt-12">
                <TestimonialCarousel testimonials={testimonials} />
              </div>
            </Container>
          </section>
        )}

        <ContentSectionRenderer
          sections={sections.filter(
            (s) =>
              (s.key === "cta-final" || s.key === "get-support-cta" || s.type === "cta-band") &&
              s.isVisible !== false,
          )}
        />
      </div>
    </>
  );
}
