import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";

const services = [
  {
    title: "Immigration services",
    description: "Professional guidance and support for your immigration journey.",
  },
  {
    title: "Housing settlement",
    description: "Help with finding safe, affordable housing and settlement support.",
  },
  {
    title: "Newcomer support",
    description: "Settlement support to help you adjust to life in Canada.",
  },
  {
    title: "Education system",
    description: "Information and support on schools, colleges, and learning opportunities.",
  },
  {
    title: "Referral",
    description: "Connecting you to trusted community and social services.",
  },
  {
    title: "Government assistance",
    description: "Assistance with applications and access to government programs.",
  },
];

export function OrganizationFlyerSection() {
  return (
    <section className="section-ivory w-full min-w-0 overflow-x-clip py-12 sm:py-16 lg:py-24">
      <Container>
        <div className="grid min-w-0 items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
          <RevealOnScroll animation="from-left" className="min-w-0">
            <SectionHeading
              eyebrow="Free immigrant services"
              title="You're not alone in Canada"
              subtitle="We are here with you. Everyone welcome — support, belonging, and hope for every newcomer."
            />

            <p className="text-muted mt-6 text-base leading-relaxed">
              Light for Immigrants offers free community-led services across Ontario to help
              newcomers build confidence, connection, and a brighter future in Canada.
            </p>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {services.map((item) => (
                <li
                  key={item.title}
                  className="rounded-2xl border border-border bg-clean-white p-4"
                >
                  <p className="font-display font-bold text-near-black">{item.title}</p>
                  <p className="text-muted mt-1 text-sm leading-relaxed">{item.description}</p>
                </li>
              ))}
            </ul>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="flex gap-3 rounded-2xl border border-border bg-clean-white p-4">
                <MapPin className="mt-0.5 size-5 shrink-0 text-signal-red" aria-hidden />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted">
                    Address
                  </p>
                  <p className="mt-1 font-medium text-near-black">163 Queen Street E, Toronto ON</p>
                </div>
              </div>
              <div className="flex gap-3 rounded-2xl border border-border bg-clean-white p-4">
                <Phone className="mt-0.5 size-5 shrink-0 text-signal-red" aria-hidden />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted">
                    Phone
                  </p>
                  <a href="tel:+14378737675" className="mt-1 font-medium text-near-black">
                    437-873-7675
                  </a>
                </div>
              </div>
              <div className="flex gap-3 rounded-2xl border border-border bg-clean-white p-4 sm:col-span-2">
                <Mail className="mt-0.5 size-5 shrink-0 text-signal-red" aria-hidden />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted">
                    Email
                  </p>
                  <a
                    href="mailto:info@immigrantslight.ca"
                    className="mt-1 font-medium text-near-black"
                  >
                    info@immigrantslight.ca
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild>
                <Link href="/contact">Get support</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/services">Our services</Link>
              </Button>
            </div>
          </RevealOnScroll>

          <RevealOnScroll animation="from-right" className="min-w-0">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              <div
                className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-signal-red/15 via-transparent to-accent-gold/15 blur-2xl"
                aria-hidden
              />
              <div className="relative overflow-hidden rounded-2xl border border-border bg-clean-white shadow-[0_24px_60px_rgba(9,9,9,0.12)]">
                <div className="relative aspect-[3/4] sm:aspect-[4/5]">
                  <Image
                    src="/images/light-for-immigrants-flyer.png"
                    alt="Light for Immigrants — free immigrant services flyer, Toronto Ontario"
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
              <p className="text-muted mt-4 text-center text-xs sm:text-left">
                New beginnings • Bright futures • Stronger together
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </Container>
    </section>
  );
}
