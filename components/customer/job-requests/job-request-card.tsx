import { format } from "date-fns";
import { Briefcase, Calendar, MapPin, Wrench } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { VerificationBadge } from "@/components/craftsmen/verification-badge";
import { JobRequestActions } from "./job-request-actions";
import { CustomerJobItem } from "./job-request-details";
import { JobRequestStatusBadge } from "./job-request-status-badge";

interface JobRequestCardProps {
  job: CustomerJobItem;
  onViewDetails: (job: CustomerJobItem) => void;
}

export function JobRequestCard({ job, onViewDetails }: JobRequestCardProps) {
  const initials = job.craftsman.user.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const formattedDate = format(new Date(job.createdAt), "MMM d, yyyy");

  return (
    <Card className="flex flex-col justify-between border-border/70 bg-card/90 shadow-xs transition-all duration-200 hover:shadow-md hover:border-border">
      <CardHeader className="space-y-3 pb-3 border-b border-border/50">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3
              onClick={() => onViewDetails(job)}
              className="font-bold text-base leading-snug cursor-pointer hover:text-primary transition-colors line-clamp-1"
            >
              {job.title}
            </h3>
            <p className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <Calendar className="size-3.5 text-primary shrink-0" />
              Requested on {formattedDate}
            </p>
          </div>
          <JobRequestStatusBadge status={job.status} className="shrink-0" />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <Badge variant="secondary" className="text-[11px] font-semibold gap-1">
            <Briefcase className="size-3" /> {job.category.name}
          </Badge>
          {job.subService && (
            <Badge variant="outline" className="text-[11px] font-normal gap-1">
              <Wrench className="size-3 text-primary" /> {job.subService.name}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4 pb-3 text-sm">
        {/* Description snippet */}
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {job.description}
        </p>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="size-3.5 text-primary shrink-0" />
          <span className="truncate">{job.address}</span>
        </div>

        {/* Craftsman Details */}
        <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/20 p-3">
          <Avatar className="size-10 border shrink-0">
            <AvatarImage src={job.craftsman.user.image ?? undefined} alt={job.craftsman.user.name} />
            <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1">
              <p className="font-semibold text-xs truncate">{job.craftsman.user.name}</p>
              <VerificationBadge level={job.craftsman.verificationLevel} className="scale-90" />
            </div>
            {job.craftsman.businessName && (
              <p className="text-[11px] text-muted-foreground truncate">{job.craftsman.businessName}</p>
            )}
            <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
              <MapPin className="size-3 text-primary" /> {job.craftsman.region.name}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="w-full">
          <JobRequestActions job={job} onViewDetails={onViewDetails} />
        </div>
      </CardFooter>
    </Card>
  );
}
