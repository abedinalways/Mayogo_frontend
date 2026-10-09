"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Loader2, AlertCircle, RefreshCw, UserX } from "lucide-react";
import { Column, DataTable } from "../../shared/DataTable";
import TableToolbar, { DropdownFilter } from "../../shared/TableToolbar";
import { SortOption } from "../../shared/SortDropdown";
import { useGetExpertsQuery } from "@/lib/redux/api/expertApi";
import { Expert } from "@/types/expert.types";

export type VerificationStatus =
  | "Level 1 verified"
  | "Level 2 verified"
  | "Level 3 verified"
  | "Level 4 verified"
  | "Verified"
  | "Pending"
  | "Unverified";

export type ExpertStatus = "Active" | "Busy" | "Inactive" | "Suspended";

export interface ExpertRecord {
  id: string;
  expertId: string;
  expert: {
    name: string;
    avatar: string;
  };
  contact: {
    phone: string;
    email: string;
  };
  category: string;
  verification: VerificationStatus;
  jobs: number;
  earnings: string;
  status: ExpertStatus;
}

const expertSortOptions: SortOption[] = [
  { label: "Newest Joined", value: "createdAt-desc" },
  { label: "Oldest Joined", value: "createdAt-asc" },
  { label: "Name (A-Z)", value: "fullName-asc" },
  { label: "Name (Z-A)", value: "fullName-desc" },
  { label: "Most Jobs", value: "totalJobs-desc" },
  { label: "Highest Earnings", value: "earnings-desc" },
];

export function ExpertsTable() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "busy" | "inactive" | "suspended"
  >("all");
  const [verificationFilter, setVerificationFilter] = useState<
    "all" | "verified" | "pending" | "rejected"
  >("all");
  const [sortValue, setSortValue] = useState("createdAt-desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 350);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const [sortBy, sortOrder] = useMemo(() => {
    const [field, order] = sortValue.split("-");
    return [
      field as "createdAt" | "fullName" | "totalJobs" | "earnings" | "verificationLevel",
      order as "asc" | "desc",
    ];
  }, [sortValue]);

  const offset = (page - 1) * pageSize;

  const { data, isLoading, isFetching, error, refetch } = useGetExpertsQuery({
    search: debouncedSearch || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    verificationStatus: verificationFilter !== "all" ? verificationFilter : undefined,
    sortBy,
    sortOrder,
    limit: pageSize,
    offset,
  });

  const { expertList, totalCount } = useMemo(() => {
    if (!data) return { expertList: [], totalCount: 0 };

    let items: Expert[] = [];
    let total = 0;

    if (Array.isArray(data.data)) {
      items = data.data;
      total = data.data.length;
    } else if (data.data) {
      items = data.data.experts || data.data.data || data.data.items || [];
      total = data.data.total ?? items.length;
    }

    const mapped: ExpertRecord[] = items.map((e, index) => {
      const rawStatus = (e.status || "active").toLowerCase();
      let status: ExpertStatus = "Active";
      if (rawStatus === "busy") status = "Busy";
      else if (rawStatus === "inactive") status = "Inactive";
      else if (rawStatus === "suspended") status = "Suspended";

      const rawLevel = (e.verificationLevel || "").toUpperCase();
      let verification: VerificationStatus = "Pending";
      if (rawLevel.includes("LEVEL_1") || rawLevel.includes("LEVEL 1")) {
        verification = "Level 1 verified";
      } else if (rawLevel.includes("LEVEL_2") || rawLevel.includes("LEVEL 2")) {
        verification = "Level 2 verified";
      } else if (rawLevel.includes("LEVEL_3") || rawLevel.includes("LEVEL 3")) {
        verification = "Level 3 verified";
      } else if (rawLevel.includes("LEVEL_4") || rawLevel.includes("LEVEL 4")) {
        verification = "Level 4 verified";
      } else if (e.verificationStatus?.toLowerCase() === "verified") {
        verification = "Verified";
      } else if (rawLevel === "UNVERIFIED") {
        verification = "Unverified";
      }

      const earningsNum =
        typeof e.earnings === "number"
          ? e.earnings
          : parseFloat(String(e.earnings || 0));

      const categoryName =
        typeof e.category === "object" && e.category !== null
          ? e.category.name
          : typeof e.category === "string"
          ? e.category
          : "General Services";

      return {
        id: e.id,
        expertId: e.expertId || `#E${String(index + 1).padStart(3, "0")}`,
        expert: {
          name: e.fullName || "Unnamed Expert",
          avatar:
            e.avatar ||
            `https://placehold.co/80x80?text=${encodeURIComponent(
              (e.fullName || "E").charAt(0)
            )}`,
        },
        contact: {
          phone: e.phone || "N/A",
          email: e.email || "N/A",
        },
        category: categoryName,
        verification,
        jobs: e.totalJobs ?? e.jobs ?? 0,
        earnings: `$${earningsNum.toLocaleString()}`,
        status,
      };
    });

    return { expertList: mapped, totalCount: total };
  }, [data]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(expertList.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const renderVerificationBadge = (verification: VerificationStatus) => {
    if (verification === "Pending") {
      return (
        <span className="inline-flex items-center rounded bg-amber-50 px-2.5 py-1 font-['Manrope'] text-xs font-medium text-amber-600 outline outline-1 outline-offset-[-1px] outline-amber-200">
          Pending
        </span>
      );
    }
    if (verification === "Unverified") {
      return (
        <span className="inline-flex items-center rounded bg-slate-50 px-2.5 py-1 font-['Manrope'] text-xs font-medium text-slate-500 outline outline-1 outline-offset-[-1px] outline-slate-200">
          Unverified
        </span>
      );
    }

    return (
      <span className="inline-flex items-center rounded bg-emerald-50 px-2.5 py-1 font-['Manrope'] text-xs font-medium text-emerald-600 outline outline-1 outline-offset-[-1px] outline-emerald-200">
        {verification}
      </span>
    );
  };

  const renderStatusBadge = (status: ExpertStatus) => {
    const config = {
      Active: {
        bg: "bg-sky-50",
        border: "border-sky-200",
        text: "text-sky-600",
        dot: "bg-sky-500",
      },
      Busy: {
        bg: "bg-amber-50",
        border: "border-amber-200",
        text: "text-amber-600",
        dot: "bg-amber-500",
      },
      Inactive: {
        bg: "bg-rose-50",
        border: "border-rose-200",
        text: "text-rose-500",
        dot: "bg-rose-500",
      },
      Suspended: {
        bg: "bg-rose-50",
        border: "border-rose-300",
        text: "text-rose-700",
        dot: "bg-rose-700",
      },
    }[status];

    return (
      <div
        className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold font-['Manrope'] ${config.bg} ${config.border} ${config.text}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
        {status}
      </div>
    );
  };

  const columns: Column<ExpertRecord>[] = [
    {
      key: "checkbox",
      header: (
        <input
          type="checkbox"
          onChange={handleSelectAll}
          checked={
            selectedIds.length === expertList.length && expertList.length > 0
          }
          className="h-4 w-4 cursor-pointer rounded border-slate-300 text-[#0a3558] focus:ring-0"
        />
      ),
      className: "w-12 pl-6 pr-2",
      cell: (item) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(item.id)}
          onChange={() => handleSelectRow(item.id)}
          className="h-4 w-4 cursor-pointer rounded border-slate-300 text-[#0a3558] focus:ring-0"
        />
      ),
    },
    {
      key: "expertId",
      header: "Expert ID",
      className: "min-w-[100px]",
      cell: (item) => (
        <span className="font-['Manrope'] text-sm font-normal leading-6 text-[#103D5C]">
          {item.expertId}
        </span>
      ),
    },
    {
      key: "expert",
      header: "Expert Name",
      className: "min-w-[180px]",
      cell: (item) => (
        <div className="flex items-center gap-2.5">
          <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-amber-400">
            <img
              src={item.expert.avatar}
              alt={item.expert.name}
              className="h-full w-full object-cover"
            />
          </div>
          <span className="font-['Manrope'] text-xs font-medium leading-4 text-[#103D5C]">
            {item.expert.name}
          </span>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      className: "min-w-[200px]",
      cell: (item) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-['Manrope'] text-xs font-medium leading-5 text-[#667085]">
            {item.contact.phone}
          </span>
          <span className="font-['Manrope'] text-[10px] font-medium leading-[10px] text-[#667085]">
            {item.contact.email}
          </span>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      className: "min-w-[180px]",
      cell: (item) => (
        <span className="font-['Manrope'] text-xs font-medium leading-4 text-[#667085]">
          {item.category}
        </span>
      ),
    },
    {
      key: "verification",
      header: "Verification",
      className: "min-w-[150px]",
      cell: (item) => renderVerificationBadge(item.verification),
    },
    {
      key: "jobs",
      header: "Jobs",
      className: "min-w-[80px]",
      cell: (item) => (
        <span className="font-['Manrope'] text-xs font-medium leading-4 text-[#667085]">
          {item.jobs}
        </span>
      ),
    },
    {
      key: "earnings",
      header: "Earnings",
      className: "min-w-[110px]",
      cell: (item) => (
        <span className="font-['Manrope'] text-xs font-medium leading-4 text-[#667085]">
          {item.earnings}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      className: "min-w-[120px]",
      cell: (item) => renderStatusBadge(item.status),
    },
    {
      key: "action",
      header: "Action",
      className: "min-w-[120px] pr-6 text-right",
      cell: (item) => (
        <Link
          href={`/dashboard/experts/${item.id}`}
          className="inline-flex h-8 items-center justify-center rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 font-['Manrope'] leading-3 transition-colors hover:bg-slate-50"
        >
          View Details
        </Link>
      ),
    },
  ];

  const dropdownFilters: DropdownFilter[] = [
    {
      placeholder: "Status",
      value: statusFilter,
      options: [
        { label: "All Status", value: "all" },
        { label: "Active", value: "active" },
        { label: "Busy", value: "busy" },
        { label: "Inactive", value: "inactive" },
        { label: "Suspended", value: "suspended" },
      ],
      onChange: (val) => {
        setStatusFilter(
          val as "all" | "active" | "busy" | "inactive" | "suspended"
        );
        setPage(1);
      },
    },
    {
      placeholder: "Verification",
      value: verificationFilter,
      options: [
        { label: "All Verification", value: "all" },
        { label: "Verified", value: "verified" },
        { label: "Pending", value: "pending" },
        { label: "Rejected", value: "rejected" },
      ],
      onChange: (val) => {
        setVerificationFilter(
          val as "all" | "verified" | "pending" | "rejected"
        );
        setPage(1);
      },
    },
  ];

  return (
    <div>
      <TableToolbar
        searchQuery={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        dropdownFilters={dropdownFilters}
        sortOptions={expertSortOptions}
        onSortClick={() => {}}
        onSortChange={(val) => {
          setSortValue(val);
          setPage(1);
        }}
      />

      {error ? (
        <div className="p-8 text-center bg-white border border-[#E8E8E8] rounded-b-xl">
          <AlertCircle className="mx-auto h-8 w-8 text-red-500 mb-2" />
          <p className="text-sm font-medium text-slate-800">Failed to load experts</p>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Could not retrieve experts data from the server.
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
          <p className="text-xs text-slate-500 font-medium">Loading experts...</p>
        </div>
      ) : expertList.length === 0 ? (
        <div className="p-16 text-center bg-white border border-[#E8E8E8] rounded-b-xl">
          <UserX className="mx-auto h-10 w-10 text-slate-300 mb-2" />
          <p className="text-sm font-semibold text-slate-800">No experts found</p>
          <p className="text-xs text-slate-500 mt-1">
            {searchTerm || statusFilter !== "all" || verificationFilter !== "all"
              ? "Try adjusting your search query or filters."
              : "No expert records are available at the moment."}
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
            data={expertList}
            pagination={true}
            pageSize={pageSize}
            pageSizeOptions={[10, 25, 50, 100]}
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

export default ExpertsTable;