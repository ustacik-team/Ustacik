import { Briefcase, Globe, MessageSquare, UserCheck } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const stats = [
  {
    icon: UserCheck,
    label: "Verified Craftsmen",
    value: "150+",
    description: "Profiles manually reviewed for your peace of mind.",
  },
  {
    icon: Briefcase,
    label: "Completed Jobs",
    value: "152",
    description: "Successful projects across the trades people need most.",
  },
  {
    icon: MessageSquare,
    label: "Customer Reviews",
    value: "1.2k",
    description: "Genuine community feedback to inform every decision.",
  },
  {
    icon: Globe,
    label: "Regions Covered",
    value: "5",
    description: "Helping homes and businesses across Northern Cyprus.",
  },
];

export function TrustStats() {
  return (
    <section className="relative z-20 -mt-8 pb-12 md:-mt-10 md:pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid overflow-hidden rounded-2xl border border-border/70 bg-background/92 shadow-xl shadow-slate-950/10 backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card
              key={stat.label}
              className={"group rounded-none border-0 bg-transparent shadow-none transition-colors hover:bg-primary/[0.035] " + (index !== 3 ? "border-b border-border/50 lg:border-b-0 lg:border-r " : "") + (index === 1 ? "sm:border-b-0 sm:border-r-0 lg:border-r " : "") + (index === 2 ? "sm:border-b-0 sm:border-r " : "")}
            >
              <CardContent className="space-y-3 p-6 text-center md:p-7">
                <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                  <stat.icon className="size-6" />
                </div>
                <div className="text-3xl font-bold tracking-tight text-foreground">{stat.value}</div>
                <div className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">{stat.label}</div>
                <div className="mx-auto max-w-[210px] text-xs leading-relaxed text-muted-foreground/80">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
