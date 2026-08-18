import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import type { BookingStatus } from "@/types";

const BookingSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    serviceId: { type: Schema.Types.ObjectId, ref: "Service" },
    serviceName: String,
    preferredDate: String,
    preferredTime: String,
    attendees: Number,
    notes: String,
    consent: { type: Boolean, required: true },
    status: {
      type: String,
      enum: ["new", "contacted", "confirmed", "completed", "cancelled"] as BookingStatus[],
      default: "new",
    },
    isRead: { type: Boolean, default: false },
    internalNotes: String,
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

BookingSchema.index({ status: 1, createdAt: -1 });

export type IBooking = InferSchemaType<typeof BookingSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Booking: Model<IBooking> =
  mongoose.models.Booking ?? mongoose.model<IBooking>("Booking", BookingSchema);

const InquirySchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    topic: { type: String, required: true },
    message: { type: String, required: true },
    consent: { type: Boolean, required: true },
    productSlug: String,
    status: {
      type: String,
      enum: ["new", "read", "replied", "archived"],
      default: "new",
    },
    isRead: { type: Boolean, default: false },
    internalNotes: String,
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

InquirySchema.index({ status: 1, createdAt: -1 });

export type IInquiry = InferSchemaType<typeof InquirySchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Inquiry: Model<IInquiry> =
  mongoose.models.Inquiry ?? mongoose.model<IInquiry>("Inquiry", InquirySchema);
