import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { ReviewsHeader } from "@/components/craftsman/reviews/reviews-header";
import { ReviewSummary } from "@/components/craftsman/reviews/review-summary";
import { ReviewList } from "@/components/craftsman/reviews/review-list";
import { ReviewsEmptyState } from "@/components/craftsman/reviews/reviews-empty-state";

export default async function CraftsmanReviewsPage() {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return null;
  }

  const craftsmanProfile = await prisma.craftsmanProfile.findUnique({
    where: {
      userId: session.user.id,
    },
  });

  if (!craftsmanProfile) {
    return <ReviewsEmptyState />;
  }

  const reviews = await prisma.review.findMany({
    where: {
      craftsmanId: craftsmanProfile.id,
    },
    include: {
      customer: {
        select: {
          name: true,
          image: true,
        },
      },
      job: {
        include: {
          category: true,
          subService: true,
        },
      },
      photos: {
        select: {
          id: true,
          imageUrl: true,
        },
      },
      reply: {
        select: {
          id: true,
          reply: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalReviews = reviews.length;

  if (totalReviews === 0) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <ReviewsHeader totalCount={0} />
        <ReviewsEmptyState />
      </div>
    );
  }

  // Calculate averages across real database records
  const sumOverall = reviews.reduce(
    (acc, r) => acc + (r.punctuality + r.workmanship + r.priceHonesty + r.communication) / 4,
    0
  );
  const avgOverall = sumOverall / totalReviews;
  const avgPunctuality = reviews.reduce((acc, r) => acc + r.punctuality, 0) / totalReviews;
  const avgWorkmanship = reviews.reduce((acc, r) => acc + r.workmanship, 0) / totalReviews;
  const avgPriceHonesty = reviews.reduce((acc, r) => acc + r.priceHonesty, 0) / totalReviews;
  const avgCommunication = reviews.reduce((acc, r) => acc + r.communication, 0) / totalReviews;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* 1. Header Banner */}
      <ReviewsHeader totalCount={totalReviews} />

      {/* 2. Review Summary & Rating Breakdown */}
      <ReviewSummary
        totalReviews={totalReviews}
        avgOverall={avgOverall}
        avgPunctuality={avgPunctuality}
        avgWorkmanship={avgWorkmanship}
        avgPriceHonesty={avgPriceHonesty}
        avgCommunication={avgCommunication}
      />

      {/* 3. Interactive Review List */}
      <ReviewList reviews={reviews} />
    </div>
  );
}
