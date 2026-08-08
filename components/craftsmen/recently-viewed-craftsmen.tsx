"use client";

import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRecentCraftsmen } from "@/hooks/use-recent-craftsmen";

export function RecentlyViewedCraftsmen() {
  const craftsmen = useRecentCraftsmen();

  if (!craftsmen.length) return null;

  return (
    <section aria-labelledby="recently-viewed-heading" className="rounded-2xl border border-border/70 bg-card/75 p-4 shadow-sm backdrop-blur-xs">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-primary"><Clock3 className="size-4" />Pick up where you left off</p>
          <h2 id="recently-viewed-heading" className="mt-1 text-lg font-semibold">Recently viewed craftsmen</h2>
        </div>
        <Button asChild variant="ghost" size="sm" className="self-start gap-1 sm:self-auto">
          <Link href="#directory-heading">Browse all <ArrowRight className="size-4" /></Link>
        </Button>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {craftsmen.slice(0, 3).map((craftsman) => {
          const initials = craftsman.name.split(" ").map((part) => part[0]).join("").slice(0, 2);
          return (
            <Link key={craftsman.id} href={`/craftsmen/${craftsman.id}`} className="group flex items-center gap-3 rounded-xl border border-border/60 bg-background/55 p-3 transition-colors hover:border-primary/40 hover:bg-primary/5">
              <Avatar className="size-10"><AvatarImage src={craftsman.image ?? undefined} alt="" /><AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">{initials}</AvatarFallback></Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium group-hover:text-primary">{craftsman.name}</p>
                <p className="truncate text-xs text-muted-foreground">{craftsman.category} · ★ {craftsman.rating.toFixed(1)}</p>
              </div>
              <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
