"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Search, MoreVertical, Eye, RefreshCw, XCircle } from "lucide-react";
import { Column, DataTable } from "../../shared/DataTable";
import CustomSelect, { CustomSelectOption } from "../../shared/CustomSelect";

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
    currentlyPlan: "Premium Plan",
    startDate: "12 Jul, 2026",
    expiryDate: "12 Jul, 2026",
    status: "Cancelled",
  },
  {
    id: "4",
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
    id: "5",
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
];

const statusOptions: CustomSelectOption[] = [
  { label: "All Status", value: "all" },
  { label: "Active", value: "active" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Expired", value: "expired" },
];

export function SubscriptionTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const actionMenuRef = useRef<HTMLDivElement>(null);

  // Close action popup on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
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

  const columns: Column<SubscriptionRecord>[] = [
    {
      key: "expert",
      header: "Expert Name",
      className: "min-w-[180px] pl-6",
      cell: (item) => (
        <div className="flex items-center gap-3">
          <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-amber-400">
            <Image
              src={item.expert.avatar}
              alt={item.expert.name}
              fill
              className="object-cover"
            />
          </div>
          <span className="font-['Manrope'] text-xs font-medium leading-4 text-[#103D5C]">
            {item.expert.name}
          </span>
        </div>
      ),
    },
    {
      key: "currentlyPlan",
      header: "Currently Plan",
      className: "min-w-[150px]",
      cell: (item) => (
        <span className="cursor-pointer font-['Manrope'] text-xs font-medium leading-4  hover:underline">
          {item.currentlyPlan}
        </span>
      ),
    },
    {
      key: "startDate",
      header: "Start Date",
      className: "min-w-[140px]",
      cell: (item) => (
        <span className="font-['Manrope'] text-xs font-normal leading-4 text-[#667085]">
          {item.startDate}
        </span>
      ),
    },
    {
      key: "expiryDate",
      header: "Expiry Date",
      className: "min-w-[140px]",
      cell: (item) => (
        <span className="font-['Manrope'] text-xs font-normal leading-4 text-[#667085]">
          {item.expiryDate}
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
      key: "actions",
      header: "Actions",
      className: "w-24 min-w-[96px] pr-6 text-center",
      cell: (item) => (
        <div className="relative inline-block text-left">
          <button
            type="button"
            onClick={() =>
              setActiveMenuId(activeMenuId === item.id ? null : item.id)
            }
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-amber-500 transition-colors hover:bg-slate-50 focus:outline-none"
            aria-label="Actions"
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {/* Action Menu Dropdown */}
          {activeMenuId === item.id && (
            <div
              ref={actionMenuRef}
              className="absolute right-0 z-40 mt-1 w-44 flex flex-col gap-2 p-3 origin-top-right rounded-lg border border-[#e4ebf1] bg-white p-1 shadow-lg ring-1 ring-black/5 focus:outline-none"
            >
              <button
                type="button"
                onClick={() => setActiveMenuId(null)}
                className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium bg-[#EDF2F6] text-[#103D5C] transition-colors hover:bg-[#103D5C] hover:text-white"
              >
                View Profile
              </button>
              <button
                type="button"
                onClick={() => setActiveMenuId(null)}
                className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium bg-[#EDF2F6] text-[#103D5C] transition-colors hover:bg-[#103D5C] hover:text-white"
              >
                Suspend
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="w-full font-['Manrope']">
      {/* Top Toolbar Container */}
      <div className="flex w-full flex-wrap items-center justify-between gap-4 rounded-t-xl border border-b-0 border-[#e4ebf1] bg-white p-4 font-['Manrope']">
        {/* Left: Heading */}
        <h2 className="text-[color:var(--Deep-Navy-Brand-800,#103D5C)] text-lg font-semibold leading-[132%]">
          Active Subscribers
        </h2>

        {/* Right: Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <label className="flex h-10 w-44 sm:w-60 items-center gap-2 rounded-lg border border-[#e4ebf1] bg-white px-3 py-2 transition-colors focus-within:border-slate-300">
            <span className="sr-only">Search Clients</span>
            <Search className="h-4 w-4 shrink-0 text-[#9aaab5]" />
            <input
              type="text"
              placeholder="Search Clients"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-xs font-normal text-[#0f3453] placeholder:text-[#9aaab5] outline-none"
            />
          </label>

          {/* Custom Select for Status Filter */}
          <div className="w-36">
            <CustomSelect
              options={statusOptions}
              value={selectedStatus}
              onValueChange={(value) => setSelectedStatus(value)}
              placeholder="All Status"
              containerClassName="w-36"
              triggerClassName="h-10 text-xs font-medium border-[#e4ebf1] text-[#103D5C] rounded-lg bg-white"
            />
          </div>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="w-full">
        <DataTable
          columns={columns}
          data={sampleSubscriptions}
          pagination={false}
        />
      </div>
    </div>
  );
}

export default SubscriptionTable;
