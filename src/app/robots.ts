import { getEnv } from "@/lib/env";

export default function robots() {
  const { siteUrl } = getEnv();
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
