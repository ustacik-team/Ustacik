import { Loader2 } from "lucide-react";
import { Logo } from "@/components/logo";

export default function DashboardLoading() {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="animate-pulse">
        <Logo size={48} showText={false} />
      </div>
      <div className="flex items-center gap-2 text-muted-foreground font-medium text-sm">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        <span>Loading your dashboard...</span>
      </div>
    </div>
  );
}
