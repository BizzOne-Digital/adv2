import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import sharp from "sharp";
import { fileTypeFromBuffer } from "file-type";
import { connectDB } from "@/lib/db/connect";
import { MediaAsset } from "@/models/MediaAsset";
import { SiteSettings } from "@/models/SiteSettings";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");
const SAFE_MAX_IMAGE_MB = 10;
const SAFE_MAX_VIDEO_MB = 100;

const IMAGE_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);
const VIDEO_MIMES = new Set(["video/mp4", "video/webm"]);

async function getUploadLimits() {
  await connectDB();
  const settings = await SiteSettings.findOne({ singletonKey: "main" }).lean();
  return {
    maxImageBytes:
      Math.min(
        settings?.uploads?.maxImageSizeMb ?? SAFE_MAX_IMAGE_MB,
        SAFE_MAX_IMAGE_MB,
      ) *
      1024 *
      1024,
    maxVideoBytes:
      Math.min(
        settings?.uploads?.maxVideoSizeMb ?? SAFE_MAX_VIDEO_MB,
        SAFE_MAX_VIDEO_MB,
      ) *
      1024 *
      1024,
    allowedImageTypes: settings?.uploads?.allowedImageTypes ?? [
      ...IMAGE_MIMES,
    ],
    allowedVideoTypes: settings?.uploads?.allowedVideoTypes ?? [
      ...VIDEO_MIMES,
    ],
  };
}

function getDatePath(type: "images" | "videos") {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return path.join(type, String(year), month);
}

export type UploadResult = {
  assetId: string;
  src: string;
  thumbnailSrc?: string;
  mimeType: string;
  size: number;
  type: "image" | "video";
  width?: number;
  height?: number;
  alt: string;
};

export async function processUpload(
  file: File,
  alt = "",
  userId?: string,
): Promise<UploadResult> {
  const limits = await getUploadLimits();
  const buffer = Buffer.from(await file.arrayBuffer());
  const detected = await fileTypeFromBuffer(buffer);

  if (!detected) {
    throw new Error("Unable to determine file type");
  }

  const isImage = IMAGE_MIMES.has(detected.mime);
  const isVideo = VIDEO_MIMES.has(detected.mime);

  if (!isImage && !isVideo) {
    throw new Error("Unsupported file type");
  }

  if (isImage && buffer.length > limits.maxImageBytes) {
    throw new Error("Image exceeds maximum allowed size");
  }

  if (isVideo && buffer.length > limits.maxVideoBytes) {
    throw new Error("Video exceeds maximum allowed size");
  }

  if (
    isImage &&
    !limits.allowedImageTypes.includes(detected.mime)
  ) {
    throw new Error("Image type not allowed");
  }

  if (
    isVideo &&
    !limits.allowedVideoTypes.includes(detected.mime)
  ) {
    throw new Error("Video type not allowed");
  }

  const datePath = getDatePath(isImage ? "images" : "videos");
  const dir = path.join(UPLOAD_ROOT, datePath);
  await fs.mkdir(dir, { recursive: true });

  const uuid = randomUUID();
  let filename: string;
  let publicSrc: string;
  let thumbnailSrc: string | undefined;
  let width: number | undefined;
  let height: number | undefined;

  if (isImage) {
    filename = `${uuid}.webp`;
    const outputPath = path.join(dir, filename);
    const image = sharp(buffer).rotate().withMetadata({ orientation: undefined });
    const metadata = await image.metadata();
    width = metadata.width;
    height = metadata.height;

    await image.webp({ quality: 85 }).toFile(outputPath);

    const thumbFilename = `${uuid}-thumb.webp`;
    const thumbPath = path.join(dir, thumbFilename);
    await sharp(buffer)
      .rotate()
      .resize(600, 600, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 75 })
      .toFile(thumbPath);

    publicSrc = `/uploads/${datePath.replace(/\\/g, "/")}/${filename}`;
    thumbnailSrc = `/uploads/${datePath.replace(/\\/g, "/")}/${thumbFilename}`;
  } else {
    const ext = detected.ext === "webm" ? "webm" : "mp4";
    filename = `${uuid}.${ext}`;
    const outputPath = path.join(dir, filename);
    await fs.writeFile(outputPath, buffer);
    publicSrc = `/uploads/${datePath.replace(/\\/g, "/")}/${filename}`;
  }

  await connectDB();
  const asset = await MediaAsset.create({
    filename,
    originalName: file.name,
    src: publicSrc,
    thumbnailSrc,
    mimeType: detected.mime,
    size: buffer.length,
    type: isImage ? "image" : "video",
    alt,
    width,
    height,
    uploadedBy: userId,
  });

  return {
    assetId: String(asset._id),
    src: publicSrc,
    thumbnailSrc,
    mimeType: detected.mime,
    size: buffer.length,
    type: isImage ? "image" : "video",
    width,
    height,
    alt,
  };
}

export async function deleteMediaFile(src: string) {
  if (!src.startsWith("/uploads/")) return;
  const filePath = path.join(process.cwd(), "public", src.replace(/^\//, ""));
  const resolved = path.resolve(filePath);
  const uploadsRoot = path.resolve(UPLOAD_ROOT);
  if (!resolved.startsWith(uploadsRoot)) return;
  try {
    await fs.unlink(resolved);
  } catch {
    // file may already be gone
  }
}
