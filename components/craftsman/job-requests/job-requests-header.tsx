import { ClipboardList } from "lucide-react";

interface JobRequestsHeaderProps {
  totalCount: number;
  pendingCount: number;
}

export function JobRequestsHeader({ totalCount, pendingCount }: JobRequestsHeaderProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2 text-primary">
          <ClipboardList className="size-5" />
          <span className="text-sm font-semibold">Craftsman Workspace</span>
        </div>
        <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight">Job Requests</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review customer service requests, manage active work, and track completed jobs ({totalCount} total).
        </p>
      </div>
      {pendingCount > 0 && (
        <div className="inline-flex items-center gap-2 rounded-lg bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-300 border border-amber-500/20 self-start sm:self-auto">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex size-2 rounded-full bg-amber-500"></span>
          </span>
          {pendingCount} {pendingCount === 1 ? "request requires" : "requests require"} your response
        </div>
      )}
    </div>
  );
}
