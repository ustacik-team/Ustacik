import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────
interface SimilarServicesProps {
  subServices: string[];
  className?: string;
}

// ─── Component ──────────────────────────────────────────────────────────
export function SimilarServices({ subServices, className }: SimilarServicesProps) {
  if (!subServices || subServices.length === 0) {
    return null;
  }

  const MAX_DISPLAY = 8;
  const servicesToShow = subServices.slice(0, MAX_DISPLAY);

  return (
    <div className={cn("space-y-6", className)}>
      <h2 className="text-2xl font-bold tracking-tight">Similar Services</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {servicesToShow.map((service) => (
          <Link
            key={service}
            href={`/find-craftsmen?subService=${encodeURIComponent(service)}`}
            className="group block"
          >
            <Card className="h-full border-border/40 bg-card/60 backdrop-blur-sm shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/30">
              <CardHeader className="p-4 pb-2">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  <Wrench className="h-5 w-5" />
                </div>
                <CardTitle className="text-sm font-semibold leading-tight line-clamp-2">
                  {service}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">
                  <span>View Craftsmen</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {subServices.length > MAX_DISPLAY && (
        <p className="text-sm text-muted-foreground text-center mt-2">
          And {subServices.length - MAX_DISPLAY} more similar services...
        </p>
      )}
    </div>
  );
}