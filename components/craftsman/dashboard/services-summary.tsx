import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wrench, ArrowRight, CheckCircle2, Tag } from "lucide-react";

export interface DashboardServiceCategory {
  id: string;
  name: string;
  subServices: {
    id: string;
    name: string;
  }[];
}

interface ServicesSummaryProps {
  categories: DashboardServiceCategory[];
}

export function ServicesSummary({ categories }: ServicesSummaryProps) {
  const totalSubServices = categories.reduce((acc, cat) => acc + cat.subServices.length, 0);

  return (
    <Card className="border-border/70 bg-card flex flex-col justify-between">
      <CardHeader className="p-4 sm:p-5 pb-3 flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Wrench className="size-4 text-primary" />
            <span>Offered Services Summary</span>
          </CardTitle>
          <CardDescription className="text-xs">
            {categories.length} categories • {totalSubServices} sub-services listed
          </CardDescription>
        </div>
        <Button size="sm" variant="ghost" className="gap-1 text-xs h-8 text-primary hover:text-primary" asChild>
          <Link href="/craftsman/services">
            <span>Manage</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 pt-0 space-y-3">
        {categories.length > 0 ? (
          <div className="space-y-3">
            {categories.slice(0, 3).map((cat) => (
              <div key={cat.id} className="rounded-xl border border-border/60 bg-muted/20 p-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Tag className="size-3 text-primary" />
                    {cat.name}
                  </span>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    {cat.subServices.length} {cat.subServices.length === 1 ? "skill" : "skills"}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {cat.subServices.map((sub) => (
                    <Badge
                      key={sub.id}
                      variant="outline"
                      className="text-[11px] font-normal bg-background/60 border-border/70 text-foreground flex items-center gap-1"
                    >
                      <CheckCircle2 className="size-3 text-emerald-500" />
                      <span>{sub.name}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed p-6 text-center text-xs text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">No services assigned yet.</p>
            <p>Assign service categories to start receiving customer requests.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
