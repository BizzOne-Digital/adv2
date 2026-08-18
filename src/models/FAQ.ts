import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import type { PublishStatus } from "@/types";

const FAQCategorySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    order: { type: Number, default: 0 },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export type IFAQCategory = InferSchemaType<typeof FAQCategorySchema> & {
  _id: mongoose.Types.ObjectId;
};

export const FAQCategory: Model<IFAQCategory> =
  mongoose.models.FAQCategory ??
  mongoose.model<IFAQCategory>("FAQCategory", FAQCategorySchema);

const FAQSchema = new Schema(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "FAQCategory",
      required: true,
      index: true,
    },
    question: { type: String, required: true },
    answerHtml: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
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

FAQSchema.index({ question: "text", answerHtml: "text" });

export type IFAQ = InferSchemaType<typeof FAQSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const FAQ: Model<IFAQ> =
  mongoose.models.FAQ ?? mongoose.model<IFAQ>("FAQ", FAQSchema);
