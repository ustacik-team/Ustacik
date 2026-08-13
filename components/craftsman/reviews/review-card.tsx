"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Star,
  Calendar,
  MessageSquare,
  CornerDownRight,
  Send,
  Loader2,
  Images,
  Tag,
} from "lucide-react";
import { createReviewReplyAction } from "@/app/(dashboard)/craftsman/reviews/actions";
import { toast } from "sonner";

export interface DetailedReviewItem {
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
    category: {
      name: string;
    };
    subService?: {
      name: string;
    } | null;
  };
  photos: {
    id: string;
    imageUrl: string;
  }[];
  reply?: {
    id: string;
    reply: string;
    createdAt: Date | string;
  } | null;
}

interface ReviewCardProps {
  review: DetailedReviewItem;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const overallScore = (
    (review.punctuality + review.workmanship + review.priceHonesty + review.communication) / 4
  ).toFixed(1);

  const customerInitials = review.customer.name
    ? review.customer.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "CU";

  const formattedDate = new Date(review.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleReplySubmit = async () => {
    if (!replyText.trim()) {
      toast.error("Please enter a reply message.");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Submitting response to review...");

    try {
      const result = await createReviewReplyAction(review.id, replyText);
      if (result.success) {
        toast.success("Your response has been published!", { id: toastId });
        setReplyText("");
        setReplyOpen(false);
      } else {
        toast.error(result.error || "Failed to submit response.", { id: toastId });
      }
    } catch (error) {
      console.error("Error submitting reply:", error);
      toast.error("An error occurred while submitting your reply.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoriesScores = [
    { label: "Punctuality", score: review.punctuality },
    { label: "Workmanship", score: review.workmanship },
    { label: "Price Honesty", score: review.priceHonesty },
    { label: "Communication", score: review.communication },
  ];

  return (
    <Card className="border-border/70 bg-card overflow-hidden transition-colors hover:border-primary/30">
      <CardContent className="p-4 sm:p-6 space-y-4">
        {/* Header: Customer & Overall Score */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/50">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="size-11 border shrink-0">
              <AvatarImage src={review.customer.image ?? undefined} alt={review.customer.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                {customerInitials}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <h3 className="font-bold text-base text-foreground truncate">{review.customer.name}</h3>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-0.5">
                <span className="flex items-center gap-1">
                  <Calendar className="size-3 text-muted-foreground shrink-0" />
                  <span>{formattedDate}</span>
                </span>
                <span>•</span>
                <span className="truncate text-foreground/80 font-medium">{review.job.title}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <div className="flex items-center gap-1.5 bg-amber-500/10 px-3 py-1 rounded-full text-amber-600 dark:text-amber-400 text-sm font-bold border border-amber-500/20">
              <Star className="size-4 fill-amber-500 text-amber-500" />
              <span>{overallScore}</span>
            </div>
          </div>
        </div>

        {/* Job Category & Subservice Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Badge variant="secondary" className="gap-1 font-medium">
            <Tag className="size-3 text-primary" />
            {review.job.category.name}
          </Badge>
          {review.job.subService && (
            <Badge variant="outline" className="text-muted-foreground font-normal">
              {review.job.subService.name}
            </Badge>
          )}
        </div>

        {/* Rating Categories Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
          {categoriesScores.map((cat) => (
            <div key={cat.label} className="rounded-lg border border-border/50 bg-muted/20 p-2 text-center space-y-0.5">
              <span className="text-[11px] text-muted-foreground block truncate">{cat.label}</span>
              <span className="font-bold text-foreground flex items-center justify-center gap-1">
                <Star className="size-3 fill-amber-500 text-amber-500" />
                {cat.score}/5
              </span>
            </div>
          ))}
        </div>

        {/* Customer Comment */}
        {review.comment && (
          <div className="rounded-xl border border-border/50 bg-muted/15 p-3.5 space-y-1">
            <p className="text-xs text-foreground/90 leading-relaxed italic">
              &quot;{review.comment}&quot;
            </p>
          </div>
        )}

        {/* Review Photos */}
        {review.photos.length > 0 && (
          <div className="space-y-2 pt-1">
            <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Images className="size-3.5 text-primary" />
              <span>Customer Photos ({review.photos.length})</span>
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {review.photos.map((p, idx) => (
                <Dialog key={p.id}>
                  <DialogTrigger asChild>
                    <div className="relative aspect-square rounded-lg overflow-hidden border border-border/60 bg-muted cursor-pointer group">
                      <Image
                        src={p.imageUrl}
                        alt={`Review photo ${idx + 1}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl border-none bg-black/90 p-0 overflow-hidden">
                    <div className="relative aspect-video w-full max-h-[75vh] flex items-center justify-center">
                      <Image src={p.imageUrl} alt={`Full photo ${idx + 1}`} fill className="object-contain" />
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </div>
        )}

        {/* Craftsman Reply Section */}
        {review.reply ? (
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 space-y-1.5 mt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-primary flex items-center gap-1.5">
                <CornerDownRight className="size-3.5" />
                <span>Your Response</span>
              </span>
              <span className="text-[10px] text-muted-foreground">
                {new Date(review.reply.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <p className="text-xs text-foreground/90 leading-relaxed pl-5">
              {review.reply.reply}
            </p>
          </div>
        ) : (
          <div className="pt-2 flex justify-end">
            {!replyOpen ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setReplyOpen(true)}
                className="gap-1.5 text-xs text-primary border-primary/30 hover:bg-primary/5"
              >
                <MessageSquare className="size-3.5" />
                <span>Reply to Customer</span>
              </Button>
            ) : (
              <div className="w-full space-y-3 rounded-xl border border-border/70 p-3.5 bg-muted/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <CornerDownRight className="size-3.5 text-primary" />
                    Write a response to {review.customer.name}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 text-[11px] text-muted-foreground"
                    onClick={() => setReplyOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>

                <Textarea
                  placeholder="Type your polite and professional response..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="text-xs min-h-[80px]"
                />

                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    disabled={isSubmitting || !replyText.trim()}
                    onClick={handleReplySubmit}
                    className="gap-1.5 text-xs font-medium"
                  >
                    {isSubmitting ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Send className="size-3.5" />
                    )}
                    <span>Publish Response</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
