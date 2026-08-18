"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Menu, 
  Home, 
  Users, 
  Briefcase, 
  Grid, 
  HelpCircle,
  ChevronRight,
  LogOut,
  Loader2
} from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserAvatar } from "@/components/user-avatar";
import { useSignOut } from "@/hooks/use-sign-out";

interface User {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  role?: string | null;
}

interface MobileNavProps {
  user?: User | null;
  isLoading?: boolean;
  craftsmanNavLabel?: string;
  craftsmanNavHref?: string;
  onCraftsmanClick?: (e: React.MouseEvent) => void;
}

export function MobileNav({
  user,
  isLoading = false,
  craftsmanNavLabel = "Become a Craftsman",
  craftsmanNavHref = "/become-craftsman",
  onCraftsmanClick,
}: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const { signOut, isLoading: isSigningOut } = useSignOut();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/find-craftsmen", label: "Find Craftsmen", icon: Users },
    { 
      href: craftsmanNavHref, 
      label: craftsmanNavLabel, 
      icon: Briefcase,
      onClick: onCraftsmanClick 
    },
    { href: "/#categories", label: "Categories", icon: Grid },
    { href: "/#how-it-works", label: "How it Works", icon: HelpCircle },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open navigation menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent 
        side="right" 
        className="flex flex-col justify-between w-[320px] sm:w-[380px] p-6 sm:p-8 border-l border-border bg-background text-foreground shadow-2xl"
      >
        <div className="flex flex-col gap-6">
          {/* Header with Logo */}
          <SheetHeader className="text-left pb-5 border-b border-border/60">
            <SheetTitle asChild>
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="transition-opacity hover:opacity-90"
              >
                <Logo size={36} />
              </Link>
            </SheetTitle>
            <SheetDescription className="sr-only">
              Mobile navigation menu for Ustacik platform
            </SheetDescription>
          </SheetHeader>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    if (item.onClick) item.onClick(e);
                    setOpen(false);
                  }}
                  className="group flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-accent/80 transition-all duration-150 active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Area: Theme Toggle & User Info */}
        <div className="mt-auto pt-6 border-t border-border/60 flex flex-col gap-4">
          <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-muted/40 border border-border/40">
            <span className="text-sm font-medium text-muted-foreground">Theme</span>
            <ThemeToggle />
          </div>

          {/* User Profile / Auth Action */}
          {isLoading ? (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 animate-pulse">
              <div className="h-9 w-9 rounded-full bg-muted" />
              <div className="h-4 w-28 rounded bg-muted" />
            </div>
          ) : user ? (
            <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-primary/5 border border-primary/15">
              <div className="flex items-center gap-3 overflow-hidden">
                <UserAvatar user={user} className="h-9 w-9 border border-border/60 shrink-0" />
                <div className="flex flex-col truncate">
                  <span className="text-sm font-semibold truncate text-foreground">
                    {user.name || "User"}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-8 shrink-0 gap-1.5 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 cursor-pointer"
                onClick={async () => {
                  setOpen(false);
                  await signOut();
                }}
                disabled={isSigningOut}
              >
                {isSigningOut ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <LogOut className="h-3.5 w-3.5" />
                )}
                <span>Sign Out</span>
              </Button>
            </div>
          ) : (
            <Button asChild size="lg" className="w-full h-11 font-medium rounded-xl shadow-xs">
              <Link href="/sign-in" onClick={() => setOpen(false)}>
                Sign In
              </Link>
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}