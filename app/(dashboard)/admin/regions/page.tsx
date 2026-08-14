import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { AdminRegionsClient } from "@/components/admin/admin-regions-client";

export default async function AdminRegionsPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/sign-in?redirect=/admin/regions");
  }

  if (session.user.role !== Role.ADMIN) {
    redirect("/dashboard");
  }

  const regionsList = await prisma.region.findMany({
    orderBy: { name: "asc" },
    include: {
      craftsmen: { select: { id: true } },
    },
  });

  const formattedRegions = regionsList.map((r) => ({
    id: r.id,
    name: r.name,
    craftsmenCount: r.craftsmen.length,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Geographic Regions &amp; Coverage</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Manage Northern Cyprus territory regions and inspect craftsman distribution per region.
        </p>
      </div>

      <AdminRegionsClient regions={formattedRegions} />
    </div>
  );
}
