import Image from "next/image";
import { getPublishedPage, getPublishedTeam } from "@/services/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteImagePath } from "@/lib/media/site-assets";
import { HeroCinematic } from "@/components/site/hero-cinematic";
import { Container } from "@/components/ui/container";
import { ContentSectionRenderer } from "@/components/site/content-section-renderer";
import { Button } from "@/components/ui/button";
import { sanitizeRichText } from "@/lib/validation/sanitize";

export async function generateMetadata() {
  const page = await getPublishedPage("team");
  const seo = page?.seo as { metaTitle?: string; metaDescription?: string } | undefined;
  return buildMetadata({ title: seo?.metaTitle ?? "Team", description: seo?.metaDescription, path: "/team" });
}

export default async function TeamPage() {
  const [page, team] = await Promise.all([
    getPublishedPage("team"),
    getPublishedTeam(),
  ]);
  const hero = page?.hero as Record<string, string> | undefined;
  const sections = (page?.sections as Record<string, unknown>[]) ?? [];

  return (
    <>
      <HeroCinematic
        eyebrow={hero?.eyebrow ?? "Team"}
        heading={hero?.heading ?? "People behind the light"}
        subheading={hero?.subheading}
        compact
      />
      <section className="py-16">
        <Container>
          {team.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((member) => {
                const photo = member.photo as { src?: string; alt?: string } | undefined;
                return (
                  <article key={String(member._id)} className="rounded-2xl border bg-white p-6 text-center">
                    <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-full">
                      <Image src={photo?.src ?? siteImagePath(30)} alt={photo?.alt ?? String(member.name)} fill className="object-cover" />
                    </div>
                    <h2 className="font-display mt-4 text-xl font-bold">{String(member.name)}</h2>
                    <p className="text-signal-red text-sm font-medium">{String(member.role)}</p>
                    {member.shortBio ? (
                      <p className="text-muted mt-3 text-sm">{String(member.shortBio)}</p>
                    ) : null}
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="text-muted text-center">Team profiles will appear once published in admin.</p>
          )}
        </Container>
      </section>
      <ContentSectionRenderer sections={sections} />
      <section className="py-16 text-center">
        <Container>
          <Button href="/get-involved">Join as a volunteer</Button>
        </Container>
      </section>
    </>
  );
}
