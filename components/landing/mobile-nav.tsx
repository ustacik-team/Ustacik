"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserAvatar } from "@/components/user-avatar";
import { Separator } from "@/components/ui/separator";

interface User {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
}

interface MobileNavProps {
  user?: User | null;
  isLoading?: boolean; // ✅ Added loading prop
}

const navItems = [
  { href: "/", label: "Home" },
  { href: "/find-craftsmen", label: "Find Craftsmen" },
  { href: "/categories", label: "Categories" },
  { href: "/how-it-works", label: "How it Works" },
];

export function MobileNav({ user, isLoading = false }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="mt-6 flex flex-col gap-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Theme</span>
            <ThemeToggle />
          </div>
          
          {/* ✅ Updated user section with loading state */}
          {isLoading ? (
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
              <div className="h-4 w-24 rounded bg-muted animate-pulse" />
            </div>
          ) : user ? (
            <div className="flex items-center gap-3">
              <UserAvatar user={user} className="h-8 w-8" />
              <span className="text-sm font-medium">{user.name || user.email}</span>
            </div>
          ) : (
            <Button asChild variant="outline" className="w-full">
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