import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────
interface ReviewSummaryProps {
  totalReviews: number;
  averageRating: number;
  punctualityAvg: number;
  workmanshipAvg: number;
  priceHonestyAvg: number;
  communicationAvg: number;
  className?: string;
}

// ─── Component ──────────────────────────────────────────────────────────
export function ReviewSummary({
  totalReviews,
  averageRating,
  punctualityAvg,
  workmanshipAvg,
  priceHonestyAvg,
  communicationAvg,
  className,
}: ReviewSummaryProps) {
  // ─── Not enough reviews state ──────────────────────────────────────
  if (totalReviews < 3) {
    return (
      <Card className={cn("h-full border-border/40 bg-card/60 backdrop-blur-sm shadow-sm", className)}>
        <CardHeader className="border-b border-border/20 pb-4">
          <CardTitle className="text-lg font-bold">Review Summary</CardTitle>
        </CardHeader>
        <CardContent className="pt-8 pb-12 flex flex-col items-center justify-center text-center gap-3">
          <Star className="h-12 w-12 text-muted-foreground/30" />
          <div>
            <p className="text-lg font-medium text-muted-foreground">Not enough reviews yet.</p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Need at least 3 reviews to display an average rating.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ─── Breakdown items ──────────────────────────────────────────────────
  const breakdowns = [
    { label: "Punctuality", value: punctualityAvg },
    { label: "Workmanship", value: workmanshipAvg },
    { label: "Price Honesty", value: priceHonestyAvg },
    { label: "Communication", value: communicationAvg },
  ];

  return (
    <Card className={cn("h-full border-border/40 bg-card/60 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md", className)}>
      <CardHeader className="border-b border-border/20 pb-4">
        <CardTitle className="text-lg font-bold">Review Summary</CardTitle>
      </CardHeader>

      <CardContent className="pt-6 pb-6 space-y-8">
        
        {/* ─── TOP SECTION: LARGE OVERALL RATING ──────────────────────── */}
        <div className="flex flex-col items-center justify-center pb-6 border-b border-border/20">
          <div className="flex items-center gap-4 mb-1">
            <span className="text-6xl font-extrabold text-foreground tracking-tight">
              {averageRating.toFixed(1)}
            </span>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-500">
              <Star className="h-8 w-8 fill-yellow-500" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              {totalReviews} {totalReviews === 1 ? "Review" : "Reviews"}
            </p>
            <p className="text-xs text-muted-foreground">Average Rating</p>
          </div>
        </div>

        {/* ─── BOTTOM SECTION: BREAKDOWN GRID ──────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
          {breakdowns.map((item) => {
            const percentage = Math.min(Math.max((item.value / 5) * 100, 0), 100);
            return (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-medium">{item.label}</span>
                  <span className="font-semibold text-foreground">{item.value.toFixed(1)}</span>
                </div>
                <Progress value={percentage} className="h-2 bg-muted/40 [&>div]:bg-primary/80" />
              </div>
            );
          })}
        </div>

      </CardContent>
    </Card>
  );
}