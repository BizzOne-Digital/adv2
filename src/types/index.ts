export type MediaRef = {
  assetId?: string;
  src: string;
  thumbnailSrc?: string;
  type: "image" | "video";
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
};

export type CtaLink = {
  label: string;
  href: string;
};

export type ContentSection = {
  key: string;
  type: string;
  internalLabel: string;
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  bodyHtml?: string;
  media?: MediaRef[];
  primaryCta?: CtaLink;
  secondaryCta?: CtaLink;
  layout?: string;
  theme?: string;
  animation?: string;
  isVisible: boolean;
  order: number;
};

export type PageSeo = {
  metaTitle?: string;
  metaDescription?: string;
  socialImage?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
};

export type ServiceOfferItem = {
  title: string;
  description?: string;
  icon?: string;
};

export type ServiceProcessStep = {
  title: string;
  description?: string;
  order: number;
};

export type ServiceDetailSection = {
  key: string;
  title: string;
  bodyHtml?: string;
  media?: MediaRef[];
  alt?: string;
  layout?: string;
  animation?: string;
  isVisible: boolean;
  order: number;
};

export type SocialLinks = {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
  x?: string;
  other?: string;
};

export type OfficeHours = {
  label: string;
  hours: string;
};

export type UserRole = "admin" | "editor";

export type PublishStatus = "draft" | "published" | "archived";

export type BookingStatus =
  | "new"
  | "contacted"
  | "confirmed"
  | "completed"
  | "cancelled";

export type InquiryStatus = "new" | "read" | "replied" | "archived";

export type AnimationPreset =
  | "none"
  | "fade"
  | "from-left"
  | "from-right"
  | "from-top"
  | "from-bottom"
  | "stagger"
  | "mask-reveal";
