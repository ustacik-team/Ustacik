import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { AdminVerificationsClient } from "@/components/admin/admin-verifications-client";

export default async function AdminVerificationsPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/sign-in?redirect=/admin/verifications");
  }

  if (session.user.role !== Role.ADMIN) {
    redirect("/dashboard");
  }

  const craftsmen = await prisma.craftsmanProfile.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
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
      verificationRecords: {
        orderBy: { verifiedAt: "desc" },
        take: 1,
        include: {
          verifier: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  // Convert Decimal & Date fields to plain serializable primitives for Client Components
  const formattedCraftsmen = craftsmen.map((c) => ({
    id: c.id,
    businessName: c.businessName,
    verificationLevel: c.verificationLevel,
    workmanshipGuarantee: c.workmanshipGuarantee,
    businessRegistrationNumber: c.businessRegistrationNumber,
    user: {
      name: c.user.name,
      email: c.user.email,
      phone: c.user.phone,
    },
    region: {
      name: c.region.name,
    },
    categories: c.categories.map((cat) => ({
      category: {
        name: cat.category.name,
      },
    })),
    verificationRecords: c.verificationRecords.map((r) => ({
      id: r.id,
      level: r.level,
      phoneVerified: r.phoneVerified,
      idVerified: r.idVerified,
      referencesVerified: r.referencesVerified,
      workPhotosVerified: r.workPhotosVerified,
      businessRegistrationVerified: r.businessRegistrationVerified,
      guaranteeVerified: r.guaranteeVerified,
      notes: r.notes,
      verifiedAt: r.verifiedAt.toISOString(),
      verifier: {
        name: r.verifier.name,
        email: r.verifier.email,
      },
    })),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Manual Verification Queue</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Review, upgrade, and record verification audit trails for craftsmen in Northern Cyprus.
        </p>
      </div>

      <AdminVerificationsClient craftsmen={formattedCraftsmen} />
    </div>
  );
}
