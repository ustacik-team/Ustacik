import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, ShieldCheck, Calendar, Lock } from "lucide-react";

export default async function AdminProfilePage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/sign-in?redirect=/admin/profile");
  }

  if (session.user.role !== Role.ADMIN) {
    redirect("/dashboard");
  }

  const adminUser = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!adminUser) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Administrator Account Profile</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Superuser account credentials, authorization status, and platform identity.
        </p>
      </div>

      <Card className="border border-border/60">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
          <div className="flex items-center gap-3">
            <div className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary font-bold text-lg">
              {adminUser.name?.slice(0, 2).toUpperCase() || "AD"}
            </div>
            <div>
              <CardTitle className="text-lg font-bold">{adminUser.name}</CardTitle>
              <CardDescription className="text-xs">{adminUser.email}</CardDescription>
            </div>
          </div>

          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-xs font-semibold gap-1 w-fit">
            <ShieldCheck className="h-3.5 w-3.5" /> Platform Administrator
          </Badge>
        </CardHeader>

        <CardContent className="space-y-4 text-xs">
          <div className="grid gap-4 sm:grid-cols-2 pt-2">
            <div className="space-y-1.5 p-3 rounded-lg border bg-muted/20">
              <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                <User className="h-3.5 w-3.5 text-primary" /> User Name
              </span>
              <p className="font-semibold text-foreground text-sm">{adminUser.name}</p>
            </div>

            <div className="space-y-1.5 p-3 rounded-lg border bg-muted/20">
              <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                <Mail className="h-3.5 w-3.5 text-primary" /> Email Address
              </span>
              <p className="font-semibold text-foreground text-sm">{adminUser.email}</p>
            </div>

            <div className="space-y-1.5 p-3 rounded-lg border bg-muted/20">
              <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                <Lock className="h-3.5 w-3.5 text-primary" /> Access Role
              </span>
              <p className="font-semibold text-foreground text-sm">ADMIN (Superuser Access)</p>
            </div>

            <div className="space-y-1.5 p-3 rounded-lg border bg-muted/20">
              <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                <Calendar className="h-3.5 w-3.5 text-primary" /> Joined Platform
              </span>
              <p className="font-semibold text-foreground text-sm">
                {new Date(adminUser.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
