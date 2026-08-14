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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Lock } from "lucide-react";

export default async function AdminLogsPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/sign-in?redirect=/admin/logs");
  }

  if (session.user.role !== Role.ADMIN) {
    redirect("/dashboard");
  }

  const logs = await prisma.adminLog.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      admin: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Activity Audit Logs</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Read-only immutable record of administrative actions, user bans, and verification badge updates.
        </p>
      </div>

      <Card className="border border-border/60">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ClipboardList className="h-5 w-5 text-primary" />
              System Audit Trail ({logs.length})
            </CardTitle>
            <CardDescription className="text-xs">
              Every verification decision, application review, or user status toggle is logged for transparency.
            </CardDescription>
          </div>

          <Badge variant="outline" className="bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/30 text-xs gap-1 w-fit">
            <Lock className="h-3 w-3" /> Read-Only Audit Log
          </Badge>
        </CardHeader>

        <CardContent>
          {logs.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-xs border border-dashed rounded-lg">
              No administrative action logs recorded yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="text-xs">
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Administrator</TableHead>
                  <TableHead>Action Performed</TableHead>
                  <TableHead>Entity Type</TableHead>
                  <TableHead className="text-right">Entity ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-xs">
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-muted-foreground text-[11px]">
                      {new Date(log.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="font-medium">
                      <p className="font-semibold text-foreground">{log.admin.name}</p>
                      <p className="text-[11px] text-muted-foreground">{log.admin.email}</p>
                    </TableCell>
                    <TableCell className="font-medium text-foreground max-w-md">
                      {log.action}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono text-[10px]">
                        {log.entityType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-[11px] text-muted-foreground">
                      #{log.entityId.slice(0, 12)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
