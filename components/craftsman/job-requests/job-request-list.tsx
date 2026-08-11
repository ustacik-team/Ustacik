"use client";

import { useMemo, useState } from "react";
import { JobStatus } from "@prisma/client";
import { JobWithDetails, JobRequestCard } from "./job-request-card";
import { JobRequestFilters } from "./job-request-filters";
import { JobRequestEmptyState } from "./job-request-empty-state";
import { JobRequestStats } from "./job-request-stats";

interface JobRequestListProps {
  initialJobs: JobWithDetails[];
}

export function JobRequestList({ initialJobs }: JobRequestListProps) {
  const [jobs, setJobs] = useState<JobWithDetails[]>(initialJobs);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const handleStatusChange = (jobId: string, newStatus: JobStatus) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === jobId
          ? {
              ...job,
              status: newStatus,
              completedAt: newStatus === JobStatus.COMPLETED ? new Date() : job.completedAt,
            }
          : job,
      ),
    );
  };

  const counts = useMemo(() => {
    return {
      all: jobs.length,
      pending: jobs.filter((j) => j.status === JobStatus.PENDING).length,
      accepted: jobs.filter((j) => j.status === JobStatus.ACCEPTED).length,
      completed: jobs.filter((j) => j.status === JobStatus.COMPLETED).length,
      cancelled: jobs.filter((j) => j.status === JobStatus.CANCELLED).length,
    };
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Status filter
      if (statusFilter !== "ALL" && job.status !== statusFilter) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const titleMatch = job.title.toLowerCase().includes(query);
        const customerMatch = job.customer.name.toLowerCase().includes(query);
        const addressMatch = job.address.toLowerCase().includes(query);
        const categoryMatch = job.category.name.toLowerCase().includes(query);
        const subServiceMatch = job.subService?.name.toLowerCase().includes(query) ?? false;

        return titleMatch || customerMatch || addressMatch || categoryMatch || subServiceMatch;
      }

      return true;
    });
  }, [jobs, statusFilter, searchQuery]);

  const isFiltered = jobs.length > 0 && (statusFilter !== "ALL" || searchQuery.trim().length > 0);

  return (
    <div className="space-y-6">
      {/* Live Statistics */}
      <JobRequestStats
        stats={{
          total: counts.all,
          pending: counts.pending,
          accepted: counts.accepted,
          completed: counts.completed,
          cancelled: counts.cancelled,
        }}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
      />

      {/* Filters and Search Bar */}
      <JobRequestFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        counts={counts}
      />

      {/* Job Cards Grid or Empty State */}
      {filteredJobs.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => (
            <JobRequestCard key={job.id} job={job} onStatusChange={handleStatusChange} />
          ))}
        </div>
      ) : (
        <JobRequestEmptyState
          isFiltered={isFiltered}
          onClearFilters={() => {
            setSearchQuery("");
            setStatusFilter("ALL");
          }}
        />
      )}
    </div>
  );
}
