import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VerificationBadge } from "@/components/craftsmen/verification-badge";
import { 
  MapPin, 
  Briefcase, 
  Star, 
  DollarSign, 
  Phone, 
  CheckCircle2,
  ShieldCheck,
  FileText
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────
export interface ProfileHeroCraftsman {
  id: string;
  user: {
    name: string;
    image: string | null;
    phone: string | null;
  };
  businessName: string | null;
  region: { name: string };
  categories: { name: string }[];
  verificationLevel: "REGISTERED" | "VERIFIED" | "APPROVED";
  totalJobsCompleted: number;
  priceRangeMin: number | null;
  priceRangeMax: number | null;
  workmanshipGuarantee: boolean;
  reviews: { rating: number }[];
}

interface ProfileHeroProps {
  craftsman: ProfileHeroCraftsman;
}

// ─── Component ──────────────────────────────────────────────────────────
export function ProfileHero({ craftsman }: ProfileHeroProps) {
  const { user, businessName, region, categories, verificationLevel, totalJobsCompleted, priceRangeMin, priceRangeMax, workmanshipGuarantee, reviews } = craftsman;

  // Calculate average rating
  const reviewCount = reviews.length;
  const averageRating = reviewCount > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount) 
    : 0;

  const initials = user.name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .join("")
    .slice(0, 2);

  const priceRangeDisplay = 
    (priceRangeMin && priceRangeMax) 
      ? `₺${priceRangeMin.toLocaleString()} – ₺${priceRangeMax.toLocaleString()}`
      : "Price on request";

  // Matching badge logic from VerificationCard
  const levelConfig = {
    REGISTERED: {
      label: "Registered",
      badgeColor: "bg-slate-500/15 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400 border-slate-200 dark:border-slate-800",
    },
    VERIFIED: {
      label: "Verified",
      badgeColor: "bg-blue-500/15 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    },
    APPROVED: {
      label: "Approved Craftsman",
      badgeColor: "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    },
  };
  const currentLevel = levelConfig[verificationLevel];

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent -z-10" />

      <div className="pt-6 lg:pt-8 pb-2 lg:pb-2">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* ─── LEFT CARD: PROFILE INFO ────────────────────────────── */}
          <Card className="lg:col-span-2 border-border/40 bg-card/60 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md">
            <CardHeader className="border-b border-border/20 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-bold">
                <FileText className="h-5 w-5 text-primary" />
                Profile Information
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-6 pb-6 space-y-5 flex-1 flex-col justify-between">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="relative shrink-0 mx-auto sm:mx-0">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 blur-xl opacity-70" />
                  <Avatar className="h-28 w-28 lg:h-32 lg:w-32 border-4 border-background shadow-xl relative z-10">
                    <AvatarImage src={user.image || undefined} alt={user.name} />
                    <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-1 space-y-3 text-center sm:text-left">
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
                      {user.name}
                    </h1>
                    {businessName && (
                      <p className="text-lg font-medium text-muted-foreground mt-1">
                        {businessName}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                    {categories.slice(0, 3).map((cat) => (
                      <Badge key={cat.name} variant="secondary" className="text-xs font-medium px-3 py-1">
                        {cat.name}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-4 gap-y-2 text-sm text-muted-foreground pt-2">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-primary/70" />
                      <span className="font-medium text-foreground">{region.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                      <VerificationBadge level={verificationLevel} />
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-6 gap-y-2 pt-2 border-t border-border/40 mt-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="h-4 w-4 fill-amber-500" />
                        <span className="font-semibold text-foreground text-base">
                          {reviewCount > 0 ? averageRating.toFixed(1) : "New"}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="h-4 w-4 text-primary/70" />
                      <span className="font-medium text-foreground">{totalJobsCompleted}</span>
                      <span className="text-xs text-muted-foreground">jobs completed</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="h-4 w-4 text-primary/70" />
                      <span className="font-medium text-foreground">{priceRangeDisplay}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ─── ACTION BUTTONS ──────────────────────────────────── */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-border/20">
                <Button size="lg" asChild className="gap-2 flex-1 sm:flex-none bg-primary hover:bg-primary/90 shadow-sm shadow-primary/20">
                  <Link href={`/craftsmen/${craftsman.id}/request`}>
                    Request a Job
                  </Link>
                </Button>
                
                {user.phone && (
                  <Button size="lg" variant="outline" asChild className="gap-2 flex-1 sm:flex-none">
                    <a href={`tel:${user.phone}`}>
                      <Phone className="h-4 w-4" />
                      Call Craftsman
                    </a>
                  </Button>
                )}
                
                {workmanshipGuarantee && (
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 ml-0 sm:ml-2">
                    <Badge className="bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 border border-emerald-200/50 dark:border-emerald-800/50 gap-1 px-3 py-1 text-xs font-semibold shadow-sm">
                      <CheckCircle2 className="h-3 w-3" />
                      Workmanship Guarantee
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* ─── RIGHT CARD: QUICK TRUST CHECK ──────────────────────── */}
          <Card className="lg:col-span-1 border-border/40 bg-card/60 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-border/20">
              <CardTitle className="flex items-center gap-2 text-lg font-bold">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Quick Trust Check
              </CardTitle>
              <Badge variant="outline" className={cn("px-3 py-1 text-xs font-semibold", currentLevel.badgeColor)}>
                {currentLevel.label}
              </Badge>
            </CardHeader>

            <CardContent className="pt-4 pb-4 space-y-3">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium leading-none">Identity Verified</p>
                    <p className="text-xs text-muted-foreground">Government ID confirmed</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium leading-none">Phone Verified</p>
                    <p className="text-xs text-muted-foreground">Active and reachable</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
                    <Star className="h-4 w-4 fill-amber-500" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium leading-none">Community Trusted</p>
                    <p className="text-xs text-muted-foreground">
                      {reviewCount} verified reviews from real customers
                    </p>
                  </div>
                </div>
              </div>

              {/* ─── BOTTOM CTA on Trust Card ──────────────────── */}
              <div className="pt-3 border-t border-border/20 flex flex-col gap-2">
                {/* ✅ FIX: Added asChild and Link to make the button functional */}
                <Button className="w-full bg-primary/90 hover:bg-primary" asChild>
                  <Link href={`/craftsmen/${craftsman.id}/request`}>
                    Request a Job
                  </Link>
                </Button>
                {user.phone && (
                  <Button variant="ghost" className="w-full gap-2 text-muted-foreground hover:text-foreground" asChild>
                    <a href={`tel:${user.phone}`}>
                      <Phone className="h-4 w-4" />
                      Call now
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </section>
  );
}