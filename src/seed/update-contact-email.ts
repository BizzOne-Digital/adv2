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

async function main() {
  await connectDB();

  await SiteSettings.findOneAndUpdate(
    {},
    {
      $set: {
        "contact.primaryEmail": NEW_EMAIL,
        "contact.emailLaunchWarning": "",
      },
    },
    { upsert: true },
  );

  console.log(`✓ Site contact email updated to ${NEW_EMAIL}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
