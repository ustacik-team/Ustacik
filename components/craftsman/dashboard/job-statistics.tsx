import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Clock, CheckCircle2, CheckCheck, Award } from "lucide-react";

export interface DashboardJobStats {
  total: number;
  pending: number;
  accepted: number;
  completed: number;
  cancelled: number;
  totalProfileCompletedJobs?: number;
}

interface JobStatisticsProps {
  stats: DashboardJobStats;
}

export function JobStatistics({ stats }: JobStatisticsProps) {
  const statItems = [
    {
      label: "Total Requests",
      value: stats.total,
      icon: Briefcase,
      color: "text-primary",
      bgColor: "bg-primary/10",
      detail: "Customer inquiries",
    },
    {
      label: "Pending Action",
      value: stats.pending,
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-500/10",
      detail: "Requires response",
    },
    {
      label: "In Progress",
      value: stats.accepted,
      icon: CheckCircle2,
      color: "text-sky-600 dark:text-sky-400",
      bgColor: "bg-sky-500/10",
      detail: "Accepted active jobs",
    },
    {
      label: "Jobs Completed",
      value: stats.completed,
      icon: CheckCheck,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-500/10",
      detail: "Finished work",
    },
    {
      label: "Lifetime Jobs",
      value: stats.totalProfileCompletedJobs ?? stats.completed,
      icon: Award,
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-500/10",
      detail: "Total on profile",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.label} className="border-border/70 bg-card">
            <CardContent className="flex items-center gap-3 p-3.5 sm:p-4">
              <div className={`grid size-10 shrink-0 place-items-center rounded-xl font-bold ${item.bgColor} ${item.color}`}>
                <Icon className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-extrabold leading-none text-foreground">{item.value}</p>
                <p className="mt-1 text-xs font-semibold text-foreground/80 truncate">{item.label}</p>
                <p className="text-[11px] text-muted-foreground truncate">{item.detail}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
