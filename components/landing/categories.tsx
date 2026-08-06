import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  Droplets, 
  Zap, 
  Hammer, 
  PaintRoller, 
  Fan, 
  Wrench, 
  Layers, 
  Truck,
  ArrowRight
} from "lucide-react";

const categories = [
  {
    icon: Droplets,
    title: "Plumbing & Heating",
    description: "Expert repairs, installations, and maintenance for all your plumbing needs.",
  },
  {
    icon: Zap,
    title: "Electrical Services",
    description: "Certified electricians handling wiring, lighting, and electrical safety.",
  },
  {
    icon: Hammer,
    title: "Carpentry & Joinery",
    description: "Custom furniture, door installations, and precise woodworking projects.",
  },
  {
    icon: PaintRoller,
    title: "Painting & Decorating",
    description: "Professional interior and exterior painting with a flawless finish.",
  },
  {
    icon: Fan,
    title: "HVAC & Cooling",
    description: "Installation and repair of air conditioning, ventilation, and heating systems.",
  },
  {
    icon: Wrench,
    title: "Appliance Repairs",
    description: "Quick diagnostics and repairs for washing machines, fridges, and more.",
  },
  {
    icon: Layers,
    title: "Tiling & Masonry",
    description: "High-quality tiling for bathrooms, kitchens, and custom stonework.",
  },
  {
    icon: Truck,
    title: "Moving & Assembly",
    description: "Reliable moving services and expert assembly for your furniture.",
  },
];

export function Categories() {
  return (
    <section id="categories" className="py-12 md:py-16 bg-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Section Header (Optional but recommended) */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Services We Offer
          </h2>
          <p className="mt-2 text-lg text-muted-foreground">
            Choose from a wide range of verified professionals ready to help.
          </p>
        </div>

        {/* Responsive Grid: 4 Cols Desktop, 2 Cols Tablet, 1 Col Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Card 
              key={index} 
              className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <CardHeader className="pt-6 pb-2">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <category.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">{category.title}</h3>
              </CardHeader>
              <CardContent className="pb-6">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {category.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Browse Category Button */}
        <div className="mt-12 flex justify-center">
          <Button size="lg" asChild className="gap-2">
            <Link href="/find-craftsmen">
              Browse Category
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

      </div>
    </section>
  );
}