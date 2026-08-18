"use client";

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
import { useUnreadNotificationsCount } from "@/hooks/use-unread-notifications-count";

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
  const { count: unreadCount } = useUnreadNotificationsCount();

  const hasApp = hasApplicationProp;

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
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-12 lg:px-16">
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

          {/* Notification Bell Icon */}
          {user && (
            <Button variant="ghost" size="icon" asChild className="relative h-9 w-9 rounded-full" aria-label="Notifications">
              <Link href={user.role === "CRAFTSMAN" ? "/craftsman/notifications" : user.role === "ADMIN" ? "/admin/notifications" : "/customer/notifications"}>
                <Bell className="h-5 w-5 text-foreground/80" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-xs animate-in zoom-in-50">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>
            </Button>
          )}
          
          {/* Desktop user section */}
          {isLoading ? (
            <div className="hidden md:block h-8 w-8 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            <div className="hidden md:block">
              <UserAvatar user={user} className="h-8 w-8" />
            </div>
          ) : (
            <Button variant="ghost" size="sm" asChild className="hidden md:inline-flex">
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