import Link from "next/link";
import { format } from "date-fns";
import { Briefcase, Calendar, CheckCircle2, MapPin, UserCheck, Wrench } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VerificationBadge } from "@/components/craftsmen/verification-badge";

interface CurrentJobCardProps {
  currentJob: {
    id: string;
    title: string;
    description: string;
    address: string;
    createdAt: Date | string;
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
  } | null;
}

export function CurrentJobCard({ currentJob }: CurrentJobCardProps) {
  if (!currentJob) {
    return (
      <Card className="border-border/70 bg-card flex flex-col justify-between">
        <CardHeader className="p-4 sm:p-5 pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <CheckCircle2 className="size-4 text-sky-500" />
            <span>Current Job</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Your currently active work in progress
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 pt-2 text-center space-y-3">
          <div className="mx-auto grid size-12 place-items-center rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <CheckCircle2 className="size-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">No active job in progress</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
              When a craftsman accepts your job request, your active project details will appear here.
            </p>
          </div>
          <Button asChild size="sm" className="gap-1.5 font-semibold mt-2">
            <Link href="/find-craftsmen">
              <UserCheck className="size-4" /> Find a Craftsman
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const initials = currentJob.craftsman.user.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const formattedDate = format(new Date(currentJob.createdAt), "MMM d, yyyy");

  return (
    <Card className="border-sky-500/30 bg-gradient-to-br from-sky-500/5 via-card to-card flex flex-col justify-between shadow-xs">
      <CardHeader className="p-4 sm:p-5 pb-3 border-b border-sky-500/20">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-bold flex items-center gap-2 text-sky-700 dark:text-sky-400">
            <CheckCircle2 className="size-4" />
            <span>Current Job</span>
          </CardTitle>
          <Badge className="bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30 font-semibold text-[11px]">
            In Progress
          </Badge>
        </div>
        <CardDescription className="text-xs">
          Accepted service request currently active
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 space-y-4 text-sm">
        <div>
          <h3 className="font-bold text-base text-foreground line-clamp-1">{currentJob.title}</h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <Calendar className="size-3.5 text-primary shrink-0" />
            Accepted on {formattedDate}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="secondary" className="text-[11px] font-semibold gap-1">
            <Briefcase className="size-3" /> {currentJob.category.name}
          </Badge>
          {currentJob.subService && (
            <Badge variant="outline" className="text-[11px] font-normal gap-1">
              <Wrench className="size-3 text-primary" /> {currentJob.subService.name}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/80 p-3">
          <Avatar className="size-10 border shrink-0">
            <AvatarImage src={currentJob.craftsman.user.image ?? undefined} alt={currentJob.craftsman.user.name} />
            <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1">
              <p className="font-semibold text-xs truncate">{currentJob.craftsman.user.name}</p>
              <VerificationBadge level={currentJob.craftsman.verificationLevel} className="scale-90" />
            </div>
            {currentJob.craftsman.businessName && (
              <p className="text-[11px] text-muted-foreground truncate">{currentJob.craftsman.businessName}</p>
            )}
            <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
              <MapPin className="size-3 text-primary shrink-0" /> {currentJob.address}
            </p>
          </div>
        </div>

        <div className="pt-1">
          <Button asChild size="sm" variant="outline" className="w-full gap-1.5 text-xs font-semibold">
            <Link href="/customer/my-job-requests">
              View Job Requests
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
