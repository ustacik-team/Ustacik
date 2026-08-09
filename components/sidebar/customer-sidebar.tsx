"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  LayoutDashboard,
  Hammer,
  BriefcaseBusiness,
  Heart,
  Bell,
  User,
  Settings,
  CircleHelp,
  LogOut,
  Shield,
  LucideIcon,
  MessageSquareQuote,
  Loader2
} from "lucide-react";
import { useSignOut } from "@/hooks/use-sign-out";

import { UserAvatar } from "@/components/user-avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

type UserRole = "CUSTOMER" | "CRAFTSMAN" | "ADMIN";

interface CustomerSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    role: UserRole | string;
  };
}

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  todoComment?: string;
}

const mainNavItems: NavItem[] = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Dashboard",
    href: "/customer/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Find Craftsmen",
    href: "/find-craftsmen",
    icon: Hammer,
  },
  {
    title: "My Job Requests",
    href: "/customer/my-job-requests",
    icon: BriefcaseBusiness,
    todoComment:
      "Fetch jobs where customerId = session.user.id from Job table",
  },
  {
    title: "My Reviews",
    href: "/dashboard/customer/reviews",
    icon: MessageSquareQuote,
    todoComment:
      "Fetch reviews created by the current customer from Review table",
  },
  {
    title: "Saved Craftsmen",
    href: "/dashboard/customer/saved",
    icon: Heart,
    todoComment:
      "Requires SavedCraftsman/Favorites table (not yet in schema)",
  },
  {
    title: "Notifications",
    href: "/dashboard/customer/notifications",
    icon: Bell,
    todoComment:
      "Fetch notifications where userId = session.user.id",
  },
  {
    title: "Profile",
    href: "/dashboard/customer/profile",
    icon: User,
  },
];
const supportNavItems: NavItem[] = [
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
  { title: "Help", href: "/help", icon: CircleHelp },
];

export function CustomerSidebar({ user, className, ...props }: CustomerSidebarProps) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  const { signOut, isLoading } = useSignOut();

  const handleLogout = async () => {
    await signOut();
  };

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar collapsible="icon" className={className} {...props}>
      {/* Fixed Sticky Header */}
      <SidebarHeader className="shrink-0 border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/" onClick={handleNavClick}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Shield className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Ustacik</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Independently Scrollable Navigation Content */}
      <SidebarContent className="flex-1 overflow-y-auto">
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.title}
                  >
                    <Link href={item.href} onClick={handleNavClick}>
                      <Icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel>Support</SidebarGroupLabel>
          <SidebarMenu>
            {supportNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.title}
                  >
                    <Link href={item.href} onClick={handleNavClick}>
                      <Icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Fixed Sticky Footer */}
      <SidebarFooter className="shrink-0 border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 p-2 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center">
              <UserAvatar user={user} className="h-8 w-8 shrink-0" />
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-medium">
                  {user.name || user.email}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
                <span className="mt-0.5 truncate text-[10px] font-medium text-muted-foreground/70">
                  {user.role ? user.role.charAt(0) + user.role.slice(1).toLowerCase() : ''}
                </span>
              </div>
              <SidebarMenuButton
                size="default"
                variant="outline"
                className="h-8 w-8 shrink-0 group-data-[collapsible=icon]:hidden hover:text-destructive cursor-pointer"
                onClick={handleLogout}
                disabled={isLoading}
                tooltip="Logout"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
                <span className="sr-only">Logout</span>
              </SidebarMenuButton>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}