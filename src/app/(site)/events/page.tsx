import Link from "next/link";
import { getPastEvents, getUpcomingEvents } from "@/services/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { HeroCinematic } from "@/components/site/hero-cinematic";
import { EventCard } from "@/components/site/event-card";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";

export async function generateMetadata() {
  return buildMetadata({
    title: "Events",
    description:
      "Upcoming free community events, workshops, and gatherings from Light for Immigrants in Ontario.",
    path: "/events",
  });
}

export default async function EventsPage() {
  const [upcoming, past] = await Promise.all([getUpcomingEvents(), getPastEvents(6)]);

  return (
    <>
      <HeroCinematic
        eyebrow="Community calendar"
        heading="Upcoming events"
        subheading="Join us for free gatherings that celebrate diversity, friendship, and belonging across Ontario."
        compact
      />

      <section className="py-12 sm:py-16 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow="Join us"
            title="Mark your calendar"
            subtitle="All immigrants across Ontario are warmly invited. Dates and venues may be updated — contact us for the latest details."
          />

          {upcoming.length > 0 ? (
            <div className="mt-10 grid min-w-0 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {upcoming.map((event) => (
                <EventCard key={String(event._id)} event={event} />
              ))}
            </div>
          ) : (
            <p className="text-muted mt-10 rounded-2xl border bg-white p-8 text-center">
              No upcoming events are listed right now.{" "}
              <Link href="/contact" className="font-medium text-signal-red">
                Contact us
              </Link>{" "}
              to ask about the next gathering.
            </p>
          )}
        </Container>
      </section>

      {past.length > 0 && (
        <section className="section-ivory py-12 sm:py-16 lg:py-24">
          <Container>
            <SectionHeading
              eyebrow="Community highlights"
              title="Recent gatherings"
              subtitle="Moments from past programs and celebrations shared with participant consent."
            />
            <div className="mt-10 grid min-w-0 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {past.map((event) => (
                <EventCard key={String(event._id)} event={event} past />
              ))}
            </div>
          </Container>
        </section>
      )}

      <section className="section-dark py-12 sm:py-16">
        <Container className="text-center">
          <p className="text-lg text-warm-ivory/80">
            Want to volunteer or partner on an event?
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/get-involved">Get involved</Link>
            </Button>
            <Button asChild variant="outlineLight" size="lg">
              <Link href="/contact">Contact us</Link>
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
