import Link from "next/link";
import { MessageSquareOff, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@/components/ui/empty";

export function ReviewsEmptyState() {
  return (
    <Empty className="border border-dashed py-16">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <MessageSquareOff className="size-6 text-muted-foreground" />
        </EmptyMedia>
        <EmptyTitle>You haven&apos;t written any reviews yet</EmptyTitle>
        <EmptyDescription>
          After a craftsman completes your job, you can leave a review to share your experience and help other customers.
        </EmptyDescription>
      </EmptyHeader>
      <div className="flex justify-center pt-2">
        <Button asChild size="sm" className="gap-1.5 text-xs">
          <Link href="/customer/my-job-requests">
            <Briefcase className="size-3.5" />
            View My Job Requests
          </Link>
        </Button>
      </div>
    </Empty>
  );
}
