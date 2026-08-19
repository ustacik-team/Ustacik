import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { AdminCategoriesClient } from "@/components/admin/admin-categories-client";

export default async function AdminCategoriesPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/sign-in?redirect=/admin/categories");
  }

  if (session.user.role !== Role.ADMIN) {
    redirect("/dashboard");
  }

  const categoriesList = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      subServices: {
        include: {
          craftsmen: { select: { craftsmanId: true } },
          jobs: { select: { id: true } },
        },
      },
      craftsmen: { select: { craftsmanId: true } },
      jobs: { select: { id: true } },
    },
  });

  const formattedCategories = categoriesList.map((cat) => ({
    id: cat.id,
    name: cat.name,
    craftsmenCount: cat.craftsmen.length,
    jobsCount: cat.jobs.length,
    subServices: cat.subServices.map((sub) => ({
      id: sub.id,
      name: sub.name,
      craftsmenCount: sub.craftsmen.length,
      jobsCount: sub.jobs.length,
    })),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Service Categories &amp; Taxonomy</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Review the 8 core service categories and manage sub-services for craftsman registration.
        </p>
      </div>

      <AdminCategoriesClient categories={formattedCategories} />
    </div>
  );
}
