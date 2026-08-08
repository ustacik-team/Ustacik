"use client";

import Link from "next/link";
import { Heart, Search, ShieldCheck, Sparkles } from "lucide-react";

import { CraftsmanCard } from "@/components/craftsmen/craftsman-card";
import { Button } from "@/components/ui/button";
import { allCraftsmen } from "@/lib/mock-craftsmen";
import { useSavedCraftsmen } from "@/hooks/use-saved-craftsmen";

export function SavedCraftsmenPage() {
  const { savedIds } = useSavedCraftsmen();
  const savedCraftsmen = allCraftsmen.filter((craftsman) => savedIds.includes(craftsman.id));

  return (
    <div className="mx-auto max-w-7xl space-y-7 pb-8">
      <section className="relative overflow-hidden rounded-3xl border border-rose-500/15 bg-gradient-to-br from-rose-500/[0.09] via-background to-primary/[0.06] p-6 md:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-rose-500/10 blur-3xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <Heart className="size-4 fill-current" />
              <span className="section-kicker">Your shortlist</span>
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Saved craftsmen</h1>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">Keep the professionals you want to compare close by. Their current ratings, verification level, and price guidance are always visible here.</p>
          </div>
          <Button asChild className="gap-2 shadow-md shadow-primary/15">
            <Link href="/find-craftsmen"><Search className="size-4" /> Find craftsmen</Link>
          </Button>
        </div>
      </section>

      {savedCraftsmen.length ? (
        <>
          <section className="grid gap-4 sm:grid-cols-3">
            <Summary label="Saved professionals" value={String(savedCraftsmen.length)} detail="Ready to review when you are" Icon={Heart} tone="text-rose-600 bg-rose-500/10" />
            <Summary label="Verified or approved" value={String(savedCraftsmen.filter((item) => item.verificationLevel !== "REGISTERED").length)} detail="Completed platform trust checks" Icon={ShieldCheck} tone="text-emerald-600 bg-emerald-500/10" />
            <Summary label="Top shortlist rating" value={Math.max(...savedCraftsmen.map((item) => item.rating)).toFixed(1)} detail="Based on customer feedback" Icon={Sparkles} tone="text-primary bg-primary/10" />
          </section>

          <section>
            <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Your saved professionals</h2>
                <p className="mt-1 text-sm text-muted-foreground">Use the heart on a card to remove someone from this shortlist.</p>
              </div>
              <p className="text-sm font-medium text-muted-foreground">{savedCraftsmen.length} saved</p>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {savedCraftsmen.map((craftsman) => <CraftsmanCard key={craftsman.id} {...craftsman} />)}
            </div>
          </section>
        </>
      ) : (
        <section className="grid min-h-96 place-items-center rounded-3xl border border-dashed border-border/80 bg-muted/[0.18] p-8 text-center">
          <div className="max-w-md">
            <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400"><Heart className="size-6" /></div>
            <h2 className="mt-5 text-xl font-bold">Your shortlist is ready when you are.</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Save a professional from the directory to compare their details later without having to search again.</p>
            <Button asChild className="mt-5 gap-2"><Link href="/find-craftsmen">Explore craftsmen <Search className="size-4" /></Link></Button>
          </div>
        </section>
      )}
    </div>
  );
}

function Summary({
  label,
  value,
  detail,
  Icon,
  tone,
}: {
  label: string;
  value: string;
  detail: string;
  Icon: typeof Heart;
  tone: string;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/85 p-5">
      <div className={"grid size-10 place-items-center rounded-xl " + tone}><Icon className="size-5" /></div>
      <p className="mt-5 text-3xl font-bold tracking-tight">{value}</p>
      <p className="mt-1 text-sm font-semibold">{label}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{detail}</p>
    </div>
  );
}
