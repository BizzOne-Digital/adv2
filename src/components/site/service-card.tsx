import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteImagePath } from "@/lib/media/site-assets";
import type { MediaRef } from "@/types";

type ServiceCardProps = {
  service: Record<string, unknown>;
  className?: string;
};

export function ServiceCard({ service, className }: ServiceCardProps) {
  const title = String(service.title ?? "Service");
  const slug = String(service.slug ?? "#");
  const description = String(service.shortDescription ?? "");
  const category = String(service.category ?? "");
  const cardImage = service.cardImage as MediaRef | undefined;
  const featured = Boolean(service.featured);

  return (
    <article
      className={cn(
        "group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-clean-white transition-shadow duration-300 hover:shadow-[0_20px_50px_rgba(9,9,9,0.08)]",
        className,
      )}
    >
      <Link href={`/services/${slug}`} className="flex h-full flex-col">
        <div className="relative aspect-[16/10] overflow-hidden bg-charcoal/5">
          <Image
            src={cardImage?.src ?? cardImage?.thumbnailSrc ?? siteImagePath(6)}
            alt={cardImage?.alt ?? title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width:768px) 100vw, 33vw"
          />
          {featured && (
            <span className="absolute left-4 top-4 rounded-full bg-signal-red px-3 py-1 text-xs font-semibold text-clean-white">
              Featured
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col p-6">
          {category && (
            <p className="text-xs font-semibold uppercase tracking-widest text-signal-red">
              {category}
            </p>
          )}
          <h3 className="font-display mt-2 text-xl font-bold text-near-black group-hover:text-signal-red">
            {title}
          </h3>
          {description && (
            <p className="text-muted mt-3 line-clamp-3 flex-1 text-sm leading-relaxed">
              {description}
            </p>
          )}
          <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-signal-red">
            Learn more
            <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </Link>
    </article>
  );
}
