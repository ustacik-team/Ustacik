import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/get-session";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { CraftsmanApplicationsReview } from "@/components/admin/craftsman-applications-review";

export default async function CraftsmanApplicationsPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/sign-in?redirect=/admin/craftsman-applications");
  }

  if (session.user.role !== Role.ADMIN) {
    redirect("/dashboard");
  }

  // Server-side data fetching directly from Prisma
  const applications = await prisma.craftsmanApplication.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true, role: true },
      },
    },
  });

  // Serialize Decimal and Date fields for client component
  const initialApplications = applications.map((app) => ({
    ...app,
    priceMin: Number(app.priceMin),
    priceMax: Number(app.priceMax),
    createdAt: app.createdAt.toISOString(),
    updatedAt: app.updatedAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Craftsman Applications</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Review, approve, or reject incoming craftsman registration applications.
        </p>
      </div>

      <CraftsmanApplicationsReview initialApplications={initialApplications} />
    </div>
  );
}