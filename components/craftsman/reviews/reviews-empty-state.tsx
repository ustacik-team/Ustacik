import { MessageSquareOff } from "lucide-react";
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
        <EmptyTitle>No reviews yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t received any customer reviews yet. Reviews will appear here after customers complete jobs and leave feedback.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
