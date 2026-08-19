import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/site/event-card";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";

type UpcomingEventsSectionProps = {
  events: Array<Record<string, unknown>>;
};

export function UpcomingEventsSection({ events }: UpcomingEventsSectionProps) {
  if (!events.length) return null;

  return (
    <section className="section-dark w-full min-w-0 overflow-x-clip py-12 sm:py-16 lg:py-24">
      <Container>
        <RevealOnScroll animation="from-left">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="What's next"
              title="Upcoming events"
              subtitle="Free community gatherings, workshops, and celebrations across Ontario. All nations welcome."
              theme="dark"
            />
            <Button asChild variant="outlineLight" className="shrink-0">
              <Link href="/events">View all events</Link>
            </Button>
          </div>
        </RevealOnScroll>

        <div className="mt-10 grid min-w-0 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {events.slice(0, 3).map((event, i) => (
            <RevealOnScroll key={String(event._id)} animation="stagger" delay={i * 0.08}>
              <EventCard event={event} />
            </RevealOnScroll>
          ))}
        </div>
      </Container>
    </section>
  );
}
