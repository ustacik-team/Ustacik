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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Briefcase, Search, Clock, CheckCircle2, XCircle, Eye, User, Hammer, MapPin, Tag } from "lucide-react";

interface AdminJobItem {
  id: string;
  title: string;
  description: string;
  address: string;
  status: "PENDING" | "ACCEPTED" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  completedAt: string | null;
  customer: {
    name: string;
    email: string;
    phone: string | null;
  };
  craftsman: {
    businessName: string | null;
    userName: string;
    email: string;
    phone: string | null;
  };
  category: {
    name: string;
  };
  subService: {
    name: string;
  } | null;
}

interface AdminJobsClientProps {
  jobs: AdminJobItem[];
}

export function AdminJobsClient({ jobs }: AdminJobsClientProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedJob, setSelectedJob] = useState<AdminJobItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const filteredJobs = jobs.filter((j) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      j.title.toLowerCase().includes(term) ||
      j.customer.name.toLowerCase().includes(term) ||
      (j.craftsman.businessName && j.craftsman.businessName.toLowerCase().includes(term)) ||
      j.category.name.toLowerCase().includes(term);

    const matchesStatus = statusFilter === "ALL" || j.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenDetail = (job: AdminJobItem) => {
    setSelectedJob(job);
    setIsDialogOpen(true);
  };

  return (
    <Card className="border border-border/60">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Briefcase className="h-5 w-5 text-primary" />
            Marketplace Job Interactions
          </CardTitle>
          <CardDescription className="text-xs">
            Monitor non-commission job matches formed directly between customers and craftsmen.
          </CardDescription>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 text-xs w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="ACCEPTED">Accepted</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          {/* Search Input */}
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search title, customer, craftsman..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {filteredJobs.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-xs border border-dashed rounded-lg">
            No job interactions found matching filter criteria.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="text-xs">
                <TableHead>Job Title &amp; Category</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Craftsman</TableHead>
                <TableHead>Date Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              {filteredJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">
                    <p className="font-semibold text-foreground truncate max-w-[200px]">{job.title}</p>
                    <p className="text-[11px] text-muted-foreground">{job.category.name} {job.subService ? `(${job.subService.name})` : ""}</p>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-foreground">{job.customer.name}</p>
                    <p className="text-[11px] text-muted-foreground">{job.customer.email}</p>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-foreground">{job.craftsman.businessName || job.craftsman.userName}</p>
                    <p className="text-[11px] text-muted-foreground">{job.craftsman.email}</p>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {job.status === "PENDING" && (
                      <Badge variant="secondary" className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 text-[10px]">
                        <Clock className="h-3 w-3 mr-1" /> Pending
                      </Badge>
                    )}
                    {job.status === "ACCEPTED" && (
                      <Badge variant="secondary" className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30 text-[10px]">
                        Accepted
                      </Badge>
                    )}
                    {job.status === "COMPLETED" && (
                      <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[10px]">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Completed
                      </Badge>
                    )}
                    {job.status === "CANCELLED" && (
                      <Badge variant="secondary" className="bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30 text-[10px]">
                        <XCircle className="h-3 w-3 mr-1" /> Cancelled
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs gap-1"
                      onClick={() => handleOpenDetail(job)}
                    >
                      <Eye className="h-3.5 w-3.5" /> Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Job Detail Modal */}
        {selectedJob && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-lg flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Job Request Details
                </DialogTitle>
                <DialogDescription className="text-xs">
                  ID: #{selectedJob.id} · Created on {new Date(selectedJob.createdAt).toLocaleString()}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2 text-xs">
                {/* Title & Status */}
                <div className="p-3 rounded-lg bg-muted/20 border border-border/30 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm text-foreground">{selectedJob.title}</h4>
                    <Badge variant="outline" className="text-[10px]">
                      {selectedJob.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground whitespace-pre-wrap">{selectedJob.description}</p>
                </div>

                {/* Location & Category */}
                <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-muted/20 border border-border/30">
                  <div>
                    <p className="text-muted-foreground flex items-center gap-1"><Tag className="h-3 w-3" /> Category</p>
                    <p className="font-medium text-foreground">{selectedJob.category.name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> Address</p>
                    <p className="font-medium text-foreground">{selectedJob.address}</p>
                  </div>
                </div>

                {/* Parties Involved */}
                <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-muted/20 border border-border/30">
                  <div>
                    <p className="text-muted-foreground flex items-center gap-1"><User className="h-3 w-3" /> Customer</p>
                    <p className="font-semibold text-foreground">{selectedJob.customer.name}</p>
                    <p className="text-muted-foreground">{selectedJob.customer.email}</p>
                    <p className="text-muted-foreground">{selectedJob.customer.phone || "No phone"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground flex items-center gap-1"><Hammer className="h-3 w-3" /> Craftsman</p>
                    <p className="font-semibold text-foreground">{selectedJob.craftsman.businessName || selectedJob.craftsman.userName}</p>
                    <p className="text-muted-foreground">{selectedJob.craftsman.email}</p>
                    <p className="text-muted-foreground">{selectedJob.craftsman.phone || "No phone"}</p>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}
