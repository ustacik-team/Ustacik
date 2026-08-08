import { prisma } from "@/lib/prisma";
import { apiSuccess } from "@/lib/api/response";
import { handleApiError } from "@/lib/api/errors";
import { unstable_cache } from "next/cache";

const getCachedStats = unstable_cache(
  async () => {
    const [totalCraftsmen, verifiedCraftsmen, completedJobs, totalReviews] =
      await Promise.all([
        prisma.craftsmanProfile.count(),
        prisma.craftsmanProfile.count({
          where: { verificationLevel: { in: ["VERIFIED", "APPROVED"] } },
        }),
        prisma.job.count({
          where: { status: "COMPLETED" },
        }),
        prisma.review.count(),
      ]);

    return {
      totalCraftsmen,
      verifiedCraftsmen,
      completedJobs,
      totalReviews,
    };
  },
  ["craftsmen-hero-stats"],
  { revalidate: 3600 }
);

export async function GET() {
  try {
    const stats = await getCachedStats();
    return apiSuccess(stats);
  } catch (error) {
    return handleApiError(error);
  }
}
