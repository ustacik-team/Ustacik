import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess } from "@/lib/api/response";
import { handleApiError } from "@/lib/api/errors";

export async function GET(req: NextRequest) {
  try {
    // Fetch craftsmen that are APPROVED and have at least one review
    const craftsmen = await prisma.craftsmanProfile.findMany({
      where: {
        verificationLevel: "APPROVED",
        reviews: {
          some: {}, // has at least one review
        },
      },
      include: {
        user: { select: { name: true, image: true } },
        region: { select: { name: true } },
        categories: { include: { category: { select: { name: true } } }, take: 1 },
        subServices: {
          include: { subService: { select: { name: true } } },
        },
        photos: { select: { imageUrl: true }, take: 1, orderBy: { createdAt: "desc" } },
        reviews: { select: { punctuality: true, workmanship: true, priceHonesty: true, communication: true } },
      },
    });

    // Compute stats and filter by criteria
    const withStats = craftsmen.map((profile) => {
      const reviews = profile.reviews;
      const reviewCount = reviews.length;
      let averageRating: number | null = null;
      if (reviewCount > 0) {
        const total = reviews.reduce(
          (s, r) => s + (r.punctuality + r.workmanship + r.priceHonesty + r.communication) / 4,
          0
        );
        averageRating = total / reviewCount;
      }
      return {
        profile,
        averageRating,
        reviewCount,
      };
    });

    // Apply criteria: reviewCount >= 10, rating >= 4.5, jobs >= 20
    const featured = withStats
      .filter(
        (item) =>
          item.reviewCount >= 10 &&
          (item.averageRating ?? 0) >= 4.5 &&
          item.profile.totalJobsCompleted >= 20
      )
      .sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0))
      .slice(0, 5);

    // Map to response shape
    const data = featured.map(({ profile, averageRating, reviewCount }) => ({
      id: profile.id,
      name: profile.user.name,
      businessName: profile.businessName,
      image: profile.user.image,
      verificationLevel: profile.verificationLevel,
      averageRating,
      reviewCount,
      category: profile.categories[0]?.category.name ?? "",
      region: profile.region.name,
      priceRangeMin: profile.priceRangeMin ? Number(profile.priceRangeMin) : null,
      priceRangeMax: profile.priceRangeMax ? Number(profile.priceRangeMax) : null,
      totalJobsCompleted: profile.totalJobsCompleted,
      mainPhoto: profile.photos[0]?.imageUrl ?? null,
      subServices: profile.subServices.map((s) => s.subService.name),
    }));

    return apiSuccess(data);
  } catch (error) {
    return handleApiError(error);
  }
}