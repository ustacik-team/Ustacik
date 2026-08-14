import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { Role, JobStatus } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Briefcase, ShieldCheck, MapPin, Tag } from "lucide-react";

export default async function AdminAnalyticsPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/sign-in?redirect=/admin/analytics");
  }

  if (session.user.role !== Role.ADMIN) {
    redirect("/dashboard");
  }

  // ─── Real Database Metrics & Value Analytics ──────────────────────────────
  const [
    totalJobsGenerated,
    completedJobsCount,
    activeJobsCount,
    categoryBreakdown,
    regionBreakdown,
  ] = await Promise.all([
    // 1. Total Jobs Generated
    prisma.job.count(),
    // 2. Completed Jobs
    prisma.job.count({ where: { status: JobStatus.COMPLETED } }),
    // 3. Active Jobs
    prisma.job.count({ where: { status: { in: [JobStatus.PENDING, JobStatus.ACCEPTED] } } }),
    // 4. Jobs grouped by category
    prisma.category.findMany({
      select: {
        name: true,
        _count: {
          select: { jobs: true, craftsmen: true },
        },
      },
      orderBy: { jobs: { _count: "desc" } },
    }),
    // 5. Jobs / Craftsmen by region
    prisma.region.findMany({
      select: {
        name: true,
        _count: {
          select: { craftsmen: true },
        },
      },
      orderBy: { craftsmen: { _count: "desc" } },
    }),
  ]);

  const completionRate = totalJobsGenerated > 0 
    ? ((completedJobsCount / totalJobsGenerated) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Marketplace &amp; Value Analytics</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Value-generation tracking and supply/demand coverage insights across Northern Cyprus.
        </p>
      </div>

      {/* Top Value Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Jobs Sent to Craftsmen</CardTitle>
            <Briefcase className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalJobsGenerated.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              &quot;We sent craftsmen {totalJobsGenerated} jobs&quot;
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Jobs Completed</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {completedJobsCount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {completionRate}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active In-Progress Jobs</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeJobsCount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Pending customer matches &amp; accepted jobs
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Monetization Proposition</CardTitle>
            <ShieldCheck className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-amber-600 dark:text-amber-400">Free Tier Active</div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Cash-based marketplace model
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Two Columns: Demand by Category + Supply by Region */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Jobs & Craftsmen by Category */}
        <Card className="border border-border/60">
          <CardHeader className="py-4 border-b">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary" />
              Category Demand &amp; Supply Balance
            </CardTitle>
            <CardDescription className="text-xs">
              Job requests generated vs. registered trade craftsmen per category.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {categoryBreakdown.map((cat) => (
              <div key={cat.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-foreground">{cat.name}</span>
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">{cat._count.jobs}</strong> jobs · {cat._count.craftsmen} craftsmen
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted/40 overflow-hidden flex">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{
                      width: `${totalJobsGenerated > 0 ? Math.min(100, Math.max(5, (cat._count.jobs / totalJobsGenerated) * 100)) : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Craftsman Supply by Region */}
        <Card className="border border-border/60">
          <CardHeader className="py-4 border-b">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Regional Supply Coverage
            </CardTitle>
            <CardDescription className="text-xs">
              Active craftsman distribution across Northern Cyprus territory districts.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {regionBreakdown.map((reg) => (
              <div key={reg.name} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20 border border-border/30 text-xs">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  <span className="font-semibold text-foreground">{reg.name}</span>
                </div>
                <Badge variant="secondary" className="font-mono text-[10px]">
                  {reg._count.craftsmen} Craftsmen
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
