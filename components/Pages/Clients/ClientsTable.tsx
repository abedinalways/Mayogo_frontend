"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Loader2, AlertCircle, RefreshCw, UserX } from "lucide-react";
import { Column, DataTable } from "../../shared/DataTable";
import TableToolbar, { DropdownFilter } from "../../shared/TableToolbar";
import { SortOption } from "../../shared/SortDropdown";
import { useGetClientsQuery } from "@/lib/redux/api/clientApi";
import { Client } from "@/types/client.types";

export type ClientStatus = "Active" | "Inactive" | "Suspended";

export interface ClientRecord {
  id: string;
  clientId: string;
  client: {
    name: string;
    avatar: string;
  };
  contact: {
    phone: string;
    email: string;
  };
  jobRequested: number;
  totalSpent: string;
  joined: string;
  status: ClientStatus;
}

const clientSortOptions: SortOption[] = [
  { label: "Newest Joined", value: "createdAt-desc" },
  { label: "Oldest Joined", value: "createdAt-asc" },
  { label: "Name (A-Z)", value: "fullName-asc" },
  { label: "Name (Z-A)", value: "fullName-desc" },
  { label: "Highest Spent", value: "totalSpent-desc" },
  { label: "Most Jobs", value: "jobRequested-desc" },
];

export function ClientsTable() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
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
      field as "createdAt" | "fullName" | "totalSpent" | "jobRequested",
      order as "asc" | "desc",
    ];
  }, [sortValue]);

  const offset = (page - 1) * pageSize;

  const { data, isLoading, isFetching, error, refetch } = useGetClientsQuery({
    search: debouncedSearch || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    sortBy,
    sortOrder,
    limit: pageSize,
    offset,
  });

  const { clientList, totalCount } = useMemo(() => {
    if (!data) return { clientList: [], totalCount: 0 };

    let items: Client[] = [];
    let total = 0;

    if (Array.isArray(data.data)) {
      items = data.data;
      total = data.data.length;
    } else if (data.data) {
      items = data.data.clients || data.data.data || data.data.items || [];
      total = data.data.total ?? items.length;
    }

    const mapped: ClientRecord[] = items.map((c, index) => {
      const active = c.isActive ?? (c.status?.toLowerCase() === "active");
      const status: ClientStatus = active ? "Active" : "Inactive";
      const totalSpentNum = typeof c.totalSpent === "number" ? c.totalSpent : parseFloat(String(c.totalSpent || 0));

      let formattedDate = "N/A";
      if (c.createdAt) {
        try {
          formattedDate = new Intl.DateTimeFormat("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }).format(new Date(c.createdAt));
        } catch {
          formattedDate = c.createdAt;
        }
      }

      return {
        id: c.id,
        clientId: c.clientId || `#C${String(index + 1).padStart(3, "0")}`,
        client: {
          name: c.fullName || "Unnamed Client",
          avatar:
            c.avatar ||
            `https://placehold.co/80x80?text=${encodeURIComponent(
              (c.fullName || "C").charAt(0)
            )}`,
        },
        contact: {
          phone: c.phone || "N/A",
          email: c.email || "N/A",
        },
        jobRequested: c.jobRequested ?? c.totalJobs ?? 0,
        totalSpent: `$${totalSpentNum.toLocaleString()}`,
        joined: formattedDate,
        status,
      };
    });

    return { clientList: mapped, totalCount: total };
  }, [data]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(clientList.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const renderStatusBadge = (status: ClientStatus) => {
    const config = {
      Active: {
        bg: "bg-sky-50",
        border: "border-sky-200",
        text: "text-sky-600",
        dot: "bg-sky-500",
      },
      Inactive: {
        bg: "bg-rose-50",
        border: "border-rose-200",
        text: "text-rose-500",
        dot: "bg-rose-500",
      },
      Suspended: {
        bg: "bg-amber-50",
        border: "border-amber-200",
        text: "text-amber-600",
        dot: "bg-amber-500",
      },
    }[status];

    return (
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md border text-xs font-semibold ${config.bg} ${config.border} ${config.text}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
        {status}
      </div>
    );
  };

  const columns: Column<ClientRecord>[] = [
    {
      key: "checkbox",
      header: (
        <input
          type="checkbox"
          onChange={handleSelectAll}
          checked={
            selectedIds.length === clientList.length && clientList.length > 0
          }
          className="h-4 w-4 rounded border-slate-300 text-[#0a3558] focus:ring-0 cursor-pointer"
        />
      ),
      className: "w-12 pl-6 pr-2",
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
      key: "clientId",
      header: "Client ID",
      className: "min-w-[100px]",
      cell: (item) => (
        <span className="text-sm font-normal text-[#103D5C] font-['Manrope'] leading-6">
          {item.clientId}
        </span>
      ),
    },
    {
      key: "client",
      header: "Client Name",
      className: "min-w-[180px]",
      cell: (item) => (
        <div className="flex items-center gap-2.5">
          <img
            src={item.client.avatar}
            alt={item.client.name}
            className="h-8 w-8 rounded-full border border-amber-400 object-cover shrink-0"
          />
          <span className="text-xs font-medium text-[#103D5C] font-['Manrope'] leading-4">
            {item.client.name}
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
          <span className="text-xs font-medium text-[#667085] font-['Manrope'] leading-5">
            {item.contact.phone}
          </span>
          <span className="text-[10px] font-medium text-[#667085] font-['Manrope'] leading-[10px]">
            {item.contact.email}
          </span>
        </div>
      ),
    },
    {
      key: "jobRequested",
      header: "Job Requested",
      className: "min-w-[130px]",
      cell: (item) => (
        <span className="text-xs font-medium text-[#667085] font-['Manrope'] leading-4">
          {item.jobRequested}
        </span>
      ),
    },
    {
      key: "totalSpent",
      header: "Total Spent",
      className: "min-w-[120px]",
      cell: (item) => (
        <span className="text-xs font-medium text-[#667085] font-['Manrope'] leading-4">
          {item.totalSpent}
        </span>
      ),
    },
    {
      key: "joined",
      header: "Joined",
      className: "min-w-[130px]",
      cell: (item) => (
        <span className="text-xs font-medium text-[#667085] font-['Manrope'] leading-4 whitespace-nowrap">
          {item.joined}
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
          href={`/dashboard/clients/${item.id}`}
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
        { label: "Inactive", value: "inactive" },
      ],
      onChange: (val) => {
        setStatusFilter(val as "all" | "active" | "inactive");
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
        sortOptions={clientSortOptions}
        onSortClick={() => {}}
        onSortChange={(val) => {
          setSortValue(val);
          setPage(1);
        }}
      />

      {error ? (
        <div className="p-8 text-center bg-white border border-[#E8E8E8] rounded-b-xl">
          <AlertCircle className="mx-auto h-8 w-8 text-red-500 mb-2" />
          <p className="text-sm font-medium text-slate-800">Failed to load clients</p>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Could not retrieve clients data from the server.
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
          <p className="text-xs text-slate-500 font-medium">Loading clients...</p>
        </div>
      ) : clientList.length === 0 ? (
        <div className="p-16 text-center bg-white border border-[#E8E8E8] rounded-b-xl">
          <UserX className="mx-auto h-10 w-10 text-slate-300 mb-2" />
          <p className="text-sm font-semibold text-slate-800">No clients found</p>
          <p className="text-xs text-slate-500 mt-1">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your search query or status filter."
              : "No client records are available at the moment."}
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
            data={clientList}
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

export default ClientsTable;