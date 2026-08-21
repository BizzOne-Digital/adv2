import type { MediaRef } from "@/types";

export type EventSeed = {
  title: string;
  slug: string;
  shortDescription: string;
  descriptionHtml: string;
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  location: string;
  address?: string;
  city?: string;
  image: MediaRef;
  isFree?: boolean;
  featured?: boolean;
  order: number;
};

export const EVENT_SEEDS: EventSeed[] = [
  {
    title: "Canada's Outdoor Farm Show 2026 — Newcomer Farmers Trip",
    slug: "canada-outdoor-farm-show-2026",
    shortDescription:
      "Free trip for newcomer and immigrant farmers — 3 days at Canada's Outdoor Farm Show with transport and accommodation included. All nations welcome.",
    descriptionHtml:
      "<p><strong>Empower newcomer farmers</strong> at Canada's Outdoor Farm Show 2026. All newcomers and immigrant farmers are <strong>free to attend</strong>.</p><ul><li><strong>Located:</strong> Discover Farm Woodstock, 744906 Oxford Road 17, Woodstock, ON</li><li><strong>Date:</strong> September 15, 16 &amp; 17, 2026</li><li><strong>Time:</strong> 8:30 AM to 5:00 PM EST (each day)</li><li><strong>Transport &amp; lodging:</strong> Free transport and accommodation for 3 days</li><li><strong>Registration deadline:</strong> September 1st, 2026 — register early, spaces are limited</li></ul><p>All nations are welcome. Learn, connect, grow, and succeed — together, we grow stronger communities!</p><p>Questions? Email <a href=\"mailto:info@lightimmigrants.ca\">info@lightimmigrants.ca</a> or call <a href=\"tel:+14378737675\">437-873-7675</a> (9:00 AM – 5:00 PM).</p>",
    startDate: "2026-09-15T12:30:00.000Z",
    endDate: "2026-09-17T21:00:00.000Z",
    startTime: "8:30 AM – 5:00 PM EST (each day)",
    location: "Discover Farm Woodstock",
    address: "744906 Oxford Road 17, Woodstock, ON",
    city: "Woodstock",
    image: {
      type: "image",
      src: "/images/canada-outdoor-farm-show-2026.png",
      alt: "Empower newcomer farmers at Canada's Outdoor Farm Show 2026 — Light for Immigrants",
    } satisfies MediaRef,
    isFree: true,
    featured: true,
    order: 0,
  },
  {
    title: "BBQ and Games Festival",
    slug: "bbq-games-festival-2026",
    shortDescription:
      "Our free BBQ and games festival celebrating diversity, culture, friendship, and community at G Ross Lord Park.",
    descriptionHtml:
      "<p>All immigrants across Ontario were warmly invited to our <strong>BBQ and Games Festival</strong> — a wonderful celebration of diversity, culture, friendship, and community.</p><ul><li>All nations are welcome</li><li>Free BBQ food &amp; drinks</li><li>Family &amp; community gathering</li><li>Games and activities for everyone</li></ul><p>Come together, celebrate together, and build community. Everyone is welcome!</p>",
    startDate: "2026-08-01T14:00:00.000Z",
    startTime: "10:00 AM – 8:00 PM",
    location: "G Ross Lord Park",
    address: "G Ross Lord Park, North York, Ontario M3H 5T3",
    city: "North York",
    image: {
      type: "image",
      src: "/images/bbq-games-festival-2026.png",
      alt: "Light for Immigrants BBQ and Games Festival — free community event, all nations welcome",
    } satisfies MediaRef,
    isFree: true,
    featured: true,
    order: 1,
  },
];
