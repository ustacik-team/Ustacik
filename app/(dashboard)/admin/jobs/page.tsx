import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { AdminJobsClient } from "@/components/admin/admin-jobs-client";

export default async function AdminJobsPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/sign-in?redirect=/admin/jobs");
  }

  if (session.user.role !== Role.ADMIN) {
    redirect("/dashboard");
  }

  const jobsList = await prisma.job.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      customer: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },
      craftsman: {
        select: {
          businessName: true,
          user: {
            select: {
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      },
      category: {
        select: {
          name: true,
        },
      },
      subService: {
        select: {
          name: true,
        },
      },
    },
  });

  const formattedJobs = jobsList.map((j) => ({
    id: j.id,
    title: j.title,
    description: j.description,
    address: j.address,
    status: j.status,
    createdAt: j.createdAt.toISOString(),
    completedAt: j.completedAt ? j.completedAt.toISOString() : null,
    customer: {
      name: j.customer.name,
      email: j.customer.email,
      phone: j.customer.phone,
    },
    craftsman: {
      businessName: j.craftsman.businessName,
      userName: j.craftsman.user.name,
      email: j.craftsman.user.email,
      phone: j.craftsman.user.phone,
    },
    category: {
      name: j.category.name,
    },
    subService: j.subService
      ? {
          name: j.subService.name,
        }
      : null,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Marketplace Job Activity</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Monitor all customer job requests and craftsman interaction statuses across Northern Cyprus.
        </p>
      </div>

      <AdminJobsClient jobs={formattedJobs} />
    </div>
  );
}
