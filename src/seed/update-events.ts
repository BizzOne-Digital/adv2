import { readFileSync } from "node:fs";
import path from "node:path";
import { connectDB } from "@/lib/db/connect";
import { Event } from "@/models/Event";
import { EVENT_SEEDS } from "./events-data";

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
  let upserted = 0;

  for (const data of EVENT_SEEDS) {
    await Event.findOneAndUpdate(
      { slug: data.slug },
      {
        $set: {
          title: data.title,
          shortDescription: data.shortDescription,
          descriptionHtml: data.descriptionHtml,
          startDate: new Date(data.startDate),
          endDate: data.endDate ? new Date(data.endDate) : undefined,
          startTime: data.startTime,
          endTime: data.endTime,
          location: data.location,
          address: data.address,
          city: data.city ?? "Toronto",
          province: "Ontario",
          image: data.image,
          isFree: data.isFree ?? true,
          featured: data.featured ?? false,
          order: data.order,
          status: "published",
          isDeleted: false,
        },
        $setOnInsert: { slug: data.slug },
      },
      { upsert: true },
    );
    upserted++;
    console.log(`  • ${data.title}`);
  }

  const upcoming = await Event.countDocuments({
    status: "published",
    isDeleted: { $ne: true },
    startDate: { $gte: new Date() },
  });
  console.log(`✓ Synced ${upserted} event(s); ${upcoming} upcoming`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
