import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, ChevronRight, MapPin } from "lucide-react";
import { getEventBySlug } from "@/services/content";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo/metadata";
import { formatEventDate } from "@/lib/events/format";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { sanitizeRichText } from "@/lib/validation/sanitize";
import { siteImagePath } from "@/lib/media/site-assets";
import type { MediaRef } from "@/types";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return {};
  const seo = event.seo as { metaTitle?: string; metaDescription?: string } | undefined;
  return buildMetadata({
    title: seo?.metaTitle ?? String(event.title),
    description: seo?.metaDescription ?? String(event.shortDescription),
    path: `/events/${slug}`,
    image: (event.image as MediaRef | undefined)?.src,
  });
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const title = String(event.title ?? "Event");
  const image = event.image as MediaRef | undefined;
  const startDate = event.startDate ? new Date(String(event.startDate)) : null;
  const isPast = startDate ? startDate < new Date() : false;

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Events", path: "/events" },
    { name: title, path: `/events/${slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <section className="bg-near-black text-warm-ivory">
        <Container className="py-6 pt-24 sm:pt-28 lg:pb-12">
          <nav
            className="mb-8 flex flex-wrap items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-warm-ivory/55"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="transition hover:text-warm-ivory">Home</Link>
            <ChevronRight className="size-3.5 opacity-50" aria-hidden />
            <Link href="/events" className="transition hover:text-warm-ivory">Events</Link>
            <ChevronRight className="size-3.5 opacity-50" aria-hidden />
            <span className="text-warm-ivory/80 line-clamp-1">{title}</span>
          </nav>

          <div className="grid min-w-0 items-start gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              {isPast && (
                <span className="mb-4 inline-block rounded-full bg-warm-ivory/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-warm-ivory/80">
                  Past event
                </span>
              )}
              {event.isFree ? (
                <span className="mb-4 ml-2 inline-block rounded-full bg-signal-red px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                  Free event
                </span>
              ) : null}
              <h1 className="font-display text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {title}
              </h1>
              {event.shortDescription ? (
                <p className="mt-6 text-lg leading-relaxed text-warm-ivory/80">
                  {String(event.shortDescription)}
                </p>
              ) : null}

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {startDate && (
                  <div className="rounded-2xl border border-warm-ivory/15 bg-warm-ivory/5 p-4">
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-accent-gold">
                      <Calendar className="size-4" aria-hidden />
                      Date & time
                    </p>
                    <p className="mt-2 font-display text-lg font-bold">
                      {formatEventDate(startDate)}
                    </p>
                    {event.startTime ? (
                      <p className="mt-1 text-sm text-warm-ivory/75">{String(event.startTime)}</p>
                    ) : null}
                  </div>
                )}
                {event.location ? (
                  <div className="rounded-2xl border border-warm-ivory/15 bg-warm-ivory/5 p-4">
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-accent-gold">
                      <MapPin className="size-4" aria-hidden />
                      Location
                    </p>
                    <p className="mt-2 font-display text-lg font-bold">{String(event.location)}</p>
                    {event.address ? (
                      <p className="mt-1 text-sm text-warm-ivory/75">{String(event.address)}</p>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild size="lg">
                  <Link href="/contact">{isPast ? "Ask about next events" : "Register interest"}</Link>
                </Button>
                <Button asChild variant="outlineLight" size="lg">
                  <Link href="/events">All events</Link>
                </Button>
              </div>
            </div>

            <div className="relative min-w-0 overflow-hidden rounded-2xl border border-warm-ivory/10 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
              <div className="relative aspect-[4/5] sm:aspect-[3/4]">
                <Image
                  src={image?.src ?? siteImagePath(6)}
                  alt={image?.alt ?? title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {event.descriptionHtml ? (
        <section className="py-12 sm:py-16">
          <Container>
            <div
              className="prose-lfi mx-auto max-w-3xl"
              dangerouslySetInnerHTML={{
                __html: sanitizeRichText(String(event.descriptionHtml)),
              }}
            />
          </Container>
        </section>
      ) : null}
    </>
  );
}
