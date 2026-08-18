import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(1, "Password required"),
});

export const contactSchema = z.object({
  firstName: z.string().min(1, "First name required").max(100),
  lastName: z.string().min(1, "Last name required").max(100),
  email: z.string().email("Valid email required"),
  phone: z.string().max(30).optional(),
  topic: z.string().min(1, "Topic required").max(200),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
  consent: z.literal(true, { message: "Consent is required" }),
  website: z.string().max(0).optional(),
});

export const bookingSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().max(30).optional(),
  serviceId: z.string().optional(),
  serviceName: z.string().optional(),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  attendees: z.coerce.number().min(1).max(50).optional(),
  notes: z.string().max(2000).optional(),
  consent: z.literal(true),
  website: z.string().max(0).optional(),
});

export const ctaSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

export const mediaRefSchema = z.object({
  assetId: z.string().optional(),
  src: z.string().min(1),
  thumbnailSrc: z.string().optional(),
  type: z.enum(["image", "video"]).default("image"),
  alt: z.string().default(""),
  caption: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
});

export const contentSectionSchema = z.object({
  key: z.string().min(1),
  type: z.string().min(1),
  internalLabel: z.string().min(1),
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  subheading: z.string().optional(),
  bodyHtml: z.string().optional(),
  media: z.array(mediaRefSchema).optional(),
  primaryCta: ctaSchema.optional(),
  secondaryCta: ctaSchema.optional(),
  layout: z.string().optional(),
  theme: z.string().optional(),
  animation: z.string().optional(),
  isVisible: z.boolean().default(true),
  order: z.number().default(0),
});

export const serviceCardSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  shortDescription: z.string().optional(),
  cardImage: mediaRefSchema.optional(),
  icon: z.string().optional(),
  category: z.string().min(1),
  featured: z.boolean().optional(),
  order: z.number().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
});

export const serviceDetailSchema = z.object({
  hero: z
    .object({
      eyebrow: z.string().optional(),
      heading: z.string().optional(),
      introduction: z.string().optional(),
      media: mediaRefSchema.optional(),
    })
    .optional(),
  overviewHtml: z.string().optional(),
  offerItems: z
    .array(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        icon: z.string().optional(),
      }),
    )
    .optional(),
  benefitsHtml: z.string().optional(),
  eligibilityHtml: z.string().optional(),
  processSteps: z
    .array(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        order: z.number(),
      }),
    )
    .optional(),
  cta: ctaSchema.optional(),
  seo: z
    .object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      socialImage: z.string().optional(),
      canonicalUrl: z.string().optional(),
      noIndex: z.boolean().optional(),
    })
    .optional(),
});

export const pageUpdateSchema = z.object({
  title: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  hero: z
    .object({
      eyebrow: z.string().optional(),
      heading: z.string().optional(),
      subheading: z.string().optional(),
      bodyHtml: z.string().optional(),
      backgroundImage: z.string().optional(),
      backgroundImageAlt: z.string().optional(),
      mobileBackgroundImage: z.string().optional(),
      backgroundVideo: z.string().optional(),
      theme: z.string().optional(),
    })
    .optional(),
  sections: z.array(contentSectionSchema).optional(),
  seo: z
    .object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      socialImage: z.string().optional(),
      canonicalUrl: z.string().optional(),
      noIndex: z.boolean().optional(),
    })
    .optional(),
});

export const faqSchema = z.object({
  categoryId: z.string().min(1),
  question: z.string().min(1),
  answerHtml: z.string().min(1),
  slug: z.string().min(1),
  featured: z.boolean().optional(),
  order: z.number().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
});

export const testimonialSchema = z.object({
  personName: z.string().min(1),
  role: z.string().optional(),
  quote: z.string().min(1),
  avatar: mediaRefSchema.optional(),
  featured: z.boolean().optional(),
  order: z.number().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
});

export const blogPostSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().optional(),
  coverImage: mediaRefSchema.optional(),
  author: z.string().optional(),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  contentHtml: z.string().min(1),
  featured: z.boolean().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  publishedAt: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
