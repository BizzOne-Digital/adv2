import { readFileSync } from "node:fs";
import path from "node:path";
import { connectDB } from "@/lib/db/connect";
import { TeamMember } from "@/models/TeamMember";
import { LEADERSHIP_SEEDS, LEADERSHIP_SLUGS, LEGACY_TEAM_PLACEHOLDER_SLUGS } from "./leadership-data";

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

  await TeamMember.updateMany(
    { slug: { $in: LEGACY_TEAM_PLACEHOLDER_SLUGS } },
    { $set: { isDeleted: true, status: "archived" } },
  );

  const removed = await TeamMember.deleteMany({
    slug: { $nin: LEADERSHIP_SLUGS },
  });
  if (removed.deletedCount > 0) {
    console.log(`  Removed ${removed.deletedCount} other team member(s)`);
  }

  for (const member of LEADERSHIP_SEEDS) {
    await TeamMember.findOneAndUpdate(
      { slug: member.slug },
      {
        $set: {
          name: member.name,
          role: member.role,
          shortBio: member.shortBio,
          fullBioHtml: `<p>${member.shortBio}</p>`,
          photo: member.photo,
          isLeadership: true,
          featured: true,
          order: member.order,
          status: "published",
          isDeleted: false,
        },
        $setOnInsert: { slug: member.slug },
      },
      { upsert: true },
    );
    console.log(`  • ${member.name} — ${member.role}`);
  }

  const count = await TeamMember.countDocuments({
    status: "published",
    isLeadership: true,
    isDeleted: { $ne: true },
  });
  console.log(`✓ ${count} leadership profile(s) published`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
