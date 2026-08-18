import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { MediaRefSchema, PageSeoSchema } from "./shared";
import type { PublishStatus } from "@/types";

const BlogPostSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: String,
    coverImage: MediaRefSchema,
    author: { type: String, default: "Light for Immigrants" },
    categories: [String],
    tags: [String],
    contentHtml: { type: String, required: true },
    featured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["draft", "published", "archived"] as PublishStatus[],
      default: "draft",
    },
    publishedAt: Date,
    seo: PageSeoSchema,
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

BlogPostSchema.index({ slug: 1 });
BlogPostSchema.index({ status: 1, publishedAt: -1 });
BlogPostSchema.index({ title: "text", excerpt: "text", contentHtml: "text" });

export type IBlogPost = InferSchemaType<typeof BlogPostSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const BlogPost: Model<IBlogPost> =
  mongoose.models.BlogPost ??
  mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);
