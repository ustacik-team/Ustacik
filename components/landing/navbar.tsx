import Link from "next/link";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
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
}

interface NavbarProps {
  user?: User | null;
  isLoading?: boolean; // ✅ Added loading prop
}

// ─── Navbar ──────────────────────────────────────────────────────────────
export function Navbar({ user, isLoading = false }: NavbarProps) {
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
                <Link href="/become-craftsman" className="px-3 py-2 text-sm font-medium transition-colors hover:text-primary">
                  Become a Craftsman
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
          
          {/* ✅ Updated desktop user section with loading state */}
          {isLoading ? (
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            <UserAvatar user={user} className="h-8 w-8" />
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
          )}
          
          {/* Pass loading state down to the mobile menu */}
          <MobileNav user={user} isLoading={isLoading} />
        </div>
      </div>
    </header>
  );
}