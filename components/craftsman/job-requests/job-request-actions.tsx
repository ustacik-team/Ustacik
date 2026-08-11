"use client";

import { JobStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, CheckCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface JobRequestActionsProps {
  jobId: string;
  jobTitle: string;
  status: JobStatus | string;
  onStatusChange?: (jobId: string, newStatus: JobStatus) => void;
}

export function JobRequestActions({
  jobId,
  jobTitle,
  status,
  onStatusChange,
}: JobRequestActionsProps) {
  const handleAccept = () => {
    toast.success("Job request accepted", {
      description: `Accepted "${jobTitle}". Customer has been notified.`,
    });
    onStatusChange?.(jobId, JobStatus.ACCEPTED);
  };

  const handleCancel = () => {
    toast.info("Job request cancelled", {
      description: `Cancelled "${jobTitle}". Status updated.`,
    });
    onStatusChange?.(jobId, JobStatus.CANCELLED);
  };

  const handleComplete = () => {
    toast.success("Job marked as completed", {
      description: `Completed "${jobTitle}". Total completed jobs updated.`,
    });
    onStatusChange?.(jobId, JobStatus.COMPLETED);
  };

  if (status === JobStatus.PENDING) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          className="gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-sm shadow-emerald-500/20 active:scale-[0.98] transition-all font-medium"
          onClick={handleAccept}
        >
          <CheckCircle2 className="size-4" />
          <span>Accept Request</span>
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5 text-rose-600 dark:text-rose-400 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 border-rose-200 dark:border-rose-900/50 active:scale-[0.98] transition-all"
          onClick={handleCancel}
        >
          <XCircle className="size-4" />
          <span>Decline</span>
        </Button>
      </div>
    );
  }

  if (status === JobStatus.ACCEPTED) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          className="gap-1.5 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white shadow-sm shadow-sky-500/20 active:scale-[0.98] transition-all font-medium"
          onClick={handleComplete}
        >
          <CheckCheck className="size-4" />
          <span>Mark as Completed</span>
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="gap-1.5 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all text-xs"
          onClick={handleCancel}
        >
          <XCircle className="size-3.5" />
          <span>Cancel Job</span>
        </Button>
      </div>
    );
  }

  if (status === JobStatus.COMPLETED) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-500/20">
        <Sparkles className="size-3.5 text-emerald-500 animate-pulse" />
        <span>Work Finalized</span>
      </div>
    );
  }

  if (status === JobStatus.CANCELLED) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium border border-border/60">
        <XCircle className="size-3.5" />
        <span>Closed / Cancelled</span>
      </div>
    );
  }

  return null;
}
