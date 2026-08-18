import { cmsPageMetadata, CmsPageView } from "@/components/site/cms-page-view";
import { getPricingCards } from "@/services/content";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { sanitizeRichText } from "@/lib/validation/sanitize";

export async function generateMetadata() {
  return cmsPageMetadata("pricing");
}

export default async function PricingPage() {
  const cards = await getPricingCards();

  return (
    <>
      <CmsPageView slug="pricing" />
      <section className="py-16">
        <Container>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => (
              <article key={String(card._id)} className="rounded-2xl border bg-white p-6">
                <h2 className="font-display text-xl font-bold">{String(card.title)}</h2>
                <div
                  className="prose-lfi mt-3 text-sm"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeRichText(String(card.descriptionHtml ?? "")),
                  }}
                />
                <p className="mt-4 font-semibold text-signal-red">Contact for details</p>
                <Button
                  href={String(card.ctaHref ?? "/contact")}
                  variant="secondary"
                  className="mt-4"
                >
                  {String(card.ctaLabel ?? "Contact us")}
                </Button>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
