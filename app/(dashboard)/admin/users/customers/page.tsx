import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { AdminCustomersClient } from "@/components/admin/admin-customers-client";

export default async function AdminCustomersPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/sign-in?redirect=/admin/users/customers");
  }

  if (session.user.role !== Role.ADMIN) {
    redirect("/dashboard");
  }

  const customerUsers = await prisma.user.findMany({
    where: { role: Role.CUSTOMER },
    orderBy: { createdAt: "desc" },
    include: {
      jobRequests: { select: { id: true } },
      reviews: { select: { id: true } },
    },
  });

  const formattedCustomers = customerUsers.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    banned: u.banned,
    banReason: u.banReason,
    createdAt: u.createdAt.toISOString(),
    jobsCount: u.jobRequests.length,
    reviewsCount: u.reviews.length,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Customer User Management</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Inspect customer accounts, job request statistics, and manage account access.
        </p>
      </div>

      <AdminCustomersClient customers={formattedCustomers} />
    </div>
  );
}
