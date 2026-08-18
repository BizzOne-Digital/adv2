import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Calendar,
  ChevronRight,
  CircleCheck,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServiceCard } from "@/components/site/service-card";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { sanitizeRichText } from "@/lib/validation/sanitize";
import {
  GALLERY_IMAGE_NUMBERS,
  siteImageRef,
} from "@/lib/media/site-assets";
import type { CtaLink, MediaRef, ServiceOfferItem, ServiceProcessStep } from "@/types";

type DetailSection = {
  key: string;
  title: string;
  bodyHtml?: string;
  media?: MediaRef[];
  isVisible?: boolean;
  order?: number;
};

type ServiceDetailViewProps = {
  service: Record<string, unknown>;
  relatedServices: Array<Record<string, unknown>>;
};

function getSectionMedia(
  sections: DetailSection[],
  key: string,
): MediaRef | undefined {
  const section = sections.find((s) => s.key === key);
  return section?.media?.[0];
}

function slugImageSlot(slug: string, offset: number): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash += slug.charCodeAt(i);
  return (hash + offset) % GALLERY_IMAGE_NUMBERS.length;
}

function ensureMedia(
  media: MediaRef | undefined,
  slug: string,
  offset: number,
  alt: string,
): MediaRef {
  if (media?.src) return media;
  return siteImageRef(GALLERY_IMAGE_NUMBERS[slugImageSlot(slug, offset)], alt);
}

function pickRelated(
  all: Array<Record<string, unknown>>,
  currentSlug: string,
  category: string,
) {
  const others = all.filter((s) => String(s.slug) !== currentSlug);
  const sameCategory = others.filter((s) => String(s.category) === category);
  const rest = others.filter((s) => String(s.category) !== category);
  return [...sameCategory, ...rest].slice(0, 3);
}

export function ServiceDetailView({
  service,
  relatedServices,
}: ServiceDetailViewProps) {
  const slug = String(service.slug ?? "");
  const title = String(service.title ?? "Service");
  const category = String(service.category ?? "");
  const shortDescription = String(service.shortDescription ?? "");
  const featured = Boolean(service.featured);

  const hero = service.hero as Record<string, unknown> | undefined;
  const cardImage = service.cardImage as MediaRef | undefined;
  const heroMedia = hero?.media as MediaRef | undefined;
  const heroImage = ensureMedia(
    cardImage ?? heroMedia,
    slug,
    0,
    `${title} — community program`,
  );

  const cta = service.cta as CtaLink | undefined;
  const detailSections = (service.detailSections as DetailSection[]) ?? [];
  const offerItems = (service.offerItems as ServiceOfferItem[]) ?? [];
  const processSteps = (service.processSteps as ServiceProcessStep[]) ?? [];

  const benefitsHtml = service.benefitsHtml ? String(service.benefitsHtml) : "";
  const eligibilityHtml = service.eligibilityHtml
    ? String(service.eligibilityHtml)
    : "";

  const overviewMedia = ensureMedia(
    getSectionMedia(detailSections, "overview"),
    slug,
    1,
    `${title} — program overview`,
  );
  const offersMedia = ensureMedia(
    getSectionMedia(detailSections, "offers"),
    slug,
    2,
    `${title} — what we offer`,
  );
  const benefitsMedia = ensureMedia(
    getSectionMedia(detailSections, "benefits"),
    slug,
    3,
    `${title} — program benefits`,
  );
  const eligibilityMedia = ensureMedia(
    getSectionMedia(detailSections, "eligibility"),
    slug,
    4,
    `${title} — who this is for`,
  );
  const processMedia = ensureMedia(
    getSectionMedia(detailSections, "process"),
    slug,
    5,
    `${title} — what to expect`,
  );

  const galleryImages = [
    overviewMedia,
    offersMedia,
    benefitsMedia,
    processMedia,
  ].filter((img, idx, arr) => arr.findIndex((m) => m.src === img.src) === idx);
  const related = pickRelated(relatedServices, slug, category);

  const bookHref = cta?.href ?? "/booking";
  const bookLabel = cta?.label ?? "Book support";

  return (
    <>
      {/* Hero */}
      <section className="relative w-full max-w-full overflow-hidden bg-near-black text-warm-ivory">
        <div className="absolute inset-0 lg:w-[55%]">
          <div className="hero-brand-gradient absolute inset-0" aria-hidden />
          <div className="hero-brand-gradient-glow absolute inset-0" aria-hidden />
          <div
            className="absolute inset-0 bg-gradient-to-t from-near-black via-near-black/60 to-near-black/30"
            aria-hidden
          />
          <div className="grain-overlay absolute inset-0 opacity-20" aria-hidden />
        </div>

        <Container className="relative z-10 w-full min-w-0 py-6 pt-24 sm:pt-28 lg:pb-0">
          <nav
            className="mb-8 flex flex-wrap items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-warm-ivory/55"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="transition hover:text-warm-ivory">
              Home
            </Link>
            <ChevronRight className="size-3.5 opacity-50" aria-hidden />
            <Link href="/services" className="transition hover:text-warm-ivory">
              Services
            </Link>
            <ChevronRight className="size-3.5 opacity-50" aria-hidden />
            <span className="text-warm-ivory/80 line-clamp-1">{title}</span>
          </nav>

          <div className="grid min-w-0 items-end gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="min-w-0 lg:col-span-6 lg:pb-16 xl:col-span-5">
              <div className="flex flex-wrap items-center gap-3">
                {category && (
                  <span className="rounded-full border border-warm-ivory/25 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-gold">
                    {category}
                  </span>
                )}
                {featured && (
                  <span className="rounded-full bg-signal-red px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
                    Featured program
                  </span>
                )}
              </div>

              <h1 className="font-display mt-5 text-balance text-[2rem] font-bold tracking-tight sm:text-4xl lg:text-5xl xl:text-6xl">
                {String(hero?.heading ?? title)}
              </h1>

              {(hero?.introduction || shortDescription) && (
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-warm-ivory/80">
                  {String(hero?.introduction ?? shortDescription)}
                </p>
              )}

              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild size="lg">
                  <Link href={bookHref}>{bookLabel}</Link>
                </Button>
                <Button asChild variant="outlineLight" size="lg">
                  <Link href="/contact">Ask a question</Link>
                </Button>
              </div>
            </div>

            {heroImage.src && (
              <div className="relative min-w-0 lg:col-span-6 xl:col-span-7">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl lg:aspect-auto lg:min-h-[26rem] lg:rounded-none lg:rounded-tl-3xl">
                  <Image
                    src={heroImage.src}
                    alt={heroImage.alt ?? title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-near-black/50 via-transparent to-transparent lg:bg-gradient-to-l lg:from-near-black/40 lg:via-transparent lg:to-transparent"
                    aria-hidden
                  />
                </div>
              </div>
            )}
          </div>
        </Container>

        <div
          className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-signal-red to-transparent opacity-80"
          aria-hidden
        />
      </section>

      {/* Overview + sidebar */}
      <section className="section-ivory py-12 sm:py-16 lg:py-24">
        <Container className="min-w-0">
          <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="min-w-0 lg:col-span-7">
              <RevealOnScroll animation="from-left">
                <SectionHeading
                  eyebrow="About this program"
                  title="How we support you"
                  subtitle={
                    shortDescription && service.overviewHtml
                      ? undefined
                      : shortDescription || undefined
                  }
                />
                {service.overviewHtml ? (
                  <div
                    className="prose-lfi mt-8"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeRichText(String(service.overviewHtml)),
                    }}
                  />
                ) : null}
              </RevealOnScroll>
              <RevealOnScroll animation="mask-reveal" className="mt-10 lg:hidden">
                <MediaFrame
                  src={overviewMedia.src}
                  alt={overviewMedia.alt}
                  priority={false}
                />
              </RevealOnScroll>
            </div>

            <aside className="min-w-0 lg:col-span-5">
              <RevealOnScroll animation="mask-reveal" className="mb-6 hidden lg:block">
                <MediaFrame
                  src={overviewMedia.src}
                  alt={overviewMedia.alt}
                  className="shadow-[0_16px_40px_rgba(9,9,9,0.1)]"
                />
              </RevealOnScroll>
              <RevealOnScroll animation="from-right">
                <div className="space-y-6 lg:sticky lg:top-28">
                  {offerItems.length > 0 && (
                    <div className="rounded-2xl border border-border bg-clean-white p-6 shadow-[0_20px_50px_rgba(9,9,9,0.06)]">
                      <h2 className="font-display text-xl font-bold text-near-black">
                        What we offer
                      </h2>
                      <ul className="mt-5 space-y-4">
                        {offerItems.map((item) => (
                          <li key={item.title} className="flex gap-3">
                            <CircleCheck
                              className="mt-0.5 size-5 shrink-0 text-signal-red"
                              aria-hidden
                            />
                            <div>
                              <p className="font-semibold text-near-black">
                                {item.title}
                              </p>
                              {item.description && (
                                <p className="text-muted mt-1 text-sm leading-relaxed">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="rounded-2xl border border-border bg-near-black p-6 text-warm-ivory">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-gold">
                      Get started
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-warm-ivory/75">
                      Tell us about your situation and we will help you find the
                      right next step — no pressure, no guarantees about outcomes.
                    </p>
                    <div className="mt-6 flex flex-col gap-3">
                      <Button asChild className="w-full">
                        <Link href={bookHref}>
                          <Calendar className="size-4" aria-hidden />
                          {bookLabel}
                        </Link>
                      </Button>
                      <Button asChild variant="outlineLight" className="w-full">
                        <Link href="/contact">
                          <Mail className="size-4" aria-hidden />
                          Contact us
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            </aside>
          </div>
        </Container>
      </section>

      {/* Benefits */}
      {benefitsHtml && (
        <section className="py-12 sm:py-16 lg:py-24">
          <Container>
            <div className="grid min-w-0 items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <RevealOnScroll animation="from-left">
                <SectionHeading
                  eyebrow="Outcomes"
                  title="Benefits & what you gain"
                />
                <div
                  className="prose-lfi mt-6"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeRichText(benefitsHtml),
                  }}
                />
              </RevealOnScroll>
              <RevealOnScroll animation="mask-reveal">
                <MediaFrame
                  src={benefitsMedia.src}
                  alt={benefitsMedia.alt}
                />
              </RevealOnScroll>
            </div>
          </Container>
        </section>
      )}

      {/* Eligibility */}
      {eligibilityHtml && (
        <section className="section-ivory py-12 sm:py-16 lg:py-24">
          <Container>
            <div className="grid min-w-0 items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <RevealOnScroll animation="mask-reveal" className="lg:order-1">
                <MediaFrame
                  src={eligibilityMedia.src}
                  alt={eligibilityMedia.alt}
                />
              </RevealOnScroll>
              <RevealOnScroll animation="from-right" className="lg:order-2">
                <SectionHeading
                  eyebrow="Eligibility"
                  title="Who this program is for"
                />
                <div
                  className="prose-lfi mt-6"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeRichText(eligibilityHtml),
                  }}
                />
              </RevealOnScroll>
            </div>
          </Container>
        </section>
      )}

      {/* Process */}
      {processSteps.length > 0 && (
        <section className="section-red py-12 sm:py-16 lg:py-24">
          <Container>
            <div className="grid min-w-0 items-end gap-10 lg:grid-cols-12 lg:gap-12">
              <div className="min-w-0 lg:col-span-7">
                <RevealOnScroll animation="fade">
                  <SectionHeading
                    eyebrow="Your journey"
                    title="What to expect"
                    subtitle="A clear path from first contact to ongoing support."
                    theme="dark"
                  />
                </RevealOnScroll>
              </div>
              <RevealOnScroll animation="mask-reveal" className="min-w-0 lg:col-span-5">
                <MediaFrame
                  src={processMedia.src}
                  alt={processMedia.alt}
                  aspect="video"
                  className="border border-white/10 shadow-none"
                />
              </RevealOnScroll>
            </div>
            <ol className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {processSteps
                .sort((a, b) => a.order - b.order)
                .map((step, i) => (
                  <RevealOnScroll
                    key={step.title}
                    animation="stagger"
                    delay={i * 0.08}
                  >
                    <li className="relative rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-sm">
                      <span className="font-display text-4xl font-bold text-accent-gold">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                      {step.description && (
                        <p className="mt-2 text-sm leading-relaxed opacity-90">
                          {step.description}
                        </p>
                      )}
                      {i < processSteps.length - 1 && (
                        <ArrowRight
                          className="absolute -right-3 top-1/2 hidden size-5 -translate-y-1/2 text-white/30 lg:block"
                          aria-hidden
                        />
                      )}
                    </li>
                  </RevealOnScroll>
                ))}
            </ol>
          </Container>
        </section>
      )}

      {/* Program photos */}
      {galleryImages.length > 0 && (
        <section className="section-dark py-12 sm:py-16 lg:py-20">
          <Container>
            <RevealOnScroll animation="fade">
              <SectionHeading
                eyebrow="In the community"
                title="Program in action"
                subtitle="Real moments from workshops, welcome days, and community gatherings."
                theme="dark"
              />
            </RevealOnScroll>
            <div className="mt-10 grid min-w-0 grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {galleryImages.map((image, i) => (
                <RevealOnScroll
                  key={`${image.src}-${i}`}
                  animation="stagger"
                  delay={i * 0.06}
                  className={cn(i === 0 && "col-span-2 row-span-2")}
                >
                  <div
                    className={cn(
                      "relative overflow-hidden rounded-2xl bg-charcoal/40",
                      i === 0 ? "aspect-[4/3] sm:aspect-auto sm:min-h-[18rem]" : "aspect-square",
                    )}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      sizes={
                        i === 0
                          ? "(max-width: 1024px) 100vw, 50vw"
                          : "(max-width: 1024px) 50vw, 25vw"
                      }
                    />
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Related services */}
      {related.length > 0 && (
        <section className="py-12 sm:py-16 lg:py-24">
          <Container>
            <RevealOnScroll animation="from-left">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <SectionHeading
                  eyebrow="Explore more"
                  title="Related programs"
                  subtitle="Other services that may support your goals."
                />
                <Button asChild variant="secondary">
                  <Link href="/services">
                    View all services
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </RevealOnScroll>
            <div className="mt-10 grid min-w-0 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((s, i) => (
                <RevealOnScroll key={String(s._id)} animation="stagger" delay={i * 0.06}>
                  <ServiceCard service={s} />
                </RevealOnScroll>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Final CTA */}
      <section className="section-dark py-12 sm:py-16 lg:py-24">
        <Container>
          <RevealOnScroll animation="fade">
            <div className="mx-auto max-w-2xl text-center">
              <SectionHeading
                title="Ready to connect?"
                subtitle="Reach out to discuss your needs. Information shared here does not replace legal advice."
                theme="dark"
                align="center"
              />
              <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
                <Button href={bookHref} size="lg" className="sm:w-auto">
                  {bookLabel}
                </Button>
                <Button
                  href="/contact"
                  variant="outlineLight"
                  size="lg"
                  className="sm:w-auto"
                >
                  Contact us
                </Button>
              </div>
            </div>
          </RevealOnScroll>
        </Container>
      </section>
    </>
  );
}

function MediaFrame({
  src,
  alt,
  aspect = "photo",
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  aspect?: "photo" | "video";
  className?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl shadow-[0_24px_60px_rgba(9,9,9,0.12)]",
        aspect === "video" ? "aspect-video" : "aspect-[4/3]",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 50vw"
        priority={priority}
      />
    </div>
  );
}
