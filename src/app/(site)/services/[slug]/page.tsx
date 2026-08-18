import { notFound } from "next/navigation";
import { getServiceBySlug, getPublishedServices } from "@/services/content";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo/metadata";
import { ServiceDetailView } from "@/components/site/service-detail-view";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};
  const seo = service.seo as { metaTitle?: string; metaDescription?: string } | undefined;
  return buildMetadata({
    title: seo?.metaTitle ?? String(service.title),
    description: seo?.metaDescription ?? String(service.shortDescription),
    path: `/services/${slug}`,
  });
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const relatedServices = await getPublishedServices();

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: String(service.title), path: `/services/${slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <ServiceDetailView service={service} relatedServices={relatedServices} />
    </>
  );
}
