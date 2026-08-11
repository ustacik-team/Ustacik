import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star, ArrowRight, MessageSquareOff } from "lucide-react";

export interface DashboardReviewItem {
  id: string;
  punctuality: number;
  workmanship: number;
  priceHonesty: number;
  communication: number;
  comment?: string | null;
  createdAt: Date | string;
  customer: {
    name: string;
    image?: string | null;
  };
  job: {
    title: string;
  };
}

interface RecentReviewsProps {
  reviews: DashboardReviewItem[];
}

export function RecentReviews({ reviews }: RecentReviewsProps) {
  return (
    <Card className="border-border/70 bg-card flex flex-col justify-between">
      <CardHeader className="p-4 sm:p-5 pb-3 flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="text-base font-bold">Recent Customer Reviews</CardTitle>
          <CardDescription className="text-xs">
            Verified feedback on completed work
          </CardDescription>
        </div>
        <Button size="sm" variant="ghost" className="gap-1 text-xs h-8 text-primary hover:text-primary" asChild>
          <Link href="/craftsman/reviews">
            <span>View All</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 pt-0 space-y-3">
        {reviews.length > 0 ? (
          reviews.slice(0, 4).map((rev) => {
            const overallRating = (
              (rev.punctuality + rev.workmanship + rev.priceHonesty + rev.communication) / 4
            ).toFixed(1);

            const customerInitials = rev.customer.name
              ? rev.customer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)
              : "CU";

            const formattedDate = new Date(rev.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <div
                key={rev.id}
                className="rounded-xl border border-border/60 bg-muted/20 p-3.5 space-y-2 transition-colors hover:border-primary/30"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar className="size-8 border shrink-0">
                      <AvatarImage src={rev.customer.image ?? undefined} alt={rev.customer.name} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                        {customerInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold leading-tight text-foreground truncate">
                        {rev.customer.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate">{rev.job.title}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full text-amber-600 dark:text-amber-400 text-xs font-bold shrink-0">
                    <Star className="size-3 fill-amber-500 text-amber-500" />
                    <span>{overallRating}</span>
                  </div>
                </div>

                {rev.comment && (
                  <p className="text-xs text-muted-foreground italic line-clamp-2 leading-relaxed bg-background/50 p-2 rounded-lg border border-border/40">
                    &quot;{rev.comment}&quot;
                  </p>
                )}

                <p className="text-[10px] text-muted-foreground text-right">{formattedDate}</p>
              </div>
            );
          })
        ) : (
          <div className="rounded-xl border border-dashed p-8 text-center text-xs text-muted-foreground space-y-2">
            <MessageSquareOff className="size-8 mx-auto text-muted-foreground/60" />
            <p className="font-medium text-foreground">You haven&apos;t received any reviews yet.</p>
            <p>Reviews will appear here as soon as customers complete feedback after job completion.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
