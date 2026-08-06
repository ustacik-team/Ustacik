import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, User, Calendar, ImageIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────
interface ReviewPhoto {
  id: string;
  imageUrl: string;
}

interface ReviewReply {
  id: string;
  reply: string;
  createdAt: string | Date;
}

interface Review {
  id: string;
  customer: {
    name: string;
    image: string | null;
  };
  createdAt: string | Date;
  rating: number; // Overall rating (1-5)
  punctuality: number;
  workmanship: number;
  priceHonesty: number;
  communication: number;
  comment: string | null;
  photos?: ReviewPhoto[];
  reply?: ReviewReply | null;
}

interface ReviewsProps {
  reviews: Review[];
  className?: string;
}

// ─── Helper: Render Stars ──────────────────────────────────────────────
function renderStars(rating: number, size: "sm" | "md" = "sm") {
  const starSize = size === "md" ? "h-5 w-5" : "h-4 w-4";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            starSize,
            i <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-muted text-muted"
          )}
        />
      ))}
    </div>
  );
}

// ─── Component ──────────────────────────────────────────────────────────
export function Reviews({ reviews, className }: ReviewsProps) {
  if (!reviews || reviews.length === 0) {
    return (
      <Card
        className={cn(
          "border-border/40 bg-card/60 backdrop-blur-sm shadow-sm",
          className
        )}
      >
        <CardHeader className="border-b border-border/20 pb-4">
          <CardTitle className="text-lg font-bold">Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent className="pt-8 pb-12 flex flex-col items-center justify-center text-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/30 text-muted-foreground">
            <User className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium">No reviews yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              This craftsman hasn&apos;t received any customer feedback.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "border-border/40 bg-card/60 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300",
        className
      )}
    >
      <CardHeader className="border-b border-border/20 pb-4">
        <CardTitle className="text-lg font-bold">Customer Reviews</CardTitle>
      </CardHeader>

      <CardContent className="pt-6 pb-6 divide-y divide-border/20">
        {reviews.map((review) => {
          const categoryBreakdown = [
            { label: "Punctuality", value: review.punctuality },
            { label: "Workmanship", value: review.workmanship },
            { label: "Price Honesty", value: review.priceHonesty },
            { label: "Communication", value: review.communication },
          ];

          return (
            <div key={review.id} className="py-6 first:pt-0 last:pb-0 space-y-4">
              {/* ─── HEADER: Avatar, Name, Date ─────────────────────── */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10 border-2 border-background">
                    <AvatarImage
                      src={review.customer.image || undefined}
                      alt={review.customer.name}
                    />
                    <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                      {review.customer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {review.customer.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(review.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Overall Rating */}
                <div className="flex flex-col items-end gap-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm">{review.rating.toFixed(1)}</span>
                    {renderStars(review.rating, "sm")}
                  </div>
                </div>
              </div>

              {/* ─── CATEGORY BREAKDOWN ────────────────────────────── */}
              <div className="flex flex-wrap gap-2 pl-[3.25rem]">
                {categoryBreakdown.map((cat) => (
                  <Badge
                    key={cat.label}
                    variant="outline"
                    className="bg-muted/20 text-xs font-medium border-muted-foreground/20"
                  >
                    {cat.label}: {cat.value.toFixed(1)}
                  </Badge>
                ))}
              </div>

              {/* ─── COMMENT (Optional) ────────────────────────────── */}
              {review.comment && (
                <div className="pl-[3.25rem]">
                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                    &quot;{review.comment}&quot;
                  </p>
                </div>
              )}

              {/* ─── REVIEW PHOTOS ──────────────────────────────────── */}
              {review.photos && review.photos.length > 0 && (
                <div className="pl-[3.25rem] flex flex-wrap gap-2">
                  {review.photos.slice(0, 4).map((photo) => (
                    <div
                      key={photo.id}
                      className="relative h-16 w-16 overflow-hidden rounded-md border border-border/20 bg-muted/10 cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <Image
                        src={photo.imageUrl}
                        alt="Review photo"
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* ─── CRAFTSMAN REPLY ────────────────────────────────── */}
              {review.reply && (
                <div className="pl-[3.25rem] pt-2">
                  <Card className="bg-muted/30 border-muted-foreground/10 shadow-none p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-[10px] font-semibold text-primary border-primary/20 bg-primary/5">
                        Craftsman&apos;s Reply
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(review.reply.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {review.reply.reply}
                    </p>
                  </Card>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}