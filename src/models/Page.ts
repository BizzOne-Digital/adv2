import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { ContentSectionSchema, PageSeoSchema } from "./shared";
import type { PublishStatus } from "@/types";

const PageSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    status: {
      type: String,
      enum: ["draft", "published", "archived"] as PublishStatus[],
      default: "draft",
    },
    hero: {
      eyebrow: String,
      heading: String,
      subheading: String,
      bodyHtml: String,
      backgroundImage: String,
      backgroundImageAlt: String,
      mobileBackgroundImage: String,
      backgroundVideo: String,
      theme: { type: String, default: "dark" },
    },
    sections: [ContentSectionSchema],
    seo: PageSeoSchema,
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

PageSchema.index({ slug: 1 });
PageSchema.index({ status: 1 });

export type IPage = InferSchemaType<typeof PageSchema> & { _id: mongoose.Types.ObjectId };

export const Page: Model<IPage> =
  mongoose.models.Page ?? mongoose.model<IPage>("Page", PageSchema);
