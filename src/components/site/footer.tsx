import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Mail, MapPin, Phone, Clock } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import type { OfficeHours, SocialLinks } from "@/types";

type SerializedSettings = Record<string, unknown>;

type FooterProps = {
  settings: SerializedSettings;
};

const socialLabels: Record<keyof SocialLinks, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  youtube: "YouTube",
  tiktok: "TikTok",
  x: "X",
  other: "Link",
};

export function Footer({ settings }: FooterProps) {
  const general = settings.general as Record<string, string> | undefined;
  const branding = settings.branding as Record<string, unknown> | undefined;
  const contact = settings.contact as Record<string, unknown> | undefined;  const social = settings.social as SocialLinks | undefined;
  const footer = settings.footer as Record<string, unknown> | undefined;
  const actions = settings.actions as Record<string, string> | undefined;

  const orgName = general?.organizationName ?? "Light for Immigrants";
  const logo = (branding?.logo as string) ?? "/logo.png";  const tagline =
    general?.tagline ??
    "Bringing light, guidance, and belonging to every immigrant in Canada.";
  const primaryEmail = (contact?.primaryEmail as string) ?? "";
  const secondaryEmail = contact?.secondaryEmail as string | undefined;
  const phone = contact?.phone as string | undefined;
  const address = contact?.address as string | undefined;
  const mapsUrl = contact?.mapsUrl as string | undefined;
  const officeHours = (contact?.officeHours as OfficeHours[]) ?? [];
  const description =
    (footer?.description as string) ??
    general?.shortDescription ??
    tagline;
  const copyright =
    (footer?.copyrightText as string) ??
    `© ${new Date().getFullYear()} ${orgName}. All rights reserved.`;
  const newsletter = footer?.newsletterCta as { label?: string; href?: string } | undefined;

  const footerLinks = [
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Get Involved", href: actions?.volunteerUrl ?? "/get-involved" },
    { label: "Gallery", href: "/gallery" },
    { label: "FAQ", href: "/faqs" },
    { label: "Contact", href: "/contact" },
    { label: "Book Support", href: actions?.bookingUrl ?? "/booking" },
  ];

  return (
    <footer className="section-dark mt-auto w-full max-w-full shrink-0 border-t border-warm-ivory/10">
      <Container className="pt-10 pb-6 lg:pt-12 lg:pb-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block">
              <Image
                src={logo}
                alt={orgName}
                width={240}
                height={72}
                className="h-16 w-auto sm:h-20 lg:h-24"
              />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-warm-ivory/70">              {description}
            </p>
            {newsletter && (
              <div className="mt-6">
                <Button asChild variant="secondary" size="sm">
                  <Link href={newsletter.href ?? "/contact"}>
                    {newsletter.label ?? "Stay connected"}
                  </Link>
                </Button>
              </div>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              {social &&
                (Object.entries(social) as [keyof SocialLinks, string | undefined][])
                  .filter(([, url]) => Boolean(url))
                  .map(([key, url]) => (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex size-10 items-center justify-center rounded-full border border-warm-ivory/15 text-warm-ivory/80 transition hover:border-signal-red hover:text-signal-red"
                      aria-label={socialLabels[key] ?? key}
                    >
                      <ExternalLink className="size-4" />
                      <span className="sr-only">{socialLabels[key] ?? key}</span>
                    </a>
                  ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-signal-red">
              Explore
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-warm-ivory/75 transition hover:text-warm-ivory"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-signal-red">
              Contact
            </h3>
            <ul className="mt-4 space-y-4 text-sm text-warm-ivory/75">
              {primaryEmail && (
                <li className="flex gap-3">
                  <Mail className="mt-0.5 size-4 shrink-0 text-signal-red" />
                  <div>
                    <a
                      href={`mailto:${primaryEmail}`}
                      className="transition hover:text-warm-ivory"
                    >
                      {primaryEmail}
                    </a>
                    {secondaryEmail && (
                      <a
                        href={`mailto:${secondaryEmail}`}
                        className="mt-1 block transition hover:text-warm-ivory"
                      >
                        {secondaryEmail}
                      </a>
                    )}
                  </div>
                </li>
              )}
              {phone && (
                <li className="flex gap-3">
                  <Phone className="mt-0.5 size-4 shrink-0 text-signal-red" />
                  <a href={`tel:${phone.replace(/\s/g, "")}`} className="transition hover:text-warm-ivory">
                    {phone}
                  </a>
                </li>
              )}
              {address && (
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-signal-red" />
                  {mapsUrl ? (
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition hover:text-warm-ivory"
                    >
                      {address}
                    </a>
                  ) : (
                    <span>{address}</span>
                  )}
                </li>
              )}
              {officeHours.length > 0 && (
                <li className="flex gap-3">
                  <Clock className="mt-0.5 size-4 shrink-0 text-signal-red" />
                  <div className="space-y-1">
                    {officeHours.map((row) => (
                      <p key={row.label}>
                        <span className="text-warm-ivory">{row.label}: </span>
                        {row.hours}
                      </p>
                    ))}
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-warm-ivory/10 pt-6 text-sm text-warm-ivory/50 sm:flex-row sm:items-center sm:justify-between">
          <p>{copyright}</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-warm-ivory">
              Privacy
            </Link>
            <Link href="/accessibility" className="hover:text-warm-ivory">
              Accessibility
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
