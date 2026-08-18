import type { Metadata } from "next";
import { Syne, DM_Sans, Oswald } from "next/font/google";
import { getSiteSettings, getPublishedServices } from "@/services/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { SiteProviders } from "@/components/site/site-providers";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { IntroWrapper } from "@/components/motion/intro-wrapper";
import { RouteTransition } from "@/components/motion/route-transition";
import "../globals.css";

/** CMS + MongoDB content must load at request time (not empty build-time cache). */
export const dynamic = "force-dynamic";

const display = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const body = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const hero = Oswald({
  variable: "--font-hero",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const seo = settings.seo as { defaultDescription?: string } | undefined;
  return buildMetadata({
    description: seo?.defaultDescription,
  });
}

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, services] = await Promise.all([
    getSiteSettings(),
    getPublishedServices(),
  ]);

  const navServices = services.map((service) => ({
    title: String(service.title),
    slug: String(service.slug),
    category: service.category ? String(service.category) : undefined,
  }));

  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${hero.variable} h-full`}>
      <body className="site-shell min-h-full flex flex-col antialiased">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <SiteProviders>
          <IntroWrapper logoSrc={(settings.branding as { logo?: string })?.logo ?? "/logo.png"} />
          <Header settings={settings} services={navServices} />
          <RouteTransition>
            <main id="main-content" className="site-shell flex-1 min-w-0 w-full">
              {children}
            </main>
          </RouteTransition>
          <Footer settings={settings} />
        </SiteProviders>
      </body>
    </html>
  );
}
