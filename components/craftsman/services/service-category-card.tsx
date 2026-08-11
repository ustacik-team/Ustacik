import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderTree, Tag } from "lucide-react";
import { ServiceItem } from "./service-item";

export type ServiceCategoryGroup = {
  id: string;
  name: string;
  subServices: {
    id: string;
    name: string;
  }[];
};

interface ServiceCategoryCardProps {
  categoryGroup: ServiceCategoryGroup;
}

export function ServiceCategoryCard({ categoryGroup }: ServiceCategoryCardProps) {
  const count = categoryGroup.subServices.length;

  return (
    <Card className="overflow-hidden border-border/70 bg-card transition-all duration-200 hover:border-primary/40 hover:shadow-md">
      {/* Top Gradient Accent Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-primary via-primary/80 to-sky-500" />

      <CardHeader className="p-4 sm:p-5 pb-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary font-bold">
              <FolderTree className="size-4" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg leading-tight text-foreground truncate">
                {categoryGroup.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Primary Service Category
              </p>
            </div>
          </div>

          <Badge variant="secondary" className="bg-primary/10 text-primary font-semibold text-xs shrink-0">
            <Tag className="size-3 mr-1" />
            {count} {count === 1 ? "Specialty" : "Specialties"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 pt-0 space-y-3">
        {count > 0 ? (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 pt-1">
            {categoryGroup.subServices.map((sub) => (
              <ServiceItem key={sub.id} id={sub.id} name={sub.name} categoryName={categoryGroup.name} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground">
            No specific sub-services selected under this category yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
