import { readFileSync } from "node:fs";
import path from "node:path";
import { connectDB } from "@/lib/db/connect";
import { Page } from "@/models/Page";
import { siteImagePath } from "@/lib/media/site-assets";

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

const PIC1_PATHS = new Set(["/images/pic1", "/images/pic1.jpeg"]);
const REPLACEMENT = siteImagePath(6);

async function main() {
  await connectDB();

  const page = await Page.findOne({ slug: "contact" });
  if (!page) {
    console.log("Contact page not found");
    return;
  }

  let changed = false;
  for (const section of page.sections ?? []) {
    if (section.key !== "contact-photo-strip") continue;
    for (const media of section.media ?? []) {
      if (PIC1_PATHS.has(media.src) || media.alt === "Team at reception") {
        media.src = REPLACEMENT;
        changed = true;
      }
    }
  }

  if (changed) {
    page.markModified("sections");
    await page.save();
    console.log(`✓ Contact photo strip updated (${REPLACEMENT})`);
  } else {
    console.log("No contact photo strip changes needed");
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
