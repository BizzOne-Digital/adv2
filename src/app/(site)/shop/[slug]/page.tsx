import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getProductBySlug, getPublishedProducts } from "@/services/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { sanitizeRichText } from "@/lib/validation/sanitize";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return buildMetadata({
    title: String(product.title),
    description: String(product.summary),
    path: `/shop/${slug}`,
  });
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const images = (product.images as { src?: string; alt?: string }[]) ?? [];

  return (
    <section className="py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="grid gap-4">
            {images.map((img, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-2xl">
                <Image src={img.src ?? "/placeholders/community-4.svg"} alt={img.alt ?? String(product.title)} fill className="object-cover" />
              </div>
            ))}
          </div>
          <div>
            <h1 className="font-display text-4xl font-bold">{String(product.title)}</h1>
            {product.priceText ? (
              <p className="mt-2 text-lg">{String(product.priceText)}</p>
            ) : null}
            <div className="prose-lfi mt-6" dangerouslySetInnerHTML={{ __html: sanitizeRichText(String(product.descriptionHtml ?? product.summary ?? "")) }} />
            <Button href={`/contact?topic=Product: ${product.title}`} className="mt-8">
              Ask about this item
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
