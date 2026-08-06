// components/craftsmen/rating.tsx
import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  /** Average rating (0–5) */
  rating: number;
  /** Total number of reviews */
  reviewCount: number;
  /** Optional additional classes */
  className?: string;
}

export function Rating({ rating, reviewCount, className }: RatingProps) {
  // If fewer than 3 reviews, show "New Craftsman" (per the brief)
  if (reviewCount < 3) {
    return (
      <span className={cn("text-sm font-medium text-muted-foreground", className)}>
        New Craftsman
      </span>
    );
  }

  // Ensure rating is within 0–5
  const clampedRating = Math.min(Math.max(rating, 0), 5);
  const fullStars = Math.floor(clampedRating);
  const hasHalfStar = clampedRating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star
          key={`full-${i}`}
          className="h-4 w-4 fill-yellow-500 text-yellow-500"
        />
      ))}

      {/* Half star */}
      {hasHalfStar && (
        <StarHalf className="h-4 w-4 fill-yellow-500 text-yellow-500" />
      )}

      {/* Empty stars */}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star
          key={`empty-${i}`}
          className="h-4 w-4 text-muted-foreground/30"
        />
      ))}

      {/* Rating number and review count */}
      <span className="ml-1 text-sm font-medium">{clampedRating.toFixed(1)}</span>
      <span className="text-sm text-muted-foreground">({reviewCount} reviews)</span>
    </div>
  );
}