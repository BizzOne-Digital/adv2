import type { MediaRef } from "@/types";

export type LeadershipSeed = {
  name: string;
  slug: string;
  role: string;
  shortBio: string;
  photo: MediaRef;
  order: number;
};

export const LEADERSHIP_SEEDS: LeadershipSeed[] = [
  {
    name: "Jacqueline Musyimi",
    slug: "jacqueline-musyimi",
    role: "President — Light for Immigrants",
    shortBio:
      "Leads Light for Immigrants with a commitment to welcoming newcomers and strengthening community across Ontario.",
    photo: {
      type: "image",
      src: "/images/team/jacqueline-musyimi.png",
      alt: "Jacqueline Musyimi, President of Light for Immigrants",
    },
    order: 1,
  },
  {
    name: "Neema Katana",
    slug: "neema-katana",
    role: "Vice President",
    shortBio:
      "Supports organizational leadership and program direction alongside partners, volunteers, and community members.",
    photo: {
      type: "image",
      src: "/images/team/neema-katana.png",
      alt: "Neema Katana, Vice President of Light for Immigrants",
    },
    order: 2,
  },
  {
    name: "Adv. Mwanjara A.A",
    slug: "adv-mwanjara-aa",
    role: "Appointed Coordinator",
    shortBio:
      "Coordinates programs and community initiatives that connect immigrants with practical support and belonging.",
    photo: {
      type: "image",
      src: "/images/team/mwanjara-aa.png",
      alt: "Adv. Mwanjara A.A, Appointed Coordinator at Light for Immigrants",
    },
    order: 3,
  },
  {
    name: "Faith Kazombo",
    slug: "faith-kazombo",
    role: "Secretary",
    shortBio:
      "Oversees records, communications, and organizational administration for Light for Immigrants.",
    photo: {
      type: "image",
      src: "/images/team/faith-kazombo.png",
      alt: "Faith Kazombo, Secretary of Light for Immigrants",
    },
    order: 4,
  },
];

export const LEADERSHIP_SLUGS = LEADERSHIP_SEEDS.map((m) => m.slug);

/** Legacy placeholder slugs from early seed data — removed when syncing leadership. */
export const LEGACY_TEAM_PLACEHOLDER_SLUGS = [
  "executive-director-placeholder",
  "programs-manager-placeholder",
  "community-coordinator-placeholder",
  "volunteer-lead-placeholder",
];
