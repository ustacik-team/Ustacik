import { MessageSquareQuote } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ReviewsHeaderProps {
  totalCount: number;
}

export function ReviewsHeader({ totalCount }: ReviewsHeaderProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2 text-primary">
          <MessageSquareQuote className="size-5" />
          <span className="text-sm font-semibold">Craftsman Workspace</span>
        </div>
        <div className="flex items-center gap-3 mt-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Customer Reviews</h1>
          <Badge variant="secondary" className="text-xs font-semibold px-2.5 py-0.5">
            {totalCount} {totalCount === 1 ? "review" : "reviews"}
          </Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          See what customers are saying about your work and service quality across completed jobs.
        </p>
      </div>
    </div>
  );
}
