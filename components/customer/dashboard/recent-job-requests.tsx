import Link from "next/link";
import { format } from "date-fns";
import { Briefcase, ArrowRight, ClipboardList, Calendar } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { JobRequestStatusBadge } from "@/components/customer/job-requests/job-request-status-badge";

interface RecentJobRequestsProps {
  jobs: Array<{
    id: string;
    title: string;
    description: string;
    address: string;
    status: string;
    createdAt: Date | string;
    category: { id: string; name: string };
    subService?: { id: string; name: string } | null;
    craftsman: {
      id: string;
      businessName?: string | null;
      user: {
        id: string;
        name: string;
        image?: string | null;
      };
    };
  }>;
}

export function RecentJobRequests({ jobs }: RecentJobRequestsProps) {
  const displayJobs = jobs.slice(0, 5);

  return (
    <Card className="border-border/70 bg-card flex flex-col justify-between">
      <CardHeader className="p-4 sm:p-5 pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <ClipboardList className="size-4 text-primary" />
            <span>Recent Job Requests</span>
          </CardTitle>
          <Button variant="ghost" size="sm" asChild className="gap-1 text-xs text-primary p-0 h-auto font-semibold">
            <Link href="/customer/my-job-requests">
              <span>View All</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>
        <CardDescription className="text-xs">
          Your direct service inquiries to craftsmen
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 pt-0">
        {displayJobs.length === 0 ? (
          <div className="py-8 text-center space-y-3">
            <div className="mx-auto grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
              <Briefcase className="size-6" />
            </div>
            <div>
              <p className="text-sm font-semibold">You haven&apos;t requested a craftsman yet</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                Submit a job request to get in touch with local verified specialists.
              </p>
            </div>
            <Button asChild size="sm" variant="outline" className="gap-1.5 text-xs font-semibold">
              <Link href="/find-craftsmen">Find a Craftsman</Link>
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {displayJobs.map((job) => {
              const initials = job.craftsman.user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              const formattedDate = format(new Date(job.createdAt), "MMM d");

              return (
                <div key={job.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="size-9 border shrink-0">
                      <AvatarImage src={job.craftsman.user.image ?? undefined} alt={job.craftsman.user.name} />
                      <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                        {initials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 space-y-0.5">
                      <p className="text-sm font-semibold text-foreground truncate">{job.title}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {job.craftsman.user.name}
                        {job.craftsman.businessName ? ` (${job.craftsman.businessName})` : ""}
                      </p>
                      <div className="flex items-center gap-2 pt-0.5">
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-medium">
                          {job.category.name}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Calendar className="size-3" /> {formattedDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  <JobRequestStatusBadge status={job.status} className="shrink-0 scale-90" />
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
