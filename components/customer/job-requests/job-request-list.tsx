"use client";

import { useMemo, useState } from "react";
import { JobStatus } from "@prisma/client";

import { CustomerJobItem, JobRequestDetails } from "./job-request-details";
import { JobRequestEmptyState } from "./job-request-empty-state";
import { JobRequestFilters } from "./job-request-filters";
import { JobRequestStats } from "./job-request-stats";
import { JobRequestCard } from "./job-request-card";

interface JobRequestListProps {
  initialJobs: CustomerJobItem[];
}

export function JobRequestList({ initialJobs }: JobRequestListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [activeDetailsJob, setActiveDetailsJob] = useState<CustomerJobItem | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Calculate statistics from server-fetched jobs
  const stats = useMemo(() => {
    return {
      total: initialJobs.length,
      pending: initialJobs.filter((j) => j.status === JobStatus.PENDING).length,
      accepted: initialJobs.filter((j) => j.status === JobStatus.ACCEPTED).length,
      completed: initialJobs.filter((j) => j.status === JobStatus.COMPLETED).length,
      cancelled: initialJobs.filter((j) => j.status === JobStatus.CANCELLED).length,
    };
  }, [initialJobs]);

  // Filter jobs based on selected status and search query
  const filteredJobs = useMemo(() => {
    return initialJobs.filter((job) => {
      // Status filter
      if (selectedStatus !== "ALL" && job.status !== selectedStatus) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = job.title.toLowerCase().includes(query);
        const matchesCraftsman = job.craftsman.user.name.toLowerCase().includes(query);
        const matchesBusiness = job.craftsman.businessName?.toLowerCase().includes(query) || false;
        const matchesCategory = job.category.name.toLowerCase().includes(query);
        const matchesSubService = job.subService?.name.toLowerCase().includes(query) || false;
        const matchesAddress = job.address.toLowerCase().includes(query);

        return (
          matchesTitle ||
          matchesCraftsman ||
          matchesBusiness ||
          matchesCategory ||
          matchesSubService ||
          matchesAddress
        );
      }

      return true;
    });
  }, [initialJobs, selectedStatus, searchQuery]);

  const handleOpenDetails = (job: CustomerJobItem) => {
    setActiveDetailsJob(job);
    setIsDetailsOpen(true);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedStatus("ALL");
  };

  const hasActiveFilters = searchQuery.trim().length > 0 || selectedStatus !== "ALL";

  return (
    <div className="space-y-6">
      {/* Stats summary */}
      <JobRequestStats
        stats={stats}
        activeFilter={selectedStatus}
        onSelectFilter={setSelectedStatus}
      />

      {/* Filter and search bar */}
      <JobRequestFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        onClearFilters={handleClearFilters}
      />

      {/* Content list or empty state */}
      {filteredJobs.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => (
            <JobRequestCard key={job.id} job={job} onViewDetails={handleOpenDetails} />
          ))}
        </div>
      ) : (
        <JobRequestEmptyState
          hasFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
        />
      )}

      {/* Details modal */}
      <JobRequestDetails
        job={activeDetailsJob}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </div>
  );
}
