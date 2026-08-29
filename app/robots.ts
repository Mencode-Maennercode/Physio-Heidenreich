import type { MetadataRoute } from "next";
import { seite } from "@/lib/site-config";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/kontakt/danke/"],
    },
    sitemap: `${seite.domain}/sitemap.xml`,
  };
}
