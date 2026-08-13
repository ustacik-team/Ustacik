import { BadgeCheck, CheckCircle2, FileCheck2, ShieldCheck, UsersRound } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TrustSectionProps {
  hasGuarantee: boolean;
  hasBusinessRegistration: boolean;
}

export function TrustSection({ hasGuarantee, hasBusinessRegistration }: TrustSectionProps) {
  const steps = [
    { title: "1. Request submitted", desc: "Your job details are sent directly to the craftsman." },
    { title: "2. Craftsman reviews", desc: "The craftsman examines the title, description, and address." },
    { title: "3. Accept or decline", desc: "The craftsman responds to accept or decline the request." },
    { title: "4. Track status", desc: "You can follow progress anytime under 'My Job Requests'." },
  ];

  const checks = [
    { Icon: ShieldCheck, title: "Verified identity", detail: "Identity details reviewed by Ustacik", enabled: true },
    { Icon: UsersRound, title: "Verified customer reviews", detail: "Reviews stem from real completed jobs", enabled: true },
    { Icon: FileCheck2, title: "Business registration", detail: hasBusinessRegistration ? "Registration documented" : "Standard verification level", enabled: hasBusinessRegistration },
    { Icon: BadgeCheck, title: "Workmanship guarantee", detail: hasGuarantee ? "Included with this approved craftsman" : "Not applicable for this level", enabled: hasGuarantee },
  ];

  return (
    <Card className="border-primary/10 bg-gradient-to-br from-primary/5 via-card to-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ShieldCheck className="size-5 text-primary" />
          What happens next?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, idx) => (
            <div key={idx} className="rounded-xl border border-border/60 bg-background/50 p-3 space-y-1">
              <p className="text-xs font-bold text-primary">{step.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-border/60 pt-4">
          <p className="text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Craftsman Trust Standards</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {checks.map(({ Icon, title, detail, enabled }) => (
              <div key={title} className="flex gap-3 rounded-xl border border-border/60 bg-background/50 p-3">
                <div className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full ${enabled ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-muted text-muted-foreground"}`}>
                  {enabled ? <CheckCircle2 className="size-4" /> : <Icon className="size-4" />}
                </div>
                <div>
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="text-xs text-muted-foreground">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
          Ustacik connects customers with craftsmen. Please discuss the final scope, pricing, and timing directly with the craftsman.
        </p>
      </CardContent>
    </Card>
  );
}
