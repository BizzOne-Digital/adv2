import { connectDB } from "@/lib/db/connect";
import { Page } from "@/models/Page";
import { PAGE_DEFINITIONS } from "./pages-data";

async function updateAboutPage() {
  await connectDB();

  const about = PAGE_DEFINITIONS.find((p) => p.slug === "about");
  if (!about) {
    console.log("! About page definition not found");
    process.exit(1);
  }

  const result = await Page.updateOne(
    { slug: "about" },
    {
      $set: {
        sections: about.sections,
      },
    },
  );

  if (!result.matchedCount) {
    console.log("! About page not found — run `npm run seed` first");
    process.exit(1);
  }

  console.log("✓ About page sections updated (mission + vision)");
}

updateAboutPage()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
