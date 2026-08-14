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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Hammer, Search, ShieldCheck, Award, Ban, CheckCircle2, Loader2, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CraftsmanUserItem {
  id: string; // CraftsmanProfile ID
  userId: string;
  name: string;
  email: string;
  phone: string | null;
  businessName: string | null;
  regionName: string;
  categoryNames: string[];
  verificationLevel: "REGISTERED" | "VERIFIED" | "APPROVED";
  subscriptionStatus: "FREE" | "ACTIVE" | "EXPIRED";
  totalJobsCompleted: number;
  banned: boolean | null;
  banReason: string | null;
  createdAt: string;
}

interface AdminCraftsmenClientProps {
  craftsmen: CraftsmanUserItem[];
}

export function AdminCraftsmenClient({ craftsmen }: AdminCraftsmenClientProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [levelFilter, setLevelFilter] = useState<string>("ALL");
  const [selectedCraftsman, setSelectedCraftsman] = useState<CraftsmanUserItem | null>(null);
  const [isBanDialogOpen, setIsBanDialogOpen] = useState<boolean>(false);
  const [banReason, setBanReason] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const filteredCraftsmen = craftsmen.filter((c) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      c.name.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      (c.businessName && c.businessName.toLowerCase().includes(term)) ||
      c.regionName.toLowerCase().includes(term);

    const matchesLevel = levelFilter === "ALL" || c.verificationLevel === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const handleOpenBanDialog = (craftsman: CraftsmanUserItem) => {
    setSelectedCraftsman(craftsman);
    setBanReason(craftsman.banReason || "");
    setIsBanDialogOpen(true);
  };

  const handleToggleBan = async () => {
    if (!selectedCraftsman) return;
    const isBanning = !selectedCraftsman.banned;

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/admin/users/ban", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedCraftsman.userId,
          banned: isBanning,
          banReason: isBanning ? banReason : null,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || json.error || "Failed to update craftsman ban status.");
      }

      toast.success(isBanning ? `Craftsman ${selectedCraftsman.name} has been BANNED.` : `Craftsman ${selectedCraftsman.name} has been UNBANNED.`);
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
            <Hammer className="h-5 w-5 text-primary" />
            Craftsman Account Directory
          </CardTitle>
          <CardDescription className="text-xs">
            Filter by verification level, inspect completed jobs, and manage craftsman status.
          </CardDescription>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Level Filter */}
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="h-9 text-xs w-36">
              <SelectValue placeholder="Verification" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Levels</SelectItem>
              <SelectItem value="REGISTERED">Registered</SelectItem>
              <SelectItem value="VERIFIED">Verified</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
            </SelectContent>
          </Select>

          {/* Search Input */}
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search business, name, region..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {filteredCraftsmen.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-xs border border-dashed rounded-lg">
            No craftsmen found matching filter criteria.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="text-xs">
                <TableHead>Craftsman / Business</TableHead>
                <TableHead>Category &amp; Region</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead>Jobs Done</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              {filteredCraftsmen.map((craftsman) => (
                <TableRow key={craftsman.id}>
                  <TableCell className="font-medium">
                    <p className="font-semibold text-foreground">{craftsman.businessName || craftsman.name}</p>
                    <p className="text-[11px] text-muted-foreground">{craftsman.name} · {craftsman.email}</p>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-foreground">{craftsman.categoryNames.join(", ") || "General"}</p>
                    <p className="text-[11px] text-muted-foreground">{craftsman.regionName}</p>
                  </TableCell>
                  <TableCell>
                    {craftsman.verificationLevel === "REGISTERED" && (
                      <Badge variant="outline" className="bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/30 text-[10px]">
                        Registered
                      </Badge>
                    )}
                    {craftsman.verificationLevel === "VERIFIED" && (
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30 text-[10px] flex items-center gap-1 w-fit">
                        <ShieldCheck className="h-3 w-3" /> Verified
                      </Badge>
                    )}
                    {craftsman.verificationLevel === "APPROVED" && (
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 text-[10px] flex items-center gap-1 w-fit">
                        <Award className="h-3 w-3" /> Approved
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-mono text-[10px]">
                      {craftsman.subscriptionStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-foreground">
                    <span className="flex items-center gap-1"><Briefcase className="h-3 w-3 text-muted-foreground" /> {craftsman.totalJobsCompleted}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant={craftsman.banned ? "outline" : "destructive"}
                      className="h-7 text-xs gap-1"
                      onClick={() => handleOpenBanDialog(craftsman)}
                    >
                      {craftsman.banned ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" /> Unban
                        </>
                      ) : (
                        <>
                          <Ban className="h-3.5 w-3.5" /> Suspend
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Ban / Suspend Dialog */}
        {selectedCraftsman && (
          <Dialog open={isBanDialogOpen} onOpenChange={setIsBanDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-lg flex items-center gap-2">
                  {selectedCraftsman.banned ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <Ban className="h-5 w-5 text-destructive" />}
                  {selectedCraftsman.banned ? `Unban Craftsman ${selectedCraftsman.name}` : `Suspend Craftsman ${selectedCraftsman.name}`}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  {selectedCraftsman.banned
                    ? "Restores craftsman account access."
                    : "Suspends craftsman profile and prevents receiving job requests."}
                </DialogDescription>
              </DialogHeader>

              {!selectedCraftsman.banned && (
                <div className="space-y-2 py-2 text-xs">
                  <label className="font-semibold text-foreground">Reason for Suspension (Required)</label>
                  <Textarea
                    placeholder="Enter reason (e.g. Workmanship complaints, invalid license)..."
                    value={banReason}
                    onChange={(e) => setBanReason(e.target.value)}
                    className="h-20 text-xs resize-none"
                  />
                </div>
              )}

              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={() => setIsBanDialogOpen(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button
                  variant={selectedCraftsman.banned ? "default" : "destructive"}
                  onClick={handleToggleBan}
                  disabled={isSubmitting || (!selectedCraftsman.banned && !banReason.trim())}
                  className="gap-1 text-xs"
                >
                  {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : selectedCraftsman.banned ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Ban className="h-3.5 w-3.5" />}
                  {selectedCraftsman.banned ? "Confirm Unban" : "Confirm Suspension"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}
