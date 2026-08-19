import { readFileSync } from "node:fs";
import path from "node:path";
import { connectDB } from "@/lib/db/connect";
import { Page } from "@/models/Page";

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

const HOME_TRUST_STRIP = {
  eyebrow: "Community-led support",
  heading: "Rooted in Ontario, open to all",
  subheading:
    "Programs shaped with immigrants, families, youth, seniors, volunteers, and partner organizations.",
  bodyHtml: "",
  theme: "dark",
};

const HOME_IMPACT_METRICS = {
  eyebrow: "Community impact",
  heading: "Growing together across Ontario",
  subheading:
    "Community-led programs that welcome newcomers, strengthen families, and build lasting connections.",
  bodyHtml: JSON.stringify([
    { value: "500+", label: "Orientation conversations" },
    { value: "120+", label: "Workshops delivered" },
    { value: "40+", label: "Community partners" },
    { value: "15+", label: "Languages supported in referrals" },
  ]),
};

async function patchSection(
  slug: string,
  sectionKey: string,
  patch: Record<string, unknown>,
) {
  const page = await Page.findOne({ slug });
  if (!page) {
    console.log(`  Page "${slug}" not found — skipped`);
    return;
  }

  const sections = page.sections ?? [];
  const idx = sections.findIndex((s) => String(s.key) === sectionKey);
  if (idx === -1) {
    console.log(`  Section "${sectionKey}" not on ${slug} — skipped`);
    return;
  }

  const current = sections[idx];
  for (const [field, value] of Object.entries(patch)) {
    (current as unknown as Record<string, unknown>)[field] = value;
  }
  page.markModified("sections");
  await page.save();
  console.log(`  ✓ Updated ${slug} → ${sectionKey}`);
}

async function main() {
  await connectDB();

  await patchSection("home", "trust-strip", HOME_TRUST_STRIP);
  await patchSection("home", "impact-metrics", HOME_IMPACT_METRICS);

  console.log("Done.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
