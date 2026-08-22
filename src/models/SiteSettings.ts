import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const SiteSettingsSchema = new Schema(
  {
    singletonKey: { type: String, default: "main", unique: true },
    general: {
      organizationName: { type: String, default: "Light for Immigrants" },
      legalName: String,
      tagline: {
        type: String,
        default: "Bringing light, guidance, and belonging to every immigrant in Canada.",
      },
      shortDescription: String,
    },
    branding: {
      logo: { type: String, default: "/logo.png" },
      logoDark: { type: String, default: "/logo.png" },
      favicon: { type: String, default: "/favicon.ico" },
      defaultSocialImage: String,
      colors: {
        signalRed: { type: String, default: "#E21D2E" },
        deepCrimson: { type: String, default: "#8F0D1B" },
        nearBlack: { type: String, default: "#090909" },
        charcoal: { type: String, default: "#171717" },
        warmIvory: { type: String, default: "#F6F1E8" },
        cleanWhite: { type: String, default: "#FFFFFF" },
        accentGold: { type: String, default: "#C9A227" },
        accentCobalt: { type: String, default: "#2E5AAC" },
        accentTeal: { type: String, default: "#1A8A7D" },
      },
    },
    contact: {
      primaryEmail: { type: String, default: "info@immigrantslight.ca" },
      secondaryEmail: String,
      phone: { type: String, default: "+1 437 873 7675" },
      whatsapp: String,
      address: {
        type: String,
        default: "163 Queen St E, Toronto, ON M5A 1S1, Canada",
      },
      mapsUrl: String,
      mapsEmbed: String,
      officeHours: [
        {
          label: { type: String, default: "Monday – Friday" },
          hours: { type: String, default: "9:00 AM – 5:00 PM" },
        },
      ],
      emailLaunchWarning: {
        type: String,
        default: "",
      },
    },
    social: {
      facebook: String,
      instagram: String,
      linkedin: String,
      youtube: String,
      tiktok: String,
      x: String,
      other: String,
    },
    actions: {
      bookingUrl: { type: String, default: "/booking" },
      donationUrl: String,
      volunteerUrl: { type: String, default: "/get-involved" },
    },
    footer: {
      description: String,
      copyrightText: {
        type: String,
        default: "© Light for Immigrants. All rights reserved.",
      },
      newsletterCta: {
        label: { type: String, default: "Stay connected" },
        href: { type: String, default: "/contact" },
      },
    },
    seo: {
      defaultTitleTemplate: {
        type: String,
        default: "%s | Light for Immigrants",
      },
      defaultDescription: String,
      keywords: [String],
      organizationSchema: {
        name: { type: String, default: "Light for Immigrants" },
        description: String,
        url: String,
        logo: String,
      },
    },
    uploads: {
      maxImageSizeMb: { type: Number, default: 10 },
      maxVideoSizeMb: { type: Number, default: 100 },
      allowedImageTypes: {
        type: [String],
        default: ["image/jpeg", "image/png", "image/webp", "image/avif"],
      },
      allowedVideoTypes: {
        type: [String],
        default: ["video/mp4", "video/webm"],
      },
    },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export type ISiteSettings = InferSchemaType<typeof SiteSettingsSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings ??
  mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);
