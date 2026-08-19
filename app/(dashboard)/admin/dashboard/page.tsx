import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { Role, ApplicationStatus, VerificationLevel, JobStatus } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Briefcase,
  ShieldCheck,
  Clock,
  ArrowRight,
  ClipboardList,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/sign-in?redirect=/admin/dashboard");
  }

  if (session.user.role !== Role.ADMIN) {
    redirect("/dashboard");
  }

  // ─── Direct Server Database Queries (Real Prisma Metrics) ─────────────────
  const [
    pendingApplicationsCount,
    verifiedCraftsmenCount,
    approvedCraftsmenCount,
    totalCustomersCount,
    totalCraftsmenCount,
    completedJobsCount,
    activeJobsCount,
    totalReviewsCount,
    recentApplications,
    recentJobs,
    recentLogs,
  ] = await Promise.all([
    // 1. Pending Applications
    prisma.craftsmanApplication.count({
      where: { status: ApplicationStatus.PENDING },
    }),
    // 2. Verified Craftsmen Profiles
    prisma.craftsmanProfile.count({
      where: { verificationLevel: VerificationLevel.VERIFIED },
    }),
    // 3. Approved Craftsmen Profiles
    prisma.craftsmanProfile.count({
      where: { verificationLevel: VerificationLevel.APPROVED },
    }),
    // 4. Total Customers
    prisma.user.count({
      where: { role: Role.CUSTOMER },
    }),
    // 5. Total Craftsmen Users
    prisma.user.count({
      where: { role: Role.CRAFTSMAN },
    }),
    // 6. Completed Jobs
    prisma.job.count({
      where: { status: JobStatus.COMPLETED },
    }),
    // 7. Active/Open Jobs (PENDING or ACCEPTED)
    prisma.job.count({
      where: { status: { in: [JobStatus.PENDING, JobStatus.ACCEPTED] } },
    }),
    // 8. Total Reviews
    prisma.review.count(),
    // Recent 5 Pending Applications
    prisma.craftsmanApplication.findMany({
      where: { status: ApplicationStatus.PENDING },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    // Recent 5 Jobs
    prisma.job.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        customer: { select: { name: true, email: true } },
        craftsman: {
          select: { businessName: true, user: { select: { name: true } } },
        },
        category: { select: { name: true } },
      },
    }),
    // Recent 5 Admin Audit Logs
    prisma.adminLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        admin: { select: { name: true, email: true } },
      },
    }),
  ]);

  const stats = [
    {
      title: "Pending Applications",
      value: pendingApplicationsCount.toLocaleString(),
      icon: Clock,
      description: "Craftsman applications awaiting manual review",
      href: "/admin/craftsman-applications",
      highlight: pendingApplicationsCount > 0,
    },
    {
      title: "Verified / Approved Craftsmen",
      value: `${verifiedCraftsmenCount + approvedCraftsmenCount}`,
      icon: ShieldCheck,
      description: `${approvedCraftsmenCount} Approved · ${verifiedCraftsmenCount} Verified`,
      href: "/admin/verifications",
    },
    {
      title: "Completed Jobs",
      value: completedJobsCount.toLocaleString(),
      icon: Briefcase,
      description: `${activeJobsCount} active jobs currently in progress`,
      href: "/admin/jobs",
    },
    {
      title: "Platform Community",
      value: (totalCustomersCount + totalCraftsmenCount).toLocaleString(),
      icon: Users,
      description: `${totalCustomersCount} Customers · ${totalCraftsmenCount} Craftsmen`,
      href: "/admin/users/customers",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Overview</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Real-time operational control center and marketplace audit metrics.
        </p>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:border-primary/50 transition-all cursor-pointer h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.highlight ? "text-amber-500 animate-pulse" : "text-muted-foreground"}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Action Navigation */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Button asChild variant="outline" className="h-auto py-3 px-4 flex justify-between items-center text-left">
          <Link href="/admin/craftsman-applications">
            <div>
              <p className="font-semibold text-xs text-foreground">Craftsman Applications</p>
              <p className="text-[11px] text-muted-foreground">{pendingApplicationsCount} pending</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </Button>

        <Button asChild variant="outline" className="h-auto py-3 px-4 flex justify-between items-center text-left">
          <Link href="/admin/verifications">
            <div>
              <p className="font-semibold text-xs text-foreground">Verification Queue</p>
              <p className="text-[11px] text-muted-foreground">Audit trust levels</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </Button>

        <Button asChild variant="outline" className="h-auto py-3 px-4 flex justify-between items-center text-left">
          <Link href="/admin/reviews">
            <div>
              <p className="font-semibold text-xs text-foreground">Review Moderation</p>
              <p className="text-[11px] text-muted-foreground">{totalReviewsCount} total reviews</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </Button>

        <Button asChild variant="outline" className="h-auto py-3 px-4 flex justify-between items-center text-left">
          <Link href="/admin/analytics">
            <div>
              <p className="font-semibold text-xs text-foreground">Value Analytics</p>
              <p className="text-[11px] text-muted-foreground">Platform performance</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </Button>
      </div>

      {/* Two-Column Layout: Applications + Jobs */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending Applications Table */}
        <Card className="border border-border/60">
          <CardHeader className="py-4 border-b flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" />
                Pending Applications ({pendingApplicationsCount})
              </CardTitle>
              <CardDescription className="text-xs">
                Craftsmen awaiting document review and verification.
              </CardDescription>
            </div>
            <Button asChild size="sm" variant="ghost" className="text-xs gap-1">
              <Link href="/admin/craftsman-applications">
                View All <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {recentApplications.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground space-y-1">
                <ShieldCheck className="h-8 w-8 text-muted-foreground/40 mx-auto" />
                <p>No pending craftsman applications at this time.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="text-xs">
                    <TableHead>Applicant / Business</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-xs">
                  {recentApplications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell>
                        <p className="font-medium text-foreground">{app.fullName}</p>
                        <p className="text-[11px] text-muted-foreground">{app.businessName}</p>
                      </TableCell>
                      <TableCell>{app.categoryName}</TableCell>
                      <TableCell>{app.regionName}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30 text-[10px]">
                          Pending
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Recent Jobs Table */}
        <Card className="border border-border/60">
          <CardHeader className="py-4 border-b flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-primary" />
                Recent Marketplace Jobs
              </CardTitle>
              <CardDescription className="text-xs">
                Latest customer job requests created on the platform.
              </CardDescription>
            </div>
            <Button asChild size="sm" variant="ghost" className="text-xs gap-1">
              <Link href="/admin/jobs">
                View All <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {recentJobs.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground space-y-1">
                <Briefcase className="h-8 w-8 text-muted-foreground/40 mx-auto" />
                <p>No job requests created yet.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="text-xs">
                    <TableHead>Job Title</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Craftsman</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-xs">
                  {recentJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell>
                        <p className="font-medium text-foreground truncate max-w-[140px]">{job.title}</p>
                        <p className="text-[10px] text-muted-foreground">{job.category.name}</p>
                      </TableCell>
                      <TableCell className="truncate max-w-[100px]">{job.customer.name}</TableCell>
                      <TableCell className="truncate max-w-[100px]">
                        {job.craftsman.businessName || job.craftsman.user.name}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="text-[10px]">
                          {job.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Admin Audit Logs Snippet */}
      <Card className="border border-border/60">
        <CardHeader className="py-4 border-b flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-primary" />
              Recent Admin Audit Trail
            </CardTitle>
            <CardDescription className="text-xs">
              System accountability log recording all administrator actions.
            </CardDescription>
          </div>
          <Button asChild size="sm" variant="ghost" className="text-xs gap-1">
            <Link href="/admin/logs">
              View Audit Logs <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {recentLogs.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground">
              No audit logs recorded yet.
            </div>
          ) : (
            <div className="divide-y divide-border/20 text-xs">
              {recentLogs.map((log) => (
                <div key={log.id} className="p-3.5 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-foreground">{log.action}</p>
                    <p className="text-[11px] text-muted-foreground">
                      By {log.admin.name || log.admin.email} on {new Date(log.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant="secondary" className="font-mono text-[10px] shrink-0">
                    {log.entityType}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}