import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const ActivityLogSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    userEmail: String,
    action: { type: String, required: true },
    resource: { type: String, required: true },
    resourceId: Schema.Types.ObjectId,
    details: Schema.Types.Mixed,
    ipAddress: String,
  },
  { timestamps: true },
);

ActivityLogSchema.index({ createdAt: -1 });
ActivityLogSchema.index({ resource: 1, resourceId: 1 });

export type IActivityLog = InferSchemaType<typeof ActivityLogSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const ActivityLog: Model<IActivityLog> =
  mongoose.models.ActivityLog ??
  mongoose.model<IActivityLog>("ActivityLog", ActivityLogSchema);
