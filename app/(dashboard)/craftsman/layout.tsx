import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "@/lib/get-session";
import { CraftsmanSidebar } from "@/components/sidebar/craftsman-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function CraftsmanLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  if (session.user.role !== "CRAFTSMAN") {
    redirect("/dashboard");
  }

  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider>
        <CraftsmanSidebar user={session.user} />
        <SidebarInset className="flex h-screen flex-col overflow-hidden">
          <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center border-b bg-background px-2 sm:px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-1 sm:gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="h-4 hidden sm:block" />
            </div>
            <h1 className="flex-1 text-center text-xs font-semibold truncate px-1 sm:text-sm sm:px-0">
              Craftsman Dashboard
            </h1>
            <div className="flex items-center gap-1 sm:gap-2">
              <ThemeToggle />
              <Button
                size="sm"
                asChild
                className="h-7 text-xs px-2 sm:h-9 sm:text-sm sm:px-3"
              >
                <Link href="/craftsman/services">My Services</Link>
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
