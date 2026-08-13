import { Images } from "lucide-react";
import { AddPortfolioPhotoDialog } from "./add-portfolio-photo-dialog";

interface PortfolioHeaderProps {
  totalCount: number;
}

export function PortfolioHeader({ totalCount }: PortfolioHeaderProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2 text-primary">
          <Images className="size-5" />
          <span className="text-sm font-semibold">Craftsman Workspace</span>
        </div>
        <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight">My Portfolio</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Showcase high-quality photos of your previous completed work to build trust with customers ({totalCount} {totalCount === 1 ? "photo" : "photos"} listed).
        </p>
      </div>

      <AddPortfolioPhotoDialog />
    </div>
  );
}
