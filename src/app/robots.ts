import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mongree.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/home", "/diary", "/ai-report", "/profile", "/mongi", "/community", "/calendar", "/statistics", "/counselors"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
