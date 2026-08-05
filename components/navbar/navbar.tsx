"use client";

import Link from "next/link";
import { NavbarSearch } from "./navbar-search";
import { NotificationButton } from "./notification-button";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";
import { UserAvatar } from "./user-avatar";
import { MobileMenu } from "./mobile-menu";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          href="/dashboard"
          className="text-xl font-bold tracking-tight text-foreground transition-colors hover:text-muted-foreground"
        >
          Ustacik
        </Link>

        {/* Desktop Navigation Items */}
        <div className="hidden md:flex md:flex-1 md:items-center md:justify-between md:pl-8">
          <div className="flex-1 max-w-xs">
            <NavbarSearch />
          </div>

          <div className="flex items-center gap-2">
            <NotificationButton />
            <ThemeToggle />
            <LanguageSwitcher />
            <UserAvatar />
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <MobileMenu />
      </div>
    </header>
  );
}