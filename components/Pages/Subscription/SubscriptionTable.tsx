"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Eye,
  RefreshCw,
  XCircle,
} from "lucide-react";

export type SubscriptionPlan = "Free Plan" | "Premium Plan";
export type SubscriptionStatus = "Active" | "Cancelled" | "Expired";

export interface SubscriptionRecord {
  id: string;
  expert: {
    name: string;
    avatar: string;
  };
  currentlyPlan: SubscriptionPlan;
  startDate: string;
  expiryDate: string;
  status: SubscriptionStatus;
}

const sampleSubscriptions: SubscriptionRecord[] = [
  {
    id: "1",
    expert: {
      name: "Sarah William",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    },
    currentlyPlan: "Free Plan",
    startDate: "12 Jul, 2026",
    expiryDate: "12 Jul, 2026",
    status: "Active",
  },
  {
    id: "2",
    expert: {
      name: "Sarah William",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    },
    currentlyPlan: "Premium Plan",
    startDate: "12 Jul, 2026",
    expiryDate: "12 Jul, 2026",
    status: "Active",
  },
  {
    id: "3",
    expert: {
      name: "Sarah William",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    },
    currentlyPlan: "Free Plan",
    startDate: "12 Jul, 2026",
    expiryDate: "12 Jul, 2026",
    status: "Active",
  },
  {
    id: "4",
    expert: {
      name: "Sarah William",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    },
    currentlyPlan: "Premium Plan",
    startDate: "12 Jul, 2026",
    expiryDate: "12 Jul, 2026",
    status: "Cancelled",
  },
  {
    id: "5",
    expert: {
      name: "Sarah William",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    },
    currentlyPlan: "Free Plan",
    startDate: "12 Jul, 2026",
    expiryDate: "12 Jul, 2026",
    status: "Active",
  },
  {
    id: "6",
    expert: {
      name: "Sarah William",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    },
    currentlyPlan: "Free Plan",
    startDate: "12 Jul, 2026",
    expiryDate: "12 Jul, 2026",
    status: "Active",
  },
  {
    id: "7",
    expert: {
      name: "Sarah William",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    },
    currentlyPlan: "Premium Plan",
    startDate: "12 Jul, 2026",
    expiryDate: "12 Jul, 2026",
    status: "Expired",
  },
  {
    id: "8",
    expert: {
      name: "Sarah William",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    },
    currentlyPlan: "Free Plan",
    startDate: "12 Jul, 2026",
    expiryDate: "12 Jul, 2026",
    status: "Active",
  },
  {
    id: "9",
    expert: {
      name: "Sarah William",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    },
    currentlyPlan: "Premium Plan",
    startDate: "12 Jul, 2026",
    expiryDate: "12 Jul, 2026",
    status: "Expired",
  },
  {
    id: "10",
    expert: {
      name: "Sarah William",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    },
    currentlyPlan: "Free Plan",
    startDate: "12 Jul, 2026",
    expiryDate: "12 Jul, 2026",
    status: "Active",
  },
  {
    id: "11",
    expert: {
      name: "Sarah William",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    },
    currentlyPlan: "Free Plan",
    startDate: "12 Jul, 2026",
    expiryDate: "12 Jul, 2026",
    status: "Active",
  },
];

const statusOptions: { label: string; value: string }[] = [
  { label: "All Status", value: "all" },
  { label: "Active", value: "active" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Expired", value: "expired" },
];

export function SubscriptionTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);

  // Close popups on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target as Node)
      ) {
        setIsStatusOpen(false);
      }
      if (
        actionMenuRef.current &&
        !actionMenuRef.current.contains(event.target as Node)
      ) {
        setActiveMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter subscriptions
  const filteredSubscriptions = sampleSubscriptions.filter((item) => {
    const matchesSearch =
      item.expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.currentlyPlan.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" ||
      item.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredSubscriptions.length / pageSize) || 1;
  const paginatedData = filteredSubscriptions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const renderStatusBadge = (status: SubscriptionStatus) => {
    const config = {
      Active: {
        bg: "bg-[#EBF5FF]",
        border: "border-[#B9E6FE]",
        text: "text-[#0284C7]",
        dot: "bg-[#0284C7]",
      },
      Cancelled: {
        bg: "bg-[#FEF3F2]",
        border: "border-[#FECDCA]",
        text: "text-[#F04438]",
        dot: "bg-[#F04438]",
      },
      Expired: {
        bg: "bg-[#FEFBE8]",
        border: "border-[#FDE68A]",
        text: "text-[#D97706]",
        dot: "bg-[#D97706]",
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

  const selectedStatusLabel =
    statusOptions.find((opt) => opt.value === selectedStatus)?.label ??
    "All Status";

  return (
    <div className="w-full">
      {/* Top Toolbar Container */}
      <div className="flex w-full flex-wrap items-center justify-between gap-4 rounded-t-xl border border-b-0 border-[#e4ebf1] bg-white p-4 font-['Manrope']">
        {/* Left: Heading */}
        <h2 className="text-[color:var(--Deep-Navy-Brand-800,#103D5C)] text-lg font-semibold leading-[132%]">
          Active Subscribers
        </h2>

        {/* Right: Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative flex h-10 w-48 sm:w-60 items-center rounded-lg border border-[#e4ebf1] bg-white px-3 py-2 transition-colors focus-within:border-slate-300">
            <Search className="h-4 w-4 shrink-0 text-[#9aaab5]" />
            <input
              type="text"
              placeholder="Search Clients"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="ml-2 w-full bg-transparent text-xs font-normal text-[#0f3453] placeholder:text-[#9aaab5] outline-none"
            />
          </div>

          {/* Status Dropdown */}
          <div className="relative" ref={statusDropdownRef}>
            <button
              type="button"
              onClick={() => setIsStatusOpen(!isStatusOpen)}
              className="flex h-10 items-center gap-2 rounded-lg border border-[#e4ebf1] bg-white px-3.5 py-2 text-xs font-medium text-[#103D5C] transition-colors hover:bg-slate-50 focus:outline-none"
            >
              <span>{selectedStatusLabel}</span>
              <ChevronDown
                className={`h-4 w-4 text-[#9aaab5] transition-transform duration-200 ${
                  isStatusOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isStatusOpen && (
              <div className="absolute right-0 z-30 mt-1.5 w-40 origin-top-right rounded-lg border border-[#e4ebf1] bg-white p-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setSelectedStatus(option.value);
                      setIsStatusOpen(false);
                      setCurrentPage(1);
                    }}
                    className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                      selectedStatus === option.value
                        ? "bg-slate-50 font-semibold text-[#0284C7]"
                        : "text-[#103D5C] hover:bg-slate-50"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="w-full overflow-hidden rounded-b-xl border border-[#e4ebf1] bg-white shadow-[0_2px_4px_-1px_rgba(13,13,18,0.06)]">
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="h-12 border-b border-[#e4ebf1] [background:var(--Card-bg,rgba(16,61,92,0.06))]">
                <th className="px-6 py-3 font-['Manrope'] text-sm font-semibold leading-6 text-[#5A5A5A]">
                  Expert Name
                </th>
                <th className="px-6 py-3 font-['Manrope'] text-sm font-semibold leading-6 text-[#5A5A5A]">
                  Currently Plan
                </th>
                <th className="px-6 py-3 font-['Manrope'] text-sm font-semibold leading-6 text-[#5A5A5A]">
                  Start Date
                </th>
                <th className="px-6 py-3 font-['Manrope'] text-sm font-semibold leading-6 text-[#5A5A5A]">
                  Expiry Date
                </th>
                <th className="px-6 py-3 font-['Manrope'] text-sm font-semibold leading-6 text-[#5A5A5A]">
                  Status
                </th>
                <th className="w-24 px-6 py-3 text-center font-['Manrope'] text-sm font-semibold leading-6 text-[#5A5A5A]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#e4ebf1]">
              {paginatedData.length > 0 ? (
                paginatedData.map((row) => (
                  <tr
                    key={row.id}
                    className="h-16 transition-colors hover:bg-slate-50/60"
                  >
                    {/* Expert Name */}
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-amber-400">
                          <Image
                            src={row.expert.avatar}
                            alt={row.expert.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-['Manrope'] text-xs font-medium leading-4 text-[#103D5C]">
                          {row.expert.name}
                        </span>
                      </div>
                    </td>

                    {/* Currently Plan */}
                    <td className="px-6 py-3">
                      <span className="cursor-pointer font-['Manrope'] text-xs font-medium leading-4 text-[#1570EF] hover:underline">
                        {row.currentlyPlan}
                      </span>
                    </td>

                    {/* Start Date */}
                    <td className="px-6 py-3">
                      <span className="font-['Manrope'] text-xs font-normal leading-4 text-[#667085]">
                        {row.startDate}
                      </span>
                    </td>

                    {/* Expiry Date */}
                    <td className="px-6 py-3">
                      <span className="font-['Manrope'] text-xs font-normal leading-4 text-[#667085]">
                        {row.expiryDate}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-3">
                      {renderStatusBadge(row.status)}
                    </td>

                    {/* Actions */}
                    <td className="relative px-6 py-3 text-center">
                      <div className="relative inline-block text-left">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveMenuId(
                              activeMenuId === row.id ? null : row.id,
                            )
                          }
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-amber-500 transition-colors hover:bg-slate-50 focus:outline-none"
                          aria-label="Actions"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>

                        {/* Action Menu Dropdown */}
                        {activeMenuId === row.id && (
                          <div
                            ref={actionMenuRef}
                            className="absolute right-0 z-40 mt-1 w-44 origin-top-right rounded-lg border border-[#e4ebf1] bg-white p-1 shadow-lg ring-1 ring-black/5 focus:outline-none"
                          >
                            <button
                              type="button"
                              onClick={() => setActiveMenuId(null)}
                              className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
                            >
                              <Eye className="h-3.5 w-3.5 text-slate-500" />
                              View Details
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveMenuId(null)}
                              className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
                            >
                              <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
                              Upgrade Plan
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveMenuId(null)}
                              className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50"
                            >
                              <XCircle className="h-3.5 w-3.5 text-rose-500" />
                              Cancel Subscription
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center font-['Manrope'] text-sm text-slate-400"
                  >
                    No subscriptions found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Optional Pagination Footer */}
        {filteredSubscriptions.length > pageSize && (
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#e4ebf1] bg-white p-4 font-['Manrope']">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-[#123e5e]">
                Show items
              </span>
              <div className="relative flex items-center">
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="h-9 appearance-none rounded-lg border border-[#e4ebf1] bg-white pl-3 pr-8 text-sm font-medium text-[#123e5e] outline-none focus:border-slate-300"
                >
                  {[10, 25, 50].map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e4ebf1] text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <span className="px-2 text-xs font-medium text-slate-600">
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e4ebf1] text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SubscriptionTable;
