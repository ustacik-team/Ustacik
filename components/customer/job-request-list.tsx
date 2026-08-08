"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CalendarDays, ChevronRight, CircleAlert, Clock3, Search, SlidersHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CustomerJob } from "@/lib/local-job-requests";

export type { CustomerJob } from "@/lib/local-job-requests";

const statusConfig = {
  PENDING: { label: "Awaiting response", className: "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-400" },
  ACCEPTED: { label: "Accepted", className: "border-blue-500/25 bg-blue-500/10 text-blue-700 dark:text-blue-400" },
  COMPLETED: { label: "Completed", className: "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" },
  CANCELLED: { label: "Cancelled", className: "border-muted bg-muted text-muted-foreground" },
} as const;

const dateFormatter = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" });

export function JobRequestList({ jobs }: { jobs: CustomerJob[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const filteredJobs = useMemo(
    () => jobs.filter((job) =>
      (status === "all" || job.status === status) &&
      `${job.title} ${job.craftsman} ${job.category}`.toLowerCase().includes(query.toLowerCase()),
    ),
    [jobs, query, status],
  );

  if (!jobs.length) return <EmptyState />;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-xl border bg-card/70 p-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by job, craftsman, or category" className="pl-9" />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full sm:w-48"><SlidersHorizontal className="mr-2 size-4 text-muted-foreground" /><SelectValue placeholder="All statuses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {Object.entries(statusConfig).map(([value, config]) => <SelectItem key={value} value={value}>{config.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-between text-sm text-muted-foreground"><p>{filteredJobs.length} {filteredJobs.length === 1 ? "request" : "requests"}</p><p className="hidden sm:block">Most recently updated first</p></div>
      <div className="space-y-3">
        {filteredJobs.map((job) => {
          const config = statusConfig[job.status];
          return (
            <Card key={job.id} className="border-border/70 transition-all hover:-translate-y-0.5 hover:shadow-md">
              <CardContent className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2"><h2 className="font-semibold">{job.title}</h2><Badge variant="outline" className={config.className}>{config.label}</Badge></div>
                  <p className="mt-1 text-sm text-muted-foreground">With <span className="font-medium text-foreground">{job.craftsman}</span> · {job.category} · {job.region}</p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground"><span className="inline-flex items-center gap-1"><CalendarDays className="size-3.5" />Requested {dateFormatter.format(new Date(job.createdAt))}</span><span className="inline-flex items-center gap-1"><Clock3 className="size-3.5" />Updated {job.updatedAt}</span></div>
                </div>
                <Button variant="outline" size="sm" className="self-start sm:self-auto" asChild>
                  <Link href={`/craftsmen/${job.craftsmanId}`} aria-label={`View ${job.craftsman}'s profile`}><span className="sm:hidden">View craftsman</span><span className="hidden sm:inline">Profile</span><ChevronRight className="size-4" /></Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {!filteredJobs.length && <div className="rounded-xl border border-dashed py-14 text-center"><CircleAlert className="mx-auto size-6 text-muted-foreground" /><h2 className="mt-3 font-semibold">No requests match your filters</h2><p className="mt-1 text-sm text-muted-foreground">Try a different search or status.</p><Button variant="link" onClick={() => { setQuery(""); setStatus("all"); }} className="mt-2">Clear filters</Button></div>}
    </div>
  );
}

function EmptyState() {
  return <Card className="border-dashed"><CardContent className="py-16 text-center"><div className="mx-auto grid size-12 place-items-center rounded-full bg-primary/10 text-primary"><CalendarDays className="size-6" /></div><h2 className="mt-4 text-lg font-semibold">No job requests yet</h2><p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">Browse verified craftsmen and add your first request when you are ready.</p><Button asChild className="mt-5"><Link href="/find-craftsmen">Find craftsmen</Link></Button></CardContent></Card>;
}
