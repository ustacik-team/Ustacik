import { Loader2, Shield } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary animate-pulse">
        <Shield className="h-6 w-6" />
      </div>
      <div className="flex items-center gap-2 text-muted-foreground font-medium text-sm">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        <span>Loading your dashboard...</span>
      </div>
    </div>
  );
}
