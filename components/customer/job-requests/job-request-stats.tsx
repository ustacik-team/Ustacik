import { JobStatus } from "@prisma/client";
import { CheckCheck, CheckCircle2, Clock, Layers, XCircle } from "lucide-react";

interface JobRequestStatsProps {
  stats: {
    total: number;
    pending: number;
    accepted: number;
    completed: number;
    cancelled: number;
  };
  activeFilter: string;
  onSelectFilter: (filter: string) => void;
}

export function JobRequestStats({ stats, activeFilter, onSelectFilter }: JobRequestStatsProps) {
  const items = [
    {
      id: "ALL",
      label: "Total Requests",
      count: stats.total,
      Icon: Layers,
      color: "text-primary bg-primary/10 border-primary/20",
    },
    {
      id: JobStatus.PENDING,
      label: "Pending",
      count: stats.pending,
      Icon: Clock,
      color: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      id: JobStatus.ACCEPTED,
      label: "Accepted",
      count: stats.accepted,
      Icon: CheckCircle2,
      color: "text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20",
    },
    {
      id: JobStatus.COMPLETED,
      label: "Completed",
      count: stats.completed,
      Icon: CheckCheck,
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      id: JobStatus.CANCELLED,
      label: "Cancelled",
      count: stats.cancelled,
      Icon: XCircle,
      color: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {items.map(({ id, label, count, Icon, color }) => {
        const isSelected = activeFilter === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelectFilter(id)}
            className={`flex flex-col justify-between rounded-2xl border p-4 text-left transition-all hover:scale-[1.02] ${
              isSelected
                ? "border-primary bg-primary/5 shadow-md ring-2 ring-primary/20"
                : "border-border/70 bg-card/85 hover:border-border"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">{label}</span>
              <div className={`grid size-8 place-items-center rounded-lg border ${color}`}>
                <Icon className="size-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold tracking-tight">{count}</p>
          </button>
        );
      })}
    </div>
  );
}
