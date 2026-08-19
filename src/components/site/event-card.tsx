import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatEventDate } from "@/lib/events/format";
import { siteImagePath } from "@/lib/media/site-assets";
import type { MediaRef } from "@/types";

type EventCardProps = {
  event: Record<string, unknown>;
  className?: string;
  past?: boolean;
};

export function EventCard({ event, className, past = false }: EventCardProps) {
  const title = String(event.title ?? "Event");
  const slug = String(event.slug ?? "");
  const shortDescription = String(event.shortDescription ?? "");
  const location = String(event.location ?? "");
  const city = event.city ? String(event.city) : "";
  const isFree = Boolean(event.isFree);
  const image = event.image as MediaRef | undefined;
  const startDate = event.startDate ? new Date(String(event.startDate)) : null;

  return (
    <article
      className={cn(
        "group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-clean-white transition-shadow duration-300 hover:shadow-[0_20px_50px_rgba(9,9,9,0.08)]",
        className,
      )}
    >
      <Link href={`/events/${slug}`} className="flex h-full flex-col">
        <div className="relative aspect-[16/10] overflow-hidden bg-charcoal/5">
          <Image
            src={image?.src ?? siteImagePath(6)}
            alt={image?.alt ?? title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width:768px) 100vw, 33vw"
          />
          {isFree && (
            <span className="absolute left-4 top-4 rounded-full bg-signal-red px-3 py-1 text-xs font-semibold text-clean-white">
              Free event
            </span>
          )}
          {past && (
            <span className="absolute right-4 top-4 rounded-full bg-near-black/75 px-3 py-1 text-xs font-semibold text-warm-ivory">
              Past event
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col p-6">
          {startDate && (
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-signal-red">
              <Calendar className="size-3.5" aria-hidden />
              {formatEventDate(startDate)}
              {event.startTime ? ` · ${String(event.startTime)}` : ""}
            </p>
          )}
          <h3 className="font-display mt-3 text-xl font-bold text-near-black group-hover:text-signal-red">
            {title}
          </h3>
          {shortDescription && (
            <p className="text-muted mt-3 line-clamp-3 flex-1 text-sm leading-relaxed">
              {shortDescription}
            </p>
          )}
          {location && (
            <p className="text-muted mt-4 flex items-start gap-2 text-sm">
              <MapPin className="mt-0.5 size-4 shrink-0 text-signal-red" aria-hidden />
              <span>
                {location}
                {city ? `, ${city}` : ""}
              </span>
            </p>
          )}
          <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-signal-red">
            Event details
            <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </Link>
    </article>
  );
}
