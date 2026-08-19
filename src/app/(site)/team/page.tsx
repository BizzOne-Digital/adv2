import { getPublishedPage, getLeadershipTeam, getPublishedTeam } from "@/services/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { HeroCinematic } from "@/components/site/hero-cinematic";
import { LeadershipSection } from "@/components/site/leadership-section";
import { Container } from "@/components/ui/container";
import { ContentSectionRenderer } from "@/components/site/content-section-renderer";
import { Button } from "@/components/ui/button";

export async function generateMetadata() {
  const page = await getPublishedPage("team");
  const seo = page?.seo as { metaTitle?: string; metaDescription?: string } | undefined;
  return buildMetadata({
    title: seo?.metaTitle ?? "Team",
    description: seo?.metaDescription,
    path: "/team",
  });
}

export default async function TeamPage() {
  const [page, leadership, team] = await Promise.all([
    getPublishedPage("team"),
    getLeadershipTeam(),
    getPublishedTeam(),
  ]);
  const hero = page?.hero as Record<string, string> | undefined;
  const sections = (page?.sections as Record<string, unknown>[]) ?? [];
  const programTeam = team.filter((m) => !m.isLeadership);

  return (
    <>
      <HeroCinematic
        eyebrow={hero?.eyebrow ?? "Our team"}
        heading={hero?.heading ?? "People behind the light"}
        subheading={
          hero?.subheading ??
          "Leadership, program staff, and volunteers serving immigrants across Ontario."
        }
        compact
      />

      <LeadershipSection members={leadership} showViewAll={false} />

      {programTeam.length > 0 && (
        <section className="py-12 sm:py-16 lg:py-24">
          <Container>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Program & community team</h2>
            <p className="text-muted mt-3 max-w-2xl text-sm leading-relaxed">
              Additional team profiles appear here as they are published.
            </p>
            {/* Additional non-leadership members can be listed in a future update */}
          </Container>
        </section>
      )}

      <ContentSectionRenderer sections={sections} />

      <section className="section-dark py-12 sm:py-16">
        <Container className="text-center">
          <p className="text-lg text-warm-ivory/80">Interested in volunteering with us?</p>
          <div className="mt-6">
            <Button asChild size="lg">
              <a href="/get-involved">Join as a volunteer</a>
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
