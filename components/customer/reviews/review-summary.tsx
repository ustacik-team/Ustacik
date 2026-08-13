import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Star, PenLine, Award } from "lucide-react";
import { RatingBreakdownItem } from "@/components/craftsman/reviews/rating-breakdown";

interface ReviewSummaryProps {
  totalReviews: number;
  avgOverall: number;
  avgPunctuality: number;
  avgWorkmanship: number;
  avgPriceHonesty: number;
  avgCommunication: number;
}

export function ReviewSummary({
  totalReviews,
  avgOverall,
  avgPunctuality,
  avgWorkmanship,
  avgPriceHonesty,
  avgCommunication,
}: ReviewSummaryProps) {
  const fullStars = Math.floor(avgOverall);
  const hasHalfStar = avgOverall % 1 >= 0.5;

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* 1. Overall Score Box */}
      <Card className="border-border/70 bg-gradient-to-br from-card via-card to-amber-500/5 flex flex-col justify-between">
        <CardHeader className="p-5 pb-2">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Award className="size-4 text-amber-500" />
            <span>Average Rating Given</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Your average rating across {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-5 pt-0 text-center space-y-3">
          <div className="flex flex-col items-center justify-center my-2">
            <span className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">
              {avgOverall.toFixed(1)}
            </span>

            {/* Stars rendering */}
            <div className="flex items-center gap-1 my-2">
              {Array.from({ length: 5 }).map((_, i) => {
                const isFilled = i < fullStars;
                const isHalf = i === fullStars && hasHalfStar;

                return (
                  <Star
                    key={i}
                    className={`size-5 ${
                      isFilled
                        ? "fill-amber-500 text-amber-500"
                        : isHalf
                        ? "fill-amber-500/50 text-amber-500"
                        : "text-muted-foreground/30"
                    }`}
                  />
                );
              })}
            </div>

            <span className="text-xs font-semibold text-muted-foreground">
              Based on your review history
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20 mx-auto">
            <PenLine className="size-3.5" />
            <span>{totalReviews} {totalReviews === 1 ? "Review" : "Reviews"} Written</span>
          </div>
        </CardContent>
      </Card>

      {/* 2. Rating Category Breakdown */}
      <Card className="border-border/70 bg-card md:col-span-2 flex flex-col justify-between">
        <CardHeader className="p-5 pb-2">
          <CardTitle className="text-base font-bold">Your Rating Breakdown</CardTitle>
          <CardDescription className="text-xs">
            Average ratings you&apos;ve given across the 4 key service criteria on Ustacik
          </CardDescription>
        </CardHeader>

        <CardContent className="p-5 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <RatingBreakdownItem label="Punctuality" value={avgPunctuality} />
          <RatingBreakdownItem label="Workmanship" value={avgWorkmanship} />
          <RatingBreakdownItem label="Price Honesty" value={avgPriceHonesty} />
          <RatingBreakdownItem label="Communication" value={avgCommunication} />
        </CardContent>
      </Card>
    </div>
  );
}
