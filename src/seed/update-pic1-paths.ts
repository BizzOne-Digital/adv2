import { readFileSync } from "node:fs";
import path from "node:path";
import { connectDB } from "@/lib/db/connect";
import { GalleryItem } from "@/models/Gallery";
import { Page } from "@/models/Page";
import { Service } from "@/models/Service";

type PatchableMedia = {
  src?: string;
  thumbnailSrc?: string | null;
};

function loadEnvFiles() {
  const root = process.cwd();
  for (const name of [".env.local", ".env"]) {
    try {
      const filePath = path.join(root, name);
      const content = readFileSync(filePath, "utf8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eq = trimmed.indexOf("=");
        if (eq === -1) continue;
        const key = trimmed.slice(0, eq).trim();
        const value = trimmed.slice(eq + 1).trim();
        if (!process.env[key]) process.env[key] = value;
      }
    } catch {
      // optional
    }
  }
}

loadEnvFiles();

const OLD_SRC = "/images/pic1";
const NEW_SRC = "/images/pic1.jpeg";

function fixMedia(media: PatchableMedia | null | undefined): boolean {
  if (!media) return false;
  let changed = false;
  if (media.src === OLD_SRC) {
    media.src = NEW_SRC;
    changed = true;
  }
  if (media.thumbnailSrc === OLD_SRC) {
    media.thumbnailSrc = NEW_SRC;
    changed = true;
  }
  return changed;
}

function fixMediaList(media: PatchableMedia[] | undefined): boolean {
  if (!media?.length) return false;
  let changed = false;
  for (const item of media) {
    if (fixMedia(item)) changed = true;
  }
  return changed;
}

async function main() {
  await connectDB();

  let pageUpdates = 0;
  const pages = await Page.find({});
  for (const page of pages) {
    let changed = false;

    for (const section of page.sections ?? []) {
      if (fixMediaList(section.media)) changed = true;
    }

    if (page.seo?.socialImage === OLD_SRC) {
      page.seo.socialImage = NEW_SRC;
      changed = true;
    }

    if (changed) {
      page.markModified("sections");
      await page.save();
      pageUpdates++;
    }
  }

  let serviceUpdates = 0;
  const services = await Service.find({});
  for (const service of services) {
    let changed = false;

    if (fixMedia(service.cardImage)) changed = true;
    if (fixMedia(service.hero?.media)) changed = true;

    for (const section of service.detailSections ?? []) {
      if (fixMediaList(section.media)) changed = true;
    }

    if (changed) {
      service.markModified("detailSections");
      await service.save();
      serviceUpdates++;
    }
  }

  let galleryUpdates = 0;
  const galleryItems = await GalleryItem.find({});
  for (const item of galleryItems) {
    if (fixMedia(item.media)) {
      await item.save();
      galleryUpdates++;
    }
  }

  console.log(
    `Updated pic1 paths: ${pageUpdates} pages, ${serviceUpdates} services, ${galleryUpdates} gallery items`,
  );
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
