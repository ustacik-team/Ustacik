import Link from "next/link";
import { CheckCheck, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
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
        <EmptyTitle>No notifications yet</EmptyTitle>
        <EmptyDescription>
          You&apos;ll see updates about your job requests, completed jobs, reviews, and account activity here.
        </EmptyDescription>
      </EmptyHeader>
      <div className="flex justify-center pt-2">
        <Button asChild size="sm" className="gap-1.5 text-xs">
          <Link href="/find-craftsmen">
            <Search className="size-3.5" />
            Find a Craftsman
          </Link>
        </Button>
      </div>
    </Empty>
  );
}
