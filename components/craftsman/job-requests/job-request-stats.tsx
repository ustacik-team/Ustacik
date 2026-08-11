import { Card, CardContent } from "@/components/ui/card";
import { FolderKanban, Clock, CheckCircle2, CheckCheck, XCircle } from "lucide-react";

export interface JobStats {
  total: number;
  pending: number;
  accepted: number;
  completed: number;
  cancelled: number;
}

interface JobRequestStatsProps {
  stats: JobStats;
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
}

export function JobRequestStats({ stats, activeFilter, onFilterChange }: JobRequestStatsProps) {
  const statItems = [
    {
      id: "ALL",
      label: "Total Requests",
      value: stats.total,
      icon: FolderKanban,
      color: "text-foreground",
      bgColor: "bg-muted/80 text-foreground",
      borderColor: "hover:border-foreground/40",
      activeRing: "ring-foreground/50 border-foreground/50",
    },
    {
      id: "PENDING",
      label: "Pending Response",
      value: stats.pending,
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      borderColor: "hover:border-amber-500/40",
      activeRing: "ring-amber-500/50 border-amber-500/50 bg-amber-500/5",
    },
    {
      id: "ACCEPTED",
      label: "Accepted Jobs",
      value: stats.accepted,
      icon: CheckCircle2,
      color: "text-sky-600 dark:text-sky-400",
      bgColor: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
      borderColor: "hover:border-sky-500/40",
      activeRing: "ring-sky-500/50 border-sky-500/50 bg-sky-500/5",
    },
    {
      id: "COMPLETED",
      label: "Completed",
      value: stats.completed,
      icon: CheckCheck,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      borderColor: "hover:border-emerald-500/40",
      activeRing: "ring-emerald-500/50 border-emerald-500/50 bg-emerald-500/5",
    },
    {
      id: "CANCELLED",
      label: "Cancelled",
      value: stats.cancelled,
      icon: XCircle,
      color: "text-rose-600 dark:text-rose-400",
      bgColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
      borderColor: "hover:border-rose-500/40",
      activeRing: "ring-rose-500/50 border-rose-500/50 bg-rose-500/5",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {statItems.map((item) => {
        const Icon = item.icon;
        const isSelected = activeFilter === item.id;
        return (
          <Card
            key={item.id}
            className={`relative overflow-hidden transition-all duration-200 ${
              onFilterChange ? "cursor-pointer active:scale-[0.98]" : ""
            } ${
              isSelected
                ? `ring-2 ${item.activeRing} shadow-md`
                : "border-border/70 hover:shadow-sm"
            } ${item.borderColor}`}
            onClick={() => onFilterChange?.(item.id)}
          >
            <CardContent className="flex items-center gap-3 p-3.5 sm:p-4">
              <div className={`grid size-10 shrink-0 place-items-center rounded-xl font-bold shadow-xs ${item.bgColor}`}>
                <Icon className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-none text-foreground">
                  {item.value}
                </p>
                <p className="mt-1 text-xs font-medium text-muted-foreground truncate">{item.label}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
