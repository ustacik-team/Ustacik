import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, UserPlus } from "lucide-react";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { CraftsmanDashboardHeader } from "@/components/craftsman/dashboard/craftsman-dashboard-header";
import { JobStatistics } from "@/components/craftsman/dashboard/job-statistics";
import { VerificationStatusCard } from "@/components/craftsman/dashboard/verification-status-card";
import { ProfileOverviewCard } from "@/components/craftsman/dashboard/profile-overview-card";
import { RecentJobRequests } from "@/components/craftsman/dashboard/recent-job-requests";
import { RecentReviews } from "@/components/craftsman/dashboard/recent-reviews";
import { ServicesSummary } from "@/components/craftsman/dashboard/services-summary";
import { WorkPortfolioPreview } from "@/components/craftsman/dashboard/work-portfolio-preview";
import { NotificationsPreview } from "@/components/craftsman/dashboard/notifications-preview";
import { SubscriptionCard } from "@/components/craftsman/dashboard/subscription-card";
import { QuickActions } from "@/components/craftsman/dashboard/quick-actions";
import { JobStatus } from "@prisma/client";

export default async function CraftsmanDashboardPage() {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return null;
  }

  // Fetch CraftsmanProfile with relations
  const craftsmanProfile = await prisma.craftsmanProfile.findUnique({
    where: {
      userId: session.user.id,
    },
    include: {
      region: true,
      categories: {
        include: {
          category: true,
        },
      },
      subServices: {
        include: {
          subService: {
            include: {
              category: true,
            },
          },
        },
      },
      photos: {
        orderBy: {
          createdAt: "desc",
        },
        take: 6,
      },
      verificationRecords: {
        orderBy: {
          verifiedAt: "desc",
        },
        take: 1,
      },
    },
  });

  // If no craftsman profile is created yet, render an initial setup state
  if (!craftsmanProfile) {
    return (
      <div className="mx-auto max-w-4xl py-16 text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <UserPlus className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Welcome to Ustacik Craftsman Workspace</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            You currently don&apos;t have an active craftsman profile registered. Complete your profile registration to start receiving customer job requests.
          </p>
        </div>
        <div className="pt-2">
          <Button size="lg" asChild className="gap-2 font-semibold shadow-md">
            <Link href="/become-craftsman">
              Apply to Become a Craftsman
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="pt-6 border-t border-border/40">
          <QuickActions />
        </div>
      </div>
    );
  }

  // Fetch Jobs belonging to this craftsman
  const jobs = await prisma.job.findMany({
    where: {
      craftsmanId: craftsmanProfile.id,
    },
    include: {
      customer: {
        select: {
          name: true,
          image: true,
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
    orderBy: {
      createdAt: "desc",
    },
  });

  // Fetch Reviews belonging to this craftsman
  const reviews = await prisma.review.findMany({
    where: {
      craftsmanId: craftsmanProfile.id,
    },
    include: {
      customer: {
        select: {
          name: true,
          image: true,
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

  // Fetch Notifications for this user
  const notifications = await prisma.notification.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  // Calculate live statistics
  const pendingCount = jobs.filter((j) => j.status === JobStatus.PENDING).length;
  const acceptedCount = jobs.filter((j) => j.status === JobStatus.ACCEPTED).length;
  const completedCount = jobs.filter((j) => j.status === JobStatus.COMPLETED).length;
  const cancelledCount = jobs.filter((j) => j.status === JobStatus.CANCELLED).length;

  // Group subservices by category for ServicesSummary
  const categoryMap = new Map<string, { id: string; name: string; subServices: { id: string; name: string }[] }>();

  for (const cc of craftsmanProfile.categories) {
    if (cc.category) {
      categoryMap.set(cc.category.id, {
        id: cc.category.id,
        name: cc.category.name,
        subServices: [],
      });
    }
  }

  for (const cs of craftsmanProfile.subServices) {
    if (cs.subService) {
      const pCat = cs.subService.category;
      if (!categoryMap.has(pCat.id)) {
        categoryMap.set(pCat.id, {
          id: pCat.id,
          name: pCat.name,
          subServices: [],
        });
      }
      const grp = categoryMap.get(pCat.id)!;
      if (!grp.subServices.some((s) => s.id === cs.subService.id)) {
        grp.subServices.push({
          id: cs.subService.id,
          name: cs.subService.name,
        });
      }
    }
  }

  const serviceCategories = Array.from(categoryMap.values());
  const latestVerificationRecord = craftsmanProfile.verificationRecords[0] || null;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* 1. Header Banner */}
      <CraftsmanDashboardHeader
        user={{
          name: session.user.name ?? "Craftsman",
          email: session.user.email ?? "",
          image: session.user.image,
        }}
        profile={{
          businessName: craftsmanProfile.businessName,
          verificationLevel: craftsmanProfile.verificationLevel,
          region: craftsmanProfile.region,
        }}
      />

      {/* 2. Live Job Statistics */}
      <JobStatistics
        stats={{
          total: jobs.length,
          pending: pendingCount,
          accepted: acceptedCount,
          completed: completedCount,
          cancelled: cancelledCount,
          totalProfileCompletedJobs: craftsmanProfile.totalJobsCompleted,
        }}
      />

      {/* 3. Verification & Business Profile Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <VerificationStatusCard
          level={craftsmanProfile.verificationLevel}
          record={latestVerificationRecord}
        />
        <ProfileOverviewCard profile={craftsmanProfile} />
      </div>

      {/* 4. Recent Job Requests & Reviews */}
      <div className="grid gap-6 md:grid-cols-2">
        <RecentJobRequests jobs={jobs} />
        <RecentReviews reviews={reviews} />
      </div>

      {/* 5. Services Summary & Work Portfolio Preview */}
      <div className="grid gap-6 md:grid-cols-2">
        <ServicesSummary categories={serviceCategories} />
        <WorkPortfolioPreview photos={craftsmanProfile.photos} />
      </div>

      {/* 6. Notifications & Subscription Status */}
      <div className="grid gap-6 md:grid-cols-2">
        <NotificationsPreview notifications={notifications} />
        <SubscriptionCard status={craftsmanProfile.subscriptionStatus} />
      </div>

      {/* 7. Quick Actions Shortcuts */}
      <QuickActions />
    </div>
  );
}