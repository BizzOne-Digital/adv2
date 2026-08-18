import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { MediaRefSchema } from "./shared";
import type { PublishStatus } from "@/types";

const GalleryCategorySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    coverImage: MediaRefSchema,
    order: { type: Number, default: 0 },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true },
);

GalleryCategorySchema.index({ slug: 1 });

export type IGalleryCategory = InferSchemaType<typeof GalleryCategorySchema> & {
  _id: mongoose.Types.ObjectId;
};

export const GalleryCategory: Model<IGalleryCategory> =
  mongoose.models.GalleryCategory ??
  mongoose.model<IGalleryCategory>("GalleryCategory", GalleryCategorySchema);

const GalleryItemSchema = new Schema(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "GalleryCategory",
      required: true,
      index: true,
    },
    title: String,
    caption: String,
    media: { type: MediaRefSchema, required: true },
    eventDate: Date,
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["draft", "published", "archived"] as PublishStatus[],
      default: "draft",
    },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

GalleryItemSchema.index({ categoryId: 1, order: 1 });
GalleryItemSchema.index({ status: 1, featured: -1 });

export type IGalleryItem = InferSchemaType<typeof GalleryItemSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const GalleryItem: Model<IGalleryItem> =
  mongoose.models.GalleryItem ??
  mongoose.model<IGalleryItem>("GalleryItem", GalleryItemSchema);
