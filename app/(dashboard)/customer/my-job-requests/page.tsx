import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { JobStatus } from "@prisma/client";

import { JobRequestsHeader } from "@/components/customer/job-requests/job-requests-header";
import { JobRequestList } from "@/components/customer/job-requests/job-request-list";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "My Job Requests | Ustacik",
  description: "View and manage all your direct job requests to local craftsmen.",
};

export default async function CustomerJobRequestsPage() {
  const session = await getServerSession();

  if (!session?.user?.id) {
    redirect("/sign-in?redirect=/customer/my-job-requests");
  }

  // Fetch jobs for the authenticated customer using explicit select
  const rawJobs = await prisma.job.findMany({
    where: {
      customerId: session.user.id,
    },
    select: {
      id: true,
      title: true,
      description: true,
      address: true,
      status: true,
      createdAt: true,
      completedAt: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      subService: {
        select: {
          id: true,
          name: true,
        },
      },
      craftsman: {
        select: {
          id: true,
          businessName: true,
          verificationLevel: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              phone: true,
            },
          },
          region: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      review: {
        select: {
          id: true,
          punctuality: true,
          workmanship: true,
          priceHonesty: true,
          communication: true,
          comment: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const pendingCount = rawJobs.filter((j) => j.status === JobStatus.PENDING).length;

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-8">
      <JobRequestsHeader totalCount={rawJobs.length} pendingCount={pendingCount} />
      <JobRequestList initialJobs={rawJobs} />
    </div>
  );
}