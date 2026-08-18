import { getPublishedPage, getPublishedServices } from "@/services/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { HeroCinematic } from "@/components/site/hero-cinematic";
import { BookingForm } from "@/components/site/booking-form";
import { Container } from "@/components/ui/container";
import { ContentSectionRenderer } from "@/components/site/content-section-renderer";

export async function generateMetadata() {
  const page = await getPublishedPage("booking");
  const seo = page?.seo as { metaTitle?: string; metaDescription?: string } | undefined;
  return buildMetadata({ title: seo?.metaTitle ?? "Booking", description: seo?.metaDescription, path: "/booking" });
}

export default async function BookingPage() {
  const [page, services] = await Promise.all([
    getPublishedPage("booking"),
    getPublishedServices(),
  ]);
  const hero = page?.hero as Record<string, string> | undefined;
  const sections = (page?.sections as Record<string, unknown>[]) ?? [];

  return (
    <>
      <HeroCinematic
        eyebrow={hero?.eyebrow ?? "Booking"}
        heading={hero?.heading ?? "Request a conversation"}
        subheading={hero?.subheading ?? "Share your preferences and our team will follow up. This is not a guaranteed appointment."}
        compact
      />
      <section className="py-16">
        <Container>
          <div className="mx-auto max-w-2xl rounded-3xl border bg-white p-8">
            <BookingForm
              services={services.map((s) => ({
                _id: String(s._id),
                title: String(s.title),
              }))}
            />
          </div>
        </Container>
      </section>
      <ContentSectionRenderer sections={sections} />
    </>
  );
}
