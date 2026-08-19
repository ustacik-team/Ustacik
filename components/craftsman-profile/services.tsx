import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface ServiceCategory {
  name: string;
  subServices: string[];
}

interface ServicesProps {
  categories: ServiceCategory[];
  className?: string;
}

export function Services({ categories, className }: ServicesProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <Card
      className={cn(
        "border-border/40 bg-card/60 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md",
        className
      )}
    >
      {/* pb-3 matches ContactCard padding for perfect header alignment */}
      <CardHeader className="border-b border-border/20 pb-3">
        <CardTitle className="text-lg font-bold">Services Offered</CardTitle>
      </CardHeader>

      {/* pt-4 pb-0 matches ContactCard padding */}
      <CardContent className="pt-4 pb-6 space-y-6">
        {categories.map((category, index) => (
          <div key={index} className="space-y-3 group">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary/40 group-hover:bg-primary/60 transition-colors" />
              <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                {category.name}
              </h3>
            </div>
            <div className="flex flex-wrap gap-2 ml-4">
              {category.subServices.map((sub, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="px-3 py-1 text-xs font-semibold bg-muted text-foreground border border-border/60 transition-all duration-200 hover:scale-105 hover:bg-muted/80 shadow-xs cursor-default"
                >
                  {sub}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}