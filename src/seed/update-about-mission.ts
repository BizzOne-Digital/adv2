import { connectDB } from "@/lib/db/connect";
import { Page } from "@/models/Page";
import { PAGE_DEFINITIONS } from "./pages-data";

async function updateAboutMission() {
  await connectDB();

  const about = PAGE_DEFINITIONS.find((p) => p.slug === "about");
  if (!about) {
    console.log("! About page definition not found");
    process.exit(1);
  }

  const missionSection = about.sections.find((s) => s.key === "mission-vision");
  if (!missionSection) {
    console.log("! Mission section not found in seed data");
    process.exit(1);
  }

  const result = await Page.updateOne(
    { slug: "about" },
    {
      $set: {
        "sections.$[mission]": missionSection,
      },
    },
    {
      arrayFilters: [{ "mission.key": "mission-vision" }],
    },
  );

  if (!result.matchedCount) {
    console.log("! About page not found — run `npm run seed` first");
    process.exit(1);
  }

  console.log("✓ About mission section updated");
}

updateAboutMission()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
