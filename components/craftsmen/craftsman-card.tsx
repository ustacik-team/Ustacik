import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  DollarSign,
  MapPin,
  ShieldCheck,
  Star,
} from "lucide-react";

import { SaveCraftsmanButton } from "@/components/craftsmen/save-craftsman-button";
import { VerificationBadge } from "@/components/craftsmen/verification-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface CraftsmanCardProps {
  id: string;
  name: string;
  businessName: string;
  image?: string | null;
  verificationLevel: "REGISTERED" | "VERIFIED" | "APPROVED";
  rating: number;
  reviewCount: number;
  category: string;
  subServices: string[];
  region: string;
  priceMin: number | null;
  priceMax: number | null;
  jobsCompleted: number;
  comparisonSelected?: boolean;
  onToggleComparison?: (craftsmanId: string) => void;
  className?: string;
}

const verificationAccents = {
  REGISTERED: "from-blue-400/20 to-blue-500/20",
  VERIFIED: "from-emerald-400/20 to-emerald-500/20",
  APPROVED: "from-amber-400/20 to-amber-500/20",
};

export function CraftsmanCard({
  id,
  name,
  businessName,
  image,
  verificationLevel,
  rating,
  reviewCount,
  category,
  subServices,
  region,
  priceMin,
  priceMax,
  jobsCompleted,
  comparisonSelected = false,
  onToggleComparison,
  className,
}: CraftsmanCardProps) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .join("")
    .slice(0, 2);

  const priceRange =
    priceMin !== null && priceMax !== null
      ? `₺${priceMin.toLocaleString()} – ₺${priceMax.toLocaleString()}`
      : "Price on request";

  return (
    <Card
      className={cn(
        "group relative h-full overflow-hidden rounded-2xl border-border/60 bg-card/80 backdrop-blur-xs transition-all duration-300",
        "hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 dark:hover:shadow-primary/10",
        className,
      )}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <CardContent className="flex h-full flex-col justify-between space-y-5 p-6">
        <div className="flex items-start gap-3">
          <Link
            href={`/craftsmen/${id}`}
            className="flex min-w-0 flex-1 items-start gap-4 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="relative shrink-0">
              <div
                className={cn(
                  "absolute -inset-1 rounded-full bg-gradient-to-br blur-xl opacity-0 transition-opacity duration-300 group-hover:opacity-70",
                  verificationAccents[verificationLevel],
                )}
              />
              <Avatar className="relative h-16 w-16 border-2 border-background shadow-md transition-transform duration-300 group-hover:scale-105">
                <AvatarImage src={image || undefined} alt={name} />
                <AvatarFallback className="bg-primary/10 text-base font-semibold text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className="line-clamp-1 text-lg font-bold leading-tight tracking-tight transition-colors group-hover:text-primary">
                  {name}
                </h3>
                {verificationLevel !== "REGISTERED" && (
                  <ShieldCheck className="size-5 shrink-0 text-emerald-500" aria-label="Verified professional" />
                )}
              </div>
              <p className="line-clamp-1 text-sm font-medium text-muted-foreground">{businessName}</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                <VerificationBadge level={verificationLevel} />
                {verificationLevel !== "REGISTERED" && (
                  <Badge variant="outline" className="shrink-0 border-emerald-200 bg-emerald-50/50 px-2 py-0 text-[10px] font-medium text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950/20">
                    Trusted
                  </Badge>
                )}
              </div>
            </div>
          </Link>
          <SaveCraftsmanButton craftsmanId={id} craftsmanName={name} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 rounded-xl bg-muted/40 px-3 py-2.5 transition-colors group-hover:bg-muted/60">
            <Star className="size-4 fill-amber-400 text-amber-400" />
            <div className="leading-tight">
              <p className="text-sm font-bold">{rating.toFixed(1)}</p>
              <p className="text-[10px] text-muted-foreground">{reviewCount} reviews</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-muted/40 px-3 py-2.5 transition-colors group-hover:bg-muted/60">
            <Briefcase className="size-4 text-primary/70" />
            <div className="leading-tight">
              <p className="text-sm font-bold">{jobsCompleted}</p>
              <p className="text-[10px] text-muted-foreground">jobs completed</p>
            </div>
          </div>
        </div>

        <div className="space-y-2.5 border-t border-border/40 pt-3.5 text-sm">
          <div className="flex items-center gap-3">
            <MapPin className="size-4 shrink-0 text-muted-foreground/70" />
            <span className="text-muted-foreground">Location</span>
            <span className="ml-auto font-medium">{region}</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="grid size-4 shrink-0 place-items-center text-xs text-muted-foreground/70">⚙</span>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 font-medium">{category}</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {subServices.slice(0, 3).map((service) => (
                  <span key={service} className="rounded-full border border-primary/15 bg-primary/8 px-2 py-0.5 text-[10px] font-medium text-primary">
                    {service}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <DollarSign className="size-4 shrink-0 text-muted-foreground/70" />
            <span className="text-muted-foreground">Price guidance</span>
            <span className="ml-auto font-semibold text-primary">{priceRange}</span>
          </div>
        </div>

        <div className="flex gap-2">
          {onToggleComparison && (
            <Button
              type="button"
              variant={comparisonSelected ? "secondary" : "outline"}
              className="flex-1"
              aria-pressed={comparisonSelected}
              onClick={() => onToggleComparison(id)}
            >
              {comparisonSelected ? "Selected" : "Compare"}
            </Button>
          )}
          <Button asChild className="mt-1 flex-1 gap-2 bg-primary font-semibold shadow-sm transition-all duration-300 hover:bg-primary/90 hover:shadow-md hover:shadow-primary/20">
            <Link href={`/craftsmen/${id}`}>
              View profile
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
