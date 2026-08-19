"use client";

import Image from "next/image";
import Link from "next/link";
import { LogOut, ShieldCheck, User as UserIcon, LayoutDashboard, Settings, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useSignOut } from "@/hooks/use-sign-out";

export interface UserDropdownUser {
  id?: string;
  email: string;
  name?: string | null;
  image?: string | null;
  role?: string | null;
}

interface UserDropdownProps {
  user: UserDropdownUser;
}

export function UserDropdown({ user }: UserDropdownProps) {
  const { signOut, isLoading } = useSignOut();

  const displayName = user.name || user.email.split("@")[0];

  const getDashboardHref = () => {
    const role = user.role?.toLowerCase();
    if (role === "admin") return "/admin/dashboard";
    if (role === "craftsman") return "/craftsman/dashboard";
    if (role === "customer") return "/customer/dashboard";
    return "/dashboard";
  };

  const isAdmin = user.role?.toLowerCase() === "admin";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 cursor-pointer">
          {user.image ? (
            <Image
              src={user.image}
              alt={displayName}
              width={18}
              height={18}
              className="rounded-full object-cover shrink-0"
            />
          ) : (
            <UserIcon className="size-4 shrink-0" />
          )}
          <span className="max-w-[12rem] truncate font-medium">{displayName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none truncate">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground truncate">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link href={getDashboardHref()} className="flex items-center gap-2 cursor-pointer">
            <LayoutDashboard className="size-4" /> <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
            <Settings className="size-4" /> <span>Settings</span>
          </Link>
        </DropdownMenuItem>

        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link href="/admin/dashboard" className="flex items-center gap-2 cursor-pointer text-primary">
              <ShieldCheck className="size-4" /> <span>Admin Panel</span>
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={async () => await signOut()}
          disabled={isLoading}
          className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
        >
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <LogOut className="size-4" />
          )}
          <span>{isLoading ? "Signing out..." : "Sign out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
