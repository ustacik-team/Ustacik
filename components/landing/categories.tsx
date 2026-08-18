import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Droplets,
  Zap,
  Hammer,
  PaintRoller,
  Fan,
  Wrench,
  Sprout,
  ArrowRight,
  DoorClosed,
  ChevronRight,
} from "lucide-react";

const categories = [
  {
    icon: Droplets,
    title: "Plumbing & Water Systems",
    description:
      "Expert installations, repairs, and maintenance for all your plumbing and water needs.",
  },
  {
    icon: Zap,
    title: "Electrical",
    description:
      "Certified electricians handling wiring, lighting, safety checks, and electrical panels.",
  },
  {
    icon: Fan,
    title: "HVAC & Refrigeration",
    description:
      "Installation and repair of air conditioning, ventilation, refrigeration, and heating systems.",
  },
  {
    icon: Wrench,
    title: "Appliance & Electronics Repair",
    description:
      "Quick diagnostics and skilled repairs for washing machines, fridges, TVs, and more.",
  },
  {
    icon: PaintRoller,
    title: "Painting & Plastering",
    description:
      "Professional interior and exterior painting with flawless finishes and expert plastering.",
  },
  {
    icon: Hammer,
    title: "Carpentry & Furniture",
    description:
      "Custom furniture, precision woodworking, door installations, and carpentry projects.",
  },
  {
    icon: DoorClosed,
    title: "Aluminium, PVC & Glass",
    description:
      "Expert installation and repairs for windows, doors, glasswork, and aluminium structures.",
  },
  {
    icon: Sprout,
    title: "Garden & Pool Maintenance",
    description:
      "Complete landscaping, garden care, pool cleaning, and outdoor maintenance services.",
  },
];

export function Categories() {
  return (
    <section id="categories" className="py-14 md:py-20 bg-muted/20 border-y border-border/40">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14 space-y-3">
          <Badge variant="outline" className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary border-primary/30 bg-primary/5 rounded-full">
            Explore Services
          </Badge>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            Popular Service Categories
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Connect with verified local craftsmen across Northern Cyprus for your home and business projects.
          </p>
        </div>

        {/* Responsive Grid: 4 Cols Desktop, 2 Cols Tablet, 1 Col Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            const categoryUrl = `/find-craftsmen?category=${encodeURIComponent(category.title)}`;

            return (
              <Link key={index} href={categoryUrl} className="group block focus:outline-none cursor-pointer">
                <Card className="h-full relative overflow-hidden border-border/60 bg-card/80 backdrop-blur-xs transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-primary/50 group-hover:shadow-xl group-hover:shadow-primary/5 flex flex-col justify-between">
                  {/* Subtle top hover accent line */}
                  <div className="h-1 w-full bg-gradient-to-r from-primary via-primary/80 to-sky-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div>
                    <CardHeader className="pt-6 pb-3 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-105 shadow-xs">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="size-7 rounded-full bg-muted/60 text-muted-foreground flex items-center justify-center transition-all duration-300 group-hover:bg-primary/10 group-hover:text-primary group-hover:translate-x-0.5">
                          <ChevronRight className="size-4" />
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                        {category.title}
                      </h3>
                    </CardHeader>

                    <CardContent className="pb-6">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {category.description}
                      </p>
                    </CardContent>
                  </div>

                  <div className="px-6 pb-5 pt-0 flex items-center text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span>Browse Craftsmen</span>
                    <ArrowRight className="ml-1.5 size-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Browse All Categories Button */}
        <div className="mt-12 md:mt-16 flex justify-center">
          <Button size="lg" asChild className="gap-2 px-7 font-bold shadow-md hover:shadow-lg transition-all">
            <Link href="/find-craftsmen">
              Browse All Categories
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
