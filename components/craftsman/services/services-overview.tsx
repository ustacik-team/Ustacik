import { Card, CardContent } from "@/components/ui/card";
import { FolderTree, Layers, CheckCircle2, Award } from "lucide-react";

interface ServicesOverviewProps {
  totalCategories: number;
  totalSubServices: number;
}

export function ServicesOverview({ totalCategories, totalSubServices }: ServicesOverviewProps) {
  const avgPerCat = totalCategories > 0 ? (totalSubServices / totalCategories).toFixed(1) : "0";

  const statItems = [
    {
      label: "Active Categories",
      value: totalCategories,
      icon: FolderTree,
      bgColor: "bg-primary/10",
      color: "text-primary",
      detail: "Primary service areas",
    },
    {
      label: "Sub-Services Offered",
      value: totalSubServices,
      icon: Layers,
      bgColor: "bg-sky-500/10",
      color: "text-sky-600 dark:text-sky-400",
      detail: "Specific skills listed",
    },
    {
      label: "Avg. Services / Category",
      value: avgPerCat,
      icon: Award,
      bgColor: "bg-amber-500/10",
      color: "text-amber-600 dark:text-amber-400",
      detail: "Specialization depth",
    },
    {
      label: "Marketplace Listing",
      value: totalCategories > 0 ? "Active" : "Inactive",
      icon: CheckCircle2,
      bgColor: totalCategories > 0 ? "bg-emerald-500/10" : "bg-muted",
      color: totalCategories > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground",
      detail: totalCategories > 0 ? "Visible to customers" : "No services listed",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.label} className="border-border/70 bg-card">
            <CardContent className="flex items-center gap-3 p-3.5 sm:p-4">
              <div className={`grid size-10 shrink-0 place-items-center rounded-xl font-bold ${item.bgColor} ${item.color}`}>
                <Icon className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold leading-none text-foreground">{item.value}</p>
                <p className="mt-1 text-xs font-medium text-foreground/80 truncate">{item.label}</p>
                <p className="text-[11px] text-muted-foreground truncate">{item.detail}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
