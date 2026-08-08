import { Award, ClipboardCheck, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const verificationLevels = [
  {
    title: "Registered",
    badgeLabel: "Registered",
    badgeVariant: "secondary",
    icon: ClipboardCheck,
    description: "A profile has been created and initial identification documents are ready for review.",
  },
  {
    title: "Verified",
    badgeLabel: "Verified",
    badgeColor: "border-blue-200 bg-blue-500/15 text-blue-600 dark:border-blue-800 dark:bg-blue-500/20 dark:text-blue-400",
    icon: ShieldCheck,
    description: "Identity, trade certifications, and professional references have been checked by our trust team.",
  },
  {
    title: "Approved",
    badgeLabel: "Approved",
    badgeColor: "border-emerald-200 bg-emerald-500/15 text-emerald-600 dark:border-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400",
    icon: Award,
    description: "The highest trust level for professionals with a strong track record and consistently excellent work.",
  },
] as const;

const borderColors = ["rgb(226, 232, 240)", "rgb(59, 130, 246)", "rgb(16, 185, 129)"];

export function TrustSection() {
  return (
    <section className="py-20 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="section-kicker text-primary">Built for confidence</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Trust that is easy to understand.</h2>
          <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
            Every profile moves through a clear review path, so you can see what has actually been checked before you reach out.
          </p>
        </div>

        <div className="mx-auto mb-8 grid max-w-4xl grid-cols-3 overflow-hidden rounded-2xl border border-border/70 bg-muted/25 text-center">
          {verificationLevels.map((level, index) => (
            <div key={level.title} className="relative px-3 py-4 sm:px-6">
              {index < verificationLevels.length - 1 && <span className="absolute right-0 top-1/2 h-px w-1/2 bg-border sm:w-1/3" />}
              {index > 0 && <span className="absolute left-0 top-1/2 h-px w-1/2 bg-border sm:w-1/3" />}
              <div className={"relative z-10 mx-auto grid size-9 place-items-center rounded-full border-4 border-background " + (index === 2 ? "bg-emerald-500 text-white" : index === 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                {index + 1}
              </div>
              <p className="mt-2 text-xs font-bold uppercase tracking-wide text-muted-foreground sm:text-sm">{level.title}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {verificationLevels.map((level, index) => (
            <Card
              key={level.title}
              className="group relative overflow-hidden border-t-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
              style={{ borderTopColor: borderColors[index] }}
            >
              <div className="absolute right-4 top-3 text-5xl font-black tracking-tighter text-muted/70">0{index + 1}</div>
              <CardHeader className="relative space-y-4 pb-2 pt-6">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                  <level.icon className="size-6" />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-xl">{level.title}</CardTitle>
                  {"badgeVariant" in level ? (
                    <Badge variant={level.badgeVariant}>{level.badgeLabel}</Badge>
                  ) : (
                    <Badge className={level.badgeColor}>{level.badgeLabel}</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pb-6">
                <p className="text-sm leading-relaxed text-muted-foreground">{level.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
