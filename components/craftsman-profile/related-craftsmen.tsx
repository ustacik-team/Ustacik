import { CraftsmanCard } from "@/components/craftsmen/craftsman-card";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────
export interface RelatedCraftsmanData {
  id: string;
  name: string;
  businessName: string | null;
  image: string | null;
  verificationLevel: "REGISTERED" | "VERIFIED" | "APPROVED";
  rating: number;
  reviewCount: number;
  category: string;
  subServices: string[];
  region: string;
  priceMin: number | null;
  priceMax: number | null;
  jobsCompleted: number;
}

interface RelatedCraftsmenProps {
  craftsmen: RelatedCraftsmanData[];
  className?: string;
}

export function RelatedCraftsmen({ craftsmen, className }: RelatedCraftsmenProps) {
  if (!craftsmen || craftsmen.length === 0) {
    return null;
  }

  return (
    <section className={cn("py-0", className)}>
      <h2 className="text-2xl font-bold tracking-tight mb-6">Related Craftsmen</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {craftsmen.map((craftsman) => (
          <CraftsmanCard
            key={craftsman.id}
            id={craftsman.id}
            name={craftsman.name}
            businessName={craftsman.businessName || ""}
            image={craftsman.image}
            verificationLevel={craftsman.verificationLevel}
            rating={craftsman.rating}
            reviewCount={craftsman.reviewCount}
            category={craftsman.category}
            subServices={craftsman.subServices}
            region={craftsman.region}
            priceMin={craftsman.priceMin} 
            priceMax={craftsman.priceMax} 
            jobsCompleted={craftsman.jobsCompleted}
          />
        ))}
      </div>
    </section>
  );
}