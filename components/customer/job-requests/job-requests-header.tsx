import { ClipboardList } from "lucide-react";

interface JobRequestsHeaderProps {
  totalCount: number;
  pendingCount: number;
}

export function JobRequestsHeader({ totalCount, pendingCount }: JobRequestsHeaderProps) {
  return (
    <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-5">
      <div>
        <div className="flex items-center gap-2 text-primary">
          <ClipboardList className="size-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Customer Portal</span>
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">My Job Requests</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track, filter, and manage all your direct requests to local craftsmen.
        </p>
      </div>

      <div className="flex items-center gap-3 self-start sm:self-auto">
        <div className="rounded-xl border border-border/70 bg-card px-3 py-2 text-center shadow-2xs">
          <p className="text-xs text-muted-foreground">Total Requests</p>
          <p className="text-lg font-bold text-foreground">{totalCount}</p>
        </div>
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-center shadow-2xs">
          <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">Pending</p>
          <p className="text-lg font-bold text-amber-700 dark:text-amber-300">{pendingCount}</p>
        </div>
      </div>
    </header>
  );
}
