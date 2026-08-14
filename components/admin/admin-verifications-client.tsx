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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ShieldCheck, Shield, Award, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CraftsmanVerificationItem {
  id: string; // CraftsmanProfile id
  businessName: string | null;
  verificationLevel: "REGISTERED" | "VERIFIED" | "APPROVED";
  workmanshipGuarantee: boolean;
  businessRegistrationNumber: string | null;
  user: {
    name: string;
    email: string;
    phone: string | null;
  };
  region: {
    name: string;
  };
  categories: {
    category: {
      name: string;
    };
  }[];
  verificationRecords: {
    id: string;
    level: string;
    phoneVerified: boolean;
    idVerified: boolean;
    referencesVerified: boolean;
    workPhotosVerified: boolean;
    businessRegistrationVerified: boolean;
    guaranteeVerified: boolean;
    notes: string | null;
    verifiedAt: string;
    verifier: {
      name: string;
      email: string;
    };
  }[];
}

interface AdminVerificationsClientProps {
  craftsmen: CraftsmanVerificationItem[];
}

export function AdminVerificationsClient({ craftsmen }: AdminVerificationsClientProps) {
  const router = useRouter();
  const [selectedCraftsman, setSelectedCraftsman] = useState<CraftsmanVerificationItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [targetLevel, setTargetLevel] = useState<"REGISTERED" | "VERIFIED" | "APPROVED">("VERIFIED");
  
  // Audit Checklist state
  const [phoneVerified, setPhoneVerified] = useState<boolean>(true);
  const [idVerified, setIdVerified] = useState<boolean>(false);
  const [referencesVerified, setReferencesVerified] = useState<boolean>(false);
  const [workPhotosVerified, setWorkPhotosVerified] = useState<boolean>(false);
  const [businessRegistrationVerified, setBusinessRegistrationVerified] = useState<boolean>(false);
  const [guaranteeVerified, setGuaranteeVerified] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleOpenUpdate = (craftsman: CraftsmanVerificationItem) => {
    setSelectedCraftsman(craftsman);
    setTargetLevel(craftsman.verificationLevel);
    
    const latestRecord = craftsman.verificationRecords[0];
    if (latestRecord) {
      setPhoneVerified(latestRecord.phoneVerified);
      setIdVerified(latestRecord.idVerified);
      setReferencesVerified(latestRecord.referencesVerified);
      setWorkPhotosVerified(latestRecord.workPhotosVerified);
      setBusinessRegistrationVerified(latestRecord.businessRegistrationVerified);
      setGuaranteeVerified(latestRecord.guaranteeVerified);
      setNotes(latestRecord.notes || "");
    } else {
      setPhoneVerified(true);
      setIdVerified(craftsman.verificationLevel !== "REGISTERED");
      setReferencesVerified(craftsman.verificationLevel !== "REGISTERED");
      setWorkPhotosVerified(craftsman.verificationLevel !== "REGISTERED");
      setBusinessRegistrationVerified(craftsman.verificationLevel === "APPROVED");
      setGuaranteeVerified(craftsman.workmanshipGuarantee);
      setNotes("");
    }
    setIsDialogOpen(true);
  };

  const handleSaveVerification = async () => {
    if (!selectedCraftsman) return;

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/admin/verifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          craftsmanId: selectedCraftsman.id,
          level: targetLevel,
          phoneVerified,
          idVerified,
          referencesVerified,
          workPhotosVerified,
          businessRegistrationVerified,
          guaranteeVerified,
          notes,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || json.error || "Failed to save verification.");
      }

      toast.success(`Verification badge updated to ${targetLevel}!`);
      setIsDialogOpen(false);
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
            <ShieldCheck className="h-5 w-5 text-primary" />
            Craftsman Verification Queue &amp; Audit Trail
          </CardTitle>
          <CardDescription className="text-xs">
            Manage multi-tier verification status (Registered, Verified, Approved Craftsman) with audit records.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        {craftsmen.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-xs border border-dashed rounded-lg">
            No active craftsmen registered on the platform.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="text-xs">
                <TableHead>Craftsman / Business</TableHead>
                <TableHead>Category &amp; Region</TableHead>
                <TableHead>Current Level</TableHead>
                <TableHead>Last Verified</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              {craftsmen.map((craftsman) => {
                const latestRecord = craftsman.verificationRecords[0];
                return (
                  <TableRow key={craftsman.id}>
                    <TableCell className="font-medium">
                      <p className="font-semibold text-foreground">{craftsman.businessName || craftsman.user.name}</p>
                      <p className="text-[11px] text-muted-foreground">{craftsman.user.email} · {craftsman.user.phone || "No phone"}</p>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-foreground">
                        {craftsman.categories.map((c) => c.category.name).join(", ") || "General"}
                      </p>
                      <p className="text-[11px] text-muted-foreground">{craftsman.region.name}</p>
                    </TableCell>
                    <TableCell>
                      {craftsman.verificationLevel === "REGISTERED" && (
                        <Badge variant="outline" className="bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/30">
                          Registered
                        </Badge>
                      )}
                      {craftsman.verificationLevel === "VERIFIED" && (
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30 flex items-center gap-1 w-fit">
                          <ShieldCheck className="h-3 w-3" /> Verified
                        </Badge>
                      )}
                      {craftsman.verificationLevel === "APPROVED" && (
                        <Badge variant="outline" className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 flex items-center gap-1 w-fit">
                          <Award className="h-3 w-3" /> Approved Craftsman
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-[11px]">
                      {latestRecord ? (
                        <div>
                          <p>{new Date(latestRecord.verifiedAt).toLocaleDateString()}</p>
                          <p className="text-[10px]">By {latestRecord.verifier.name}</p>
                        </div>
                      ) : (
                        "Not audited yet"
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs gap-1"
                        onClick={() => handleOpenUpdate(craftsman)}
                      >
                        <Shield className="h-3.5 w-3.5" /> Manage Level
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}

        {/* Verification Edit Dialog */}
        {selectedCraftsman && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle className="text-lg flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  Audit &amp; Update Verification Badge
                </DialogTitle>
                <DialogDescription className="text-xs">
                  {selectedCraftsman.businessName || selectedCraftsman.user.name} ({selectedCraftsman.region.name})
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2 text-xs">
                {/* Target Level Select */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Verification Badge Level</label>
                  <Select
                    value={targetLevel}
                    onValueChange={(val: "REGISTERED" | "VERIFIED" | "APPROVED") => setTargetLevel(val)}
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="REGISTERED">REGISTERED (Phone verified, category &amp; region selected)</SelectItem>
                      <SelectItem value="VERIFIED">VERIFIED (ID checked, references contacted, work photos verified)</SelectItem>
                      <SelectItem value="APPROVED">APPROVED CRAFTSMAN (Verified + Business Reg &amp; Guarantee)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Audit Checklist */}
                <div className="space-y-2 p-3 rounded-lg bg-muted/20 border border-border/30">
                  <p className="font-semibold text-foreground mb-1">Manual Verification Audit Checklist</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox checked={phoneVerified} onCheckedChange={(checked) => setPhoneVerified(!!checked)} />
                      <span>Phone Number Verified</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox checked={idVerified} onCheckedChange={(checked) => setIdVerified(!!checked)} />
                      <span>ID / Passport Verified</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox checked={referencesVerified} onCheckedChange={(checked) => setReferencesVerified(!!checked)} />
                      <span>2 Customer References Checked</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox checked={workPhotosVerified} onCheckedChange={(checked) => setWorkPhotosVerified(!!checked)} />
                      <span>Work Photos Sample Verified</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox checked={businessRegistrationVerified} onCheckedChange={(checked) => setBusinessRegistrationVerified(!!checked)} />
                      <span>Business Registration Checked</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox checked={guaranteeVerified} onCheckedChange={(checked) => setGuaranteeVerified(!!checked)} />
                      <span>Workmanship Guarantee Signed</span>
                    </label>
                  </div>
                </div>

                {/* Audit Notes */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Audit Notes &amp; Verification Trail</label>
                  <Textarea
                    placeholder="Enter audit notes (e.g. Called reference John at +90..., verified TRNC ID card)."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="h-20 text-xs resize-none"
                  />
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button onClick={handleSaveVerification} disabled={isSubmitting} className="gap-1 text-xs">
                  {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                  Save Verification Audit Record
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}
