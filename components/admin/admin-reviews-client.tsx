"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MessageSquareQuote, Search, Star, Trash2, ShieldAlert, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AdminReviewItem {
  id: string;
  jobId: string;
  jobTitle: string;
  customerName: string;
  customerEmail: string;
  craftsmanBusinessName: string | null;
  craftsmanUserName: string;
  punctuality: number;
  workmanship: number;
  priceHonesty: number;
  communication: number;
  averageRating: string;
  comment: string | null;
  createdAt: string;
  replyText: string | null;
  photos: string[];
}

interface AdminReviewsClientProps {
  reviews: AdminReviewItem[];
}

export function AdminReviewsClient({ reviews }: AdminReviewsClientProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedReview, setSelectedReview] = useState<AdminReviewItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const filteredReviews = reviews.filter((r) => {
    const term = searchTerm.toLowerCase();
    return (
      r.jobTitle.toLowerCase().includes(term) ||
      r.customerName.toLowerCase().includes(term) ||
      (r.craftsmanBusinessName && r.craftsmanBusinessName.toLowerCase().includes(term)) ||
      (r.comment && r.comment.toLowerCase().includes(term))
    );
  });

  const handleOpenDetail = (review: AdminReviewItem) => {
    setSelectedReview(review);
    setIsDialogOpen(true);
  };

  const handleDeleteReview = async () => {
    if (!selectedReview) return;
    if (!confirm("Are you sure this review is a fake review or contains abusive content? Legitimate negative reviews must NOT be removed according to platform policy.")) {
      return;
    }

    try {
      setIsDeleting(true);
      const res = await fetch(`/api/admin/reviews/${selectedReview.id}`, {
        method: "DELETE",
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || json.error || "Failed to remove review.");
      }

      toast.success("Review removed successfully.");
      setIsDialogOpen(false);
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred.";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="border border-border/60">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageSquareQuote className="h-5 w-5 text-primary" />
            Review &amp; Rating Moderation Queue
          </CardTitle>
          <CardDescription className="text-xs">
            Reviews from verified platform jobs. Enforces 4 sub-ratings &amp; anti-removal policies.
          </CardDescription>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search job, customer, craftsman..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>
      </CardHeader>

      <CardContent>
        {/* Anti-Removal Notice Banner */}
        <div className="mb-4 rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-amber-800 dark:text-amber-300 text-xs leading-relaxed flex items-start gap-2.5">
          <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div>
            <p className="font-semibold text-xs mb-0.5">Strict Policy Notice: Negative Reviews</p>
            <p>
              Negative reviews must <strong>NEVER</strong> be removed simply for being critical. Reviews are only deleted for verified abuse or fake reviews with no real job. Craftsmen have 1 public reply available.
            </p>
          </div>
        </div>

        {filteredReviews.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-xs border border-dashed rounded-lg">
            No customer reviews found matching search.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="text-xs">
                <TableHead>Job &amp; Customer</TableHead>
                <TableHead>Craftsman</TableHead>
                <TableHead>Sub-Ratings Breakdown</TableHead>
                <TableHead>Avg Score</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              {filteredReviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="font-medium">
                    <p className="font-semibold text-foreground truncate max-w-[180px]">{review.jobTitle}</p>
                    <p className="text-[11px] text-muted-foreground">By {review.customerName}</p>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-foreground">{review.craftsmanBusinessName || review.craftsmanUserName}</p>
                    {review.replyText && (
                      <Badge variant="secondary" className="text-[9px] mt-0.5">1 Reply Posted</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[10px] text-muted-foreground">
                      <span>Punctuality: <strong className="text-foreground">{review.punctuality}/5</strong></span>
                      <span>Workmanship: <strong className="text-foreground">{review.workmanship}/5</strong></span>
                      <span>Price Honesty: <strong className="text-foreground">{review.priceHonesty}/5</strong></span>
                      <span>Communication: <strong className="text-foreground">{review.communication}/5</strong></span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 font-bold text-foreground">
                      <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                      {review.averageRating}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs gap-1"
                      onClick={() => handleOpenDetail(review)}
                    >
                      Inspect
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Review Detail & Moderation Dialog */}
        {selectedReview && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-lg flex items-center gap-2">
                  <MessageSquareQuote className="h-5 w-5 text-primary" />
                  Review Details &amp; Moderation
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Submitted on {new Date(selectedReview.createdAt).toLocaleString()} for Job #{selectedReview.jobId.slice(0, 8)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2 text-xs">
                {/* 4 Scores */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 rounded-lg bg-muted/20 border border-border/30 text-center">
                  <div className="p-2 rounded bg-background">
                    <p className="text-[10px] text-muted-foreground">Punctuality</p>
                    <p className="text-sm font-bold text-foreground">{selectedReview.punctuality}/5</p>
                  </div>
                  <div className="p-2 rounded bg-background">
                    <p className="text-[10px] text-muted-foreground">Workmanship</p>
                    <p className="text-sm font-bold text-foreground">{selectedReview.workmanship}/5</p>
                  </div>
                  <div className="p-2 rounded bg-background">
                    <p className="text-[10px] text-muted-foreground">Price Honesty</p>
                    <p className="text-sm font-bold text-foreground">{selectedReview.priceHonesty}/5</p>
                  </div>
                  <div className="p-2 rounded bg-background">
                    <p className="text-[10px] text-muted-foreground">Communication</p>
                    <p className="text-sm font-bold text-foreground">{selectedReview.communication}/5</p>
                  </div>
                </div>

                {/* Comment & Photos */}
                <div className="p-3 rounded-lg bg-muted/20 border border-border/30 space-y-2">
                  <p className="font-semibold text-foreground">Written Comment</p>
                  <p className="text-muted-foreground whitespace-pre-wrap">{selectedReview.comment || "No written comment left."}</p>
                  {selectedReview.photos.length > 0 && (
                    <div className="pt-2 border-t border-border/20">
                      <p className="font-semibold text-foreground mb-1 flex items-center gap-1"><ImageIcon className="h-3 w-3" /> Attached Work Photos ({selectedReview.photos.length})</p>
                      <div className="flex items-center gap-2 overflow-x-auto">
                        {selectedReview.photos.map((url, idx) => (
                          <div key={idx} className="relative h-16 w-16 rounded overflow-hidden border bg-muted shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt={`Review photo ${idx + 1}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Craftsman Reply */}
                {selectedReview.replyText && (
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 space-y-1">
                    <p className="font-semibold text-primary">Craftsman Public Reply</p>
                    <p className="text-foreground whitespace-pre-wrap">{selectedReview.replyText}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteReview}
                  disabled={isDeleting}
                  className="gap-1 text-xs"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Remove for Abuse / Fake Job
                </Button>
                <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}
