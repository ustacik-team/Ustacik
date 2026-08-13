import { Wrench } from "lucide-react";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@/components/ui/empty";

export function ServicesEmptyState() {
  return (
    <Empty className="border border-dashed py-16">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Wrench className="size-6 text-muted-foreground" />
        </EmptyMedia>
        <EmptyTitle>No services assigned yet</EmptyTitle>
        <EmptyDescription>
          You currently don&apos;t have any services assigned to your craftsman profile.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
