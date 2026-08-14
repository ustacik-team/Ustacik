import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

/**
 * sitemap.ts — Ustacik craftsman marketplace
 *
 * Included routes (based on actual app/ route inspection):
 *
 * Static public pages:
 *   /                    — homepage (priority 1.0)
 *   /find-craftsmen      — craftsman discovery listing (priority 0.9)
 *   /become-craftsman    — craftsman onboarding landing (priority 0.8)
 *   /help                — help centre (priority 0.6)
 *   /terms               — terms of service (priority 0.5)
 *   /privacy             — privacy policy (priority 0.5)
 *   /cookies             — cookie policy (priority 0.4)
 *
 * Dynamic public pages:
 *   /craftsmen/[id]      — individual public craftsman profiles
 *                          Route param is CraftsmanProfile.id (cuid).
 *                          All profiles are publicly accessible — the profile
 *                          page has no auth gate. Only the /request sub-page
 *                          requires a session, so it is excluded.
 *                          lastModified: CraftsmanProfile.updatedAt
 *
 * Intentionally excluded:
 *   /application-status  — private, authenticated status checker
 *   /sign-in, /sign-up   — auth forms with no indexable content
 *   /admin/*             — ADMIN-role-gated back-office
 *   /craftsman/*         — CRAFTSMAN-role-gated private dashboard
 *   /customer/*          — CUSTOMER-role-gated private dashboard
 *   /dashboard           — role-based redirect hub
 *   /settings            — authenticated account settings
 *   /api/*               — API endpoints
 *   /craftsmen/[id]/request — redirects unauthenticated visitors to /sign-in
 *
 * Environment variable: NEXT_APP_URL (defined in .env and .env.prod)
 */

const BASE_URL =
  process.env.NEXT_APP_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

const STATIC_PAGES: MetadataRoute.Sitemap = [
  {
    url: `${BASE_URL}/`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1.0,
  },
  {
    url: `${BASE_URL}/find-craftsmen`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/become-craftsman`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/help`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    url: `${BASE_URL}/terms`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.5,
  },
  {
    url: `${BASE_URL}/privacy`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.5,
  },
  {
    url: `${BASE_URL}/cookies`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.4,
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const craftsmen = await prisma.craftsmanProfile.findMany({
    select: {
      id: true,
      updatedAt: true,
    },
  });

  const craftsmanUrls: MetadataRoute.Sitemap = craftsmen.map((profile) => ({
    url: `${BASE_URL}/craftsmen/${profile.id}`,
    lastModified: profile.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...STATIC_PAGES, ...craftsmanUrls];
}
