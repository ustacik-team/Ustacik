import { CheckCheck } from "lucide-react";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@/components/ui/empty";

export function NotificationsEmptyState() {
  return (
    <Empty className="border border-dashed py-16">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CheckCheck className="size-6 text-emerald-500" />
        </EmptyMedia>
        <EmptyTitle>You&apos;re all caught up</EmptyTitle>
        <EmptyDescription>
          You don&apos;t have any notifications yet. Important updates about your jobs, reviews, and account will appear here.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
