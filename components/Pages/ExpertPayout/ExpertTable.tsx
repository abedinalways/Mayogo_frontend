"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MoreVertical } from "lucide-react";
import { Column, DataTable } from "../../shared/DataTable";
import TableToolbar from "../../shared/TableToolbar";
import { expertsFilterSchema } from "../../shared/filter-presets";
import Link from "next/link";
import { strict } from "assert";
import { StatusBadge } from "@/components/shared/StatusBadge";
import ExpertPayoutDetailsModal from "./ExpertPayoutDetailsModal";

export type VerificationStatus =
  | "Level 1 verified"
  | "Level 2 verified"
  | "Level 3 verified"
  | "Level 4 verified"
  | "Pending";

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
  requestAmount: string;
  availableBalance: string;
  method: string;
  accountName: string;
  accountNumber: string;
  date: string;
  status: string;
  rejectedBy?: string;
  rejectedDate?: string;
  rejectionNote?: string;
}

const sampleExperts: ExpertRecord[] = [
  {
    id: "1",
    expertId: "#EXP001",
    expert: {
      name: "Daniel Green",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    },
    contact: {
      phone: "999-(1234)-555",
      email: "danielgreen@gmail.com",
    },
    category: "Construction & Property",
    requestAmount: "$4,000",
    availableBalance: "$6,000",
    method: "Bank Transfer",
    accountName: "Daniel Green",
    accountNumber: "074******87",
    date: "Jul 27, 2026",
    status: "Rejected",
    rejectedBy: "Admin",
    rejectedDate: "Jul 27, 2026",
    rejectionNote: "Account information mismatch.",
  },
  {
    id: "2",
    expertId: "#EXP002",
    expert: {
      name: "Sarah Williams",
      avatar:
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&auto=format&fit=crop&q=80",
    },
    contact: {
      phone: "999-(5678)-111",
      email: "sarahwilliams@gmail.com",
    },
    category: "Construction & Property",
    requestAmount: "$2,450",
    availableBalance: "$5,200",
    method: "Bank Transfer",
    accountName: "Sarah Williams",
    accountNumber: "082******34",
    date: "Jul 27, 2026",
    status: "Rejected",
    rejectedBy: "Admin",
    rejectedDate: "Jul 28, 2026",
    rejectionNote: "Account information mismatch.",
  },
  {
    id: "3",
    expertId: "#EXP003",
    expert: {
      name: "Alex Morgan",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    },
    contact: {
      phone: "999-(9012)-222",
      email: "alexmorgan@gmail.com",
    },
    category: "Construction & Property",
    requestAmount: "$4,000",
    availableBalance: "$6,000",
    method: "Bank Transfer",
    accountName: "Alex Morgan",
    accountNumber: "074******87",
    date: "Jul 27, 2026",
    status: "Pending",
  },
  {
    id: "4",
    expertId: "#EXP004",
    expert: {
      name: "James Carter",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
    },
    contact: {
      phone: "999-(3456)-333",
      email: "jamescarter@gmail.com",
    },
    category: "Construction & Property",
    requestAmount: "$2,450",
    availableBalance: "$8,100",
    method: "Bank Transfer",
    accountName: "James Carter",
    accountNumber: "091******52",
    date: "Jul 27, 2026",
    status: "Approved",
  },
];

export function ExpertPayoutTable() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("");
  const [filter, setFilter] = useState<string>("");

  // Modal state
  const [selectedExpert, setSelectedExpert] = useState<ExpertRecord | null>(
    null,
  );
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const handleViewDetails = (expert: ExpertRecord) => {
    setSelectedExpert(expert);
    setDetailsModalOpen(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(sampleExperts.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
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

    return (
      <span className="inline-flex items-center rounded bg-emerald-50 px-2.5 py-1 font-['Manrope'] text-xs font-medium text-emerald-600 outline outline-1 outline-offset-[-1px] outline-emerald-200">
        {verification}
      </span>
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
            selectedIds.length === sampleExperts.length &&
            sampleExperts.length > 0
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
      key: "requestAmount",
      header: "Request Amount",
      className: "min-w-[180px]",
      cell: (item) => (
        <span className="font-['Manrope'] text-xs font-medium leading-4 text-[#667085]">
          {item.requestAmount}
        </span>
      ),
    },
    {
      key: "method",
      header: "Method",
      className: "min-w-[150px]",
      cell: (item) => (
        <span className="font-['Manrope'] text-xs font-medium leading-4 text-[#667085]">
          {item.method}
        </span>
      ),
    },
    {
      key: "date",
      header: "Requested Date",
      className: "min-w-[150px]",
      cell: (item) => (
        <span className="font-['Manrope'] text-xs font-medium leading-4 text-[#667085]">
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
        <span
          onClick={() => handleViewDetails(item)}
          className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 text-nowrap"
        >
          View Details
        </span>
      ),
    },
  ];

  return (
    <div>
      {/* Table Top Controls */}
      <TableToolbar
        searchQuery={searchTerm}
        onSearchChange={handleSearchChange}
        onSortClick={() => {}}
        onExportClick={() => {}}
        filterSchema={expertsFilterSchema}
      />

      {/* Main Data Table */}
      <div>
        <DataTable columns={columns} data={sampleExperts} pagination={false} />
      </div>

      {/* Modal 1: Review Withdrawal Request (Modal 2 is rendered inside it) */}
      <ExpertPayoutDetailsModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        expert={selectedExpert}
      />
    </div>
  );
}

export default ExpertPayoutTable;
