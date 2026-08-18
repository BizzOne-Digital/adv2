function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export function getEnv() {
  return {
    mongodbUri:
      process.env.MONGODB_URI ??
      "mongodb://127.0.0.1:27017/light_for_immigrants",
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    sessionSecret: process.env.SESSION_SECRET ?? "dev-secret-change-in-production-min-32-chars",
    adminSeedEmail: process.env.ADMIN_SEED_EMAIL,
    adminSeedPassword: process.env.ADMIN_SEED_PASSWORD,
    smtp: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined,
      user: process.env.SMTP_USER,
      password: process.env.SMTP_PASSWORD,
      from: process.env.SMTP_FROM,
    },
  };
}

export function validateProductionEnv() {
  if (process.env.NODE_ENV === "production") {
    requireEnv("SESSION_SECRET");
    requireEnv("MONGODB_URI");
    requireEnv("NEXT_PUBLIC_SITE_URL");
  }
}
