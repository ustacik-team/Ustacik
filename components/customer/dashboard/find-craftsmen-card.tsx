import Link from "next/link";
import { ArrowRight, CheckCircle2, Compass, ShieldCheck, Sparkles, UserCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function FindCraftsmenCard() {
  const highlights = [
    "Verified IDs & background checks",
    "Direct request & quick response",
    "Real customer reviews & feedback",
  ];

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card flex flex-col justify-between shadow-xs">
      <CardHeader className="p-4 sm:p-5 pb-3">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Compass className="size-4 text-primary" />
          <span>Looking for a professional?</span>
        </CardTitle>
        <CardDescription className="text-xs">
          Browse verified local craftsmen by service category and region across Northern Cyprus.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 pt-1 space-y-4">
        <div className="space-y-2">
          {highlights.map((item) => (
            <div key={item} className="flex items-center gap-2 text-xs font-medium text-foreground/90">
              <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-primary/15 bg-background/60 p-3 flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <p className="text-xs font-bold flex items-center gap-1 text-primary">
              <Sparkles className="size-3" /> Ustacik Guarantee
            </p>
            <p className="text-[11px] text-muted-foreground">Find top-rated plumbers, electricians, HVAC, painters & more.</p>
          </div>
          <ShieldCheck className="size-7 text-primary/30 shrink-0" />
        </div>

        <Button asChild size="sm" className="w-full gap-2 font-semibold shadow-xs">
          <Link href="/find-craftsmen">
            <UserCheck className="size-4" />
            <span>Find a Craftsman</span>
            <ArrowRight className="size-3.5 ml-auto" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
