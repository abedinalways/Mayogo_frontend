"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ChevronDown, AlertCircle, Loader2, RefreshCw, LifeBuoy } from "lucide-react";
import { Column, DataTable } from "../../shared/DataTable";
import TableToolbar, { DropdownFilter } from "../../shared/TableToolbar";
import {
  useGetSupportTicketsQuery,
  useAssignSupportTicketAdminMutation,
} from "@/lib/redux/api/supportApi";
import { useGetAdminsListQuery } from "@/lib/redux/api/disputeApi";
import {
  SupportTicketItem,
  SupportTicketStatus,
  SupportTicketPriority,
  SupportTicketCategory,
} from "@/types/support.types";

export type TicketStatus = "Open" | "Resolved" | "Under Review" | "Closed";
export type PriorityLevel = "Low" | "Medium" | "High" | "Urgent";

export interface TicketRecord {
  id: string;
  ticketId: string;
  category: string;
  user: {
    name: string;
    avatar: string;
  };
  role: "Client" | "Expert";
  reason: string;
  status: TicketStatus;
  priority: PriorityLevel;
  assignedAdmin: string;
  assignedAdminId?: string;
}

const SUPPORT_TABS: { label: string; value: string }[] = [
  { label: "All Tickets", value: "ALL" },
  { label: "Open", value: "OPEN" },
  { label: "Under Review", value: "UNDER_REVIEW" },
  { label: "Resolved", value: "RESOLVED" },
  { label: "Closed", value: "CLOSED" },
];

export function SupportTicketsTable() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [currentTab, setCurrentTab] = useState<string>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 350);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const offset = (page - 1) * pageSize;

  const { data, isLoading, isFetching, error, refetch } = useGetSupportTicketsQuery({
    status: currentTab !== "ALL" ? (currentTab as SupportTicketStatus) : undefined,
    priority: priorityFilter !== "all" ? (priorityFilter as SupportTicketPriority) : undefined,
    category: categoryFilter !== "all" ? (categoryFilter as SupportTicketCategory) : undefined,
    search: debouncedSearch || undefined,
    limit: pageSize,
    offset,
  });

  const { data: adminsList } = useGetAdminsListQuery();
  const [assignAdmin] = useAssignSupportTicketAdminMutation();

  const handleAdminChange = async (ticketId: string, adminId: string) => {
    if (!ticketId || !adminId) return;
    try {
      await assignAdmin({ ticketId, adminId }).unwrap();
    } catch {
      // handled via mutation
    }
  };

  const { ticketList, totalCount } = useMemo(() => {
    if (!data) return { ticketList: [], totalCount: 0 };

    let items: SupportTicketItem[] = [];
    let total = 0;

    const payload = (data as unknown) as Record<string, unknown>;
    if (Array.isArray(payload.tickets)) {
      items = payload.tickets as SupportTicketItem[];
      total = (payload.total as number) ?? items.length;
    } else if (Array.isArray(payload.data)) {
      items = payload.data as SupportTicketItem[];
      total = (payload.total as number) ?? items.length;
    } else if (Array.isArray(payload.items)) {
      items = payload.items as SupportTicketItem[];
      total = (payload.total as number) ?? items.length;
    } else if (payload.data && typeof payload.data === "object") {
      const sub = payload.data as Record<string, unknown>;
      items = (sub.tickets || sub.items || sub.data || []) as SupportTicketItem[];
      total = (sub.total as number) ?? items.length;
    }

    const mapped: TicketRecord[] = items.map((ticket, index) => {
      const rawStatus = (ticket.status || "OPEN").toUpperCase();
      let status: TicketStatus = "Open";
      if (rawStatus === "UNDER_REVIEW") status = "Under Review";
      else if (rawStatus === "RESOLVED") status = "Resolved";
      else if (rawStatus === "CLOSED") status = "Closed";

      const rawPriority = (ticket.priority || "MEDIUM").toUpperCase();
      let priority: PriorityLevel = "Medium";
      if (rawPriority === "LOW") priority = "Low";
      else if (rawPriority === "HIGH") priority = "High";
      else if (rawPriority === "URGENT") priority = "Urgent";

      const userName =
        ticket.user?.fullName ||
        ticket.user?.name ||
        ticket.client?.fullName ||
        ticket.client?.name ||
        ticket.expert?.fullName ||
        ticket.expert?.name ||
        "Daniel Green";

      const rawRole = (ticket.role || ticket.user?.role || "CLIENT").toUpperCase();
      const role: "Client" | "Expert" = rawRole.includes("EXPERT") ? "Expert" : "Client";

      return {
        id: ticket.id,
        ticketId: ticket.ticketId || ticket.ticketNumber || `#TKT-${10480 + index}`,
        category: ticket.category || "General Issue",
        user: {
          name: userName,
          avatar:
            ticket.user?.avatar ||
            ticket.user?.avatarUrl ||
            ticket.client?.avatar ||
            ticket.expert?.avatar ||
            `https://placehold.co/80x80?text=${encodeURIComponent(userName.charAt(0))}`,
        },
        role,
        reason: ticket.reason || ticket.subject || ticket.description || "Service request query",
        status,
        priority,
        assignedAdmin: ticket.assignedAdmin || "Unassigned",
        assignedAdminId: ticket.assignedAdminId,
      };
    });

    return { ticketList: mapped, totalCount: total };
  }, [data]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const renderStatusBadge = (status: TicketStatus) => {
    const config: Record<
      TicketStatus,
      { bg: string; border: string; text: string; dot: string }
    > = {
      Open: {
        bg: "bg-sky-50",
        border: "border-sky-200",
        text: "text-sky-600",
        dot: "bg-sky-500",
      },
      Resolved: {
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        text: "text-emerald-600",
        dot: "bg-emerald-500",
      },
      "Under Review": {
        bg: "bg-amber-50",
        border: "border-amber-200",
        text: "text-amber-600",
        dot: "bg-amber-500",
      },
      Closed: {
        bg: "bg-slate-50",
        border: "border-slate-200",
        text: "text-slate-600",
        dot: "bg-slate-400",
      },
    };

    const cur = config[status] || config.Open;

    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium text-nowrap ${cur.bg} ${cur.border} ${cur.text}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${cur.dot}`} />
        {status}
      </div>
    );
  };

  const renderPriorityBadge = (priority: PriorityLevel) => {
    const config: Record<
      PriorityLevel,
      { bg: string; border: string; text: string; dot: string }
    > = {
      Low: {
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        text: "text-emerald-600",
        dot: "bg-emerald-500",
      },
      Medium: {
        bg: "bg-amber-50",
        border: "border-amber-200",
        text: "text-amber-600",
        dot: "bg-amber-500",
      },
      High: {
        bg: "bg-rose-50",
        border: "border-rose-200",
        text: "text-rose-500",
        dot: "bg-rose-500",
      },
      Urgent: {
        bg: "bg-rose-100",
        border: "border-rose-300",
        text: "text-rose-600",
        dot: "bg-rose-600",
      },
    };

    const cur = config[priority] || config.Medium;

    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium text-nowrap ${cur.bg} ${cur.border} ${cur.text}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${cur.dot}`} />
        {priority}
      </div>
    );
  };

  const columns: Column<TicketRecord>[] = [
    {
      key: "ticketId",
      header: "Ticket ID",
      className: "min-w-[120px] pl-6",
      cell: (item) => (
        <Link
          href={`/dashboard/support-ticket/${item.id}`}
          className="text-[#103D5C] text-sm font-semibold hover:underline"
        >
          {item.ticketId}
        </Link>
      ),
    },
    {
      key: "category",
      header: "Category",
      className: "min-w-[140px]",
      cell: (item) => (
        <span className="text-[#103D5C] text-sm font-normal underline">
          {item.category}
        </span>
      ),
    },
    {
      key: "user",
      header: "User Name",
      className: "min-w-[160px]",
      cell: (item) => (
        <div className="flex items-center gap-2.5">
          <img
            src={item.user.avatar}
            alt={item.user.name}
            className="h-8 w-8 rounded-full border border-amber-400 object-cover"
          />
          <span className="text-[#103D5C] text-xs font-medium">
            {item.user.name}
          </span>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      className: "min-w-[90px]",
      cell: (item) => (
        <span className="text-xs font-normal text-slate-500">{item.role}</span>
      ),
    },
    {
      key: "reason",
      header: "Reason",
      className: "min-w-[160px]",
      cell: (item) => (
        <span className="text-xs font-normal text-slate-500 truncate max-w-[150px] block">
          {item.reason}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      className: "min-w-[130px]",
      cell: (item) => renderStatusBadge(item.status),
    },
    {
      key: "priority",
      header: "Priority",
      className: "min-w-[110px]",
      cell: (item) => renderPriorityBadge(item.priority),
    },
    {
      key: "assignedAdmin",
      header: "Assigned Admin",
      className: "min-w-[170px]",
      cell: (item) => (
        <div className="relative inline-block w-full max-w-[150px]">
          <select
            defaultValue={item.assignedAdminId || ""}
            onChange={(e) => handleAdminChange(item.id, e.target.value)}
            className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-1.5 pr-8 text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0a3558] cursor-pointer"
          >
            <option value="">{item.assignedAdmin || "Select Admin"}</option>
            {adminsList &&
              adminsList.map((admin) => (
                <option key={admin.id} value={admin.id}>
                  {admin.fullName || admin.email}
                </option>
              ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
        </div>
      ),
    },
    {
      key: "action",
      header: "Action",
      className: "min-w-[90px] pr-6 text-right",
      cell: (item) => (
        <Link
          href={`/dashboard/support-ticket/${item.id}`}
          className="inline-block rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
        >
          Open
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
        { label: "General Issue", value: "GENERAL_ISSUE" },
        { label: "Raise Dispute", value: "RAISE_DISPUTE" },
        { label: "Service Incomplete", value: "SERVICE_NOT_COMPLETED" },
        { label: "Quality Issue", value: "QUALITY_ISSUE" },
        { label: "Expert Behavior", value: "EXPERT_BEHAVIOR" },
        { label: "Safety Concern", value: "SAFETY_CONCERN" },
        { label: "Refund Request", value: "REFUND_REQUEST" },
        { label: "Payment Issue", value: "PAYMENT_ISSUE" },
      ],
      onChange: (val) => {
        setCategoryFilter(val);
        setPage(1);
      },
    },
  ];

  return (
    <div className="w-full font-['Manrope']">
      {/* Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 pb-2 mb-3">
        {SUPPORT_TABS.map((tab) => (
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
      />

      {error ? (
        <div className="p-8 text-center bg-white border border-[#E8E8E8] rounded-b-xl">
          <AlertCircle className="mx-auto h-8 w-8 text-red-500 mb-2" />
          <p className="text-sm font-medium text-slate-800">Failed to load tickets</p>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Could not retrieve support tickets from the server.
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
          <p className="text-xs text-slate-500 font-medium">Loading tickets...</p>
        </div>
      ) : ticketList.length === 0 ? (
        <div className="p-16 text-center bg-white border border-[#E8E8E8] rounded-b-xl">
          <LifeBuoy className="mx-auto h-10 w-10 text-slate-300 mb-2" />
          <p className="text-sm font-semibold text-slate-800">No tickets found</p>
          <p className="text-xs text-slate-500 mt-1">
            {searchTerm || currentTab !== "ALL" || priorityFilter !== "all" || categoryFilter !== "all"
              ? "Try adjusting your search query, status, or category filter."
              : "No support tickets have been opened yet."}
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
            data={ticketList}
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

export default SupportTicketsTable;