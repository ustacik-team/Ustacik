import type { Metadata } from "next";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

// ─── Dynamic Metadata ────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  // Minimal select — only the fields needed for title/description generation.
  const profile = await prisma.craftsmanProfile.findUnique({
    where: { id },
    select: {
      businessName: true,
      verificationLevel: true,
      region: { select: { name: true } },
      user: { select: { name: true } },
      categories: {
        select: { category: { select: { name: true } } },
        take: 1,
      },
    },
  });

  if (!profile) {
    // Next.js will render the notFound() page; metadata values won't matter.
    return { title: "Craftsman Not Found" };
  }

  const displayName = profile.businessName ?? profile.user.name;
  const category = profile.categories[0]?.category.name ?? "Craftsman";
  const region = profile.region.name;

  const verifiedLabel =
    profile.verificationLevel === "APPROVED"
      ? "Approved & Verified"
      : profile.verificationLevel === "VERIFIED"
      ? "Verified"
      : "";

  const title = `${displayName} — ${category} in ${region}`;
  const description = `Hire ${displayName}, a${verifiedLabel ? ` ${verifiedLabel}` : ""} ${category.toLowerCase()} based in ${region}, Northern Cyprus. View work portfolio, pricing, reviews, and request a job directly on Ustacik.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}



import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Breadcrumb } from "@/components/craftsman-profile/breadcrumb";
import { ProfileHero } from "@/components/craftsman-profile/profile-hero";
import { AboutCraftsman } from "@/components/craftsman-profile/about";
import { VerificationCard } from "@/components/craftsman-profile/verification-card";
import { ContactCard } from "@/components/craftsman-profile/contact-card";
import { Services } from "@/components/craftsman-profile/services";
import { WorkGallery } from "@/components/craftsman-profile/work-gallery";
import { PricingCard } from "@/components/craftsman-profile/pricing-card";
import { ReviewSummary } from "@/components/craftsman-profile/review-summary";
import { Reviews } from "@/components/craftsman-profile/reviews";
import { RelatedCraftsmen } from "@/components/craftsman-profile/related-craftsmen";
import { SafetyNotice } from "@/components/craftsman-profile/safety-notice";

export default async function CraftsmanProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession();
  const user = session?.user || null;

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
    },
  });

  if (!profile) {
    notFound();
  }

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

  const craftsman = {
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

  let hasApplication = false;
  if (user && user.role === "CUSTOMER") {
    const appRecord = await prisma.craftsmanApplication.findFirst({
      where: { userId: user.id },
    });
    hasApplication = Boolean(appRecord);
  }

  const overallRating = averageRating ?? 0;

  return (
    <div className="flex min-h-screen flex-col bg-(image:--find-craftsmen-bg) bg-cover bg-center bg-no-repeat bg-fixed">
      <Navbar user={user} hasApplication={hasApplication} />
      <main className="flex-1">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-4 pb-12 space-y-8">
          <Breadcrumb
            categoryName={craftsman.categories[0]?.name ?? "Craftsman"}
            craftsmanName={craftsman.user.name}
          />
          <ProfileHero craftsman={craftsman} />
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="flex-1 flex flex-col gap-6">
              <AboutCraftsman craftsman={craftsman} />
              <Services categories={craftsman.serviceCategories} />
            </div>
            <div className="w-full lg:w-1/3 flex flex-col gap-6">
              <VerificationCard {...craftsman.verification} />
              <div className="sticky top-24 z-10">
                <ContactCard
                  craftsmanId={craftsman.id}
                  name={craftsman.user.name}
                  verificationLevel={craftsman.verificationLevel}
                  rating={overallRating}
                  reviewCount={craftsman.reviews.length}
                  jobsCompleted={craftsman.totalJobsCompleted}
                  phone={craftsman.user.phone}
                />
              </div>
            </div>
          </div>
          <WorkGallery works={craftsman.photos} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PricingCard
              priceMin={craftsman.priceRangeMin}
              priceMax={craftsman.priceRangeMax}
            />
            <ReviewSummary {...craftsman.reviewSummary} />
          </div>
          <Reviews reviews={craftsman.customerReviews} />
          <RelatedCraftsmen craftsmen={craftsman.relatedCraftsmen} />
          <SafetyNotice />
        </div>
      </main>
      <Footer />
    </div>
  );
}