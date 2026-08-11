import { Images } from "lucide-react";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
  EmptyContent,
} from "@/components/ui/empty";
import { AddPortfolioPhotoDialog } from "./add-portfolio-photo-dialog";

export function PortfolioEmptyState() {
  return (
    <Empty className="border border-dashed py-16">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Images className="size-6 text-muted-foreground" />
        </EmptyMedia>
        <EmptyTitle>Your portfolio is empty</EmptyTitle>
        <EmptyDescription>
          Show customers examples of your previous work by adding photos to your portfolio.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <AddPortfolioPhotoDialog />
      </EmptyContent>
    </Empty>
  );
}
