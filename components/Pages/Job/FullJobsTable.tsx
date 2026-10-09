"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Loader2, AlertCircle, RefreshCw, Briefcase } from "lucide-react";
import { Column, DataTable } from "../../shared/DataTable";
import { StatusBadge, type StatusType } from "../../shared/StatusBadge";
import TableToolbar, { DropdownFilter } from "../../shared/TableToolbar";
import { SortOption } from "../../shared/SortDropdown";
import { useGetJobsQuery } from "@/lib/redux/api/jobApi";
import { AdminJobItem, JobSortBy, JobTab } from "@/types/job.types";

export interface FullJobRecord {
  id: string;
  jobId: string;
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
  serviceType: string;
  payment: StatusType;
  amount: string;
  location: string;
  date: string;
  status: StatusType;
}

const jobSortOptions: SortOption[] = [
  { label: "Newest First", value: "NEWEST_FIRST" },
  { label: "Oldest First", value: "OLDEST_FIRST" },
  { label: "Client Name (A-Z)", value: "CLIENT_NAME_A_Z" },
  { label: "Client Name (Z-A)", value: "CLIENT_NAME_Z_A" },
  { label: "Highest Amount", value: "AMOUNT_HIGHEST" },
  { label: "Lowest Amount", value: "AMOUNT_LOWEST" },
];

const JOB_TABS: { label: string; value: JobTab }[] = [
  { label: "All Jobs", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Disputed", value: "DISPUTED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export function FullJobsTable() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentTab, setCurrentTab] = useState<JobTab>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<string>("all");
  const [sortValue, setSortValue] = useState<JobSortBy>("NEWEST_FIRST");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 350);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const offset = (page - 1) * pageSize;

  const { data, isLoading, isFetching, error, refetch } = useGetJobsQuery({
    tab: currentTab !== "ALL" ? currentTab : undefined,
    paymentStatus: paymentStatus !== "all" ? paymentStatus : undefined,
    search: debouncedSearch || undefined,
    sortBy: sortValue,
    limit: pageSize,
    offset,
  });

  const { jobList, totalCount } = useMemo(() => {
    if (!data) return { jobList: [], totalCount: 0 };

    let items: AdminJobItem[] = [];
    let total = 0;

    if (Array.isArray(data.data)) {
      items = data.data;
      total = data.data.length;
    } else if (data.data) {
      items = data.data.jobs || data.data.data || data.data.items || [];
      total = data.data.total ?? items.length;
    }

    const mapped: FullJobRecord[] = items.map((j, index) => {
      const rawStatus = (j.status || "PENDING").toUpperCase();
      let status: StatusType = "Pending";
      if (rawStatus === "COMPLETED") status = "Completed";
      else if (rawStatus === "IN_PROGRESS") status = "In Progress";
      else if (rawStatus === "CANCELLED") status = "Cancelled";
      else if (rawStatus === "DISPUTED") status = "Disputed";
      else if (rawStatus === "ACCEPTED" || rawStatus === "QUOTE_ACCEPTED") status = "Accepted";

      const rawPayment = (j.paymentStatus || j.payment || "PENDING").toUpperCase();
      let payment: StatusType = "Pending";
      if (rawPayment === "PAID") payment = "Paid";
      else if (rawPayment === "FAILED") payment = "Failed";
      else if (rawPayment === "REFUNDED") payment = "Refunded";

      const clientName = j.client?.fullName || j.client?.name || "Client Name";
      const expertName = j.expert?.fullName || j.expert?.name || "Unassigned";

      const amountVal = j.amount ?? j.quote ?? j.totalAmount ?? 0;
      const amountNum = typeof amountVal === "number" ? amountVal : parseFloat(String(amountVal || 0));

      let locationText = "N/A";
      if (typeof j.location === "object" && j.location !== null) {
        locationText = j.location.city || j.location.address || "N/A";
      } else if (typeof j.location === "string") {
        locationText = j.location;
      }

      let dateText = "N/A";
      const rawDate = j.date || j.appointment?.date || j.createdAt;
      if (rawDate) {
        try {
          dateText = new Intl.DateTimeFormat("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }).format(new Date(rawDate));
        } catch {
          dateText = rawDate;
        }
      }

      return {
        id: j.id,
        jobId: j.jobId || j.requestNumber || `#JB${String(index + 1).padStart(3, "0")}`,
        service: {
          name: j.service?.name || "Standard Service",
          category: j.service?.category || "General",
          image:
            j.service?.image ||
            "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=100&auto=format&fit=crop&q=80",
        },
        client: {
          name: clientName,
          avatar:
            j.client?.avatar ||
            `https://placehold.co/80x80?text=${encodeURIComponent(clientName.charAt(0))}`,
        },
        expert: {
          name: expertName,
          avatar:
            j.expert?.avatar ||
            `https://placehold.co/80x80?text=${encodeURIComponent(expertName.charAt(0))}`,
        },
        serviceType: j.serviceType || "In-Person",
        payment,
        amount: `$${amountNum.toLocaleString()}`,
        location: locationText,
        date: dateText,
        status,
      };
    });

    return { jobList: mapped, totalCount: total };
  }, [data]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(jobList.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const columns: Column<FullJobRecord>[] = [
    {
      key: "checkbox",
      header: (
        <input
          type="checkbox"
          onChange={handleSelectAll}
          checked={selectedIds.length === jobList.length && jobList.length > 0}
          className="h-4 w-4 rounded border-slate-300 text-[#0a3558] focus:ring-0 cursor-pointer"
        />
      ),
      className: "w-12 px-4",
      cell: (item) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(item.id)}
          onChange={() => handleSelectRow(item.id)}
          className="h-4 w-4 rounded border-slate-300 text-[#0a3558] focus:ring-0 cursor-pointer"
        />
      ),
    },
    {
      key: "jobId",
      header: "Job ID",
      className: "w-28 min-w-[100px]",
      cell: (item) => (
        <Link
          href={`/dashboard/jobs/${item.id}`}
          className="text-sm font-semibold text-[#123e5e] hover:underline cursor-pointer"
        >
          {item.jobId}
        </Link>
      ),
    },
    {
      key: "service",
      header: "Service Name",
      className: "min-w-[240px]",
      cell: (item) => (
        <div className="flex items-center gap-2.5">
          <img
            src={item.service.image}
            alt={item.service.name}
            className="h-8 w-8 rounded-md border border-slate-100 object-cover"
          />
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#123e5e]">
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
      header: "Client Name",
      className: "min-w-[160px]",
      cell: (item) => (
        <div className="flex items-center gap-2">
          <img
            src={item.client.avatar}
            alt={item.client.name}
            className="h-7 w-7 rounded-full border border-slate-200 object-cover"
          />
          <span className="text-xs font-medium text-[#123e5e]">
            {item.client.name}
          </span>
        </div>
      ),
    },
    {
      key: "expert",
      header: "Expert Name",
      className: "min-w-[160px]",
      cell: (item) => (
        <div className="flex items-center gap-2">
          <img
            src={item.expert.avatar}
            alt={item.expert.name}
            className="h-7 w-7 rounded-full border border-slate-200 object-cover"
          />
          <span className="text-xs font-medium text-[#123e5e]">
            {item.expert.name}
          </span>
        </div>
      ),
    },
    {
      key: "serviceType",
      header: "Service Type",
      className: "min-w-[130px]",
      cell: (item) => (
        <span className="text-xs font-normal text-slate-500">
          {item.serviceType}
        </span>
      ),
    },
    {
      key: "payment",
      header: "Payment",
      className: "w-28 min-w-[100px]",
      cell: (item) => <StatusBadge status={item.payment} />,
    },
    {
      key: "amount",
      header: "Amount",
      className: "w-24 min-w-[90px]",
      cell: (item) => (
        <span className="text-sm font-semibold text-[#123e5e]">
          {item.amount}
        </span>
      ),
    },
    {
      key: "location",
      header: "Location",
      className: "w-28 min-w-[100px]",
      cell: (item) => (
        <span className="text-xs font-normal text-slate-500">
          {item.location}
        </span>
      ),
    },
    {
      key: "date",
      header: "Date",
      className: "min-w-[120px]",
      cell: (item) => (
        <span className="text-xs font-normal text-slate-500 whitespace-nowrap">
          {item.date}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      className: "min-w-[120px]",
      cell: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: "action",
      header: "Action",
      className: "w-28 min-w-[110px] text-center",
      cell: (item) => (
        <Link
          href={`/dashboard/jobs/${item.id}`}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 text-nowrap"
        >
          View Details
        </Link>
      ),
    },
  ];

  const dropdownFilters: DropdownFilter[] = [
    {
      placeholder: "Payment",
      value: paymentStatus,
      options: [
        { label: "All Payments", value: "all" },
        { label: "Paid", value: "PAID" },
        { label: "Pending", value: "PENDING" },
        { label: "Failed", value: "FAILED" },
        { label: "Refunded", value: "REFUNDED" },
      ],
      onChange: (val) => {
        setPaymentStatus(val);
        setPage(1);
      },
    },
  ];

  return (
    <div className="w-full font-['Manrope']">
      {/* Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 pb-2 mb-3">
        {JOB_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => {
              setCurrentTab(tab.value);
              setPage(1);
            }}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              currentTab === tab.value
                ? "bg-[#103D5C] text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <TableToolbar
        searchQuery={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        dropdownFilters={dropdownFilters}
        sortOptions={jobSortOptions}
        onSortClick={() => {}}
        onSortChange={(val) => {
          setSortValue(val as JobSortBy);
          setPage(1);
        }}
      />

      {error ? (
        <div className="p-8 text-center bg-white border border-[#E8E8E8] rounded-b-xl">
          <AlertCircle className="mx-auto h-8 w-8 text-red-500 mb-2" />
          <p className="text-sm font-medium text-slate-800">Failed to load jobs</p>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Could not retrieve jobs data from the server.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#103D5C] text-white hover:bg-[#0b2b41] transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      ) : isLoading ? (
        <div className="p-16 flex flex-col items-center justify-center gap-3 bg-white border border-[#E8E8E8] rounded-b-xl">
          <Loader2 className="h-7 w-7 text-[#103D5C] animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Loading jobs...</p>
        </div>
      ) : jobList.length === 0 ? (
        <div className="p-16 text-center bg-white border border-[#E8E8E8] rounded-b-xl">
          <Briefcase className="mx-auto h-10 w-10 text-slate-300 mb-2" />
          <p className="text-sm font-semibold text-slate-800">No jobs found</p>
          <p className="text-xs text-slate-500 mt-1">
            {searchTerm || currentTab !== "ALL" || paymentStatus !== "all"
              ? "Try adjusting your search query, tab, or payment filter."
              : "No jobs have been posted yet."}
          </p>
        </div>
      ) : (
        <div className="relative">
          {isFetching && (
            <div className="absolute top-2 right-4 z-10 flex items-center gap-1.5 px-2 py-1 bg-white/90 backdrop-blur rounded shadow-sm border text-[11px] text-slate-600">
              <Loader2 className="h-3 w-3 animate-spin text-[#103D5C]" />
              <span>Updating...</span>
            </div>
          )}
          <DataTable
            columns={columns}
            data={jobList}
            pagination={true}
            pageSize={pageSize}
            pageSizeOptions={[10, 20, 50, 100]}
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setPage(1);
            }}
          />
        </div>
      )}
    </div>
  );
}

export default FullJobsTable;