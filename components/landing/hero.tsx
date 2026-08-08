import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  Star,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const serviceSignals = ["Plumbing", "Electrical", "AC & HVAC", "Carpentry"];

export function Hero() {
  return (
    <section
      className="relative flex min-h-[760px] w-full items-center overflow-hidden bg-(image:--hero-bg) bg-cover bg-right bg-no-repeat sm:min-h-[800px]"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/88 to-slate-950/15" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_20%,rgba(25,156,245,0.2),transparent_28%)]" />
      <div className="hero-orbit absolute -left-32 top-24 size-72 rounded-full border border-primary/20" />
      <div className="hero-orbit absolute -bottom-44 left-[32%] size-96 rounded-full border border-white/10 [animation-delay:-5s]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-24 md:px-12 lg:px-16">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-16">
          <div className="max-w-3xl flex-1 space-y-7 text-center lg:max-w-[53%] lg:text-left">
            <Badge
              variant="outline"
              className="inline-flex border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white shadow-lg shadow-slate-950/20 backdrop-blur-md"
            >
              <span className="relative mr-2 flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400/70" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
              </span>
              Northern Cyprus&apos;s trusted local network
            </Badge>

            <div className="space-y-5">
              <h1 className="max-w-4xl text-4xl font-extrabold tracking-[-0.045em] text-white sm:text-5xl md:text-6xl lg:text-7xl lg:leading-[1.02]">
                A better way to find a{" "}
                <span className="bg-gradient-to-r from-sky-300 via-white to-sky-200 bg-clip-text text-transparent">
                  trusted craftsman.
                </span>
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-slate-200 sm:text-xl">
                Compare vetted local professionals, real customer feedback, and clear price guidance before you make contact.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Button size="lg" asChild className="group min-w-44 gap-2 rounded-xl px-6 shadow-lg shadow-primary/30">
                <Link href="/find-craftsmen">
                  Find craftsmen
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="rounded-xl border-white/25 bg-white/5 px-6 text-white backdrop-blur-sm hover:bg-white/15 hover:text-white"
              >
                <Link href="/become-craftsman">List your trade</Link>
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 pt-2 text-sm text-slate-200 lg:justify-start">
              <span className="flex items-center gap-2"><ShieldCheck className="size-4 text-emerald-300" /> Manually reviewed profiles</span>
              <span className="flex items-center gap-2"><Star className="size-4 fill-amber-300 text-amber-300" /> Real customer reviews</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="size-4 text-sky-300" /> No hidden commission</span>
            </div>
          </div>

          <div className="hidden min-h-[380px] flex-1 lg:block">
            <div className="ml-auto mt-48 max-w-[292px] rounded-2xl border border-white/20 bg-slate-950/62 p-5 text-white shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-200">Marketplace pulse</p>
                  <p className="mt-2 text-2xl font-bold tracking-tight">Ready when you are</p>
                </div>
                <div className="grid size-10 place-items-center rounded-xl bg-primary/20 text-sky-200">
                  <BriefcaseBusiness className="size-5" />
                </div>
              </div>
              <div className="my-4 h-px bg-white/10" />
              <div className="flex items-center gap-3 text-sm text-slate-200">
                <div className="grid size-8 place-items-center rounded-full bg-emerald-400/15 text-emerald-300"><MapPin className="size-4" /></div>
                Local specialists across five regions
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {serviceSignals.map((service) => (
                  <span key={service} className="rounded-full border border-white/10 bg-white/7 px-2.5 py-1 text-[11px] font-medium text-slate-100">
                    {service}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
