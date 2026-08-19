import { Card, CardContent } from "@/components/ui/card";
import { Images, ShieldCheck, CheckCircle2 } from "lucide-react";

interface PortfolioStatsProps {
  totalPhotos: number;
  workPhotosVerified?: boolean;
}

export function PortfolioStats({ totalPhotos, workPhotosVerified = false }: PortfolioStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <Card className="border-border/70 bg-card">
        <CardContent className="flex items-center gap-3 p-3.5 sm:p-4">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary font-bold">
            <Images className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-2xl font-extrabold leading-none text-foreground">{totalPhotos}</p>
            <p className="mt-1 text-xs font-medium text-foreground/80 truncate">Total Work Photos</p>
            <p className="text-[11px] text-muted-foreground truncate">Uploaded portfolio items</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/70 bg-card">
        <CardContent className="flex items-center gap-3 p-3.5 sm:p-4">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
            <ShieldCheck className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xl font-bold leading-none text-foreground">
              {workPhotosVerified ? "Verified Photos" : "Standard Showcase"}
            </p>
            <p className="mt-1 text-xs font-medium text-foreground/80 truncate">Verification Check</p>
            <p className="text-[11px] text-muted-foreground truncate">
              {workPhotosVerified ? "Inspected & approved by admins" : "Subject to trust review"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/70 bg-card">
        <CardContent className="flex items-center gap-3 p-3.5 sm:p-4">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold">
            <CheckCircle2 className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xl font-bold leading-none text-foreground">Publicly Visible</p>
            <p className="mt-1 text-xs font-medium text-foreground/80 truncate">Marketplace Status</p>
            <p className="text-[11px] text-muted-foreground truncate">Visible on your public profile</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
