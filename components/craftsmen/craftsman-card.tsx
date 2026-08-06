import Link from "next/link";
import {
  MapPin,
  DollarSign,
  Briefcase,
  ArrowRight,
  Star,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VerificationBadge } from "@/components/craftsmen/verification-badge";
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
  priceMin: number;
  priceMax: number;
  jobsCompleted: number;
  className?: string;
}

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
  className,
}: CraftsmanCardProps) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .join("")
    .slice(0, 2);

  const priceRange =
    priceMin && priceMax
      ? `₺${priceMin.toLocaleString()} – ₺${priceMax.toLocaleString()}`
      : "Price on request";

  const accentColors = {
    REGISTERED: "from-blue-400/20 to-blue-500/20",
    VERIFIED: "from-emerald-400/20 to-emerald-500/20",
    APPROVED: "from-amber-400/20 to-amber-500/20",
  };

  return (
    <Link href={`/craftsmen/${id}`} className="group block h-full">
      <Card
        className={cn(
          "relative h-full overflow-hidden rounded-2xl border border-border/60 bg-card/80 backdrop-blur-xs transition-all duration-300",
          "hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 dark:hover:shadow-primary/10",
          className
        )}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <CardContent className="p-6 flex flex-col justify-between h-full space-y-5">
          {/* ─── TOP SECTION ────────────────────────────────────────── */}
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <div
                className={cn(
                  "absolute -inset-1 rounded-full bg-gradient-to-br blur-xl opacity-0 transition-opacity duration-300 group-hover:opacity-70",
                  accentColors[verificationLevel]
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
                <h3 className="text-lg font-bold leading-tight tracking-tight text-foreground line-clamp-1 transition-colors duration-200 group-hover:text-primary">
                  {name}
                </h3>
                {verificationLevel !== "REGISTERED" && (
                  <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-500" />
                )}
              </div>
              <p className="text-sm font-medium text-muted-foreground line-clamp-1">
                {businessName}
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                <VerificationBadge level={verificationLevel} />
                {verificationLevel !== "REGISTERED" && (
                  <Badge
                    variant="outline"
                    className="shrink-0 text-[10px] font-medium text-emerald-600 border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-800 px-2 py-0"
                  >
                    Trusted
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* ─── TRUST SECTION ──────────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-3">
            {/* Rating Chip */}
            <div className="flex items-center gap-2 rounded-xl bg-muted/30 px-3 py-2.5 transition-colors group-hover:bg-muted/50">
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-bold">{rating.toFixed(1)}</span>
                <span className="text-[10px] text-muted-foreground">
                  {reviewCount} reviews
                </span>
              </div>
            </div>

            {/* Jobs Chip */}
            <div className="flex items-center gap-2 rounded-xl bg-muted/30 px-3 py-2.5 transition-colors group-hover:bg-muted/50">
              <Briefcase className="h-4 w-4 text-primary/70" />
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-bold">{jobsCompleted}</span>
                <span className="text-[10px] text-muted-foreground">
                  jobs completed
                </span>
              </div>
            </div>
          </div>

          {/* ─── DETAILS SECTION ────────────────────────────────────── */}
          <div className="space-y-2.5 border-t border-border/40 pt-3.5">
            {/* Region */}
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-4 w-4 shrink-0 text-muted-foreground/60" />
              <span className="text-muted-foreground">Location</span>
              <span className="ml-auto font-medium text-foreground">
                {region}
              </span>
            </div>

            {/* Category & SubServices */}
            <div className="flex flex-col gap-1.5 text-sm">
              <div className="flex items-center gap-3">
                <span className="h-4 w-4 shrink-0 text-center text-muted-foreground/60">⚙️</span>
                <span className="text-muted-foreground">Category</span>
                <span className="ml-auto font-medium text-foreground line-clamp-1">
                  {category}
                </span>
              </div>
              {/* ✅ Enhanced Sub-services: Clean, distinct accent tags */}
              <div className="flex flex-wrap gap-2 ml-7 mt-1">
                {subServices.slice(0, 4).map((sub, idx) => (
                  <span 
                    key={idx} 
                    className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-medium text-primary border border-primary/20 shadow-sm"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 text-sm">
              <DollarSign className="h-4 w-4 shrink-0 text-muted-foreground/60" />
              <span className="text-muted-foreground">Starting price</span>
              <span className="ml-auto font-semibold text-primary">
                {priceRange}
              </span>
            </div>
          </div>

          {/* ─── BOTTOM SECTION ─────────────────────────────────────── */}
          <Button
            variant="default"
            className="w-full mt-1 gap-2 bg-primary font-semibold text-primary-foreground shadow-sm transition-all duration-300 hover:bg-primary/90 hover:shadow-md hover:shadow-primary/20 group/btn cursor-pointer"
          >
            <span>View Profile</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}