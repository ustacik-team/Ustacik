import { Star } from "lucide-react";

interface RatingBreakdownProps {
  label: string;
  value: number;
  max?: number;
}

export function RatingBreakdownItem({ label, value, max = 5 }: RatingBreakdownProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const formattedValue = value.toFixed(1);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-foreground">{label}</span>
        <span className="font-bold text-foreground flex items-center gap-1">
          <Star className="size-3 fill-amber-500 text-amber-500" />
          <span>{formattedValue}</span>
          <span className="text-muted-foreground font-normal">/ {max}</span>
        </span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
