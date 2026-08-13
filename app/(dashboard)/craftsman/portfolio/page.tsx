import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { PortfolioHeader } from "@/components/craftsman/portfolio/portfolio-header";
import { PortfolioStats } from "@/components/craftsman/portfolio/portfolio-stats";
import { PortfolioGallery } from "@/components/craftsman/portfolio/portfolio-gallery";
import { PortfolioEmptyState } from "@/components/craftsman/portfolio/portfolio-empty-state";

export default async function CraftsmanPortfolioPage() {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return null;
  }

  const craftsmanProfile = await prisma.craftsmanProfile.findUnique({
    where: {
      userId: session.user.id,
    },
    include: {
      verificationRecords: {
        orderBy: {
          verifiedAt: "desc",
        },
        take: 1,
      },
    },
  });

  if (!craftsmanProfile) {
    return <PortfolioEmptyState />;
  }

  const photos = await prisma.workPhoto.findMany({
    where: {
      craftsmanId: craftsmanProfile.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const latestVerRecord = craftsmanProfile.verificationRecords[0];
  const workPhotosVerified = latestVerRecord?.workPhotosVerified ?? (craftsmanProfile.verificationLevel === "APPROVED");

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PortfolioHeader totalCount={photos.length} />
      <PortfolioStats totalPhotos={photos.length} workPhotosVerified={workPhotosVerified} />
      <PortfolioGallery photos={photos} />
    </div>
  );
}
