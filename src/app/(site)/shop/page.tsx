import { cmsPageMetadata, CmsPageView } from "@/components/site/cms-page-view";
import { getPublishedProducts } from "@/services/content";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";

export async function generateMetadata() {
  return cmsPageMetadata("shop");
}

export default async function ShopPage() {
  const products = await getPublishedProducts();

  return (
    <>
      <CmsPageView slug="shop" />
      <section className="py-16">
        <Container>
          {products.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => {
                const image = (product.images as { src?: string; alt?: string }[])?.[0];
                return (
                  <Link key={String(product._id)} href={`/shop/${product.slug}`} className="group rounded-2xl border bg-white overflow-hidden">
                    <div className="relative aspect-square">
                      <Image src={image?.src ?? "/placeholders/community-4.svg"} alt={image?.alt ?? String(product.title)} fill className="object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="p-4">
                      <h2 className="font-display font-bold">{String(product.title)}</h2>
                      {product.priceText ? (
                        <p className="text-muted text-sm mt-1">{String(product.priceText)}</p>
                      ) : null}
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-muted text-center">Products will appear here once published in admin.</p>
          )}
        </Container>
      </section>
    </>
  );
}
