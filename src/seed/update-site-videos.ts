import { readFileSync } from "node:fs";
import path from "node:path";
import { connectDB } from "@/lib/db/connect";
import { Page } from "@/models/Page";
import { siteVideosAsMedia } from "@/lib/media/site-assets";

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

async function main() {
  await connectDB();
  const media = siteVideosAsMedia();

  const result = await Page.updateOne(
    { slug: "home" },
    { $set: { "sections.$[videos].media": media } },
    { arrayFilters: [{ "videos.key": "community-videos" }] },
  );

  if (result.matchedCount === 0) {
    console.log("Home page or community-videos section not found");
    return;
  }

  console.log(`✓ Updated home community videos (${media.length} videos including vid4)`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
