import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { siteImagePath } from "@/lib/media/site-assets";
import type { MediaRef } from "@/types";

type LeadershipSectionProps = {
  members: Array<Record<string, unknown>>;
  showViewAll?: boolean;
  className?: string;
};

export function LeadershipSection({
  members,
  showViewAll = true,
}: LeadershipSectionProps) {
  if (!members.length) return null;

  return (
    <section className="section-ivory w-full min-w-0 overflow-x-clip py-12 sm:py-16 lg:py-24">
      <Container>
        <RevealOnScroll animation="from-left">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Leadership"
              title="Light for Immigrants leadership"
              subtitle="Guiding our mission to bring light, guidance, and belonging to immigrants across Ontario."
            />
            {showViewAll && (
              <Button asChild variant="secondary" className="shrink-0">
                <Link href="/team">View team</Link>
              </Button>
            )}
          </div>
        </RevealOnScroll>

        <div className="mt-10 grid min-w-0 gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {members.map((member, i) => {
            const photo = member.photo as MediaRef | undefined;
            return (
              <RevealOnScroll key={String(member._id)} animation="stagger" delay={i * 0.08}>
                <article className="flex h-full flex-col rounded-2xl border border-border bg-clean-white p-5 text-center shadow-sm">
                  <div className="relative mx-auto aspect-[3/4] w-full max-w-[220px] overflow-hidden rounded-2xl bg-charcoal/5">
                    <Image
                      src={photo?.src ?? siteImagePath(30)}
                      alt={photo?.alt ?? String(member.name)}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 640px) 50vw, 220px"
                    />
                  </div>
                  <h3 className="font-display mt-5 text-lg font-bold text-near-black">
                    {String(member.name)}
                  </h3>
                  <p className="mt-2 text-sm font-semibold text-signal-red">
                    {String(member.role)}
                  </p>
                  {member.shortBio ? (
                    <p className="text-muted mt-3 text-sm leading-relaxed">
                      {String(member.shortBio)}
                    </p>
                  ) : null}
                </article>
              </RevealOnScroll>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
