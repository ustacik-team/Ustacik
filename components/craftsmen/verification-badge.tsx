// components/craftsmen/verification-badge.tsx
import { Badge } from "@/components/ui/badge";
import { User, ShieldCheck, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export type VerificationLevel = "REGISTERED" | "VERIFIED" | "APPROVED";

interface VerificationBadgeProps {
  /** The verification level */
  level: VerificationLevel;
  /** Optional className for additional styling */
  className?: string;
}

const badgeConfig: Record<
  VerificationLevel,
  {
    label: string;
    icon: React.ElementType;
    className: string;
  }
> = {
  REGISTERED: {
    label: "Registered",
    icon: User,
    className: "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600",
  },
  VERIFIED: {
    label: "Verified",
    icon: ShieldCheck,
    className: "bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
  },
  APPROVED: {
    label: "Approved Craftsman",
    icon: BadgeCheck,
    className: "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
  },
};

export function VerificationBadge({ level, className }: VerificationBadgeProps) {
  const config = badgeConfig[level];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        "flex items-center gap-1.5 px-3 py-1 text-xs font-medium",
        config.className,
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </Badge>
  );
}