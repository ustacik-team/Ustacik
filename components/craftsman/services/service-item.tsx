import { CheckCircle2 } from "lucide-react";

interface ServiceItemProps {
  id: string;
  name: string;
  categoryName?: string;
}

export function ServiceItem({ name }: ServiceItemProps) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-border/60 bg-muted/30 dark:bg-muted/15 px-3 py-2 text-xs sm:text-sm font-medium transition-all hover:border-primary/40 hover:bg-primary/5">
      <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
      <span className="text-foreground truncate">{name}</span>
    </div>
  );
}
