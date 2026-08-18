import { getPublishedPage, getSiteSettings } from "@/services/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { HeroCinematic } from "@/components/site/hero-cinematic";
import { ContactForm } from "@/components/site/contact-form";
import { Container } from "@/components/ui/container";
import { ContentSectionRenderer } from "@/components/site/content-section-renderer";
import { Mail, MapPin, Phone } from "lucide-react";

type Props = { searchParams: Promise<{ topic?: string }> };

export async function generateMetadata() {
  const page = await getPublishedPage("contact");
  const seo = page?.seo as { metaTitle?: string; metaDescription?: string } | undefined;
  return buildMetadata({ title: seo?.metaTitle ?? "Contact", description: seo?.metaDescription, path: "/contact" });
}

export default async function ContactPage({ searchParams }: Props) {
  const params = await searchParams;
  const [page, settings] = await Promise.all([
    getPublishedPage("contact"),
    getSiteSettings(),
  ]);
  const hero = page?.hero as Record<string, string> | undefined;
  const sections = (page?.sections as Record<string, unknown>[]) ?? [];
  const contact = settings.contact as Record<string, string> | undefined;

  return (
    <>
      <HeroCinematic
        eyebrow={hero?.eyebrow ?? "Contact"}
        heading={hero?.heading ?? "We are here to listen"}
        subheading={hero?.subheading}
        compact
      />
      <section className="py-16">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5 space-y-6">
              {contact?.primaryEmail && (
                <div className="flex gap-4 rounded-2xl border bg-white p-5">
                  <Mail className="text-signal-red" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <a href={`mailto:${contact.primaryEmail}`}>{contact.primaryEmail}</a>
                  </div>
                </div>
              )}
              {contact?.phone && (
                <div className="flex gap-4 rounded-2xl border bg-white p-5">
                  <Phone className="text-signal-red" />
                  <div>
                    <p className="font-semibold">Phone</p>
                    <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>{contact.phone}</a>
                  </div>
                </div>
              )}
              {contact?.address && (
                <div className="flex gap-4 rounded-2xl border bg-white p-5">
                  <MapPin className="text-signal-red" />
                  <div>
                    <p className="font-semibold">Address</p>
                    <p>{contact.address}</p>
                    {contact.mapsUrl && (
                      <a href={contact.mapsUrl} className="text-signal-red text-sm" target="_blank" rel="noopener noreferrer">
                        View map
                      </a>
                    )}
                  </div>
                </div>
              )}
              <p className="text-muted text-sm">
                Information and referrals shared here do not replace legal advice from a licensed professional.
              </p>
            </div>
            <div className="lg:col-span-7 rounded-3xl border bg-white p-8">
              <ContactForm defaultTopic={params.topic} />
            </div>
          </div>
        </Container>
      </section>
      <ContentSectionRenderer sections={sections} />
    </>
  );
}
