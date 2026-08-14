import type { MetadataRoute } from "next";

/**
 * robots.ts — Ustacik craftsman marketplace
 *
 * Route analysis (Next.js App Router route groups):
 *
 * PUBLIC — crawlable:
 *   /                      (homepage)
 *   /find-craftsmen        (craftsman discovery listing)
 *   /craftsmen/[id]        (individual public craftsman profiles)
 *   /become-craftsman      (craftsman onboarding landing page — SEO-relevant)
 *   /help                  (help centre)
 *   /terms                 (terms of service)
 *
 * PRIVATE / AUTHENTICATED DASHBOARDS & UTILITIES — must not be indexed:
 *   /application-status    (authenticated craftsman application status)
 *   /admin/*               (ADMIN role only — management back-office)
 *   /craftsman/*           (CRAFTSMAN role only — private dashboard)
 *   /customer/*            (CUSTOMER role only — private dashboard)
 *   /dashboard             (role-based redirect hub — no canonical content)
 *   /settings              (authenticated user account settings)
 *   /sign-in               (authentication form)
 *   /sign-up               (authentication form)
 *   /api/*                 (backend API endpoints)
 *
 * Environment variable: NEXT_APP_URL (set in .env / .env.prod)
 * Production value: https://ustacik.vercel.app
 */

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_APP_URL?.replace(/\/$/, "") || "http://localhost:3000";

  return {
    rules: {
      userAgent: "*",
      allow: [
        "/",
        "/find-craftsmen",
        "/craftsmen/",
        "/become-craftsman",
        "/help",
        "/terms",
      ],
      disallow: [
        "/application-status",
        "/admin",
        "/admin/",
        "/craftsman",
        "/craftsman/",
        "/customer",
        "/customer/",
        "/dashboard",
        "/settings",
        "/sign-in",
        "/sign-up",
        "/api/",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
