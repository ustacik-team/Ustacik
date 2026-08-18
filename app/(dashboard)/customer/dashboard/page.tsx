import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { JobStatus } from "@prisma/client";

import { CustomerDashboardHeader } from "@/components/customer/dashboard/customer-dashboard-header";
import { JobStatistics } from "@/components/customer/dashboard/job-statistics";
import { CurrentJobCard } from "@/components/customer/dashboard/current-job-card";
import { FindCraftsmenCard } from "@/components/customer/dashboard/find-craftsmen-card";
import { RecentJobRequests } from "@/components/customer/dashboard/recent-job-requests";
import { RecentReviews } from "@/components/customer/dashboard/recent-reviews";
import { NotificationsPreview } from "@/components/customer/dashboard/notifications-preview";
import { AccountOverview } from "@/components/customer/dashboard/account-overview";
import { QuickActions } from "@/components/customer/dashboard/quick-actions";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Customer Dashboard",
  description: "Track your active job requests, local craftsman connections, and customer account status.",
};

export default async function CustomerDashboardPage() {
  const session = await getServerSession();

  if (!session?.user?.id) {
    redirect("/sign-in?redirect=/customer/dashboard");
  }

  // Fetch customer profile from User table
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      phone: true,
      role: true,
      emailVerified: true,
      createdAt: true,
    },
  });

  if (!user) {
    redirect("/sign-in");
  }

  // Fetch jobs belonging to this customer with explicit select
  const jobs = await prisma.job.findMany({
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
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Fetch reviews submitted by this customer
  const reviews = await prisma.review.findMany({
    where: {
      customerId: session.user.id,
    },
    select: {
      id: true,
      punctuality: true,
      workmanship: true,
      priceHonesty: true,
      communication: true,
      comment: true,
      createdAt: true,
      craftsman: {
        select: {
          id: true,
          businessName: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
      job: {
        select: {
          title: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Fetch notifications belonging to this user
  const notifications = await prisma.notification.findMany({
    where: {
      userId: session.user.id,
    },
    select: {
      id: true,
      title: true,
      message: true,
      type: true,
      isRead: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  // Compute live statistics
  const pendingCount = jobs.filter((j) => j.status === JobStatus.PENDING).length;
  const acceptedCount = jobs.filter((j) => j.status === JobStatus.ACCEPTED).length;
  const completedCount = jobs.filter((j) => j.status === JobStatus.COMPLETED).length;
  const cancelledCount = jobs.filter((j) => j.status === JobStatus.CANCELLED).length;

  const stats = {
    total: jobs.length,
    pending: pendingCount,
    accepted: acceptedCount,
    completed: completedCount,
    cancelled: cancelledCount,
  };

  // Identify current active job (most recent ACCEPTED job)
  const currentJob = jobs.find((j) => j.status === JobStatus.ACCEPTED) || null;

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-8">
      {/* 1. Header Banner */}
      <CustomerDashboardHeader user={user} />

      {/* 2. Job Statistics */}
      <JobStatistics stats={stats} />

      {/* 3. Current Work & Discovery Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <CurrentJobCard currentJob={currentJob} />
        <FindCraftsmenCard />
      </div>

      {/* 4. Recent Requests & Reviews */}
      <div className="grid gap-6 md:grid-cols-2">
        <RecentJobRequests jobs={jobs} />
        <RecentReviews reviews={reviews} />
      </div>

      {/* 5. Notifications & Account Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <NotificationsPreview notifications={notifications} />
        <AccountOverview user={user} />
      </div>

      {/* 6. Quick Actions */}
      <QuickActions />
    </div>
  );
}