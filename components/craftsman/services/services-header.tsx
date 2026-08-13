import { Wrench } from "lucide-react";

interface ServicesHeaderProps {
  totalCategories: number;
  totalSubServices: number;
}

export function ServicesHeader({ totalCategories, totalSubServices }: ServicesHeaderProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2 text-primary">
          <Wrench className="size-5" />
          <span className="text-sm font-semibold">Craftsman Workspace</span>
        </div>
        <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight">Services</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage and review the service categories and sub-services you offer to customers on Ustacik.
        </p>
      </div>

      <div className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary border border-primary/20 self-start sm:self-auto">
        <span>{totalCategories} {totalCategories === 1 ? "Category" : "Categories"}</span>
        <span>•</span>
        <span>{totalSubServices} {totalSubServices === 1 ? "Service Offered" : "Services Offered"}</span>
      </div>
    </div>
  );
}
