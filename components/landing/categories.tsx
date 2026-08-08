import Link from "next/link";
import {
  ArrowRight,
  DoorClosed,
  Droplets,
  Fan,
  Hammer,
  PaintRoller,
  Sprout,
  Wrench,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const categories = [
  { icon: Droplets, title: "Plumbing & Water Systems", description: "Installations, repairs, leaks, and water systems.", accent: "from-cyan-300/30 to-blue-500/5" },
  { icon: Zap, title: "Electrical", description: "Safe wiring, lighting, panels, and inspections.", accent: "from-amber-300/30 to-orange-500/5" },
  { icon: Fan, title: "HVAC & Refrigeration", description: "Comfort systems, cooling, ventilation, and repair.", accent: "from-sky-300/30 to-indigo-500/5" },
  { icon: Wrench, title: "Appliance Repair", description: "Skilled diagnostics for the essentials at home.", accent: "from-violet-300/30 to-fuchsia-500/5" },
  { icon: PaintRoller, title: "Painting & Plastering", description: "Careful finishes for interior and exterior spaces.", accent: "from-rose-300/30 to-pink-500/5" },
  { icon: Hammer, title: "Carpentry & Furniture", description: "Custom joinery, doors, furniture, and repairs.", accent: "from-orange-300/30 to-amber-500/5" },
  { icon: DoorClosed, title: "Aluminium, PVC & Glass", description: "Windows, doors, glasswork, and secure fittings.", accent: "from-slate-200/30 to-sky-500/5" },
  { icon: Sprout, title: "Garden & Pool Care", description: "Outdoor maintenance, landscaping, and pool care.", accent: "from-emerald-300/30 to-teal-500/5" },
];

export function Categories() {
  return (
    <section id="categories" className="marketplace-surface relative isolate overflow-hidden bg-slate-950 py-20 text-white md:py-24">
      <div className="absolute inset-0 bg-slate-950/30" />
      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="section-kicker text-sky-200">Explore by trade</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">The right specialist for the work at hand.</h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-300">Start with a service, then compare local professionals by verification, reviews, price guidance, and availability.</p>
          </div>
          <Button variant="outline" asChild className="group shrink-0 border-white/20 bg-white/5 text-white hover:bg-white/12 hover:text-white">
            <Link href="/find-craftsmen">See all craftsmen <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div key={category.title} className="service-tile group relative min-h-56 overflow-hidden rounded-2xl border border-white/12 bg-white/7 p-5 backdrop-blur-sm">
                <div className={"absolute inset-0 bg-gradient-to-br " + category.accent + " opacity-0 transition-opacity duration-500 group-hover:opacity-100"} />
                <div className="relative flex h-full flex-col">
                  <div className="flex items-start justify-between">
                    <div className="grid size-12 place-items-center rounded-2xl border border-white/15 bg-slate-950/30 text-sky-100 shadow-lg shadow-slate-950/20"><Icon className="size-6" /></div>
                    <span className="font-mono text-xs tracking-widest text-slate-400">0{index + 1}</span>
                  </div>
                  <div className="mt-auto pt-8">
                    <h3 className="text-lg font-semibold leading-snug text-white">{category.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">{category.description}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-sky-200 opacity-80 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">Browse specialists <ArrowRight className="size-3.5" /></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
