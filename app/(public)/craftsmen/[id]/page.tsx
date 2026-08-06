import { getServerSession } from "@/lib/get-session";
import { notFound } from "next/navigation";

// ─── Landing Components ──────────────────────────────────────────────
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

// ─── Profile Components ──────────────────────────────────────────────
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

// ✅ Import the basic array
import { allCraftsmen, Craftsman } from "@/lib/mock-craftsmen";

// ─── Helper: Map basic craftsman to full profile structure ────────────
function buildFullProfile(basic: Craftsman) {
  // Deterministic pseudo-random derived from the id
  const seed = Array.from(basic.id).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const yearsOfExperience = (seed % 15) + 3;

  // Generate dummy reviews to match reviewCount
  const generatedReviews = Array.from({ length: basic.reviewCount }).map(() => ({
    rating: basic.rating,
  }));

  // Deterministic dates (base date: 2024-01-01)
  const baseDate = new Date("2024-01-01").getTime();
  const verifiedAtDate = new Date(baseDate + seed * 86400000 * 7); // 7 days per seed
  const reviewDateOffset = seed * 86400000 * 2; // 2 days per seed

  // Build the complex object expected by the components
  return {
    id: basic.id,
    user: {
      name: basic.name,
      image: basic.image,
      phone: "+905338887766", // Mock phone
    },
    businessName: basic.businessName,
    bio: `Experienced ${basic.category} professional with over ${yearsOfExperience} years of hands-on experience. Dedicated to providing high-quality service to homes and businesses across Northern Cyprus.`,
    region: { name: basic.region },
    categories: [{ name: basic.category }],
    verificationLevel: basic.verificationLevel,
    totalJobsCompleted: basic.jobsCompleted,
    priceRangeMin: basic.priceMin,
    priceRangeMax: basic.priceMax,
    workmanshipGuarantee: basic.verificationLevel === "APPROVED", // Example logic
    reviews: generatedReviews,
    yearsOfExperience,
    businessRegistrationNumber: `TRNC-BIZ-202${seed % 4}-${seed * 7 % 100000}`,
    serviceCategories: [
      {
        name: basic.category,
        subServices: basic.subServices,
      },
    ],
    photos: [
      { id: "1", imageUrl: "/images/work-1.jpg", uploadDate: "2024-01-15" },
      { id: "2", imageUrl: "/images/work-2.jpg", uploadDate: "2024-02-20" },
      { id: "3", imageUrl: "/images/work-3.jpg", uploadDate: "2024-03-10" },
      { id: "4", imageUrl: "/images/work-4.jpg", uploadDate: "2024-04-05" },
    ],
    verification: {
      verificationLevel: basic.verificationLevel,
      phoneVerified: true,
      idVerified: true,
      referencesVerified: true,
      workPhotosVerified: true,
      businessRegistrationVerified: basic.verificationLevel !== "REGISTERED",
      guaranteeVerified: basic.verificationLevel === "APPROVED",
      verifiedBy: { name: "Ustacik Trust Team" },
      verifiedAt: verifiedAtDate.toISOString(),
    },
    reviewSummary: {
      totalReviews: basic.reviewCount,
      averageRating: basic.rating,
      punctualityAvg: Math.min(5, basic.rating + 0.1),
      workmanshipAvg: basic.rating,
      priceHonestyAvg: Math.max(3, basic.rating - 0.1),
      communicationAvg: Math.min(5, basic.rating + 0.2),
    },
    customerReviews: Array.from({ length: Math.min(3, basic.reviewCount) }).map((_, i) => {
      const reviewDate = new Date(baseDate + reviewDateOffset + i * 86400000 * 3);
      const replyDate = new Date(reviewDate.getTime() + 86400000);
      return {
        id: `r${i}`,
        customer: { name: `Customer ${i + 1}`, image: null },
        createdAt: reviewDate.toISOString(),
        rating: basic.rating,
        punctuality: Math.min(5, basic.rating + 0.1),
        workmanship: basic.rating,
        priceHonesty: Math.max(3, basic.rating - 0.1),
        communication: Math.min(5, basic.rating + 0.2),
        comment: `Great experience! Very professional ${basic.category} work.`,
        photos: [],
        reply: i === 0 ? {
          id: `rep${i}`,
          reply: "Thank you! We appreciate your feedback.",
          createdAt: replyDate.toISOString(),
        } : null,
      };
    }),
    relatedCraftsmen: allCraftsmen
      .filter((c) => c.id !== basic.id && c.category === basic.category)
      .slice(0, 3)
      .map((c) => ({
        id: c.id,
        name: c.name,
        businessName: c.businessName,
        image: c.image,
        verificationLevel: c.verificationLevel,
        rating: c.rating,
        priceMin: c.priceMin,
        priceMax: c.priceMax,
        reviewCount: c.reviewCount,
        category: c.category,
        subServices: c.subServices,
        region: c.region,
        jobsCompleted: c.jobsCompleted,
      })),
  };
}

// ─── Page Component ──────────────────────────────────────────────────
export default async function CraftsmanProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession();
  const user = session?.user || null;

  // Find the basic craftsman
  const basicCraftsman = allCraftsmen.find((c) => c.id === id);

  // Handle 404
  if (!basicCraftsman) {
    notFound();
  }

  // Map the data to the full profile structure
  const craftsman = buildFullProfile(basicCraftsman);

  // ✅ FIX: Prevent division by zero (0 / 0) leading to NaN when there are 0 reviews
  const overallRating = craftsman.reviews.length > 0
    ? craftsman.reviews.reduce((sum, rev) => sum + rev.rating, 0) / craftsman.reviews.length
    : 0;

  return (
    <div className="flex min-h-screen flex-col bg-(image:--find-craftsmen-bg) bg-cover bg-center bg-no-repeat bg-fixed">
      <Navbar user={user} />

      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-6 pt-4 pb-12 space-y-8">
          
          <Breadcrumb categoryName={craftsman.categories[0].name} craftsmanName={craftsman.user.name} />
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
            <PricingCard priceMin={craftsman.priceRangeMin} priceMax={craftsman.priceRangeMax} />
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