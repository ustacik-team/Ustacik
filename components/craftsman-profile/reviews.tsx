"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Star, User, Calendar, CornerDownRight, MessageSquareQuote } from "lucide-react";
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
function renderStars(rating: number) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => {
        const isFilled = i <= fullStars;
        const isHalf = i === fullStars + 1 && hasHalfStar;

        return (
          <Star
            key={i}
            className={cn(
              "h-4 w-4",
              isFilled
                ? "fill-amber-500 text-amber-500"
                : isHalf
                ? "fill-amber-500/50 text-amber-500"
                : "fill-muted text-muted-foreground/30"
            )}
          />
        );
      })}
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
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <MessageSquareQuote className="h-5 w-5 text-primary" />
            <span>Customer Reviews</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-8 pb-12 flex flex-col items-center justify-center text-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/30 text-muted-foreground">
            <User className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium">No reviews yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              This craftsman hasn&apos;t received any customer feedback yet.
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
      <CardHeader className="border-b border-border/20 pb-4 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <MessageSquareQuote className="h-5 w-5 text-primary" />
          <span>Customer Reviews</span>
        </CardTitle>
        <Badge variant="secondary" className="text-xs font-semibold px-2.5 py-0.5">
          {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
        </Badge>
      </CardHeader>

      <CardContent className="pt-6 pb-6 divide-y divide-border/20">
        {reviews.map((review) => {
          const categoryBreakdown = [
            { label: "Punctuality", value: review.punctuality },
            { label: "Workmanship", value: review.workmanship },
            { label: "Price Honesty", value: review.priceHonesty },
            { label: "Communication", value: review.communication },
          ];

          const initials = review.customer.name
            ? review.customer.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()
            : "CU";

          return (
            <div key={review.id} className="py-6 first:pt-0 last:pb-0 space-y-3.5">
              {/* ─── HEADER: Avatar, Name, Date & Score Badge ──────── */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10 border-2 border-background shadow-xs shrink-0">
                    <AvatarImage
                      src={review.customer.image || undefined}
                      alt={review.customer.name}
                    />
                    <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      {review.customer.name}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
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

                {/* Overall Rating Badge */}
                <div className="flex items-center gap-2 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
                  <span className="font-extrabold text-sm leading-none">{review.rating.toFixed(1)}</span>
                  {renderStars(review.rating)}
                </div>
              </div>

              {/* ─── CATEGORY RATING CHIPS ──────────────────────────── */}
              <div className="flex flex-wrap gap-1.5 sm:pl-[3.25rem]">
                {categoryBreakdown.map((cat) => (
                  <Badge
                    key={cat.label}
                    variant="outline"
                    className="bg-muted/30 text-[11px] font-medium border-border/50 gap-1 text-foreground/90"
                  >
                    <Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
                    <span>{cat.label}: {cat.value.toFixed(1)}</span>
                  </Badge>
                ))}
              </div>

              {/* ─── COMMENT (Optional) ────────────────────────────── */}
              {review.comment && (
                <div className="sm:pl-[3.25rem]">
                  <p className="text-sm text-foreground/90 leading-relaxed italic bg-muted/15 p-3 rounded-xl border border-border/40">
                    &quot;{review.comment}&quot;
                  </p>
                </div>
              )}

              {/* ─── REVIEW PHOTOS WITH LIGHTBOX ────────────────────── */}
              {review.photos && review.photos.length > 0 && (
                <div className="sm:pl-[3.25rem] flex flex-wrap gap-2 pt-1">
                  {review.photos.map((photo, idx) => (
                    <Dialog key={photo.id}>
                      <DialogTrigger asChild>
                        <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-border/60 bg-muted cursor-pointer hover:opacity-90 hover:scale-105 transition-all shadow-xs group">
                          <Image
                            src={photo.imageUrl}
                            alt={`Review photo ${idx + 1}`}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden rounded-2xl border-none bg-black/90">
                        <div className="relative aspect-video w-full max-h-[75vh] flex items-center justify-center">
                          <Image
                            src={photo.imageUrl}
                            alt={`Review photo full ${idx + 1}`}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              )}

              {/* ─── PREMIUM CRAFTSMAN REPLY BOX ───────────────────── */}
              {review.reply && (
                <div className="sm:pl-[3.25rem] pt-1">
                  <div className="rounded-xl border border-l-4 border-l-primary border-primary/20 bg-gradient-to-r from-primary/5 via-muted/30 to-muted/10 p-3.5 space-y-1.5 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-primary flex items-center gap-1.5">
                        <CornerDownRight className="h-3.5 w-3.5" />
                        <span>Craftsman Response</span>
                      </span>
                      <span className="text-[10px] text-muted-foreground font-medium">
                        {new Date(review.reply.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-foreground/90 leading-relaxed font-normal pl-5">
                      {review.reply.reply}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}