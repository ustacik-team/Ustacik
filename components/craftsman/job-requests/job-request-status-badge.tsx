import { JobStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, CheckCheck, XCircle } from "lucide-react";

interface JobRequestStatusBadgeProps {
  status: JobStatus | string;
  className?: string;
}

const statusConfig: Record<
  JobStatus,
  { label: string; icon: typeof Clock; className: string; pulse?: boolean }
> = {
  PENDING: {
    label: "Pending Response",
    icon: Clock,
    className: "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300 dark:border-amber-500/30 shadow-xs shadow-amber-500/10",
    pulse: true,
  },
  ACCEPTED: {
    label: "Accepted & In Progress",
    icon: CheckCircle2,
    className: "border-sky-500/40 bg-sky-500/10 text-sky-700 dark:text-sky-300 dark:border-sky-500/30 shadow-xs shadow-sky-500/10",
  },
  COMPLETED: {
    label: "Completed",
    icon: CheckCheck,
    className: "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 dark:border-emerald-500/30 shadow-xs shadow-emerald-500/10",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: XCircle,
    className: "border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300 dark:border-rose-500/30 shadow-xs shadow-rose-500/10",
  },
};

export function JobRequestStatusBadge({ status, className = "" }: JobRequestStatusBadgeProps) {
  const config = statusConfig[status as JobStatus] || {
    label: status,
    icon: Clock,
    className: "border-gray-500/40 bg-gray-500/10 text-gray-700 dark:text-gray-300",
  };

  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full transition-colors ${config.className} ${className}`}
    >
      {config.pulse && (
        <span className="relative flex size-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex size-2 rounded-full bg-amber-500"></span>
        </span>
      )}
      <Icon className="size-3.5 shrink-0" />
      <span>{config.label}</span>
    </Badge>
  );
}
