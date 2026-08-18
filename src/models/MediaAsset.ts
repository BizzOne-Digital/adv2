import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const MediaAssetSchema = new Schema(
  {
    filename: { type: String, required: true },
    originalName: String,
    src: { type: String, required: true },
    thumbnailSrc: String,
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    type: { type: String, enum: ["image", "video", "document"], default: "image" },
    alt: { type: String, default: "" },
    width: Number,
    height: Number,
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User" },
    references: [{ model: String, id: Schema.Types.ObjectId, field: String }],
  },
  { timestamps: true },
);

MediaAssetSchema.index({ filename: 1 });
MediaAssetSchema.index({ type: 1, createdAt: -1 });
MediaAssetSchema.index({ originalName: "text", alt: "text" });

export type IMediaAsset = InferSchemaType<typeof MediaAssetSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const MediaAsset: Model<IMediaAsset> =
  mongoose.models.MediaAsset ??
  mongoose.model<IMediaAsset>("MediaAsset", MediaAssetSchema);
