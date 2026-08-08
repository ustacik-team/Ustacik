"use client";

import { useEffect } from "react";

import { rememberCraftsman } from "@/hooks/use-recent-craftsmen";
import type { Craftsman } from "@/lib/mock-craftsmen";

export function RecentViewTracker({ craftsman }: { craftsman: Craftsman }) {
  useEffect(() => {
    rememberCraftsman(craftsman);
  }, [craftsman]);

  return null;
}
