import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BellRing,
  BriefcaseBusiness,
  CalendarCheck2,
  CircleAlert,
  ClipboardList,
  Clock3,
  Eye,
  Heart,
  MapPin,
  MessageSquareText,
  Plus,
  Sparkles,
  Star,
  TrendingUp,
  UserRoundCheck,
  type LucideIcon,
} from "lucide-react";

import { MetricChart } from "@/components/dashboard/metric-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export type DashboardRole = "customer" | "craftsman";

type DashboardStatus = "Needs action" | "Awaiting reply" | "Visit booked" | "In progress" | "Completed" | "New";
type Priority = "High" | "Medium" | "Low";

interface Metric {
  label: string;
  value: string;
  change: string;
  detail: string;
  Icon: LucideIcon;
  tone: string;
}

interface OverviewRow {
  title: string;
  service: string;
  counterpart: string;
  counterpartDetail: string;
  location: string;
  budget: string;
  status: DashboardStatus;
  priority: Priority;
  nextStep: string;
  updated: string;
  progress: number;
}

interface FocusItem {
  title: string;
  detail: string;
  status: "Ready" | "Needs attention" | "Upcoming";
  Icon: LucideIcon;
}

interface ActivityItem {
  title: string;
  detail: string;
  time: string;
  Icon: LucideIcon;
  tone: string;
}

interface Tip {
  title: string;
  detail: string;
}

interface DashboardConfig {
  eyebrow: string;
  title: string;
  description: string;
  primaryAction: { label: string; href: string; Icon: LucideIcon };
  secondaryAction: { label: string; href: string };
  focusLabel: string;
  focusValue: string;
  focusProgress: number;
  focusDetail: string;
  chart: { label: string; value: string; change: string; bars: number[]; tone: "blue" | "emerald" | "violet" };
  metrics: Metric[];
  overviewTitle: string;
  overviewDescription: string;
  overview: OverviewRow[];
  focusItems: FocusItem[];
  activity: ActivityItem[];
  tipsTitle: string;
  tipsDescription: string;
  tips: Tip[];
}

const dashboards: Record<DashboardRole, DashboardConfig> = {
  customer: {
    eyebrow: "Customer workspace",
    title: "Everything you need to keep a job moving.",
    description: "Track replies, compare the right professionals, and stay on top of every planned visit from one clear workspace.",
    primaryAction: { label: "Find a craftsman", href: "/find-craftsmen", Icon: Plus },
    secondaryAction: { label: "View all requests", href: "/customer/my-job-requests" },
    focusLabel: "Request readiness",
    focusValue: "80%",
    focusProgress: 80,
    focusDetail: "Your active requests include the photos, location, and preferred timing craftsmen need.",
    chart: { label: "Request activity this month", value: "18", change: "+24%", bars: [24, 38, 31, 54, 48, 66, 52, 70, 64, 82], tone: "blue" },
    metrics: [
      { label: "Active requests", value: "3", change: "1 needs attention", detail: "Requests awaiting a reply or booking", Icon: ClipboardList, tone: "text-primary bg-primary/10" },
      { label: "Craftsmen comparing", value: "7", change: "+2 this week", detail: "Professionals saved or shortlisted", Icon: UserRoundCheck, tone: "text-sky-600 bg-sky-500/10" },
      { label: "Visits booked", value: "2", change: "Next: Friday", detail: "Confirmed appointments coming up", Icon: CalendarCheck2, tone: "text-emerald-600 bg-emerald-500/10" },
      { label: "Reviews to leave", value: "1", change: "Quick reminder", detail: "Completed work waiting for feedback", Icon: Star, tone: "text-amber-600 bg-amber-500/10" },
    ],
    overviewTitle: "Your activity overview",
    overviewDescription: "A detailed view of each request, its current stage, and the next action that keeps it moving.",
    overview: [
      { title: "Kitchen leak repair", service: "Plumbing", counterpart: "3 craftsmen contacted", counterpartDetail: "1 viewed · 2 replies pending", location: "Kyrenia", budget: "₺2,000–₺3,500", status: "Needs action", priority: "High", nextStep: "Compare the first replies", updated: "12 min ago", progress: 32 },
      { title: "Electrical safety check", service: "Electrical", counterpart: "Mehmet Electrical", counterpartDetail: "Visit confirmed", location: "Nicosia", budget: "₺1,500–₺2,500", status: "Visit booked", priority: "Medium", nextStep: "Friday, 10:00", updated: "Yesterday", progress: 66 },
      { title: "Guest room repaint", service: "Painting", counterpart: "2 craftsmen contacted", counterpartDetail: "Awaiting availability", location: "Famagusta", budget: "₺4,000–₺6,000", status: "Awaiting reply", priority: "Low", nextStep: "Check back tomorrow", updated: "2 days ago", progress: 18 },
      { title: "Air conditioner service", service: "HVAC & Refrigeration", counterpart: "North Coast HVAC", counterpartDetail: "Work completed", location: "Kyrenia", budget: "₺1,800–₺2,800", status: "Completed", priority: "Low", nextStep: "Leave a review", updated: "4 days ago", progress: 100 },
    ],
    focusItems: [
      { title: "Compare kitchen leak replies", detail: "Two professionals are preparing estimates for you.", status: "Needs attention", Icon: MessageSquareText },
      { title: "Confirm access for Friday", detail: "Add any parking or building-entry notes before the visit.", status: "Upcoming", Icon: CalendarCheck2 },
      { title: "Share feedback for your AC service", detail: "A short review helps local customers make better choices.", status: "Ready", Icon: Star },
    ],
    activity: [
      { title: "A craftsman viewed your request", detail: "Aydin Plumbing opened the details for your kitchen leak repair.", time: "12 min ago", Icon: Eye, tone: "text-sky-600 bg-sky-500/10" },
      { title: "Visit time confirmed", detail: "Mehmet Electrical is booked for Friday at 10:00.", time: "Yesterday", Icon: CalendarCheck2, tone: "text-emerald-600 bg-emerald-500/10" },
      { title: "Profile saved for later", detail: "North Coast HVAC was added to your saved craftsmen.", time: "2 days ago", Icon: Heart, tone: "text-rose-600 bg-rose-500/10" },
    ],
    tipsTitle: "Hire with confidence",
    tipsDescription: "A few small checks make a big difference before work starts.",
    tips: [
      { title: "Compare the scope, not only the price", detail: "Make sure each quote covers the same materials, labour, and expected completion date." },
      { title: "Add photos and access notes", detail: "Clear photos and a note about parking or building access make a first visit more efficient." },
      { title: "Keep the job thread in one place", detail: "Use the request details to record agreements, appointment times, and any changes to the work." },
    ],
  },
  craftsman: {
    eyebrow: "Craftsman workspace",
    title: "Run your day, not just your inbox.",
    description: "Prioritise fresh enquiries, keep customers informed, and see exactly where your profile can win more of the right work.",
    primaryAction: { label: "Review job requests", href: "/craftsman/jobs", Icon: BriefcaseBusiness },
    secondaryAction: { label: "Edit public profile", href: "/craftsman/profile" },
    focusLabel: "Profile strength",
    focusValue: "78%",
    focusProgress: 78,
    focusDetail: "Add two recent work photos and update your availability to make your profile more compelling.",
    chart: { label: "New customer enquiries", value: "12", change: "+16%", bars: [28, 35, 42, 39, 55, 51, 64, 73, 68, 88], tone: "emerald" },
    metrics: [
      { label: "New enquiries", value: "4", change: "2 unread", detail: "Requests received in the last seven days", Icon: MessageSquareText, tone: "text-primary bg-primary/10" },
      { label: "Response target", value: "< 2h", change: "On track", detail: "Your typical first-response time", Icon: Clock3, tone: "text-emerald-600 bg-emerald-500/10" },
      { label: "Profile views", value: "28", change: "+18% this week", detail: "Customers who opened your profile", Icon: Eye, tone: "text-sky-600 bg-sky-500/10" },
      { label: "Average rating", value: "4.9", change: "36 reviews", detail: "Verified customer feedback", Icon: Star, tone: "text-amber-600 bg-amber-500/10" },
    ],
    overviewTitle: "Enquiry and work overview",
    overviewDescription: "Use the context below to decide what needs a reply first, what is booked, and what is ready to close.",
    overview: [
      { title: "Bathroom leak repair", service: "Plumbing", counterpart: "New customer enquiry", counterpartDetail: "Photos attached · needs same-day help", location: "Kyrenia", budget: "₺2,000–₺3,500", status: "New", priority: "High", nextStep: "Reply with availability", updated: "10 min ago", progress: 12 },
      { title: "Hallway lighting installation", service: "Electrical", counterpart: "Elif Kaya", counterpartDetail: "Site visit scheduled", location: "Nicosia", budget: "₺3,000–₺4,500", status: "Visit booked", priority: "Medium", nextStep: "Tomorrow, 14:30", updated: "Today", progress: 58 },
      { title: "Custom wardrobe measurement", service: "Carpentry", counterpart: "Kemal & family", counterpartDetail: "Quote accepted", location: "Famagusta", budget: "₺12,000–₺18,000", status: "In progress", priority: "High", nextStep: "Confirm material order", updated: "Yesterday", progress: 74 },
      { title: "Kitchen tap replacement", service: "Plumbing", counterpart: "Seda Arslan", counterpartDetail: "Handover completed", location: "Kyrenia", budget: "₺1,200–₺1,800", status: "Completed", priority: "Low", nextStep: "Request a review", updated: "3 days ago", progress: 100 },
    ],
    focusItems: [
      { title: "Reply to bathroom leak repair", detail: "The customer requested same-day availability and shared photos.", status: "Needs attention", Icon: CircleAlert },
      { title: "Prepare for tomorrow's site visit", detail: "Bring lighting measurements and confirm the building access details.", status: "Upcoming", Icon: CalendarCheck2 },
      { title: "Add new wardrobe project photos", detail: "Your latest work can strengthen the profile customers see in search.", status: "Ready", Icon: Sparkles },
    ],
    activity: [
      { title: "New request received", detail: "A customer in Kyrenia needs help with a bathroom leak repair.", time: "10 min ago", Icon: BellRing, tone: "text-primary bg-primary/10" },
      { title: "Your profile is being discovered", detail: "You appeared in 8 customer searches this week.", time: "Today", Icon: TrendingUp, tone: "text-sky-600 bg-sky-500/10" },
      { title: "Review reminder", detail: "Your kitchen tap replacement is completed and ready for a review request.", time: "2 days ago", Icon: Star, tone: "text-amber-600 bg-amber-500/10" },
    ],
    tipsTitle: "Build a stronger pipeline",
    tipsDescription: "These small habits turn more profile visits into the right enquiries.",
    tips: [
      { title: "Reply while the request is fresh", detail: "A clear first reply with your earliest availability builds confidence immediately." },
      { title: "Keep your price guidance realistic", detail: "Update your range as labour or material costs change so customers arrive better qualified." },
      { title: "Close completed work with a review request", detail: "A thoughtful, timely review request helps your profile build trust over time." },
    ],
  },
};

const statusStyles: Record<DashboardStatus, string> = {
  "Needs action": "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  "Awaiting reply": "border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  "Visit booked": "border-violet-500/25 bg-violet-500/10 text-violet-700 dark:text-violet-300",
  "In progress": "border-primary/25 bg-primary/10 text-primary",
  Completed: "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  New: "border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-300",
};

const priorityStyles: Record<Priority, string> = {
  High: "text-rose-600 dark:text-rose-400",
  Medium: "text-amber-600 dark:text-amber-400",
  Low: "text-muted-foreground",
};

const focusStyles = {
  Ready: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  "Needs attention": "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Upcoming: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
} as const;

export function RoleDashboard({ role }: { role: DashboardRole }) {
  const dashboard = dashboards[role];
  const PrimaryIcon = dashboard.primaryAction.Icon;

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-8">
      <section className="relative overflow-hidden rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/[0.14] via-background to-sky-500/[0.08] p-6 shadow-sm md:p-8">
        <div className="pointer-events-none absolute -right-24 -top-28 size-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/2 size-72 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="size-4" />
              <p className="section-kicker">{dashboard.eyebrow}</p>
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{dashboard.title}</h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">{dashboard.description}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="gap-2 shadow-md shadow-primary/15">
              <Link href={dashboard.primaryAction.href}><PrimaryIcon className="size-4" /> {dashboard.primaryAction.label}</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={dashboard.secondaryAction.href}>{dashboard.secondaryAction.label}<ArrowRight className="ml-2 size-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboard.metrics.map((metric) => {
          const Icon = metric.Icon;
          return (
            <Card key={metric.label} className="group overflow-hidden border-border/70 bg-card/85 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className={"grid size-11 place-items-center rounded-2xl " + metric.tone}><Icon className="size-5" /></div>
                  <span className="rounded-full bg-muted px-2 py-1 text-[11px] font-semibold text-muted-foreground">{metric.change}</span>
                </div>
                <p className="mt-5 text-3xl font-bold tracking-tight">{metric.value}</p>
                <p className="mt-1 text-sm font-semibold">{metric.label}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{metric.detail}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.55fr_0.85fr]">
        <Card className="border-border/70 bg-card/85">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>Momentum</CardTitle>
              <CardDescription>How your workspace has moved over the last four weeks.</CardDescription>
            </div>
            <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">This month</Badge>
          </CardHeader>
          <CardContent>
            <MetricChart {...dashboard.chart} />
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-border/70 bg-card/85">
          <CardHeader className="border-b border-border/60">
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle>{dashboard.focusLabel}</CardTitle>
                <CardDescription>One simple improvement at a time.</CardDescription>
              </div>
              <BadgeCheck className="size-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-5">
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold tracking-tight">{dashboard.focusValue}</p>
              <p className="text-xs font-semibold text-primary">Keep building</p>
            </div>
            <Progress value={dashboard.focusProgress} />
            <p className="text-sm leading-relaxed text-muted-foreground">{dashboard.focusDetail}</p>
            <div className="rounded-xl border border-primary/10 bg-primary/[0.035] p-3 text-sm">
              <span className="font-semibold text-primary">Next best move:</span>{" "}
              <span className="text-muted-foreground">{dashboard.focusItems[0].title}</span>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="overflow-hidden border-border/70 bg-card/85">
          <CardHeader className="flex flex-col gap-3 border-b border-border/60 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <CardTitle>{dashboard.overviewTitle}</CardTitle>
              <CardDescription className="mt-1 max-w-2xl">{dashboard.overviewDescription}</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href={dashboard.primaryAction.href}>Open workspace <ArrowRight className="ml-2 size-3.5" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/35">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="min-w-56 pl-5">Request & service</TableHead>
                  <TableHead className="hidden min-w-48 lg:table-cell">Contact / context</TableHead>
                  <TableHead className="hidden xl:table-cell">Location & budget</TableHead>
                  <TableHead className="min-w-32">Stage</TableHead>
                  <TableHead className="hidden min-w-44 2xl:table-cell">Next step</TableHead>
                  <TableHead className="w-28 pr-5 text-right">Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboard.overview.map((row) => (
                  <TableRow key={row.title} className="group">
                    <TableCell className="pl-5 py-4 align-top">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><BriefcaseBusiness className="size-4" /></div>
                        <div className="min-w-0">
                          <p className="font-semibold">{row.title}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">{row.service}</p>
                          <div className="mt-2 flex items-center gap-2 lg:hidden">
                            <Badge variant="outline" className={statusStyles[row.status]}>{row.status}</Badge>
                            <span className={"text-xs font-semibold " + priorityStyles[row.priority]}>{row.priority}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden py-4 align-top lg:table-cell">
                      <p className="text-sm font-semibold">{row.counterpart}</p>
                      <p className="mt-1 max-w-48 text-xs leading-relaxed text-muted-foreground">{row.counterpartDetail}</p>
                    </TableCell>
                    <TableCell className="hidden py-4 align-top xl:table-cell">
                      <p className="flex items-center gap-1.5 text-sm"><MapPin className="size-3.5 text-muted-foreground" />{row.location}</p>
                      <p className="mt-1 text-xs font-medium text-muted-foreground">{row.budget}</p>
                    </TableCell>
                    <TableCell className="py-4 align-top">
                      <Badge variant="outline" className={statusStyles[row.status]}>{row.status}</Badge>
                      <div className="mt-2 flex items-center gap-1.5">
                        <span className={"text-xs font-semibold " + priorityStyles[row.priority]}>{row.priority}</span>
                        <span className="text-xs text-muted-foreground">priority</span>
                      </div>
                      <Progress value={row.progress} className="mt-2 h-1 w-24" />
                    </TableCell>
                    <TableCell className="hidden py-4 align-top 2xl:table-cell">
                      <p className="text-sm font-medium">{row.nextStep}</p>
                      <p className="mt-1 text-xs text-muted-foreground">Move the request forward</p>
                    </TableCell>
                    <TableCell className="py-4 pr-5 text-right align-top">
                      <span className="text-xs text-muted-foreground">{row.updated}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-border/70 bg-card/85">
          <CardHeader>
            <CardTitle>Today&apos;s focus</CardTitle>
            <CardDescription>Three concrete things that will keep your work moving.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {dashboard.focusItems.map((item) => {
              const Icon = item.Icon;
              return (
                <div key={item.title} className="flex gap-3 rounded-2xl border border-border/60 p-4 transition-colors hover:bg-muted/35">
                  <div className={"grid size-10 shrink-0 place-items-center rounded-xl " + focusStyles[item.status]}><Icon className="size-4" /></div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <p className="font-semibold">{item.title}</p>
                      <span className={"text-xs font-semibold " + focusStyles[item.status].split(" ").slice(1).join(" ")}>{item.status}</span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/85">
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>The most recent updates from your workspace.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {dashboard.activity.map((item, index) => {
              const Icon = item.Icon;
              return (
                <div key={item.title} className="relative flex gap-3 py-3 first:pt-0 last:pb-0">
                  {index !== dashboard.activity.length - 1 && <div className="absolute left-5 top-11 h-[calc(100%-1.75rem)] w-px bg-border" />}
                  <div className={"relative z-10 grid size-10 shrink-0 place-items-center rounded-xl " + item.tone}><Icon className="size-4" /></div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold">{item.title}</p>
                      <span className="shrink-0 text-xs text-muted-foreground">{item.time}</span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="border-border/70 bg-card/85">
          <CardHeader>
            <CardTitle>{dashboard.tipsTitle}</CardTitle>
            <CardDescription>{dashboard.tipsDescription}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            {dashboard.tips.map((tip, index) => (
              <div key={tip.title} className="group rounded-2xl border border-border/60 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:bg-primary/[0.025]">
                <span className="grid size-7 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">0{index + 1}</span>
                <h3 className="mt-4 text-sm font-semibold">{tip.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tip.detail}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
