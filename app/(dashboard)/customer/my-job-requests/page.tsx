"use client";

import { BriefcaseBusiness, CheckCircle2, Clock3, Send } from "lucide-react";

import { JobRequestList, type CustomerJob } from "@/components/customer/job-request-list";
import { Card, CardContent } from "@/components/ui/card";
import { useLocalJobRequests } from "@/lib/local-job-requests";

const starterJobs: CustomerJob[] = [
  { id: "starter-job-1", craftsmanId: "craftsman-1", title: "Repair a leaking kitchen tap", craftsman: "Ahmet Yılmaz", category: "Plumbing & Water Systems", region: "Nicosia", status: "PENDING", createdAt: "2026-08-06", updatedAt: "Today" },
  { id: "starter-job-2", craftsmanId: "craftsman-2", title: "Install new hallway lighting", craftsman: "Mehmet Demir", category: "Electrical", region: "Kyrenia", status: "ACCEPTED", createdAt: "2026-08-03", updatedAt: "Yesterday" },
  { id: "starter-job-3", craftsmanId: "craftsman-4", title: "Custom wardrobe measurement", craftsman: "Mustafa Çelik", category: "Carpentry & Furniture", region: "Larnaca", status: "COMPLETED", createdAt: "2026-07-14", updatedAt: "Jul 22" },
];

export default function MyJobRequests() {
  const localJobs = useLocalJobRequests();
  const jobs = [...localJobs, ...starterJobs];
  const pending = jobs.filter((job) => job.status === "PENDING").length;
  const active = jobs.filter((job) => job.status === "ACCEPTED").length;
  const completed = jobs.filter((job) => job.status === "COMPLETED").length;
  const stats = [
    { label: "Awaiting response", value: pending, Icon: Clock3, tone: "text-amber-600" },
    { label: "Active requests", value: active, Icon: Send, tone: "text-blue-600" },
    { label: "Completed jobs", value: completed, Icon: CheckCircle2, tone: "text-emerald-600" },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-7">
      <div>
        <div className="flex items-center gap-2 text-primary"><BriefcaseBusiness className="size-5" /><span className="text-sm font-semibold">Customer workspace</span></div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">My job requests</h1>
        <p className="mt-2 text-muted-foreground">Track every request, response, and completed job in one place.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, Icon, tone }) => <Card key={label} className="border-border/70"><CardContent className="flex items-center gap-4 py-5"><div className={`grid size-10 place-items-center rounded-xl bg-muted ${tone}`}><Icon className="size-5" /></div><div><p className="text-2xl font-bold">{value}</p><p className="text-sm text-muted-foreground">{label}</p></div></CardContent></Card>)}
      </div>
      <JobRequestList jobs={jobs} />
    </div>
  );
}
