import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { AdminCraftsmenClient } from "@/components/admin/admin-craftsmen-client";

export default async function AdminCraftsmenPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/sign-in?redirect=/admin/users/craftsmen");
  }

  if (session.user.role !== Role.ADMIN) {
    redirect("/dashboard");
  }

  const craftsmenProfiles = await prisma.craftsmanProfile.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          banned: true,
          banReason: true,
        },
      },
      region: {
        select: {
          name: true,
        },
      },
      categories: {
        include: {
          category: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  const formattedCraftsmen = craftsmenProfiles.map((c) => ({
    id: c.id,
    userId: c.userId,
    name: c.user.name,
    email: c.user.email,
    phone: c.user.phone,
    businessName: c.businessName,
    regionName: c.region.name,
    categoryNames: c.categories.map((cat) => cat.category.name),
    verificationLevel: c.verificationLevel,
    subscriptionStatus: c.subscriptionStatus,
    totalJobsCompleted: c.totalJobsCompleted,
    banned: c.user.banned,
    banReason: c.user.banReason,
    createdAt: c.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Craftsman User Management</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Directory of registered craftsmen, verification badges, subscription status, and job volume.
        </p>
      </div>

      <AdminCraftsmenClient craftsmen={formattedCraftsmen} />
    </div>
  );
}
