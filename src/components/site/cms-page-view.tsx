import { notFound } from "next/navigation";
import { getPublishedPage, getSiteSettings } from "@/services/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { HeroCinematic } from "@/components/site/hero-cinematic";
import { ContentSectionRenderer } from "@/components/site/content-section-renderer";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export async function cmsPageMetadata(slug: string) {
  const page = await getPublishedPage(slug);
  if (!page) return {};
  const seo = page.seo as { metaTitle?: string; metaDescription?: string } | undefined;
  return buildMetadata({
    title: seo?.metaTitle ?? String(page.title),
    description: seo?.metaDescription,
    path: `/${slug}`,
  });
}

export async function CmsPageView({ slug }: { slug: string }) {
  const [page, settings] = await Promise.all([
    getPublishedPage(slug),
    getSiteSettings(),
  ]);
  if (!page) notFound();

  const hero = page.hero as Record<string, string> | undefined;
  const sections = (page.sections as Record<string, unknown>[]) ?? [];
  const actions = settings.actions as { donationUrl?: string } | undefined;

  return (
    <>
      <HeroCinematic
        eyebrow={hero?.eyebrow}
        heading={hero?.heading ?? String(page.title)}
        subheading={hero?.subheading}
        primaryCta={
          slug === "donate" && actions?.donationUrl
            ? { label: "Donate", href: actions.donationUrl }
            : slug === "get-involved"
              ? { label: "Volunteer", href: "/contact?topic=Volunteer" }
              : undefined
        }
        secondaryCta={
          slug === "donate" || slug === "get-involved"
            ? { label: "Contact us", href: "/contact" }
            : undefined
        }
        compact={slug === "privacy" || slug === "terms"}
      />
      <ContentSectionRenderer sections={sections} />
      {slug === "donate" && !actions?.donationUrl && (
        <section className="py-16">
          <Container className="text-center">
            <p className="text-muted mb-6">Donation link can be configured in Settings.</p>
            <Button href="/contact">Contact us to give</Button>
          </Container>
        </section>
      )}
    </>
  );
}
