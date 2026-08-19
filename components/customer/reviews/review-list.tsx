import { CustomerReviewItem, ReviewCard } from "./review-card";
import { ReviewsEmptyState } from "./reviews-empty-state";

interface ReviewListProps {
  reviews: CustomerReviewItem[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return <ReviewsEmptyState />;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}
