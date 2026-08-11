"use client";

import type { ComponentProps } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useSignOut } from "@/hooks/use-sign-out";
import { Loader2, LayoutDashboard, LogOut } from "lucide-react";

export interface UserAvatarProps extends ComponentProps<typeof Avatar> {
  user: {
    email: string;
    name?: string | null;
    image?: string | null;
    role?: string | null;
  };
  /** Optional custom dashboard URL (defaults to "/dashboard") */
  dashboardHref?: string;
}

export function UserAvatar({ user, className, dashboardHref, ...props }: UserAvatarProps) {
  const { signOut, isLoading } = useSignOut();

  const displayName = user.name ?? user.email;
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .join("")
    .slice(0, 2);

  // Determine dashboard link based on role
  const getDashboardHref = () => {
    if (dashboardHref) return dashboardHref;
    const role = user.role?.toLowerCase();
    if (role === "admin") return "/admin/dashboard";
    if (role === "craftsman") return "/craftsman/dashboard";
    if (role === "customer") return "/customer/dashboard";
    return "/dashboard";
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className={cn("cursor-pointer", className)} {...props}>
          <AvatarImage src={user.image ?? undefined} alt={displayName} className="aspect-square object-cover" />
          <AvatarFallback className="border">{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={getDashboardHref()} className="flex items-center gap-2 cursor-pointer">
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleSignOut}
          disabled={isLoading}
          className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4" />
          )}
          <span>{isLoading ? "Signing out..." : "Sign out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}