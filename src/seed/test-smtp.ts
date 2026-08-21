import { readFileSync } from "node:fs";
import path from "node:path";
import { verifySmtpConnection, sendMail } from "@/lib/email/send";

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
  const ok = await verifySmtpConnection();
  if (!ok) {
    console.error("✗ SMTP connection failed — check SMTP_* variables in .env.local");
    process.exit(1);
  }
  console.log("✓ SMTP connection verified");

  const sent = await sendMail({
    subject: "Light for Immigrants — SMTP test",
    text: "This is a test email from the Light for Immigrants website SMTP setup.",
  });

  if (!sent) {
    console.error("✗ Test email could not be sent");
    process.exit(1);
  }

  console.log("✓ Test email sent successfully");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
