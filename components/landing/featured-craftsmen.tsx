import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CraftsmanCard } from "@/components/craftsmen/craftsman-card";

// ─── Types ──────────────────────────────────────────────────────────────
export interface FeaturedCraftsman {
  id: string;
  name: string;
  businessName: string | null;
  image: string | null;
  verificationLevel: "REGISTERED" | "VERIFIED" | "APPROVED";
  rating: number;
  reviewCount: number;
  category: string;
  subServices: string[]; // ✅ Added this field to match CraftsmanCardProps
  region: string;
  priceMin: number;
  priceMax: number;
  jobsCompleted: number;
}

interface FeaturedCraftsmenProps {
  craftsmen: FeaturedCraftsman[];
}

export function FeaturedCraftsmen({ craftsmen }: FeaturedCraftsmenProps) {
  if (!craftsmen || craftsmen.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-muted/20 py-20 md:py-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
              <Sparkles className="mr-1.5 size-3.5" />
              Handpicked profiles
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Featured Craftsmen
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Highly rated local professionals with the details you need to hire confidently.
            </p>
          </div>
          
          <Button asChild variant="outline" className="shrink-0">
            <Link href="/craftsmen">
              View All Craftsmen
            </Link>
          </Button>
        </div>

        {/* Responsive Grid: 3 columns on LG, 4 on XL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {craftsmen.map((craftsman) => (
            <CraftsmanCard 
              key={craftsman.id} 
              {...craftsman}
              businessName={craftsman.businessName || ""} 
            />
          ))}
        </div>

      </div>
    </section>
  );
}
