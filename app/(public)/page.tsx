import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

// ─── UI Components ──────────────────────────────────────────────────────
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { TrustStats, TrustStatsData } from "@/components/landing/trust-stats";
import { Categories } from "@/components/landing/categories";
import { HowItWorks } from "@/components/landing/how-it-works";
import { FeaturedCraftsmen, FeaturedCraftsman } from "@/components/landing/featured-craftsmen";
import { TrustSection } from "@/components/landing/trust-section";
import { Testimonials, TestimonialItem } from "@/components/landing/testimonials";
import { CtaSection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";

// ─── Cached function to fetch platform trust stats ──────────────────────
const getTrustStats = unstable_cache(
  async (): Promise<TrustStatsData> => {
    const [verifiedCraftsmen, completedJobs, totalReviews, regionsCovered] = await Promise.all([
      prisma.craftsmanProfile.count({
        where: { verificationLevel: { in: ["VERIFIED", "APPROVED"] } },
      }),
      prisma.job.count({
        where: { status: "COMPLETED" },
      }),
      prisma.review.count(),
      prisma.region.count(),
    ]);

    return {
      verifiedCraftsmen,
      completedJobs,
      totalReviews,
      regionsCovered,
    };
  },
  ["trust-stats"],
  { revalidate: 3600 }
);

// ─── Cached function to fetch testimonials ──────────────────────────────
const getTestimonials = unstable_cache(
  async (): Promise<TestimonialItem[]> => {
    const reviews = await prisma.review.findMany({
      where: {
        comment: { not: null },
      },
      include: {
        customer: { select: { name: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 6,
    });

    return reviews.map((r) => {
      const rating = Math.round((r.punctuality + r.workmanship + r.priceHonesty + r.communication) / 4);
      return {
        id: r.id,
        name: r.customer.name,
        avatar: r.customer.image,
        review: r.comment ?? "",
        rating,
      };
    });
  },
  ["landing-testimonials"],
  { revalidate: 3600 }
);

// ─── Cached function to fetch featured craftsmen ────────────────────────
const getFeaturedCraftsmen = unstable_cache(
  async (): Promise<FeaturedCraftsman[]> => {
    // Fetch all APPROVED craftsmen with necessary relations
    const craftsmen = await prisma.craftsmanProfile.findMany({
      where: {
        verificationLevel: "APPROVED",
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

    // Compute stats and filter
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

    // Apply criteria: reviewCount >= 10, rating >= 4.5, jobsCompleted >= 20
    const featured = withStats
      .filter(
        (item) =>
          item.reviewCount >= 10 &&
          (item.averageRating ?? 0) >= 4.5 &&
          item.profile.totalJobsCompleted >= 20
      )
      .sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0))
      .slice(0, 6);

    // Map to the shape expected by the component
    return featured.map(({ profile, averageRating, reviewCount }) => ({
      id: profile.id,
      name: profile.user.name,
      businessName: profile.businessName,
      image: profile.user.image,
      verificationLevel: profile.verificationLevel,
      rating: averageRating ?? 0,
      reviewCount,
      category: profile.categories[0]?.category.name ?? "",
      subServices: profile.subServices.map((s) => s.subService.name),
      region: profile.region.name,
      priceMin: profile.priceRangeMin ? Number(profile.priceRangeMin) : 0,
      priceMax: profile.priceRangeMax ? Number(profile.priceRangeMax) : 0,
      jobsCompleted: profile.totalJobsCompleted,
    }));
  },
  ["featured-craftsmen"],
  { revalidate: 3600 } // Revalidate every hour
);

// ─── Landing Page ──────────────────────────────────────────────────────
export default async function Home() {
  const session = await getServerSession();
  const user = session?.user || null;

  let hasApplication = false;
  if (user && user.role === "CUSTOMER") {
    const appRecord = await prisma.craftsmanApplication.findFirst({
      where: { userId: user.id },
    });
    hasApplication = Boolean(appRecord);
  }

  const [featuredCraftsmen, stats, testimonials] = await Promise.all([
    getFeaturedCraftsmen(),
    getTrustStats(),
    getTestimonials(),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-(image:--page-bg) bg-cover bg-center bg-fixed">
      {/* 1. Navbar */}
      <Navbar user={user} hasApplication={hasApplication} />

      {/* 2. Main Content */}
      <main className="flex-1">
        <Hero />
        <TrustStats stats={stats} />
        <Categories />
        <HowItWorks />
        <FeaturedCraftsmen craftsmen={featuredCraftsmen} />
        <TrustSection />
        <Testimonials testimonials={testimonials} />
        <CtaSection />
      </main>

      {/* 3. Footer */}
      <Footer />
    </div>
  );
}