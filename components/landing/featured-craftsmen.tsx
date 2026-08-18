import Link from "next/link";
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
    <section className="py-12 md:py-16 bg-muted/20">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Featured Craftsmen
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Meet our top-rated professionals, verified and ready to serve you.
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