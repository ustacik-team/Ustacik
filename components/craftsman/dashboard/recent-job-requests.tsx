import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JobRequestStatusBadge } from "@/components/craftsman/job-requests/job-request-status-badge";
import { ArrowRight, MapPin, Calendar, Inbox } from "lucide-react";
import { JobStatus } from "@prisma/client";

export interface DashboardJobItem {
  id: string;
  title: string;
  address: string;
  status: JobStatus | string;
  createdAt: Date | string;
  customer: {
    name: string;
    image?: string | null;
  };
  category: {
    name: string;
  };
  subService?: {
    name: string;
  } | null;
}

interface RecentJobRequestsProps {
  jobs: DashboardJobItem[];
}

export function RecentJobRequests({ jobs }: RecentJobRequestsProps) {
  return (
    <Card className="border-border/70 bg-card flex flex-col justify-between">
      <CardHeader className="p-4 sm:p-5 pb-3 flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="text-base font-bold">Recent Job Requests</CardTitle>
          <CardDescription className="text-xs">
            Latest requests submitted by customers
          </CardDescription>
        </div>
        <Button size="sm" variant="ghost" className="gap-1 text-xs h-8 text-primary hover:text-primary" asChild>
          <Link href="/craftsman/job-requests">
            <span>View All</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 pt-0 space-y-3">
        {jobs.length > 0 ? (
          jobs.slice(0, 5).map((job) => {
            const customerInitials = job.customer.name
              ? job.customer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)
              : "CU";

            const formattedDate = new Date(job.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            });

            return (
              <div
                key={job.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/20 p-3 transition-colors hover:border-primary/30"
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <Avatar className="size-9 border shrink-0 mt-0.5 sm:mt-0">
                    <AvatarImage src={job.customer.image ?? undefined} alt={job.customer.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                      {customerInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-semibold text-foreground truncate">
                        {job.customer.name}
                      </span>
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                        {job.category.name}
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-sm leading-snug text-foreground truncate">
                      {job.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="size-3 text-primary shrink-0" />
                        <span className="truncate">{job.address}</span>
                      </span>
                      <span className="flex items-center gap-1 shrink-0">
                        <Calendar className="size-3" />
                        <span>{formattedDate}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 self-end sm:self-center">
                  <JobRequestStatusBadge status={job.status} />
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-xl border border-dashed p-8 text-center text-xs text-muted-foreground space-y-2">
            <Inbox className="size-8 mx-auto text-muted-foreground/60" />
            <p className="font-medium text-foreground">No job requests yet</p>
            <p>Customer inquiries will appear here as soon as they submit requests.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
