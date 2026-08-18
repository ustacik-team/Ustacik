import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export function Logo({ className, size = 32, showText = true }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2 font-semibold", className)}>
      <Image
        src="/logo.png"
        alt="Ustacik Logo"
        width={size}
        height={size}
        className="object-contain"
        priority
      />
      {showText && <span className="text-lg font-bold tracking-tight">Ustacik</span>}
    </div>
  );
}
