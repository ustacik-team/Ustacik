import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────
interface PricingCardProps {
  priceMin: number | null;
  priceMax: number | null;
  className?: string;
}

// ─── Component ──────────────────────────────────────────────────────────
export function PricingCard({ priceMin, priceMax, className }: PricingCardProps) {
  const hasPrices = priceMin !== null && priceMax !== null && priceMin > 0 && priceMax > 0;

  return (
    <Card className={cn("h-full border-border/40 bg-card/60 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md", className)}>
      <CardHeader className="border-b border-border/20 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-bold">
          <DollarSign className="h-5 w-5 text-primary" />
          Pricing Information
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6 pb-6 space-y-6">
        
        {hasPrices ? (
          <>
            {/* ─── LARGE ESTIMATED RANGE ──────────────────────────────── */}
            <div className="flex flex-col items-center justify-center py-2">
              <div className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
                ₺{priceMin.toLocaleString()} – ₺{priceMax.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground mt-2 font-medium">Estimated Price Range</p>
            </div>

            {/* ─── MIN / MAX BREAKDOWN ────────────────────────────────── */}
            <div className="grid grid-cols-2 gap-4 text-center border-t border-border/20 pt-4">
              <div>
                <p className="text-2xl font-semibold text-foreground">₺{priceMin.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mt-0.5">
                  Minimum
                </p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">₺{priceMax.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mt-0.5">
                  Maximum
                </p>
              </div>
            </div>
          </>
        ) : (
          /* ─── EMPTY STATE (PRICE ON REQUEST) ──────────────────────── */
          <div className="py-10 text-center">
            <p className="text-2xl font-semibold text-muted-foreground">Price on Request</p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Contact the craftsman for a custom quote.
            </p>
          </div>
        )}

        {/* ─── DISCLAIMER ──────────────────────────────────────────────── */}
        <div className="pt-4 border-t border-border/20">
          <p className="text-xs text-muted-foreground text-center italic leading-relaxed max-w-xs mx-auto">
            *Final quotation depends on inspection.
          </p>
        </div>

      </CardContent>
    </Card>
  );
}