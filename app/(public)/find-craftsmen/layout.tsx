import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * Server-component layout for the /find-craftsmen route.
 *
 * The page.tsx at this route uses "use client" (it manages all filter/search
 * state client-side), so metadata cannot be exported from the page itself.
 * Next.js App Router allows metadata to live in a route-segment layout instead.
 */
export const metadata: Metadata = {
  title: "Find Craftsmen",
  description:
    "Browse verified craftsmen across Northern Cyprus. Filter by service category, region, and verification level to find the right professional for your job.",
  openGraph: {
    title: "Find Craftsmen in Northern Cyprus",
    description:
      "Browse verified craftsmen across Northern Cyprus. Filter by service category, region, and verification level to find the right professional for your job.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Find Craftsmen in Northern Cyprus",
    description:
      "Browse verified craftsmen across Northern Cyprus. Filter by service category, region, and verification level to find the right professional for your job.",
  },
};

export default function FindCraftsmenLayout({ children }: { children: ReactNode }) {
  return children;
}
