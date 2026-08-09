import { NextRequest } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { apiPaginated } from "@/lib/api/response";
import { handleApiError } from "@/lib/api/errors";

const QuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(9),
  search: z.string().optional().default(""),
  category: z.string().optional().default("all"),
  region: z.string().optional().default("all"),
  verification: z.enum(["REGISTERED", "VERIFIED", "APPROVED", "all"]).optional().default("all"),
  subService: z.string().optional().default("all"),   // ✅ ADDED
  sort: z.enum(["rating_desc", "reviews_desc", "jobs_desc", "name_asc", "newest"]).default("rating_desc"),
});

export async function GET(req: NextRequest) {
  try {
    const params = Object.fromEntries(req.nextUrl.searchParams.entries());
    const query = QuerySchema.parse(params);

    const where: Prisma.CraftsmanProfileWhereInput = {};

    if (query.search) {
      where.OR = [
        { user: { name: { contains: query.search, mode: "insensitive" } } },
        { businessName: { contains: query.search, mode: "insensitive" } },
      ];
    }

    if (query.category && query.category !== "all") {
      where.categories = { some: { category: { name: query.category } } };
    }

    if (query.region && query.region !== "all") {
      where.region = { name: query.region };
    }

    if (query.verification && query.verification !== "all") {
      where.verificationLevel = query.verification;
    }

    // ✅ ADD subService filter
    if (query.subService && query.subService !== "all") {
      where.subServices = {
        some: {
          subService: { name: query.subService },
        },
      };
    }

    // Fetch all matching craftsmen with relations
    const craftsmen = await prisma.craftsmanProfile.findMany({
      where,
      include: {
        user: { select: { name: true, image: true } },
        region: { select: { name: true } },
        categories: { include: { category: { select: { name: true } } }, take: 1 },
        subServices: {
          include: {
            subService: { select: { name: true } },
          },
        },
        photos: { select: { imageUrl: true }, take: 1, orderBy: { createdAt: "desc" } },
        reviews: { select: { punctuality: true, workmanship: true, priceHonesty: true, communication: true } },
      },
    });

    // Enrich with computed stats (keep raw profile for sorting)
    const enriched = craftsmen.map((profile) => {
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

    // Sort based on query.sort
    const sorted = enriched.sort((a, b) => {
      switch (query.sort) {
        case "rating_desc":
          return (b.averageRating ?? 0) - (a.averageRating ?? 0);
        case "reviews_desc":
          return b.reviewCount - a.reviewCount;
        case "jobs_desc":
          return b.profile.totalJobsCompleted - a.profile.totalJobsCompleted;
        case "name_asc":
          return a.profile.user.name.localeCompare(b.profile.user.name);
        case "newest":
          return b.profile.createdAt.getTime() - a.profile.createdAt.getTime();
        default:
          return 0;
      }
    });

    const skip = (query.page - 1) * query.limit;
    const paginated = sorted.slice(skip, skip + query.limit);

    // Map to response
    const data = paginated.map(({ profile, averageRating, reviewCount }) => ({
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

    return apiPaginated(data, {
      page: query.page,
      limit: query.limit,
      total: sorted.length,
    });
  } catch (error) {
    return handleApiError(error);
  }
}