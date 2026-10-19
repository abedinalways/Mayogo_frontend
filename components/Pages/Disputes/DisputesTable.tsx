"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Loader2, AlertCircle, RefreshCw, Scale, ChevronDown } from "lucide-react";
import { Column, DataTable } from "../../shared/DataTable";
import TableToolbar, { DropdownFilter } from "../../shared/TableToolbar";
import { SortOption } from "../../shared/SortDropdown";
import {
  useGetDisputesQuery,
  useAssignDisputeAdminMutation,
  useGetAdminsListQuery,
} from "@/lib/redux/api/disputeApi";
import {
  DisputeItem,
  DisputeTab,
  DisputePriority,
  DisputeCategory,
  DisputeSortBy,
} from "@/types/dispute.types";

export type RiskLevel = "Low" | "Medium" | "High" | "Urgent";
export type DisputeStatus =
  | "Open"
  | "Under Review"
  | "Awaiting Client"
  | "Awaiting Expert"
  | "Resolved"
  | "Rejected";

export interface DisputeRecord {
  id: string;
  ticketId: string;
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
  disputeReason: string;
  riskLevel: RiskLevel;
  dateOpened: string;
  status: DisputeStatus;
  assignedAdmin: string;
  assignedAdminId?: string;
}

const disputeSortOptions: SortOption[] = [
  { label: "Newest First", value: "NEWEST_FIRST" },
  { label: "Oldest First", value: "OLDEST_FIRST" },
  { label: "Ticket Number", value: "TICKET_NUMBER" },
  { label: "Priority (Highest)", value: "PRIORITY_HIGHEST" },
  { label: "Priority (Lowest)", value: "PRIORITY_LOWEST" },
];

const DISPUTE_TABS: { label: string; value: DisputeTab }[] = [
  { label: "All Disputes", value: "ALL" },
  { label: "Open", value: "OPEN" },
  { label: "Under Review", value: "UNDER_REVIEW" },
  { label: "Awaiting Client", value: "AWAITING_CLIENT" },
  { label: "Awaiting Expert", value: "AWAITING_EXPERT" },
  { label: "Resolved", value: "RESOLVED" },
  { label: "Rejected", value: "REJECTED" },
];

function RiskBadge({ level }: { level: RiskLevel }) {
  const styles: Record<RiskLevel, string> = {
    Low: "bg-emerald-50 text-emerald-600 border-emerald-200",
    Medium: "bg-amber-50 text-amber-600 border-amber-200",
    High: "bg-rose-50 text-rose-500 border-rose-200",
    Urgent: "bg-rose-100 text-rose-600 border-rose-300 font-semibold",
  };

  return (
    <span
      className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded text-xs border font-medium ${
        styles[level] || styles.Medium
      }`}
    >
      {level}
    </span>
  );
}

function DisputeStatusBadge({ status }: { status: DisputeStatus }) {
  const config: Record<
    DisputeStatus,
    { dot: string; text: string; bg: string; border: string }
  > = {
    Open: {
      dot: "bg-blue-500",
      text: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
    },
    "Under Review": {
      dot: "bg-amber-500",
      text: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
    },
    "Awaiting Client": {
      dot: "bg-slate-500",
      text: "text-slate-600",
      bg: "bg-slate-50",
      border: "border-slate-200",
    },
    "Awaiting Expert": {
      dot: "bg-slate-500",
      text: "text-slate-600",
      bg: "bg-slate-50",
      border: "border-slate-200",
    },
    Resolved: {
      dot: "bg-emerald-500",
      text: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
    },
    Rejected: {
      dot: "bg-rose-500",
      text: "text-rose-600",
      bg: "bg-rose-50",
      border: "border-rose-200",
    },
  };

  const current = config[status] || config["Under Review"];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border text-nowrap ${current.bg} ${current.border} ${current.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${current.dot}`} />
      {status}
    </span>
  );
}

export function DisputesTable() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentTab, setCurrentTab] = useState<DisputeTab>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortValue, setSortValue] = useState<DisputeSortBy>("NEWEST_FIRST");
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

  const { data, isLoading, isFetching, error, refetch } = useGetDisputesQuery({
    tab: currentTab !== "ALL" ? currentTab : undefined,
    priority: priorityFilter !== "all" ? (priorityFilter as DisputePriority) : undefined,
    category: categoryFilter !== "all" ? (categoryFilter as DisputeCategory) : undefined,
    search: debouncedSearch || undefined,
    sortBy: sortValue,
    limit: pageSize,
    offset,
  });

  const { data: adminsList } = useGetAdminsListQuery();
  const [assignDisputeAdmin] = useAssignDisputeAdminMutation();

  const handleAdminChange = async (ticketId: string, adminId: string) => {
    if (!ticketId || !adminId) return;
    try {
      await assignDisputeAdmin({ ticketId, adminId }).unwrap();
    } catch {
      // handled via RTK Query mutation state
    }
  };

  const { disputeList, totalCount } = useMemo(() => {
    if (!data) return { disputeList: [], totalCount: 0 };

    let items: DisputeItem[] = [];
    let total = 0;

    const payload = (data as unknown) as Record<string, unknown>;
    if (Array.isArray(payload.disputes)) {
      items = payload.disputes as DisputeItem[];
      total = (payload.total as number) ?? items.length;
    } else if (Array.isArray(payload.tickets)) {
      items = payload.tickets as DisputeItem[];
      total = (payload.total as number) ?? items.length;
    } else if (Array.isArray(payload.items)) {
      items = payload.items as DisputeItem[];
      total = (payload.total as number) ?? items.length;
    } else if (Array.isArray(payload.data)) {
      items = payload.data as DisputeItem[];
      total = (payload.total as number) ?? items.length;
    } else if (payload.data && typeof payload.data === "object") {
      const sub = payload.data as Record<string, unknown>;
      items = (sub.disputes || sub.tickets || sub.items || sub.data || []) as DisputeItem[];
      total = (sub.total as number) ?? items.length;
    }

    const mapped: DisputeRecord[] = items.map((item, index) => {
      const rawStatus = (item.status || "OPEN").toUpperCase();
      let status: DisputeStatus = "Open";
      if (rawStatus === "UNDER_REVIEW") status = "Under Review";
      else if (rawStatus === "AWAITING_CLIENT") status = "Awaiting Client";
      else if (rawStatus === "AWAITING_EXPERT") status = "Awaiting Expert";
      else if (rawStatus === "RESOLVED") status = "Resolved";
      else if (rawStatus === "REJECTED" || rawStatus === "CLOSED") status = "Rejected";

      const rawRisk = (item.riskLevel || item.priority || "MEDIUM").toUpperCase();
      let riskLevel: RiskLevel = "Medium";
      if (rawRisk === "LOW") riskLevel = "Low";
      else if (rawRisk === "HIGH") riskLevel = "High";
      else if (rawRisk === "URGENT") riskLevel = "Urgent";

      const clientName = item.client?.fullName || item.client?.name || "Client Name";
      const expertName = item.expert?.fullName || item.expert?.name || "Expert Name";

      let dateOpened = "N/A";
      const rawDate = item.dateOpened || item.createdAt;
      if (rawDate) {
        try {
          dateOpened = new Intl.DateTimeFormat("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }).format(new Date(rawDate));
        } catch {
          dateOpened = rawDate;
        }
      }

      return {
        id: item.id,
        ticketId: item.ticketId || item.ticketNumber || `#DSP-${10480 + index}`,
        jobId: item.jobId ? (item.jobId.startsWith("#") ? item.jobId : `#${item.jobId}`) : `#JB${String(index + 1).padStart(3, "0")}`,
        service: {
          name: item.service?.name || item.subject || "Air Conditioner Repair",
          category: item.service?.category || item.category || "Repair & Diagnostic",
          image:
            item.service?.image ||
            "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=100&auto=format&fit=crop&q=80",
        },
        client: {
          name: clientName,
          avatar:
            item.client?.avatar ||
            item.client?.avatarUrl ||
            `https://placehold.co/80x80?text=${encodeURIComponent(clientName.charAt(0))}`,
        },
        expert: {
          name: expertName,
          avatar:
            item.expert?.avatar ||
            item.expert?.avatarUrl ||
            `https://placehold.co/80x80?text=${encodeURIComponent(expertName.charAt(0))}`,
        },
        disputeReason: item.disputeReason || item.reason || item.category || "Expert Behavior",
        riskLevel,
        dateOpened,
        status,
        assignedAdmin: item.assignedAdmin || "Unassigned",
        assignedAdminId: item.assignedAdminId,
      };
    });

    return { disputeList: mapped, totalCount: total };
  }, [data]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(disputeList.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const columns: Column<DisputeRecord>[] = [
    {
      key: "checkbox",
      header: (
        <input
          type="checkbox"
          onChange={handleSelectAll}
          checked={selectedIds.length === disputeList.length && disputeList.length > 0}
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
      key: "ticketId",
      header: "Ticket ID",
      className: "w-28 min-w-[100px]",
      cell: (item) => (
        <Link
          href={`/dashboard/disputes/${item.id}`}
          className="text-[#103D5C] text-sm font-semibold hover:underline text-nowrap"
        >
          {item.ticketId}
        </Link>
      ),
    },
    {
      key: "jobId",
      header: "Job ID",
      className: "w-28 min-w-[100px]",
      cell: (item) => (
        <Link
          href={`/dashboard/jobs/${item.id}`}
          className="text-[#103D5C] text-sm font-normal underline hover:text-[#0a273b] text-nowrap"
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
            <span className="text-[#103D5C] text-xs font-semibold leading-[160%]">
              {item.service.name}
            </span>
            <span className="text-[#5A5A5A] text-[10px] font-medium leading-[100%]">
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
          <span className="text-[#5A5A5A] text-xs font-medium leading-[124%]">
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
          <span className="text-[#5A5A5A] text-xs font-medium leading-[124%]">
            {item.expert.name}
          </span>
        </div>
      ),
    },
    {
      key: "disputeReason",
      header: "Dispute Reason",
      className: "min-w-[140px]",
      cell: (item) => (
        <span className="text-[#5A5A5A] text-xs font-normal leading-[160%]">
          {item.disputeReason}
        </span>
      ),
    },
    {
      key: "riskLevel",
      header: "Risk Level",
      className: "w-28 min-w-[100px]",
      cell: (item) => <RiskBadge level={item.riskLevel} />,
    },
    {
      key: "dateOpened",
      header: "Date Opened",
      className: "min-w-[120px]",
      cell: (item) => (
        <span className="text-[#5A5A5A] text-xs font-medium leading-[124%] whitespace-nowrap">
          {item.dateOpened}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      className: "min-w-[140px]",
      cell: (item) => <DisputeStatusBadge status={item.status} />,
    },
    {
      key: "assignedAdmin",
      header: "Assigned Admin",
      className: "min-w-[150px]",
      cell: (item) => (
        <div className="relative">
          <select
            defaultValue={item.assignedAdminId || ""}
            onChange={(e) => handleAdminChange(item.id, e.target.value)}
            className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-1.5 pl-3 pr-8 text-xs font-medium text-slate-700 outline-none focus:border-slate-400"
          >
            <option value="">{item.assignedAdmin || "Select Admin"}</option>
            {adminsList &&
              adminsList.map((admin) => (
                <option key={admin.id} value={admin.id}>
                  {admin.fullName || admin.email}
                </option>
              ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        </div>
      ),
    },
    {
      key: "action",
      header: "Action",
      className: "w-28 min-w-[110px] text-center",
      cell: (item) => (
        <Link
          href={`/dashboard/disputes/${item.id}`}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 text-nowrap block"
        >
          View Details
        </Link>
      ),
    },
  ];

  const dropdownFilters: DropdownFilter[] = [
    {
      placeholder: "Priority",
      value: priorityFilter,
      options: [
        { label: "All Priorities", value: "all" },
        { label: "Low", value: "LOW" },
        { label: "Medium", value: "MEDIUM" },
        { label: "High", value: "HIGH" },
        { label: "Urgent", value: "URGENT" },
      ],
      onChange: (val) => {
        setPriorityFilter(val);
        setPage(1);
      },
    },
    {
      placeholder: "Category",
      value: categoryFilter,
      options: [
        { label: "All Categories", value: "all" },
        { label: "Quality Issue", value: "QUALITY_ISSUE" },
        { label: "Service Not Completed", value: "SERVICE_NOT_COMPLETED" },
        { label: "Expert Behavior", value: "EXPERT_BEHAVIOR" },
        { label: "Refund Request", value: "REFUND_REQUEST" },
        { label: "Payment Issue", value: "PAYMENT_ISSUE" },
        { label: "Safety Concern", value: "SAFETY_CONCERN" },
        { label: "General Issue", value: "GENERAL_ISSUE" },
      ],
      onChange: (val) => {
        setCategoryFilter(val);
        setPage(1);
      },
    },
  ];

  return (
    <div className="w-full font-['Manrope']">
      {/* Dispute Tab Bar */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 pb-2 mb-3">
        {DISPUTE_TABS.map((tab) => (
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

      {/* Top Controls Toolbar */}
      <TableToolbar
        searchQuery={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        dropdownFilters={dropdownFilters}
        sortOptions={disputeSortOptions}
        onSortClick={() => {}}
        onSortChange={(val) => {
          setSortValue(val as DisputeSortBy);
          setPage(1);
        }}
      />

      {error ? (
        <div className="p-8 text-center bg-white border border-[#E8E8E8] rounded-b-xl">
          <AlertCircle className="mx-auto h-8 w-8 text-red-500 mb-2" />
          <p className="text-sm font-medium text-slate-800">Failed to load disputes</p>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Could not retrieve dispute cases from the server.
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
          <p className="text-xs text-slate-500 font-medium">Loading disputes...</p>
        </div>
      ) : disputeList.length === 0 ? (
        <div className="p-16 text-center bg-white border border-[#E8E8E8] rounded-b-xl">
          <Scale className="mx-auto h-10 w-10 text-slate-300 mb-2" />
          <p className="text-sm font-semibold text-slate-800">No disputes found</p>
          <p className="text-xs text-slate-500 mt-1">
            {searchTerm || currentTab !== "ALL" || priorityFilter !== "all" || categoryFilter !== "all"
              ? "Try adjusting your search query, priority, category or tab filters."
              : "No dispute cases have been raised yet."}
          </p>
        </div>
      ) : (
        <div className="relative border-x border-b border-[#E8E8E8] rounded-b-xl overflow-hidden bg-white">
          {isFetching && (
            <div className="absolute top-2 right-4 z-10 flex items-center gap-1.5 px-2 py-1 bg-white/90 backdrop-blur rounded shadow-sm border text-[11px] text-slate-600">
              <Loader2 className="h-3 w-3 animate-spin text-[#103D5C]" />
              <span>Updating...</span>
            </div>
          )}
          <DataTable
            columns={columns}
            data={disputeList}
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

export default DisputesTable;