import { format } from "date-fns";
import { Briefcase, Calendar, MapPin, Star, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { VerificationBadge } from "@/components/craftsmen/verification-badge";
import { JobRequestStatusBadge } from "./job-request-status-badge";

export interface CustomerJobItem {
  id: string;
  title: string;
  description: string;
  address: string;
  status: "PENDING" | "ACCEPTED" | "COMPLETED" | "CANCELLED";
  createdAt: Date | string;
  completedAt?: Date | string | null;
  category: { id: string; name: string };
  subService?: { id: string; name: string } | null;
  craftsman: {
    id: string;
    businessName?: string | null;
    verificationLevel: "REGISTERED" | "VERIFIED" | "APPROVED";
    user: {
      id: string;
      name: string;
      image?: string | null;
      phone?: string | null;
    };
    region: {
      id: string;
      name: string;
    };
  };
  review?: {
    id: string;
    punctuality: number;
    workmanship: number;
    priceHonesty: number;
    communication: number;
    comment?: string | null;
    createdAt: Date | string;
  } | null;
}

interface JobRequestDetailsProps {
  job: CustomerJobItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JobRequestDetails({ job, open, onOpenChange }: JobRequestDetailsProps) {
  if (!job) return null;

  const initials = job.craftsman.user.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const formattedDate = format(new Date(job.createdAt), "PPP");
  const formattedCompletedDate = job.completedAt ? format(new Date(job.completedAt), "PPP") : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
            <DialogTitle className="text-xl font-bold">{job.title}</DialogTitle>
            <JobRequestStatusBadge status={job.status} />
          </div>
          <DialogDescription className="text-xs text-muted-foreground pt-1">
            Submitted on {formattedDate}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Craftsman Info */}
          <div className="rounded-xl border border-border/70 bg-card p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Craftsman Details</p>
            <div className="flex items-center gap-4">
              <Avatar className="size-14 border shrink-0">
                <AvatarImage src={job.craftsman.user.image ?? undefined} alt={job.craftsman.user.name} />
                <AvatarFallback className="bg-primary/10 font-bold text-primary">{initials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="font-bold text-base">{job.craftsman.user.name}</h4>
                  <VerificationBadge level={job.craftsman.verificationLevel} />
                </div>
                {job.craftsman.businessName && (
                  <p className="text-sm text-muted-foreground">{job.craftsman.businessName}</p>
                )}
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3.5 text-primary" /> {job.craftsman.region.name}
                  </span>
                  {job.craftsman.user.phone && (
                    <span className="flex items-center gap-1">
                      <User className="size-3.5 text-primary" /> {job.craftsman.user.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Job Specifications */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Job Details</p>
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <div className="flex items-center gap-2 rounded-lg border bg-muted/20 p-2.5">
                <Briefcase className="size-4 text-primary shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Category</p>
                  <p className="font-semibold">{job.category.name}</p>
                </div>
              </div>

              {job.subService && (
                <div className="flex items-center gap-2 rounded-lg border bg-muted/20 p-2.5">
                  <Briefcase className="size-4 text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Sub-Service</p>
                    <p className="font-semibold">{job.subService.name}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 rounded-lg border bg-muted/20 p-2.5 sm:col-span-2">
                <MapPin className="size-4 text-primary shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="font-semibold">{job.address}</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-muted/10 p-3">
              <p className="text-xs font-medium text-muted-foreground mb-1">Description</p>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{job.description}</p>
            </div>
          </div>

          {/* Timeline & Completion */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-muted/30 p-3 text-xs">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="size-3.5 text-primary" /> Submitted: {formattedDate}
            </span>
            {formattedCompletedDate && (
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                Completed: {formattedCompletedDate}
              </span>
            )}
          </div>

          {/* Review if present */}
          {job.review && (
            <>
              <Separator />
              <div className="space-y-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                    <Star className="size-4 fill-amber-400 text-amber-400" /> Your Review
                  </p>
                  <Badge variant="outline" className="text-xs bg-amber-500/10 border-amber-500/30">
                    Shared on {format(new Date(job.review.createdAt), "MMM d, yyyy")}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4 pt-1">
                  <div>
                    <span className="text-muted-foreground">Punctuality:</span>{" "}
                    <strong>{job.review.punctuality}/5</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Workmanship:</span>{" "}
                    <strong>{job.review.workmanship}/5</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Price Honesty:</span>{" "}
                    <strong>{job.review.priceHonesty}/5</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Communication:</span>{" "}
                    <strong>{job.review.communication}/5</strong>
                  </div>
                </div>

                {job.review.comment && (
                  <p className="text-sm italic text-foreground border-t border-amber-500/20 pt-2">
                    &quot;{job.review.comment}&quot;
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
