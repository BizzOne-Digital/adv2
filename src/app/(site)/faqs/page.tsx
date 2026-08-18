import Image from "next/image";
import { getPublishedPage, getPublishedFAQs, getSiteSettings } from "@/services/content";
import { buildMetadata, faqPageJsonLd } from "@/lib/seo/metadata";
import { siteImagePath } from "@/lib/media/site-assets";
import { HeroCinematic } from "@/components/site/hero-cinematic";
import { FAQAccordion } from "@/components/site/faq-accordion";
import { Container } from "@/components/ui/container";
import { ContentSectionRenderer } from "@/components/site/content-section-renderer";
import { Button } from "@/components/ui/button";

export async function generateMetadata() {
  const page = await getPublishedPage("faqs");
  const seo = page?.seo as { metaTitle?: string; metaDescription?: string } | undefined;
  return buildMetadata({ title: seo?.metaTitle ?? "FAQs", description: seo?.metaDescription, path: "/faqs" });
}

export default async function FAQsPage() {
  const [page, faqData] = await Promise.all([getPublishedPage("faqs"), getPublishedFAQs()]);
  const hero = page?.hero as Record<string, string> | undefined;
  const sections = (page?.sections as Record<string, unknown>[]) ?? [];
  const jsonLd = faqPageJsonLd(
    faqData.faqs.map((f) => ({
      question: String(f.question),
      answerHtml: String(f.answerHtml),
    })),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HeroCinematic
        eyebrow={hero?.eyebrow ?? "Help"}
        heading={hero?.heading ?? "Frequently asked questions"}
        subheading={hero?.subheading}
        compact
      />
      <section className="py-16">
        <Container>
          <FAQAccordion
            faqs={faqData.faqs.map((f) => ({
              _id: String(f._id),
              question: String(f.question),
              answerHtml: String(f.answerHtml),
              slug: String(f.slug),
              categoryId: String(f.categoryId),
            }))}
            categories={faqData.categories.map((c) => ({
              _id: String(c._id),
              name: String(c.name),
            }))}
          />
        </Container>
      </section>
      <section className="py-8">
        <Container>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            {[6, 10, 14, 18, 22].map((n) => (
              <div key={n} className="relative aspect-[4/3] overflow-hidden rounded-xl">
                <Image src={siteImagePath(n)} alt="" fill className="object-cover" />
              </div>
            ))}
          </div>
        </Container>
      </section>
      <ContentSectionRenderer sections={sections} />
      <section className="section-red py-16 text-center">
        <Container>
          <h2 className="font-display text-3xl font-bold">Still need help?</h2>
          <Button href="/contact" className="mt-6">Contact our team</Button>
        </Container>
      </section>
    </>
  );
}
