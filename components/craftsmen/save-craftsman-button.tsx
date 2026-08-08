"use client";

import { Heart } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useSavedCraftsmen } from "@/hooks/use-saved-craftsmen";

export function SaveCraftsmanButton({
  craftsmanId,
  craftsmanName,
}: {
  craftsmanId: string;
  craftsmanName: string;
}) {
  const { isSaved, toggleSaved } = useSavedCraftsmen();
  const saved = isSaved(craftsmanId);

  const handleToggle = () => {
    const isNowSaved = toggleSaved(craftsmanId);
    toast.success(
      isNowSaved
        ? `${craftsmanName} was added to your shortlist.`
        : `${craftsmanName} was removed from your shortlist.`,
    );
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      className="shrink-0 rounded-full bg-background/90"
      aria-label={saved ? `Remove ${craftsmanName} from saved craftsmen` : `Save ${craftsmanName}`}
      aria-pressed={saved}
      onClick={handleToggle}
    >
      <Heart className={`size-4 ${saved ? "fill-rose-500 text-rose-500" : ""}`} />
    </Button>
  );
}
