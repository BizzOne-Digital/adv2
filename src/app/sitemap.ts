import { getPublishedServices, getPublishedEvents } from "@/services/content";
import { getEnv } from "@/lib/env";

export default async function sitemap() {
  const { siteUrl } = getEnv();
  const services = await getPublishedServices();
  const events = await getPublishedEvents();

  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/gallery",
    "/events",
    "/testimonials",
    "/faqs",
    "/contact",
    "/booking",
    "/team",
    "/shop",
    "/pricing",
    "/get-involved",
    "/donate",
    "/privacy",
    "/terms",
  ];

  return [
    ...staticRoutes.map((path) => ({
      url: `${siteUrl}${path}`,
      lastModified: new Date(),
    })),
    ...services.map((s) => ({
      url: `${siteUrl}/services/${s.slug}`,
      lastModified: new Date(),
    })),
    ...events.map((e) => ({
      url: `${siteUrl}/events/${e.slug}`,
      lastModified: new Date(),
    })),
  ];
}
