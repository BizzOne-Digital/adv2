import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Sparkles, Users } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";

const highlights = [
  "All nations are welcome",
  "Free BBQ food & drinks",
  "Family & community gathering",
  "Everyone is welcome",
];

export function BbqFestivalSection() {
  return (
    <section className="section-ivory w-full min-w-0 overflow-x-clip py-12 sm:py-16 lg:py-24">
      <Container>
        <div className="grid min-w-0 items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
          <RevealOnScroll animation="from-left" className="min-w-0">
            <SectionHeading
              eyebrow="Past community highlight"
              title="Light for Immigrants BBQ Festival"
              subtitle="All immigrants across Ontario are warmly invited to celebrate diversity, culture, friendship, and community."
            />

            <p className="text-muted mt-6 text-base leading-relaxed">
              Join us for a wonderful BBQ festival in the heart of Toronto — a free
              gathering where neighbours share food, stories, and belonging. Come
              together, celebrate our diversity, and build community.
            </p>

            <ul className="mt-6 flex flex-wrap gap-2">
              {highlights.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-signal-red/20 bg-signal-red/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-signal-red"
                >
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="flex gap-3 rounded-2xl border border-border bg-clean-white p-4">
                <Calendar className="mt-0.5 size-5 shrink-0 text-signal-red" aria-hidden />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted">
                    Date
                  </p>
                  <p className="font-display mt-1 text-lg font-bold text-near-black">
                    July 4, 2026
                  </p>
                </div>
              </div>
              <div className="flex gap-3 rounded-2xl border border-border bg-clean-white p-4">
                <MapPin className="mt-0.5 size-5 shrink-0 text-signal-red" aria-hidden />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted">
                    Location
                  </p>
                  <p className="font-display mt-1 text-lg font-bold text-near-black">
                    High Park, Toronto
                  </p>
                  <p className="text-muted text-sm">Ontario, Canada</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-accent-gold">
              <Sparkles className="size-4" aria-hidden />
              Free event — no admission fee
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild>
                <Link href="/contact">Get event details</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/events/bbq-festival-2026">View BBQ event recap</Link>
              </Button>
            </div>

            <p className="text-muted mt-6 flex items-start gap-2 text-sm leading-relaxed">
              <Users className="mt-0.5 size-4 shrink-0 text-signal-red" aria-hidden />
              Past community gatherings like this BBQ help newcomers feel welcomed and
              connected. Photos from our events are shared with participant consent.
            </p>
          </RevealOnScroll>

          <RevealOnScroll animation="from-right" className="min-w-0">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              <div
                className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-signal-red/20 via-transparent to-accent-gold/20 blur-2xl"
                aria-hidden
              />
              <div className="relative overflow-hidden rounded-2xl border border-border bg-clean-white shadow-[0_24px_60px_rgba(9,9,9,0.12)]">
                <div className="relative aspect-[3/4] sm:aspect-[4/5]">
                  <Image
                    src="/images/bbq-festival.png"
                    alt="Light for Immigrants BBQ Festival — free community BBQ at High Park, Toronto, celebrating diversity and belonging"
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority={false}
                  />
                </div>
              </div>
              <p className="text-muted mt-4 text-center text-xs sm:text-left">
                Light for Immigrants BBQ Festival — all nations welcome.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </Container>
    </section>
  );
}
