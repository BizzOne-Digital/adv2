import { notFound } from "next/navigation";
import {
  getPublishedPage,
  getPublishedServices,
  getServiceCategories,
} from "@/services/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { HeroCinematic } from "@/components/site/hero-cinematic";
import { ContentSectionRenderer } from "@/components/site/content-section-renderer";
import { ServiceCard } from "@/components/site/service-card";
import { Suspense } from "react";
import { ServicesFilter } from "@/components/site/services-filter";
import { Container } from "@/components/ui/container";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";

export async function generateMetadata() {
  const page = await getPublishedPage("services");
  const seo = page?.seo as { metaTitle?: string; metaDescription?: string } | undefined;
  return buildMetadata({
    title: seo?.metaTitle ?? "Services",
    description: seo?.metaDescription,
    path: "/services",
  });
}

type Props = {
  searchParams: Promise<{ category?: string; q?: string }>;
};

export default async function ServicesPage({ searchParams }: Props) {
  const params = await searchParams;
  const [page, services, categories] = await Promise.all([
    getPublishedPage("services"),
    getPublishedServices({
      category: params.category,
      search: params.q,
    }),
    getServiceCategories(),
  ]);

  if (!page) notFound();

  const hero = page.hero as Record<string, string> | undefined;
  const sections = (page.sections as Record<string, unknown>[]) ?? [];
  const introSection = sections.find((s) => s.key === "intro");
  const footerSections = sections.filter(
    (s) =>
      !["intro", "category-filters", "services-grid"].includes(String(s.key)),
  );

  return (
    <>
      <HeroCinematic
        eyebrow={hero?.eyebrow ?? "Programs & Services"}
        heading={hero?.heading ?? "Support for every stage of your journey"}
        subheading={hero?.subheading}
        compact
      />
      {introSection && <ContentSectionRenderer sections={[introSection]} />}
      <section className="section-ivory py-12 sm:py-16">
        <Container>
          <Suspense fallback={<div className="h-12 animate-pulse rounded-full bg-white" />}>
            <ServicesFilter categories={categories} />
          </Suspense>
          <div className="mt-10 grid min-w-0 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service, i) => (
              <RevealOnScroll key={String(service._id)} animation="stagger" delay={i * 0.06}>
                <ServiceCard service={service} />
              </RevealOnScroll>
            ))}
          </div>
          {services.length === 0 && (
            <p className="text-muted py-12 text-center">No services match your filters.</p>
          )}
        </Container>
      </section>
      <ContentSectionRenderer sections={footerSections} />
    </>
  );
}
