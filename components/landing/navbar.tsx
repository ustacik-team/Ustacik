"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Bell } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserAvatar } from "@/components/user-avatar";
import { MobileNav } from "./mobile-nav";

// ─── Types ──────────────────────────────────────────────────────────────
interface User {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  role?: string | null;
}

interface NavbarProps {
  user?: User | null;
  isLoading?: boolean;
  hasApplication?: boolean;
}

// ─── Navbar ──────────────────────────────────────────────────────────────
export function Navbar({ user, isLoading = false, hasApplication: hasApplicationProp = false }: NavbarProps) {
  const router = useRouter();
  const [fetchedHasApp, setFetchedHasApp] = useState<boolean>(false);

  const hasApp = hasApplicationProp || fetchedHasApp;

  useEffect(() => {
    async function checkApp() {
      if (user && user.role === "CUSTOMER" && !hasApplicationProp) {
        try {
          const res = await fetch("/api/applications");
          if (res.ok) {
            const json = await res.json();
            if (json.success && json.data?.application) {
              setFetchedHasApp(true);
            }
          }
        } catch {
          // ignore error
        }
      }
    }
    checkApp();
  }, [user, hasApplicationProp]);

  // Determine label & href synchronously on first render (0 UI flicker!)
  let craftsmanNavLabel = "Become a Craftsman";
  let craftsmanNavHref = "/become-craftsman";

  if (!user) {
    craftsmanNavLabel = "Become a Craftsman";
    craftsmanNavHref = "/become-craftsman";
  } else if (user.role === "CRAFTSMAN") {
    craftsmanNavLabel = "Craftsman Dashboard";
    craftsmanNavHref = "/craftsman/dashboard";
  } else if (user.role === "ADMIN") {
    craftsmanNavLabel = "Admin Dashboard";
    craftsmanNavHref = "/admin/dashboard";
  } else if (hasApp) {
    craftsmanNavLabel = "Application Status";
    craftsmanNavHref = "/application-status";
  }

  const handleBecomeCraftsmanClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      toast.info("Please sign in to apply as a craftsman.", {
        duration: 3500,
      });
      router.push("/sign-in?redirect=/become-craftsman");
      return;
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Shield className="h-5 w-5" />
          </div>
          <span className="text-lg">Ustacik</span>
        </Link>

        {/* Center: Navigation (desktop only) */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/" className="px-3 py-2 text-sm font-medium transition-colors hover:text-primary">
                  Home
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/find-craftsmen" className="px-3 py-2 text-sm font-medium transition-colors hover:text-primary">
                  Find Craftsmen
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link 
                  href={craftsmanNavHref} 
                  onClick={handleBecomeCraftsmanClick}
                  className="px-3 py-2 text-sm font-medium transition-colors hover:text-primary"
                >
                  {craftsmanNavLabel}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/#categories" className="px-3 py-2 text-sm font-medium transition-colors hover:text-primary">
                  Categories
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/#how-it-works" className="px-3 py-2 text-sm font-medium transition-colors hover:text-primary">
                  How it Works
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* ✅ Notification Bell Icon with Count Badge */}
          {user && (
            <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full" aria-label="Notifications">
              <Bell className="h-5 w-5 text-foreground/80" />
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-xs">
                3
              </span>
            </Button>
          )}
          
          {/* ✅ Desktop user section with loading state */}
          {isLoading ? (
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            <UserAvatar user={user} className="h-8 w-8" />
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
          )}
          
          {/* Mobile menu */}
          <MobileNav
            user={user}
            isLoading={isLoading}
            craftsmanNavLabel={craftsmanNavLabel}
            craftsmanNavHref={craftsmanNavHref}
            onCraftsmanClick={handleBecomeCraftsmanClick}
          />
        </div>
      </div>
    </header>
  );
}