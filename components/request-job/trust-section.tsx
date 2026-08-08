import { BadgeCheck, CheckCircle2, FileCheck2, ImageIcon, ShieldCheck, UsersRound } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TrustSectionProps { hasGuarantee: boolean; hasBusinessRegistration: boolean }
export function TrustSection({ hasGuarantee, hasBusinessRegistration }: TrustSectionProps) {
  const checks = [
    [ShieldCheck, "Verified identity", "Identity details reviewed by Ustacik", true],
    [UsersRound, "Previous customers verified", "Reviews come from completed jobs", true],
    [ImageIcon, "Work photos reviewed", "Portfolio evidence is checked", true],
    [FileCheck2, "Business registration", hasBusinessRegistration ? "Registration has been reviewed" : "Not available at this verification level", hasBusinessRegistration],
    [BadgeCheck, "Workmanship guarantee", hasGuarantee ? "Included with this approved craftsman" : "Not available at this verification level", hasGuarantee],
  ] as const;
  return <Card className="border-primary/10 bg-linear-to-br from-primary/5 via-card to-card"><CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" />Book with more confidence</CardTitle></CardHeader><CardContent className="space-y-3">
    <div className="grid gap-3 sm:grid-cols-2">{checks.map(([Icon, title, detail, enabled]) => <div key={title} className="flex gap-3 rounded-xl border border-border/60 bg-background/50 p-3"><div className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full ${enabled ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"}`}>{enabled ? <CheckCircle2 className="size-4" /> : <Icon className="size-4" />}</div><div><p className="text-sm font-semibold">{title}</p><p className="text-xs text-muted-foreground">{detail}</p></div></div>)}</div>
    <p className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs leading-relaxed text-muted-foreground">Ustacik connects customers with craftsmen but does not guarantee the work. Please agree on scope, pricing, and timing directly before any work begins.</p>
  </CardContent></Card>;
}
