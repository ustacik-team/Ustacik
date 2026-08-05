"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { NavbarSearch } from "./navbar-search";
import { NotificationButton } from "./notification-button";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";
import { UserAvatar } from "./user-avatar";

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col gap-6 bg-background">
        <SheetHeader>
          <SheetTitle className="text-left font-bold text-foreground">
            Ustacik
          </SheetTitle>
        </SheetHeader>

        <NavbarSearch />

        <Separator />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserAvatar />
            <span className="text-sm font-medium text-foreground">User</span>
          </div>
          <NotificationButton />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            Language
          </span>
          <LanguageSwitcher />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            Theme
          </span>
          <ThemeToggle />
        </div>
      </SheetContent>
    </Sheet>
  );
}