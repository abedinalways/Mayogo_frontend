"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { Column, DataTable } from "../../shared/DataTable";
import { StatusBadge, type StatusType } from "../../shared/StatusBadge";
import { useGetJobsQuery } from "@/lib/redux/api/jobApi";
import { AdminJobItem } from "@/types/job.types";

export interface JobRecord {
  id: string;
  rawId: string;
  service: {
    name: string;
    category: string;
    image: string;
  };
  client: {
    name: string;
    avatar: string;
  };
  expert: {
    name: string;
    avatar: string;
  };
  status: StatusType;
  amount: string;
}

const mapStatus = (status?: string): StatusType => {
  switch (status?.toUpperCase()) {
    case "COMPLETED":
      return "Completed";
    case "IN_PROGRESS":
    case "ACCEPTED":
      return "In Progress";
    case "PENDING":
      return "Pending";
    case "DISPUTED":
      return "Disputed";
    case "CANCELLED":
      return "Cancelled";
    default:
      return "Pending";
  }
};

export function RecentJobsTable() {
  const router = useRouter();
  const { data: jobsResponse, isLoading } = useGetJobsQuery({
    limit: 5,
    sortBy: "NEWEST_FIRST",
  });

  const rawJobs: AdminJobItem[] = Array.isArray(jobsResponse?.data)
    ? jobsResponse.data
    : (jobsResponse?.data as { jobs?: AdminJobItem[]; data?: AdminJobItem[] })?.jobs ||
      (jobsResponse?.data as { jobs?: AdminJobItem[]; data?: AdminJobItem[] })?.data ||
      [];

  const jobs: JobRecord[] = rawJobs.map((item) => {
    const amountVal =
      typeof item.amount === "number"
        ? `$${item.amount.toLocaleString()}`
        : item.amount
        ? `${item.amount}`
        : typeof item.totalAmount === "number"
        ? `$${item.totalAmount.toLocaleString()}`
        : item.totalAmount
        ? `${item.totalAmount}`
        : "$0";

    return {
      id: item.jobId || item.requestNumber || `#${item.id.slice(0, 8)}`,
      rawId: item.id,
      service: {
        name: item.service?.name || item.title || "Service Request",
        category: item.service?.category || "General",
        image: item.service?.image || "https://placehold.co/28x28",
      },
      client: {
        name: item.client?.fullName || item.client?.name || "Client",
        avatar: item.client?.avatar || "https://placehold.co/28x28",
      },
      expert: {
        name: item.expert?.fullName || item.expert?.name || "Unassigned",
        avatar: item.expert?.avatar || "https://placehold.co/28x28",
      },
      status: mapStatus(item.status),
      amount: amountVal,
    };
  });

  const columns: Column<JobRecord>[] = [
    {
      key: "id",
      header: "Job ID",
      className: "w-36 min-w-[120px]",
      cell: (item) => (
        <Link
          href={`/dashboard/jobs/${item.rawId}`}
          className="text-sm font-semibold text-[#123e5e] hover:underline"
        >
          {item.id}
        </Link>
      ),
    },
    {
      key: "service",
      header: "Service Name",
      className: "w-64 min-w-[220px]",
      cell: (item) => (
        <div className="flex items-center gap-2">
          <img
            src={item.service.image}
            alt={item.service.name}
            className="h-7 w-7 rounded-sm border border-slate-200 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://placehold.co/28x28";
            }}
          />
          <div className="flex flex-col">
            <span className="text-xs font-medium text-[#123e5e]">
              {item.service.name}
            </span>
            <span className="text-[10px] font-medium text-[#8a9bab]">
              {item.service.category}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "client",
      header: "Client",
      className: "min-w-[180px]",
      cell: (item) => (
        <div className="flex items-center gap-2">
          <img
            src={item.client.avatar}
            alt={item.client.name}
            className="h-7 w-7 rounded-full border border-slate-200 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://placehold.co/28x28";
            }}
          />
          <span className="text-xs font-medium text-[#123e5e]">
            {item.client.name}
          </span>
        </div>
      ),
    },
    {
      key: "expert",
      header: "Expert",
      className: "min-w-[180px]",
      cell: (item) => (
        <div className="flex items-center gap-2">
          <img
            src={item.expert.avatar}
            alt={item.expert.name}
            className="h-7 w-7 rounded-full border border-slate-200 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://placehold.co/28x28";
            }}
          />
          <span className="text-xs font-medium text-[#123e5e]">
            {item.expert.name}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      className: "w-36 min-w-[130px]",
      cell: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: "amount",
      header: "Amount",
      className: "w-36 min-w-[100px]",
      cell: (item) => (
        <span className="text-sm font-semibold text-[#123e5e]">
          {item.amount}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between border-t border-x border-[#E8E8E8] p-4 rounded-t-xl bg-white">
        <h2 className="card-title">Recent Jobs</h2>
        <button
          type="button"
          onClick={() => router.push("/dashboard/jobs")}
          className="card-button"
        >
          <span>View All</span>
          <ArrowRight className="h-4 w-4 text-[#123e5e]" />
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12 bg-white border border-[#E8E8E8] rounded-b-xl">
          <Loader2 className="h-6 w-6 animate-spin text-[#0f3453]" />
        </div>
      ) : (
        <DataTable columns={columns} data={jobs} pagination={false} />
      )}
    </div>
  );
}

export default RecentJobsTable;