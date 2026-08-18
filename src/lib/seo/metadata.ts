import { revalidatePath, revalidateTag } from "next/cache";
import { getEnv } from "@/lib/env";
import type { Metadata } from "next";

export const CACHE_TAGS = {
  settings: "site-settings",
  pages: "pages",
  services: "services",
  gallery: "gallery",
  testimonials: "testimonials",
  faqs: "faqs",
  team: "team",
  blog: "blog",
  products: "products",
  pricing: "pricing",
} as const;

export function revalidateContent(tags: string[] = [], paths: string[] = []) {
  tags.forEach((tag) => revalidateTag(tag, "max"));
  paths.forEach((p) => revalidatePath(p));
  revalidatePath("/", "layout");
}

export function buildMetadata(options: {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
  noIndex?: boolean;
  type?: "website" | "article";
}): Metadata {
  const { siteUrl } = getEnv();
  const title = options.title
    ? `${options.title} | Light for Immigrants`
    : "Light for Immigrants | Supporting Immigrants in Ontario";
  const description =
    options.description ??
    "Light for Immigrants is a not-for-profit organization in Ontario dedicated to supporting immigrants and Canadian communities through programs, services, and advocacy.";
  const url = options.path ? `${siteUrl}${options.path}` : siteUrl;
  const image = options.image
    ? options.image.startsWith("http")
      ? options.image
      : `${siteUrl}${options.image}`
    : `${siteUrl}/logo.png`;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: options.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      url,
      siteName: "Light for Immigrants",
      images: [{ url: image }],
      type: options.type ?? "website",
      locale: "en_CA",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export function organizationJsonLd(settings: Record<string, unknown>) {
  const { siteUrl } = getEnv();
  const contact = settings.contact as Record<string, string> | undefined;
  const general = settings.general as Record<string, string> | undefined;
  const branding = settings.branding as Record<string, unknown> | undefined;

  return {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: general?.organizationName ?? "Light for Immigrants",
    description: general?.shortDescription,
    url: siteUrl,
    logo: branding?.logo
      ? `${siteUrl}${branding.logo}`
      : `${siteUrl}/logo.png`,
    email: contact?.primaryEmail,
    telephone: contact?.phone,
    address: contact?.address
      ? {
          "@type": "PostalAddress",
          streetAddress: contact.address,
          addressCountry: "CA",
        }
      : undefined,
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
) {
  const { siteUrl } = getEnv();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}

export function faqPageJsonLd(
  faqs: { question: string; answerHtml: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answerHtml.replace(/<[^>]*>/g, " "),
      },
    })),
  };
}

export function articleJsonLd(post: Record<string, unknown>) {
  const { siteUrl } = getEnv();
  const cover = post.coverImage as { src?: string } | undefined;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt ?? post.createdAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Organization",
      name: post.author ?? "Light for Immigrants",
    },
    image: cover?.src ? `${siteUrl}${cover.src}` : undefined,
    url: `${siteUrl}/blog/${post.slug}`,
  };
}
