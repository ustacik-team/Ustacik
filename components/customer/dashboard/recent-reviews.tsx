import Link from "next/link";
import { format } from "date-fns";
import { Star, ArrowRight, MessageSquareQuote } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface RecentReviewsProps {
  reviews: Array<{
    id: string;
    punctuality: number;
    workmanship: number;
    priceHonesty: number;
    communication: number;
    comment?: string | null;
    createdAt: Date | string;
    craftsman: {
      id: string;
      businessName?: string | null;
      user: {
        id: string;
        name: string;
        image?: string | null;
      };
    };
    job?: {
      title: string;
    } | null;
  }>;
}

export function RecentReviews({ reviews }: RecentReviewsProps) {
  const displayReviews = reviews.slice(0, 4);

  return (
    <Card className="border-border/70 bg-card flex flex-col justify-between">
      <CardHeader className="p-4 sm:p-5 pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Star className="size-4 text-amber-500 fill-amber-500" />
            <span>My Recent Reviews</span>
          </CardTitle>
          <Button variant="ghost" size="sm" asChild className="gap-1 text-xs text-primary p-0 h-auto font-semibold">
            <Link href="/customer/reviews">
              <span>View All</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>
        <CardDescription className="text-xs">
          Feedback and ratings shared for completed work
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 pt-0">
        {displayReviews.length === 0 ? (
          <div className="py-8 text-center space-y-3">
            <div className="mx-auto grid size-12 place-items-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <MessageSquareQuote className="size-6" />
            </div>
            <div>
              <p className="text-sm font-semibold">Your reviews will appear here</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                After completing a job with a craftsman, share your feedback to guide other customers.
              </p>
            </div>
            <Button asChild size="sm" variant="outline" className="gap-1.5 text-xs font-semibold">
              <Link href="/customer/my-job-requests">Check Completed Jobs</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {displayReviews.map((rev) => {
              const initials = rev.craftsman.user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              const avgRating = (
                (rev.punctuality + rev.workmanship + rev.priceHonesty + rev.communication) / 4
              ).toFixed(1);

              const formattedDate = format(new Date(rev.createdAt), "MMM d, yyyy");

              return (
                <div key={rev.id} className="rounded-xl border border-border/60 bg-muted/20 p-3 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Avatar className="size-8 border shrink-0">
                        <AvatarImage src={rev.craftsman.user.image ?? undefined} alt={rev.craftsman.user.name} />
                        <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-foreground truncate">
                          {rev.craftsman.user.name}
                        </p>
                        {rev.job?.title && (
                          <p className="text-[11px] text-muted-foreground truncate">{rev.job.title}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 shrink-0">
                      <Star className="size-3 text-amber-500 fill-amber-500" />
                      <span className="text-xs font-extrabold text-amber-700 dark:text-amber-300">
                        {avgRating}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 text-[11px] text-muted-foreground bg-background/60 p-1.5 rounded-md border border-border/40">
                    <span>Work: <strong>{rev.workmanship}/5</strong></span>
                    <span>Punct: <strong>{rev.punctuality}/5</strong></span>
                    <span>Comm: <strong>{rev.communication}/5</strong></span>
                    <span>Price: <strong>{rev.priceHonesty}/5</strong></span>
                  </div>

                  {rev.comment && (
                    <p className="text-xs text-foreground/90 italic line-clamp-2">
                      &quot;{rev.comment}&quot;
                    </p>
                  )}

                  <p className="text-[10px] text-muted-foreground text-right pt-0.5">
                    {formattedDate}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
