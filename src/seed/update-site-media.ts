import { connectDB } from "@/lib/db/connect";
import { Page } from "@/models/Page";
import { PAGE_DEFINITIONS } from "./pages-data";

/**
 * Syncs page hero images and section media from seed definitions
 * into MongoDB (for sites already seeded with placeholders).
 */
async function updateSiteMedia() {
  await connectDB();

  let updated = 0;
  for (const def of PAGE_DEFINITIONS) {
    const result = await Page.updateOne(
      { slug: def.slug },
      {
        $set: {
          hero: def.hero,
          sections: def.sections,
          seo: def.seo,
        },
      },
    );
    if (result.matchedCount) updated++;
  }

  console.log(`✓ Updated media on ${updated} page(s)`);
}

updateSiteMedia()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
