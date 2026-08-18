import { connectDB } from "@/lib/db/connect";
import { Page } from "@/models/Page";

/**
 * Refreshes the home hero for existing databases seeded before the
 * photographic hero was introduced.
 */
async function updateHomeHero() {
  await connectDB();

  const result = await Page.updateOne(
    { slug: "home" },
    {
      $set: {
        "hero.eyebrow": "Ontario, Canada  •  Supporting every new beginning",
        "hero.heading": "A brighter beginning starts here.",
        "hero.subheading":
          "Guidance, community and practical support for immigrants building a new life in Canada.",
        "hero.backgroundImage": "/images/hero-background.png",
        "hero.backgroundImageAlt":
          "Immigrant families looking toward the Toronto skyline at sunset",
        "hero.theme": "dark",
      },
    },
  );

  console.log(
    result.matchedCount
      ? "✓ Home hero updated"
      : "! Home page not found — run `npm run seed` first",
  );
}

updateHomeHero()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
