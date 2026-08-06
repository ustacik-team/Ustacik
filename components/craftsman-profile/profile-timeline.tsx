import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar, 
  CheckCircle, 
  Briefcase, 
  MessageSquare,
  UserPlus
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────
interface ProfileTimelineProps {
  /** Date the craftsman joined Ustacik */
  joinedAt: Date | string;
  /** Date the craftsman was verified (if applicable) */
  verifiedAt?: Date | string | null;
  /** Date of the most recently completed job */
  lastJobCompletedAt?: Date | string | null;
  /** Date of the most recently received review */
  lastReviewReceivedAt?: Date | string | null;
  className?: string;
}

// ─── Component ──────────────────────────────────────────────────────────
export function ProfileTimeline({
  joinedAt,
  verifiedAt,
  lastJobCompletedAt,
  lastReviewReceivedAt,
  className,
}: ProfileTimelineProps) {
  
  // Construct timeline events
  const events = [
    {
      id: "join",
      title: "Joined Ustacik",
      date: new Date(joinedAt),
      icon: UserPlus,
      color: "bg-primary",
    },
    verifiedAt ? {
      id: "verified",
      title: "Verification Approved",
      date: new Date(verifiedAt),
      icon: CheckCircle,
      color: "bg-green-500",
    } : null,
    lastJobCompletedAt ? {
      id: "last-job",
      title: "Latest Completed Job",
      date: new Date(lastJobCompletedAt),
      icon: Briefcase,
      color: "bg-blue-500",
    } : null,
    lastReviewReceivedAt ? {
      id: "last-review",
      title: "Latest Review Received",
      date: new Date(lastReviewReceivedAt),
      icon: MessageSquare,
      color: "bg-amber-500",
    } : null,
  ].filter(Boolean) as { id: string; title: string; date: Date; icon: any; color: string }[];

  // Sort events chronologically (newest first)
  const sortedEvents = events.sort((a, b) => b.date.getTime() - a.date.getTime());

  if (sortedEvents.length === 0) {
    return null;
  }

  return (
    <Card className={cn("border-border/40 bg-card/60 backdrop-blur-sm shadow-sm", className)}>
      <CardHeader className="border-b border-border/20 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-bold">
          <Calendar className="h-5 w-5 text-primary" />
          Profile Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 pb-6">
        <div className="relative pl-5">
          {/* Timeline Vertical Line */}
          <div className="absolute left-0 top-2 bottom-2 w-[2px] bg-border/40" />

          {sortedEvents.map((event, index) => {
            const Icon = event.icon;
            return (
              <div key={event.id} className="relative pb-8 last:pb-0">
                {/* Timeline Dot */}
                <div className={cn(
                  "absolute -left-[13px] top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-background",
                  event.color
                )}>
                  <div className={cn("h-2 w-2 rounded-full bg-white", 
                    event.id === "verified" ? "bg-white" : ""
                  )} />
                </div>

                {/* Event Content */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 ml-4">
                  <div className="flex items-center gap-2">
                    <div className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full", event.color)}>
                      <Icon className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {event.title}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium sm:ml-4">
                    {event.date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}