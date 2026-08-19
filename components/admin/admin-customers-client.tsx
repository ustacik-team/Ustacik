"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Users, Search, Ban, CheckCircle2, Loader2, Mail, Phone, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CustomerUserItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  banned: boolean | null;
  banReason: string | null;
  createdAt: string;
  jobsCount: number;
  reviewsCount: number;
}

interface AdminCustomersClientProps {
  customers: CustomerUserItem[];
}

export function AdminCustomersClient({ customers }: AdminCustomersClientProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<CustomerUserItem | null>(null);
  const [isBanDialogOpen, setIsBanDialogOpen] = useState<boolean>(false);
  const [banReason, setBanReason] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const filteredCustomers = customers.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      (c.phone && c.phone.toLowerCase().includes(term))
    );
  });

  const handleOpenBanDialog = (user: CustomerUserItem) => {
    setSelectedUser(user);
    setBanReason(user.banReason || "");
    setIsBanDialogOpen(true);
  };

  const handleToggleBan = async () => {
    if (!selectedUser) return;
    const isBanning = !selectedUser.banned;

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/admin/users/ban", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          banned: isBanning,
          banReason: isBanning ? banReason : null,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || json.error || "Failed to update user ban status.");
      }

      toast.success(isBanning ? `User ${selectedUser.name} has been BANNED.` : `User ${selectedUser.name} has been UNBANNED.`);
      setIsBanDialogOpen(false);
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border border-border/60">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-primary" />
            Customer Account Management
          </CardTitle>
          <CardDescription className="text-xs">
            Search, inspect job activity, and manage customer account access using Better Auth.
          </CardDescription>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search name, email, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>
      </CardHeader>

      <CardContent>
        {filteredCustomers.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-xs border border-dashed rounded-lg">
            No customers found matching search filter.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="text-xs">
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">
                    <p className="font-semibold text-foreground">{customer.name}</p>
                    <p className="text-[11px] font-mono text-muted-foreground">ID: {customer.id.slice(0, 10)}...</p>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="flex items-center gap-1 text-foreground"><Mail className="h-3 w-3 text-muted-foreground" /> {customer.email}</p>
                      <p className="flex items-center gap-1 text-muted-foreground"><Phone className="h-3 w-3 text-muted-foreground" /> {customer.phone || "No phone"}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-[11px]">
                      <Badge variant="secondary" className="font-mono text-[10px]">
                        <Briefcase className="h-3 w-3 mr-1" /> {customer.jobsCount} Jobs
                      </Badge>
                      <span className="text-muted-foreground">· {customer.reviewsCount} Reviews</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {customer.banned ? (
                      <Badge variant="destructive" className="text-[10px]">
                        Banned
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[10px]">
                        Active
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant={customer.banned ? "outline" : "destructive"}
                      className="h-7 text-xs gap-1"
                      onClick={() => handleOpenBanDialog(customer)}
                    >
                      {customer.banned ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" /> Unban
                        </>
                      ) : (
                        <>
                          <Ban className="h-3.5 w-3.5" /> Ban User
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Ban / Unban Dialog */}
        {selectedUser && (
          <Dialog open={isBanDialogOpen} onOpenChange={setIsBanDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-lg flex items-center gap-2">
                  {selectedUser.banned ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <Ban className="h-5 w-5 text-destructive" />}
                  {selectedUser.banned ? `Unban Customer ${selectedUser.name}` : `Ban Customer ${selectedUser.name}`}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  {selectedUser.banned
                    ? "Restores customer access to sign in and submit job requests."
                    : "Suspends account access and prevents logging in via Better Auth."}
                </DialogDescription>
              </DialogHeader>

              {!selectedUser.banned && (
                <div className="space-y-2 py-2 text-xs">
                  <label className="font-semibold text-foreground">Reason for Ban (Required)</label>
                  <Textarea
                    placeholder="Enter reason (e.g. Abusive behavior towards craftsmen, fake job postings)..."
                    value={banReason}
                    onChange={(e) => setBanReason(e.target.value)}
                    className="h-20 text-xs resize-none"
                  />
                </div>
              )}

              {selectedUser.banned && selectedUser.banReason && (
                <div className="p-3 rounded bg-muted/30 border text-xs text-muted-foreground my-2">
                  <p className="font-semibold text-foreground">Recorded Ban Reason:</p>
                  <p className="mt-0.5">{selectedUser.banReason}</p>
                </div>
              )}

              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={() => setIsBanDialogOpen(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button
                  variant={selectedUser.banned ? "default" : "destructive"}
                  onClick={handleToggleBan}
                  disabled={isSubmitting || (!selectedUser.banned && !banReason.trim())}
                  className="gap-1 text-xs"
                >
                  {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : selectedUser.banned ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Ban className="h-3.5 w-3.5" />}
                  {selectedUser.banned ? "Confirm Unban" : "Confirm Ban"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}
