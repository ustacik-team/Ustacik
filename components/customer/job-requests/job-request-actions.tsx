"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, MessageSquareQuote, Phone, Star, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cancelJobRequestAction } from "@/app/(dashboard)/customer/my-job-requests/actions";
import { CustomerJobItem } from "./job-request-details";

interface JobRequestActionsProps {
  job: CustomerJobItem;
  onViewDetails: (job: CustomerJobItem) => void;
}

export function JobRequestActions({ job, onViewDetails }: JobRequestActionsProps) {
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancelRequest = async () => {
    if (isCancelling) return;
    setIsCancelling(true);

    try {
      const res = await cancelJobRequestAction(job.id);
      if (!res.success) {
        toast.error(res.error || "Failed to cancel request.");
      } else {
        toast.success("Job request cancelled successfully.");
      }
    } catch (err) {
      console.error("Cancel error:", err);
      toast.error("Failed to cancel request.");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-border/50">
      <Button variant="outline" size="sm" onClick={() => onViewDetails(job)} className="gap-1.5 text-xs">
        <Eye className="size-3.5" /> View Details
      </Button>

      {job.status === "PENDING" && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-rose-600 hover:bg-rose-500/10 hover:text-rose-700 dark:text-rose-400">
              <XCircle className="size-3.5" /> Cancel Request
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Job Request?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel &quot;{job.title}&quot;? This action will notify the craftsman that the request has been cancelled.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Request</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleCancelRequest}
                className="bg-rose-600 hover:bg-rose-700 text-white"
                disabled={isCancelling}
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" /> Cancelling...
                  </>
                ) : (
                  "Yes, Cancel Request"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {job.status === "ACCEPTED" && (
        <Button variant="secondary" size="sm" asChild className="gap-1.5 text-xs font-medium">
          <Link href={`/craftsmen/${job.craftsman.id}`}>
            {job.craftsman.user.phone ? <Phone className="size-3.5" /> : <Eye className="size-3.5" />}
            Contact Craftsman
          </Link>
        </Button>
      )}

      {job.status === "COMPLETED" && (
        <>
          {job.review ? (
            <Button variant="secondary" size="sm" onClick={() => onViewDetails(job)} className="gap-1.5 text-xs text-amber-700 dark:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20">
              <Star className="size-3.5 fill-amber-400 text-amber-400" /> Review Submitted
            </Button>
          ) : (
            <Button size="sm" asChild className="gap-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white">
              <Link href="/customer/reviews">
                <MessageSquareQuote className="size-3.5" /> Leave a Review
              </Link>
            </Button>
          )}
        </>
      )}
    </div>
  );
}
