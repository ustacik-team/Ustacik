"use client";

import { useState } from "react";
import { JobStatus } from "@prisma/client";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  MapPin,
  Phone,
  Mail,
  Calendar,
  Eye,
  Wrench,
  User as UserIcon,
  Copy,
  Check,
  Tag,
  Clock,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { JobRequestStatusBadge } from "./job-request-status-badge";
import { JobRequestActions } from "./job-request-actions";
import { toast } from "sonner";

export interface JobWithDetails {
  id: string;
  title: string;
  description: string;
  address: string;
  status: JobStatus | string;
  createdAt: Date | string;
  completedAt?: Date | string | null;
  customer: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    image?: string | null;
  };
  category: {
    id: string;
    name: string;
  };
  subService?: {
    id: string;
    name: string;
  } | null;
}

interface JobRequestCardProps {
  job: JobWithDetails;
  onStatusChange?: (jobId: string, newStatus: JobStatus) => void;
}

const statusAccentGlow: Record<JobStatus, string> = {
  PENDING: "from-amber-500 via-amber-400 to-amber-500",
  ACCEPTED: "from-sky-500 via-blue-400 to-sky-500",
  COMPLETED: "from-emerald-500 via-teal-400 to-emerald-500",
  CANCELLED: "from-rose-500 via-red-400 to-rose-500",
};

export function JobRequestCard({ job, onStatusChange }: JobRequestCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const customerInitials = job.customer.name
    ? job.customer.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "CU";

  const formattedCreatedDate = new Date(job.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const formattedCompletedDate = job.completedAt
    ? new Date(job.completedAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(job.id);
    setCopiedId(true);
    toast.success("Job Request ID copied to clipboard!");
    setTimeout(() => setCopiedId(false), 2000);
  };

  const accentGradient = statusAccentGlow[job.status as JobStatus] || "from-primary to-primary";

  return (
    <Card className="group relative flex flex-col overflow-hidden border-border/70 bg-card/90 backdrop-blur-xs transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-0.5">
      {/* Top Accent Gradient Bar */}
      <div className={`h-1 w-full bg-gradient-to-r ${accentGradient} opacity-85 group-hover:opacity-100 transition-opacity`} />

      <CardHeader className="p-4 sm:p-5 pb-3 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary border-primary/20 font-semibold text-[11px] px-2 py-0.5"
            >
              <Tag className="size-3 mr-1" />
              {job.category.name}
            </Badge>
            {job.subService && (
              <Badge
                variant="outline"
                className="text-[11px] font-medium text-muted-foreground border-border/70 px-2 py-0.5"
              >
                {job.subService.name}
              </Badge>
            )}
          </div>
          <JobRequestStatusBadge status={job.status} className="shrink-0" />
        </div>

        <h3 className="font-bold text-base sm:text-lg leading-snug tracking-tight text-foreground group-hover:text-primary transition-colors">
          {job.title}
        </h3>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 pt-0 space-y-3.5">
        {/* Premier Customer Information Surface */}
        <div className="group/cust flex items-center justify-between gap-3 rounded-xl bg-muted/40 dark:bg-muted/20 p-3 border border-border/60 hover:border-primary/30 transition-all duration-200">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Avatar className="size-10 border-2 border-background shadow-xs shrink-0 group-hover/cust:scale-105 transition-transform">
              <AvatarImage src={job.customer.image ?? undefined} alt={job.customer.name} />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary font-bold text-xs">
                {customerInitials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-semibold leading-tight truncate text-foreground">
                  {job.customer.name}
                </p>
                <ShieldCheck className="size-3.5 text-sky-500 shrink-0" />
              </div>
              <p className="text-xs text-muted-foreground truncate mt-0.5">{job.customer.email}</p>
            </div>
          </div>

          {/* Quick Contact Micro-Actions */}
          <div className="flex items-center gap-1 shrink-0">
            {job.customer.phone && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-7 rounded-lg text-muted-foreground hover:text-emerald-600 hover:bg-emerald-500/10"
                    asChild
                  >
                    <a href={`tel:${job.customer.phone}`}>
                      <Phone className="size-3.5" />
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="text-xs">Call {job.customer.phone}</p>
                </TooltipContent>
              </Tooltip>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-7 rounded-lg text-muted-foreground hover:text-sky-600 hover:bg-sky-500/10"
                  asChild
                >
                  <a href={`mailto:${job.customer.email}`}>
                    <Mail className="size-3.5" />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-xs">Email {job.customer.email}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Location & Date Spec */}
        <div className="space-y-2 text-xs sm:text-sm">
          <div className="flex items-start gap-2 text-muted-foreground">
            <MapPin className="size-4 text-primary shrink-0 mt-0.5" />
            <span className="line-clamp-2 font-medium text-foreground/90 leading-snug">{job.address}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-0.5">
            <span className="flex items-center gap-1">
              <Calendar className="size-3.5 text-muted-foreground/80" />
              <span>Requested: <strong className="font-medium text-foreground/80">{formattedCreatedDate}</strong></span>
            </span>
            {formattedCompletedDate && (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <Wrench className="size-3.5" />
                <span>Completed: {formattedCompletedDate}</span>
              </span>
            )}
          </div>
        </div>

        {/* Work Description Snippet */}
        <div className="rounded-r-lg border-l-2 border-primary/50 bg-muted/30 dark:bg-muted/15 p-3 text-xs text-muted-foreground leading-normal line-clamp-5 overflow-hidden">
          &quot;{job.description}&quot;
        </div>
      </CardContent>

      <Separator className="bg-border/60" />

      <CardFooter className="mt-auto p-3.5 sm:p-4 bg-muted/20 flex flex-wrap items-center justify-between gap-2.5">
        {/* Full Details Modal */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 text-xs h-8 px-3 font-medium border-border/80 hover:border-primary/40 hover:bg-primary/5 transition-all"
            >
              <Eye className="size-3.5 text-primary" />
              <span>Inspect Details</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md sm:max-w-xl max-h-[92vh] overflow-y-auto p-0 gap-0 rounded-2xl border-border/80 shadow-2xl">
            {/* Modal Header Hero Banner */}
            <div className={`h-2.5 w-full bg-gradient-to-r ${accentGradient}`} />
            <div className="p-6 space-y-6">
              <DialogHeader className="space-y-2 text-left">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="bg-primary/10 text-primary font-semibold">
                      <Tag className="size-3 mr-1" />
                      {job.category.name}
                    </Badge>
                    {job.subService && (
                      <Badge variant="outline" className="font-medium text-muted-foreground">
                        {job.subService.name}
                      </Badge>
                    )}
                  </div>
                  <JobRequestStatusBadge status={job.status} />
                </div>

                <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  {job.title}
                </DialogTitle>

                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                  <span>Job Ref:</span>
                  <button
                    onClick={handleCopyId}
                    className="inline-flex items-center gap-1 font-mono bg-muted px-2 py-0.5 rounded-md hover:bg-muted/80 text-foreground transition-colors cursor-pointer"
                  >
                    <span>{job.id}</span>
                    {copiedId ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                  </button>
                </div>
              </DialogHeader>

              {/* Customer Profile Card */}
              <div className="rounded-xl border border-border/70 bg-muted/30 dark:bg-muted/15 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <UserIcon className="size-3.5 text-primary" />
                    <span>Customer Information</span>
                  </h4>
                  <Badge variant="secondary" className="text-[10px] bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20">
                    <ShieldCheck className="size-3 mr-1" />
                    Verified Customer
                  </Badge>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-12 border-2 border-background shadow-xs">
                      <AvatarImage src={job.customer.image ?? undefined} alt={job.customer.name} />
                      <AvatarFallback className="bg-primary/20 text-primary font-bold">
                        {customerInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-base text-foreground">{job.customer.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <Mail className="size-3 text-primary" />
                        <span>{job.customer.email}</span>
                      </p>
                      {job.customer.phone && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                          <Phone className="size-3 text-primary" />
                          <span>{job.customer.phone}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Direct Contact Buttons */}
                  <div className="flex items-center gap-2 self-start sm:self-center">
                    {job.customer.phone && (
                      <Button size="sm" variant="outline" className="gap-1.5 text-xs h-8" asChild>
                        <a href={`tel:${job.customer.phone}`}>
                          <Phone className="size-3.5 text-emerald-600" />
                          <span>Call</span>
                        </a>
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="gap-1.5 text-xs h-8" asChild>
                      <a href={`mailto:${job.customer.email}`}>
                        <Mail className="size-3.5 text-sky-600" />
                        <span>Email</span>
                      </a>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Location & Time Spec Grid */}
              <div className="grid gap-3 sm:grid-cols-2 text-sm">
                <div className="rounded-xl border border-border/70 bg-card p-3.5 space-y-1">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-primary" />
                    <span>Job Location</span>
                  </span>
                  <p className="font-medium text-foreground text-xs sm:text-sm leading-snug pt-0.5">
                    {job.address}
                  </p>
                </div>

                <div className="rounded-xl border border-border/70 bg-card p-3.5 space-y-1">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="size-3.5 text-primary" />
                    <span>Request Timeline</span>
                  </span>
                  <div className="text-xs space-y-0.5 pt-0.5">
                    <p className="text-muted-foreground">
                      Submitted: <strong className="font-semibold text-foreground">{formattedCreatedDate}</strong>
                    </p>
                    {formattedCompletedDate && (
                      <p className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        Completed: {formattedCompletedDate}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Work Description Box */}
              <div className="space-y-2">
                <span className="font-semibold text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-primary" />
                  <span>Full Request Description</span>
                </span>
                <div className="rounded-xl border border-border/70 bg-muted/20 dark:bg-muted/10 p-4 text-xs sm:text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                  {job.description}
                </div>
              </div>

              {/* Modal Actions Footer */}
              <div className="border-t border-border/60 pt-4 flex items-center justify-between gap-3">
                <Button size="sm" variant="ghost" onClick={() => setDetailsOpen(false)}>
                  Close
                </Button>
                <JobRequestActions
                  jobId={job.id}
                  jobTitle={job.title}
                  status={job.status}
                  onStatusChange={(id, newStatus) => {
                    onStatusChange?.(id, newStatus);
                    setDetailsOpen(false);
                  }}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Main Action Buttons */}
        <JobRequestActions
          jobId={job.id}
          jobTitle={job.title}
          status={job.status}
          onStatusChange={onStatusChange}
        />
      </CardFooter>
    </Card>
  );
}
