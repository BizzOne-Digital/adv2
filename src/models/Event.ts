import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { MediaRefSchema, PageSeoSchema } from "./shared";
import type { PublishStatus } from "@/types";

const EventSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    shortDescription: String,
    descriptionHtml: String,
    startDate: { type: Date, required: true, index: true },
    endDate: Date,
    startTime: String,
    endTime: String,
    location: String,
    address: String,
    city: { type: String, default: "Toronto" },
    province: { type: String, default: "Ontario" },
    image: MediaRefSchema,
    isFree: { type: Boolean, default: true },
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

EventSchema.index({ status: 1, startDate: 1 });

export type IEvent = InferSchemaType<typeof EventSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Event: Model<IEvent> =
  mongoose.models.Event ?? mongoose.model<IEvent>("Event", EventSchema);
