import { Schema } from "mongoose";

export const MediaRefSchema = new Schema(
  {
    assetId: { type: Schema.Types.ObjectId, ref: "MediaAsset" },
    src: { type: String, required: true },
    thumbnailSrc: String,
    type: { type: String, enum: ["image", "video"], default: "image" },
    alt: { type: String, default: "" },
    caption: String,
    width: Number,
    height: Number,
  },
  { _id: false },
);

export const CtaSchema = new Schema(
  {
    label: { type: String, required: true },
    href: { type: String, required: true },
  },
  { _id: false },
);

export const ContentSectionSchema = new Schema(
  {
    key: { type: String, required: true },
    type: { type: String, required: true },
    internalLabel: { type: String, required: true },
    eyebrow: String,
    heading: String,
    subheading: String,
    bodyHtml: String,
    media: [MediaRefSchema],
    primaryCta: CtaSchema,
    secondaryCta: CtaSchema,
    layout: String,
    theme: String,
    animation: {
      type: String,
      enum: [
        "none",
        "fade",
        "from-left",
        "from-right",
        "from-top",
        "from-bottom",
        "stagger",
        "mask-reveal",
      ],
      default: "fade",
    },
    isVisible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { _id: false },
);

export const PageSeoSchema = new Schema(
  {
    metaTitle: String,
    metaDescription: String,
    socialImage: String,
    canonicalUrl: String,
    noIndex: { type: Boolean, default: false },
  },
  { _id: false },
);
