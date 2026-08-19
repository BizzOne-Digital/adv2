import type { MediaRef } from "@/types";
import { siteImageRef } from "@/lib/media/site-assets";

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
    title: "Fall Welcome Picnic",
    slug: "fall-welcome-picnic-2026",
    shortDescription:
      "A relaxed outdoor welcome for newcomers, families, and neighbours across Ontario.",
    descriptionHtml:
      "<p>Bring your family and meet volunteers, program staff, and other newcomers in a friendly park setting. Free food, games for children, and information about settlement programs.</p><p>All immigrants across Ontario are warmly invited. Registration is not required — just come and connect.</p>",
    startDate: "2026-09-20T11:00:00.000Z",
    startTime: "11:00 AM – 3:00 PM",
    location: "Trillium Park",
    address: "955 Lake Shore Blvd W, Toronto, ON",
    city: "Toronto",
    image: siteImageRef(12, "Families enjoying an outdoor welcome picnic"),
    isFree: true,
    featured: true,
    order: 1,
  },
  {
    title: "Language Coffee & Conversation Circle",
    slug: "language-coffee-circle-2026",
    shortDescription:
      "Practice everyday English in a supportive café-style conversation circle.",
    descriptionHtml:
      "<p>Drop in for friendly conversation practice with peers and volunteers. No formal test — just confidence-building dialogue in a welcoming space.</p><p>Light refreshments provided. Suitable for all language levels.</p>",
    startDate: "2026-10-18T14:00:00.000Z",
    startTime: "2:00 PM – 4:30 PM",
    location: "Community Program Hub",
    address: "163 Queen St E, Toronto, ON M5A 1S1",
    city: "Toronto",
    image: siteImageRef(8, "Conversation circle at a community program hub"),
    isFree: true,
    order: 2,
  },
  {
    title: "Community Sports & Recreation Day",
    slug: "community-sports-day-2026",
    shortDescription:
      "Inclusive sports, games, and recreation for youth, families, and seniors.",
    descriptionHtml:
      "<p>Join friendly matches, group activities, and cultural games designed to build friendship across backgrounds. Equipment provided where possible.</p><p>Wear comfortable clothing and arrive a few minutes early to sign in at the welcome desk.</p>",
    startDate: "2026-11-15T10:00:00.000Z",
    startTime: "10:00 AM – 2:00 PM",
    location: "Local recreation field",
    address: "Toronto, ON — exact field shared on registration",
    city: "Toronto",
    image: siteImageRef(16, "Youth and families at a community sports day"),
    isFree: true,
    order: 3,
  },
  {
    title: "Winter Holiday Community Gathering",
    slug: "winter-holiday-gathering-2026",
    shortDescription:
      "Celebrate the season with food, music, and intercultural friendship.",
    descriptionHtml:
      "<p>An end-of-year gathering for immigrants, families, and volunteers. Share traditions, enjoy music, and connect before the holidays.</p><p>Free admission. All nations welcome.</p>",
    startDate: "2026-12-06T15:00:00.000Z",
    startTime: "3:00 PM – 6:00 PM",
    location: "Community hall",
    address: "Toronto, ON — venue confirmed closer to the date",
    city: "Toronto",
    image: siteImageRef(20, "Community holiday gathering with diverse families"),
    isFree: true,
    order: 4,
  },
  {
    title: "Light for Immigrants BBQ Festival",
    slug: "bbq-festival-2026",
    shortDescription:
      "Our free BBQ festival celebrating diversity, culture, friendship, and community at High Park.",
    descriptionHtml:
      "<p>All immigrants across Ontario were warmly invited to this wonderful BBQ festival. Free BBQ food and drinks, family activities, and a chance to build community together.</p><p>This was a past community highlight — photos are shared with participant consent. Contact us to learn about the next gathering.</p>",
    startDate: "2026-07-04T12:00:00.000Z",
    startTime: "12:00 PM – 5:00 PM",
    location: "High Park",
    address: "High Park, Toronto, ON",
    city: "Toronto",
    image: {
      type: "image",
      src: "/images/bbq-festival.png",
      alt: "Light for Immigrants BBQ Festival poster at High Park, Toronto",
    } satisfies MediaRef,
    isFree: true,
    featured: true,
    order: 0,
  },
];
