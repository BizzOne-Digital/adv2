import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { MediaRefSchema, PageSeoSchema } from "./shared";
import type { PublishStatus } from "@/types";

const ProductSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    summary: String,
    descriptionHtml: String,
    images: [MediaRefSchema],
    priceText: String,
    availability: {
      type: String,
      enum: ["available", "limited", "unavailable"],
      default: "available",
    },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["draft", "published", "archived"] as PublishStatus[],
      default: "draft",
    },
    seo: PageSeoSchema,
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

ProductSchema.index({ slug: 1 });
ProductSchema.index({ status: 1, order: 1 });

export type IProduct = InferSchemaType<typeof ProductSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Product: Model<IProduct> =
  mongoose.models.Product ?? mongoose.model<IProduct>("Product", ProductSchema);

const PricingCardSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    descriptionHtml: String,
    features: [String],
    ctaLabel: { type: String, default: "Contact us" },
    ctaHref: { type: String, default: "/contact" },
    icon: String,
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["draft", "published", "archived"] as PublishStatus[],
      default: "published",
    },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export type IPricingCard = InferSchemaType<typeof PricingCardSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const PricingCard: Model<IPricingCard> =
  mongoose.models.PricingCard ??
  mongoose.model<IPricingCard>("PricingCard", PricingCardSchema);
