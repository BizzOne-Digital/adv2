import { readFileSync } from "node:fs";
import path from "node:path";
import { connectDB } from "@/lib/db/connect";
import { SiteSettings } from "@/models/SiteSettings";

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

const NEW_EMAIL = "info@lightimmigrants.ca";
const LEGACY_EMAILS = ["firstimmigrants@gmail.com", "lightforimmigrants@gmail.com"];

async function main() {
  await connectDB();

  const settings = await SiteSettings.findOne({ singletonKey: "main" }).lean();
  if (!settings) {
    console.log("No SiteSettings document found — run npm run seed first");
    return;
  }

  const updates: Record<string, string> = {
    "contact.primaryEmail": NEW_EMAIL,
    "contact.emailLaunchWarning": "",
  };

  const secondary = settings.contact?.secondaryEmail;
  if (secondary && LEGACY_EMAILS.some((legacy) => secondary.toLowerCase().includes(legacy))) {
    updates["contact.secondaryEmail"] = "";
  }

  await SiteSettings.findOneAndUpdate(
    { singletonKey: "main" },
    { $set: updates },
  );

  const before = settings.contact?.primaryEmail ?? "(empty)";
  console.log(`✓ Site contact email: ${before} → ${NEW_EMAIL}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
