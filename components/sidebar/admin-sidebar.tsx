"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Hammer,
  BriefcaseBusiness,
  BarChart3,
  Bell,
  User,
  Settings,
  CircleHelp,
  LogOut,
  Shield,
  LucideIcon,
  MessageSquareQuote,
  Loader2,
  ShieldCheck,
  Users,
  UserCog,
  Tags,
  MapPinned,
  ClipboardList,
  ChevronDown,
  ChevronRight,
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type UserRole = "CUSTOMER" | "CRAFTSMAN" | "ADMIN";

interface AdminSidebarProps extends React.ComponentProps<typeof Sidebar> {
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
  href?: string;
  icon: LucideIcon;
  isSubmenu?: boolean;
  subItems?: Omit<NavItem, "isSubmenu" | "subItems">[];
  todoComment?: string;
}

const mainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard/admin",
    icon: LayoutDashboard,
  },
  {
    title: "User Management",
    icon: UserCog,
    isSubmenu: true,
    subItems: [
      {
        title: "Customers",
        href: "/dashboard/admin/users/customers",
        icon: Users,
        todoComment: "View all registered customers and account information.",
      },
      {
        title: "Craftsmen",
        href: "/dashboard/admin/users/craftsmen",
        icon: Hammer,
        todoComment:
          "View all craftsmen, verification status, regions, subscriptions and profiles.",
      },
    ],
  },
  {
    title: "Verification Queue",
    href: "/dashboard/admin/verifications",
    icon: ShieldCheck,
    todoComment:
      "Approve or reject verification requests. Review ID, references, work photos, business registration and guarantees. Create VerificationRecord and VerificationLog.",
  },
  {
    title: "Jobs",
    href: "/dashboard/admin/jobs",
    icon: BriefcaseBusiness,
    todoComment:
      "Monitor all job requests, accepted jobs, completed jobs and cancellations.",
  },
  {
    title: "Reviews",
    href: "/dashboard/admin/reviews",
    icon: MessageSquareQuote,
    todoComment:
      "Moderate reviews. Remove only abusive reviews or reviews without a valid completed job.",
  },
  {
    title: "Categories",
    href: "/dashboard/admin/categories",
    icon: Tags,
    todoComment: "Manage the eight service categories and sub-services.",
  },
  {
    title: "Regions",
    href: "/dashboard/admin/regions",
    icon: MapPinned,
    todoComment: "Manage supported regions across Northern Cyprus.",
  },
  {
    title: "Notifications",
    href: "/dashboard/admin/notifications",
    icon: Bell,
    todoComment: "Platform notifications and administrative alerts.",
  },
  {
    title: "Analytics",
    href: "/dashboard/admin/analytics",
    icon: BarChart3,
    todoComment:
      "Platform statistics: users, craftsmen, completed jobs, reviews, verification metrics and growth.",
  },
  {
    title: "Admin Logs",
    href: "/dashboard/admin/logs",
    icon: ClipboardList,
    todoComment: "Audit trail of administrator actions from AdminLog.",
  },
  {
    title: "Profile",
    href: "/dashboard/admin/profile",
    icon: User,
  },
];

const supportNavItems: NavItem[] = [
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
  { title: "Help", href: "/help", icon: CircleHelp },
];

export function AdminSidebar({ user, className, ...props }: AdminSidebarProps) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  const { signOut, isLoading } = useSignOut();
  const [openSubmenus, setOpenSubmenus] = React.useState<
    Record<string, boolean>
  >({
    "User Management": true, // Default open
  });

  const handleLogout = async () => {
    await signOut();
  };

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const toggleSubmenu = (title: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <Sidebar collapsible="icon" className={className} {...props}>
      {/* Fixed Sticky Header */}
      <SidebarHeader className="shrink-0 border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard/admin" onClick={handleNavClick}>
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

              // Handle submenu items with Collapsible
              if (item.isSubmenu && item.subItems) {
                const isSubmenuActive = item.subItems.some(
                  (subItem) => pathname === subItem.href,
                );
                const isOpen = openSubmenus[item.title] ?? false;

                return (
                  <Collapsible
                    key={item.title}
                    open={isOpen}
                    onOpenChange={() => toggleSubmenu(item.title)}
                    className="w-full"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground w-full justify-between"
                          isActive={isSubmenuActive}
                        >
                          <div className="flex items-center gap-2">
                            <Icon />
                            <span>{item.title}</span>
                          </div>
                          {isOpen ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.subItems.map((subItem) => {
                            const SubIcon = subItem.icon;
                            const isSubActive = pathname === subItem.href;
                            return (
                              <SidebarMenuSubItem key={subItem.href}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={isSubActive}
                                >
                                  <Link
                                    href={subItem.href!}
                                    onClick={handleNavClick}
                                  >
                                    <SubIcon />
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              }

              // Handle regular items
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.title}
                  >
                    <Link href={item.href!} onClick={handleNavClick}>
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
                    <Link href={item.href!} onClick={handleNavClick}>
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
                  {user.role
                    ? user.role.charAt(0) + user.role.slice(1).toLowerCase()
                    : ""}
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
