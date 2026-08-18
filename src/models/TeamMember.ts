import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { MediaRefSchema } from "./shared";
import type { PublishStatus } from "@/types";

const TeamMemberSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    shortBio: String,
    fullBioHtml: String,
    photo: MediaRefSchema,
    email: String,
    showEmail: { type: Boolean, default: false },
    social: {
      linkedin: String,
      twitter: String,
      facebook: String,
      instagram: String,
    },
    isLeadership: { type: Boolean, default: false },
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

TeamMemberSchema.index({ status: 1, order: 1 });

export type ITeamMember = InferSchemaType<typeof TeamMemberSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const TeamMember: Model<ITeamMember> =
  mongoose.models.TeamMember ??
  mongoose.model<ITeamMember>("TeamMember", TeamMemberSchema);
