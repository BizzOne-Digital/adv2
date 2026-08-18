import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { MediaRefSchema, PageSeoSchema } from "./shared";
import type { PublishStatus } from "@/types";

const ServiceDetailSectionSchema = new Schema(
  {
    key: { type: String, required: true },
    title: { type: String, required: true },
    bodyHtml: String,
    media: [MediaRefSchema],
    alt: String,
    layout: String,
    animation: String,
    isVisible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { _id: false },
);

const ServiceSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    shortDescription: String,
    cardImage: MediaRefSchema,
    icon: String,
    category: { type: String, required: true, index: true },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["draft", "published", "archived"] as PublishStatus[],
      default: "draft",
    },
    hero: {
      eyebrow: String,
      heading: String,
      introduction: String,
      media: MediaRefSchema,
    },
    overviewHtml: String,
    offerItems: [
      {
        title: String,
        description: String,
        icon: String,
      },
    ],
    benefitsHtml: String,
    eligibilityHtml: String,
    processSteps: [
      {
        title: String,
        description: String,
        order: Number,
      },
    ],
    resources: [
      {
        label: String,
        href: String,
        type: { type: String, enum: ["link", "download"], default: "link" },
      },
    ],
    detailSections: [ServiceDetailSectionSchema],
    relatedServiceIds: [{ type: Schema.Types.ObjectId, ref: "Service" }],
    cta: { label: String, href: String },
    seo: PageSeoSchema,
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

ServiceSchema.index({ slug: 1 });
ServiceSchema.index({ status: 1, order: 1 });
ServiceSchema.index({ title: "text", shortDescription: "text" });

export type IService = InferSchemaType<typeof ServiceSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Service: Model<IService> =
  mongoose.models.Service ?? mongoose.model<IService>("Service", ServiceSchema);
