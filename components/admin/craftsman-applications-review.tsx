"use client";

import { useEffect, useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Loader2, 
  User, 
  Briefcase, 
  MapPin, 
  Tag, 
  DollarSign, 
  Phone, 
  Mail, 
  IdCard, 
  Users, 
  Image as ImageIcon,
  Check,
  X
} from "lucide-react";
import { toast } from "sonner";

interface ApplicationItem {
  id: string;
  referenceNumber?: string | null;
  fullName: string;
  email: string;
  phone: string;
  profilePhotoUrl?: string | null;
  businessName: string;
  bio?: string | null;
  regionName: string;
  categoryName: string;
  subServiceName: string;
  priceMin: string | number;
  priceMax: string | number;
  portfolioUrls: string[];
  idNumber?: string | null;
  businessRegistrationNumber?: string | null;
  workmanshipGuarantee: boolean;
  ref1Name?: string | null;
  ref1Phone?: string | null;
  ref2Name?: string | null;
  ref2Phone?: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  reviewNotes?: string | null;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
}

export function CraftsmanApplicationsReview() {
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>("ALL");

  const [selectedApp, setSelectedApp] = useState<ApplicationItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [reviewNotes, setReviewNotes] = useState<string>("");
  const [isSubmittingAction, setIsSubmittingAction] = useState<boolean>(false);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/applications");
      const json = await res.json();
      if (res.ok && json.success) {
        setApplications(json.data.applications || []);
      }
    } catch (err) {
      console.error("Failed to fetch applications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleOpenReview = (app: ApplicationItem) => {
    setSelectedApp(app);
    setReviewNotes(app.reviewNotes || "");
    setIsDialogOpen(true);
  };

  const handleReviewAction = async (action: "APPROVE" | "REJECT") => {
    if (!selectedApp) return;

    try {
      setIsSubmittingAction(true);
      const res = await fetch(`/api/applications/${selectedApp.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reviewNotes }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || json.error || `Failed to ${action.toLowerCase()} application.`);
      }

      toast.success(
        action === "APPROVE" 
          ? "Application APPROVED! User role updated to CRAFTSMAN." 
          : "Application REJECTED."
      );

      setIsDialogOpen(false);
      fetchApplications();
    } catch (err: any) {
      toast.error(err.message || "An error occurred during review.");
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const filteredApps = applications.filter((app) => {
    if (filter === "ALL") return true;
    return app.status === filter;
  });

  const pendingCount = applications.filter((a) => a.status === "PENDING").length;

  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Craftsman Applications Review Queue
          </CardTitle>
          <CardDescription>
            Review incoming applications. Approving will update the user&apos;s role to CRAFTSMAN and create their profile.
          </CardDescription>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Button
            size="sm"
            variant={filter === "ALL" ? "default" : "outline"}
            onClick={() => setFilter("ALL")}
            className="text-xs h-8"
          >
            All ({applications.length})
          </Button>
          <Button
            size="sm"
            variant={filter === "PENDING" ? "default" : "outline"}
            onClick={() => setFilter("PENDING")}
            className="text-xs h-8"
          >
            Pending ({pendingCount})
          </Button>
          <Button
            size="sm"
            variant={filter === "APPROVED" ? "default" : "outline"}
            onClick={() => setFilter("APPROVED")}
            className="text-xs h-8"
          >
            Approved ({applications.filter((a) => a.status === "APPROVED").length})
          </Button>
          <Button
            size="sm"
            variant={filter === "REJECTED" ? "default" : "outline"}
            onClick={() => setFilter("REJECTED")}
            className="text-xs h-8"
          >
            Rejected ({applications.filter((a) => a.status === "REJECTED").length})
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="p-8 text-center flex flex-col items-center justify-center space-y-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-xs text-muted-foreground">Fetching craftsman applications...</p>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm border border-dashed rounded-lg">
            No applications found matching filter &quot;{filter}&quot;.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ref / Applicant</TableHead>
                <TableHead>Business Name</TableHead>
                <TableHead>Category / Sub-Service</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApps.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">
                    <div>
                      <p className="text-xs font-mono font-semibold text-primary">
                        #{app.referenceNumber || app.id.slice(0, 8)}
                      </p>
                      <p className="text-sm font-semibold">{app.fullName}</p>
                      <p className="text-xs text-muted-foreground">{app.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-medium">{app.businessName}</TableCell>
                  <TableCell className="text-xs">
                    <p className="font-medium">{app.categoryName}</p>
                    <p className="text-muted-foreground">{app.subServiceName}</p>
                  </TableCell>
                  <TableCell className="text-sm">{app.regionName}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {app.status === "PENDING" && (
                      <Badge variant="secondary" className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20">
                        <Clock className="h-3 w-3 mr-1" /> Pending
                      </Badge>
                    )}
                    {app.status === "APPROVED" && (
                      <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Approved
                      </Badge>
                    )}
                    {app.status === "REJECTED" && (
                      <Badge variant="secondary" className="bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20">
                        <XCircle className="h-3 w-3 mr-1" /> Rejected
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 gap-1"
                      onClick={() => handleOpenReview(app)}
                    >
                      <Eye className="h-3.5 w-3.5" /> Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* APPLICATION REVIEW DIALOG */}
        {selectedApp && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <div className="flex items-center justify-between pr-6">
                  <div>
                    <DialogTitle className="text-xl flex items-center gap-2 flex-wrap">
                      <span>Application Details</span>
                      {selectedApp.referenceNumber && (
                        <Badge variant="secondary" className="font-mono text-xs">
                          Ref: #{selectedApp.referenceNumber}
                        </Badge>
                      )}
                      {selectedApp.status === "PENDING" && (
                        <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">Pending Review</Badge>
                      )}
                      {selectedApp.status === "APPROVED" && (
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Approved</Badge>
                      )}
                      {selectedApp.status === "REJECTED" && (
                        <Badge className="bg-rose-500/10 text-rose-600 border-rose-500/20">Rejected</Badge>
                      )}
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                      Submitted on {new Date(selectedApp.createdAt).toLocaleString()}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Personal Info */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <User className="h-3.5 w-3.5" /> Applicant Profile
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-lg bg-muted/20 border border-border/30 text-xs">
                    <div>
                      <p className="text-muted-foreground">Full Name</p>
                      <p className="font-semibold text-foreground">{selectedApp.fullName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Email</p>
                      <p className="font-medium text-foreground">{selectedApp.email}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Phone</p>
                      <p className="font-medium text-foreground">{selectedApp.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Business Info */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5" /> Business Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-lg bg-muted/20 border border-border/30 text-xs">
                    <div>
                      <p className="text-muted-foreground">Business Name</p>
                      <p className="font-semibold text-foreground">{selectedApp.businessName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Region</p>
                      <p className="font-medium text-foreground">{selectedApp.regionName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Category / Sub-Service</p>
                      <p className="font-medium text-foreground">{selectedApp.categoryName} ({selectedApp.subServiceName})</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Price Range</p>
                      <p className="font-medium text-foreground">₺{Number(selectedApp.priceMin).toLocaleString()} – ₺{Number(selectedApp.priceMax).toLocaleString()}</p>
                    </div>
                    {selectedApp.bio && (
                      <div className="sm:col-span-3 pt-2 border-t border-border/20">
                        <p className="text-muted-foreground">Bio / Experience</p>
                        <p className="text-foreground mt-0.5 whitespace-pre-wrap">{selectedApp.bio}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Portfolio Photos */}
                {selectedApp.portfolioUrls && selectedApp.portfolioUrls.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                      <ImageIcon className="h-3.5 w-3.5" /> Portfolio Photos ({selectedApp.portfolioUrls.length})
                    </h4>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-3 rounded-lg bg-muted/20 border border-border/30">
                      {selectedApp.portfolioUrls.map((url, idx) => (
                        <div key={idx} className="relative aspect-square rounded overflow-hidden border border-border bg-muted">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt={`Work sample ${idx + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Verification Documents & References */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" /> Verification Documents &amp; References
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-lg bg-muted/20 border border-border/30 text-xs">
                    <div>
                      <p className="text-muted-foreground">ID / Passport Number</p>
                      <p className="font-medium text-foreground">{selectedApp.idNumber || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Business Registration Number</p>
                      <p className="font-medium text-foreground">{selectedApp.businessRegistrationNumber || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Workmanship Guarantee</p>
                      <p className="font-medium text-foreground">{selectedApp.workmanshipGuarantee ? "Yes" : "No"}</p>
                    </div>
                    <div className="sm:col-span-2 pt-2 border-t border-border/20">
                      <p className="text-muted-foreground font-medium mb-1">Customer References</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="p-2 rounded bg-background border border-border/40">
                          <p className="font-semibold text-foreground">Ref 1: {selectedApp.ref1Name || "None"}</p>
                          <p className="text-muted-foreground">{selectedApp.ref1Phone || "No phone"}</p>
                        </div>
                        <div className="p-2 rounded bg-background border border-border/40">
                          <p className="font-semibold text-foreground">Ref 2: {selectedApp.ref2Name || "None"}</p>
                          <p className="text-muted-foreground">{selectedApp.ref2Phone || "No phone"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Admin Notes & Feedback Input */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground">
                    Admin Notes / Rejection Reason (Optional)
                  </label>
                  <Textarea
                    placeholder="Enter approval notes or reason for rejection..."
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    className="h-20 text-xs resize-none"
                    disabled={isSubmittingAction || selectedApp.status !== "PENDING"}
                  />
                  {selectedApp.status !== "PENDING" && selectedApp.reviewNotes && (
                    <p className="text-xs text-muted-foreground">
                      Recorded Review Notes: {selectedApp.reviewNotes}
                    </p>
                  )}
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                {selectedApp.status === "PENDING" ? (
                  <div className="flex items-center justify-end gap-2 w-full">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => handleReviewAction("REJECT")}
                      disabled={isSubmittingAction}
                      className="gap-1 text-xs"
                    >
                      {isSubmittingAction ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X className="h-3.5 w-3.5" />}
                      Reject Application
                    </Button>
                    <Button
                      type="button"
                      variant="default"
                      onClick={() => handleReviewAction("APPROVE")}
                      disabled={isSubmittingAction}
                      className="gap-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      {isSubmittingAction ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                      Approve &amp; Grant Craftsman Role
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Close
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}
