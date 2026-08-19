import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { JobRequestsHeader } from "@/components/craftsman/job-requests/job-requests-header";
import { JobRequestList } from "@/components/craftsman/job-requests/job-request-list";
import { JobStatus } from "@prisma/client";

export default async function CraftsmanJobRequestsPage() {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return null;
  }

  // Fetch jobs for the authenticated craftsman using Prisma relational filtering in a single query
  const jobs = await prisma.job.findMany({
    where: {
      craftsman: {
        userId: session.user.id,
      },
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          image: true,
        },
      },
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
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const pendingCount = jobs.filter((j) => j.status === JobStatus.PENDING).length;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <JobRequestsHeader totalCount={jobs.length} pendingCount={pendingCount} />
      <JobRequestList initialJobs={jobs} />
    </div>
  );
}
