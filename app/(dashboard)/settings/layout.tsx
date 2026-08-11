import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/get-session";
import { AdminSidebar } from "@/components/sidebar/admin-sidebar";
import { CraftsmanSidebar } from "@/components/sidebar/craftsman-sidebar";
import { CustomerSidebar } from "@/components/sidebar/customer-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function SettingsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const role = session.user.role;

  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider>
        {role === "ADMIN" && <AdminSidebar user={session.user} />}
        {role === "CRAFTSMAN" && <CraftsmanSidebar user={session.user} />}
        {role === "CUSTOMER" && <CustomerSidebar user={session.user} />}

        <SidebarInset className="flex h-screen flex-col overflow-hidden">
          <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center border-b bg-background px-2 sm:px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-1 sm:gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="h-4 hidden sm:block" />
            </div>
            <h1 className="flex-1 text-center text-xs font-semibold truncate px-1 sm:text-sm sm:px-0">
              Account Settings
            </h1>
            <div className="flex items-center gap-1 sm:gap-2">
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
