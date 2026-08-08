// app/api/craftsmen/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess } from "@/lib/api/response";
import { handleApiError } from "@/lib/api/errors";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const profile = await prisma.craftsmanProfile.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, image: true, phone: true } },
        region: { select: { name: true } },
        categories: {
          include: { category: { select: { name: true } } },
          take: 1,
        },
        subServices: {
          include: {
            subService: {
              select: { name: true, category: { select: { name: true } } },
            },
          },
        },
        photos: {
          select: { id: true, imageUrl: true, createdAt: true },
          orderBy: { createdAt: "desc" },
        },
        verificationRecords: {
          orderBy: { verifiedAt: "desc" },
          take: 1,
          include: { verifier: { select: { name: true } } },
        },
        reviews: {
          include: {
            customer: { select: { name: true, image: true } },
            reply: true,
            photos: { select: { id: true, imageUrl: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        jobs: { where: { status: "COMPLETED" } },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Compute stats
    const reviews = profile.reviews;
    const reviewCount = reviews.length;
    let averageRating: number | null = null;
    let punctualityAvg = 0,
      workmanshipAvg = 0,
      priceHonestyAvg = 0,
      communicationAvg = 0;
    if (reviewCount > 0) {
      let sumP = 0,
        sumW = 0,
        sumPH = 0,
        sumC = 0;
      for (const r of reviews) {
        sumP += r.punctuality;
        sumW += r.workmanship;
        sumPH += r.priceHonesty;
        sumC += r.communication;
      }
      punctualityAvg = sumP / reviewCount;
      workmanshipAvg = sumW / reviewCount;
      priceHonestyAvg = sumPH / reviewCount;
      communicationAvg = sumC / reviewCount;
      averageRating = (punctualityAvg + workmanshipAvg + priceHonestyAvg + communicationAvg) / 4;
    }

    // Match page: yearsOfExperience = null (removed impure Date.now())
    const yearsOfExperience = null;

    const latestVerification = profile.verificationRecords[0];
    const verification = latestVerification ?? {
      verificationLevel: profile.verificationLevel,
      phoneVerified: false,
      idVerified: false,
      referencesVerified: false,
      workPhotosVerified: false,
      businessRegistrationVerified: false,
      guaranteeVerified: false,
      verifiedAt: null,
    };

    const data = {
      id: profile.id,
      user: {
        name: profile.user.name,
        image: profile.user.image,
        phone: profile.user.phone,
      },
      businessName: profile.businessName,
      bio: profile.bio,
      region: { name: profile.region.name },
      categories: profile.categories.map((c) => ({ name: c.category.name })),
      verificationLevel: profile.verificationLevel,
      totalJobsCompleted: profile.totalJobsCompleted,
      priceRangeMin: profile.priceRangeMin ? Number(profile.priceRangeMin) : null,
      priceRangeMax: profile.priceRangeMax ? Number(profile.priceRangeMax) : null,
      workmanshipGuarantee: profile.workmanshipGuarantee,
      reviews: profile.reviews.map(() => ({ rating: averageRating ?? 0 })),
      yearsOfExperience,
      businessRegistrationNumber: profile.businessRegistrationNumber,
      serviceCategories: profile.subServices.reduce((acc, sub) => {
        const catName = sub.subService.category?.name ?? "Unknown";
        let cat = acc.find((c) => c.name === catName);
        if (!cat) {
          cat = { name: catName, subServices: [] };
          acc.push(cat);
        }
        cat.subServices.push(sub.subService.name);
        return acc;
      }, [] as { name: string; subServices: string[] }[]),
      photos: profile.photos.map((p) => ({
        id: p.id,
        imageUrl: p.imageUrl,
        uploadDate: p.createdAt,
      })),
      verification: {
        verificationLevel: profile.verificationLevel,
        phoneVerified: verification.phoneVerified,
        idVerified: verification.idVerified,
        referencesVerified: verification.referencesVerified,
        workPhotosVerified: verification.workPhotosVerified,
        businessRegistrationVerified: verification.businessRegistrationVerified,
        guaranteeVerified: verification.guaranteeVerified,
        verifiedBy: latestVerification ? { name: latestVerification.verifier.name } : null,
        verifiedAt: verification.verifiedAt?.toISOString() ?? null,
      },
      reviewSummary: {
        totalReviews: reviewCount,
        averageRating: averageRating ?? 0,
        punctualityAvg,
        workmanshipAvg,
        priceHonestyAvg,
        communicationAvg,
      },
      customerReviews: reviews.map((r) => ({
        id: r.id,
        customer: { name: r.customer.name, image: r.customer.image },
        createdAt: r.createdAt.toISOString(),
        rating: (r.punctuality + r.workmanship + r.priceHonesty + r.communication) / 4,
        punctuality: r.punctuality,
        workmanship: r.workmanship,
        priceHonesty: r.priceHonesty,
        communication: r.communication,
        comment: r.comment,
        photos: r.photos.map((p) => ({ id: p.id, imageUrl: p.imageUrl })),
        reply: r.reply
          ? {
              id: r.reply.id,
              reply: r.reply.reply,
              createdAt: r.reply.createdAt.toISOString(),
            }
          : null,
      })),
      relatedCraftsmen: await (async () => {
        const firstCat = profile.categories[0]?.category?.name;
        if (!firstCat) return [];
        const related = await prisma.craftsmanProfile.findMany({
          where: {
            id: { not: profile.id },
            categories: { some: { category: { name: firstCat } } },
          },
          include: {
            user: { select: { name: true, image: true } },
            region: { select: { name: true } },
            categories: { include: { category: { select: { name: true } } }, take: 1 },
            subServices: { include: { subService: { select: { name: true } } } },
            reviews: { select: { punctuality: true, workmanship: true, priceHonesty: true, communication: true } },
          },
          take: 3,
        });
        return related.map((r) => {
          const rReviews = r.reviews;
          const rCount = rReviews.length;
          let rAvg = null;
          if (rCount > 0) {
            const total = rReviews.reduce(
              (s, rev) =>
                s + (rev.punctuality + rev.workmanship + rev.priceHonesty + rev.communication) / 4,
              0
            );
            rAvg = total / rCount;
          }
          return {
            id: r.id,
            name: r.user.name,
            businessName: r.businessName,
            image: r.user.image,
            verificationLevel: r.verificationLevel,
            rating: rAvg ?? 0,
            priceMin: r.priceRangeMin ? Number(r.priceRangeMin) : null,
            priceMax: r.priceRangeMax ? Number(r.priceRangeMax) : null,
            reviewCount: rCount,
            category: r.categories[0]?.category.name ?? "",
            subServices: r.subServices.map((s) => s.subService.name),
            region: r.region.name,
            jobsCompleted: r.totalJobsCompleted,
          };
        });
      })(),
    };

    return apiSuccess(data);
  } catch (error) {
    return handleApiError(error);
  }
}