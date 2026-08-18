import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { MediaRefSchema } from "./shared";
import type { PublishStatus } from "@/types";

const TestimonialSchema = new Schema(
  {
    personName: { type: String, required: true },
    role: String,
    quote: { type: String, required: true },
    avatar: MediaRefSchema,
    video: MediaRefSchema,
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["draft", "published", "archived"] as PublishStatus[],
      default: "draft",
    },
    isSample: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

TestimonialSchema.index({ status: 1, order: 1, featured: -1 });

export type ITestimonial = InferSchemaType<typeof TestimonialSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Testimonial: Model<ITestimonial> =
  mongoose.models.Testimonial ??
  mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);
