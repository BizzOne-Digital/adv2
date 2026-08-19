import { notFound } from "next/navigation";
import {
  getPublishedPage,
  getLeadershipTeam,
} from "@/services/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { HeroCinematic } from "@/components/site/hero-cinematic";
import { ContentSectionRenderer } from "@/components/site/content-section-renderer";
import { LeadershipSection } from "@/components/site/leadership-section";

export async function generateMetadata() {
  const page = await getPublishedPage("about");
  if (!page) return {};
  const seo = page?.seo as { metaTitle?: string; metaDescription?: string } | undefined;
  return buildMetadata({
    title: seo?.metaTitle ?? String(page.title),
    description: seo?.metaDescription,
    path: "/about",
  });
}

export default async function AboutPage() {
  const [page, leadership] = await Promise.all([
    getPublishedPage("about"),
    getLeadershipTeam(),
  ]);
  if (!page) notFound();

  const hero = page.hero as Record<string, string> | undefined;
  const sections = (page.sections as Record<string, unknown>[]) ?? [];

  const introSections = sections.filter((s) =>
    ["organization-story", "mission-vision"].includes(String(s.key)),
  );
  const restSections = sections.filter(
    (s) =>
      !["organization-story", "mission-vision", "team-preview"].includes(String(s.key)),
  );

  return (
    <>
      <HeroCinematic
        eyebrow={hero?.eyebrow}
        heading={hero?.heading ?? String(page.title)}
        subheading={hero?.subheading}
        compact={false}
      />
      <ContentSectionRenderer sections={introSections} />
      <LeadershipSection members={leadership} />
      <ContentSectionRenderer sections={restSections} />
    </>
  );
}
