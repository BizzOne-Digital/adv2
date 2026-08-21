import Image from "next/image";
import Link from "next/link";
import { Bus, Calendar, Clock, MapPin, Sparkles, Users } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";

const highlights = [
  "All nations are welcome",
  "Free to attend for newcomer farmers",
  "Free transport & accommodation (3 days)",
  "Register early — limited spaces",
];

export function FarmShowTripSection() {
  return (
    <section className="section-dark w-full min-w-0 overflow-x-clip py-12 sm:py-16 lg:py-24">
      <Container>
        <div className="grid min-w-0 items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
          <RevealOnScroll animation="from-left" className="min-w-0">
            <SectionHeading
              eyebrow="Upcoming trip for immigrants"
              title="Canada's Outdoor Farm Show 2026"
              subtitle="Empower newcomer farmers — all newcomers and immigrant farmers are free to attend."
              theme="dark"
            />

            <p className="mt-6 text-base leading-relaxed text-warm-ivory/80">
              Join Light for Immigrants for a 3-day trip to Canada&apos;s Outdoor Farm Show in
              Woodstock, Ontario. Learn, connect, grow, and succeed alongside newcomer farmers
              from across the province. All nations are welcome.
            </p>

            <ul className="mt-6 flex flex-wrap gap-2">
              {highlights.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-warm-ivory/20 bg-warm-ivory/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-accent-gold"
                >
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="flex gap-3 rounded-2xl border border-warm-ivory/15 bg-warm-ivory/5 p-4">
                <Calendar className="mt-0.5 size-5 shrink-0 text-accent-gold" aria-hidden />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-warm-ivory/60">
                    Date
                  </p>
                  <p className="font-display mt-1 text-lg font-bold text-warm-ivory">
                    September 15, 16 &amp; 17, 2026
                  </p>
                </div>
              </div>
              <div className="flex gap-3 rounded-2xl border border-warm-ivory/15 bg-warm-ivory/5 p-4">
                <Clock className="mt-0.5 size-5 shrink-0 text-accent-gold" aria-hidden />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-warm-ivory/60">
                    Time
                  </p>
                  <p className="font-display mt-1 text-lg font-bold text-warm-ivory">
                    8:30 AM – 5:00 PM EST
                  </p>
                  <p className="text-sm text-warm-ivory/70">Each day (3 days)</p>
                </div>
              </div>
              <div className="flex gap-3 rounded-2xl border border-warm-ivory/15 bg-warm-ivory/5 p-4">
                <MapPin className="mt-0.5 size-5 shrink-0 text-accent-gold" aria-hidden />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-warm-ivory/60">
                    Location
                  </p>
                  <p className="font-display mt-1 text-lg font-bold text-warm-ivory">
                    Discover Farm Woodstock
                  </p>
                  <p className="text-sm text-warm-ivory/70">
                    744906 Oxford Road 17, Woodstock, ON
                  </p>
                </div>
              </div>
              <div className="flex gap-3 rounded-2xl border border-warm-ivory/15 bg-warm-ivory/5 p-4">
                <Bus className="mt-0.5 size-5 shrink-0 text-accent-gold" aria-hidden />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-warm-ivory/60">
                    Included
                  </p>
                  <p className="font-display mt-1 text-lg font-bold text-warm-ivory">
                    Free transport &amp; lodging
                  </p>
                  <p className="text-sm text-warm-ivory/70">3 days covered</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-accent-gold">
              <Sparkles className="size-4" aria-hidden />
              Registration deadline: September 1st, 2026
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild>
                <Link href="/contact">Register interest</Link>
              </Button>
              <Button asChild variant="outlineLight">
                <Link href="/events/canada-outdoor-farm-show-2026">Event details</Link>
              </Button>
            </div>

            <p className="mt-6 flex items-start gap-2 text-sm leading-relaxed text-warm-ivory/70">
              <Users className="mt-0.5 size-4 shrink-0 text-accent-gold" aria-hidden />
              Questions? Email info@lightimmigrants.ca or call 437-873-7675 (9:00 AM – 5:00 PM).
            </p>
          </RevealOnScroll>

          <RevealOnScroll animation="from-right" className="min-w-0">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              <div
                className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-accent-gold/20 via-transparent to-signal-red/20 blur-2xl"
                aria-hidden
              />
              <div className="relative overflow-hidden rounded-2xl border border-warm-ivory/10 bg-near-black shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
                <div className="relative aspect-[3/4] sm:aspect-[4/5]">
                  <Image
                    src="/images/canada-outdoor-farm-show-2026.png"
                    alt="Canada's Outdoor Farm Show 2026 — newcomer farmers trip by Light for Immigrants"
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </Container>
    </section>
  );
}
