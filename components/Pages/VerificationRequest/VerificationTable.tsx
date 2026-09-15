"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Column, DataTable } from "@/components/shared/DataTable";
import TableToolbar from "@/components/shared/TableToolbar";
import { verificationFilterSchema } from "@/components/shared/filter-presets";

export type VerificationStatus =
  | "Resubmission Required"
  | "Pending"
  | "Approved"
  | "Rejected";

export interface VerificationRecord {
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
  documentsSubmitted: number;
  pendingReviews: number;
  submissionDate: string;
  status: VerificationStatus;
}

const sampleVerifications: VerificationRecord[] = [
  {
    id: "1",
    expertId: "#EXP124",
    expert: {
      name: "Daniel Green",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    },
    contact: {
      phone: "999-(1234)-555",
      email: "sarahwilliam@gmail.com",
    },
    documentsSubmitted: 8,
    pendingReviews: 3,
    submissionDate: "Jul 27, 2026",
    status: "Resubmission Required",
  },
  {
    id: "2",
    expertId: "#EXP125",
    expert: {
      name: "Daniel Green",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    },
    contact: {
      phone: "999-(1234)-555",
      email: "sarahwilliam@gmail.com",
    },
    documentsSubmitted: 5,
    pendingReviews: 1,
    submissionDate: "Jul 26, 2026",
    status: "Pending",
  },
  {
    id: "3",
    expertId: "#EXP126",
    expert: {
      name: "Daniel Green",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    },
    contact: {
      phone: "999-(1234)-555",
      email: "sarahwilliam@gmail.com",
    },
    documentsSubmitted: 10,
    pendingReviews: 0,
    submissionDate: "Jul 25, 2026",
    status: "Approved",
  },
];

export function VerificationTable() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"asc" | "desc">("asc");

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(sampleVerifications.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const renderStatusBadge = (status: VerificationStatus) => {
    const config = {
      "Resubmission Required": {
        bg: "bg-amber-400/20",
        border: "outline-amber-300/50",
        text: "text-amber-700",
        dot: "bg-amber-500",
      },
      Pending: {
        bg: "bg-sky-50",
        border: "outline-sky-200",
        text: "text-sky-600",
        dot: "bg-sky-500",
      },
      Approved: {
        bg: "bg-emerald-50",
        border: "outline-emerald-200",
        text: "text-emerald-700",
        dot: "bg-emerald-500",
      },
      Rejected: {
        bg: "bg-rose-50",
        border: "outline-rose-200",
        text: "text-rose-600",
        dot: "bg-rose-500",
      },
    }[status];

    return (
      <div
        className={`inline-flex h-5 items-center gap-1 rounded-sm px-2 py-0.5 outline outline-1 outline-offset-[-1px] ${config.bg} ${config.border}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
        <span
          className={`font-['Manrope'] text-xs font-medium leading-4 ${config.text}`}
        >
          {status}
        </span>
      </div>
    );
  };

  const columns: Column<VerificationRecord>[] = [
    {
      key: "expertId",
      header: (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            onChange={handleSelectAll}
            checked={
              selectedIds.length === sampleVerifications.length &&
              sampleVerifications.length > 0
            }
            className="h-4 w-4 cursor-pointer rounded border-slate-300 text-[#103D5C] focus:ring-0"
          />
          <span>Expert ID</span>
        </div>
      ),
      className: "w-36 min-w-[144px] pl-4",
      cell: (item) => (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectedIds.includes(item.id)}
            onChange={() => handleSelectRow(item.id)}
            className="h-4 w-4 cursor-pointer rounded border-slate-300 text-[#103D5C] focus:ring-0"
          />
          <span className="font-['Manrope'] text-sm font-normal leading-6 text-[#103D5C]">
            {item.expertId}
          </span>
        </div>
      ),
    },
    {
      key: "expert",
      header: "Expert Name",
      className: "w-44 min-w-[176px]",
      cell: (item) => (
        <div className="flex items-center gap-2">
          <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full border border-amber-400 shadow-[-3.75px_7.5px_7.5px_0px_rgba(0,0,0,0.05)]">
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
      key: "contact",
      header: "Contact",
      className: "w-44 min-w-[176px]",
      cell: (item) => (
        <div className="flex flex-col justify-center">
          <span className="font-['Manrope'] text-xs font-medium leading-5 text-[#667085]">
            {item.contact.phone}
          </span>
          <span className="font-['Manrope'] text-[10px] font-medium leading-[10px] text-slate-400">
            {item.contact.email}
          </span>
        </div>
      ),
    },
    {
      key: "documentsSubmitted",
      header: "Docs Submitted",
      className: "w-28 min-w-[112px] text-center",
      cell: (item) => (
        <span className="font-['Manrope'] text-xs font-medium leading-4 text-[#667085]">
          {String(item.documentsSubmitted).padStart(2, "0")}
        </span>
      ),
    },
    {
      key: "pendingReviews",
      header: "Pending Reviews",
      className: "w-28 min-w-[112px] text-center",
      cell: (item) => (
        <span className="font-['Manrope'] text-xs font-medium leading-4 text-[#667085]">
          {String(item.pendingReviews).padStart(2, "0")}
        </span>
      ),
    },
    {
      key: "submissionDate",
      header: "Submission Date",
      className: "w-28 min-w-[112px] text-center",
      cell: (item) => (
        <span className="font-['Manrope'] text-xs font-medium leading-4 text-[#667085]">
          {item.submissionDate}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      className: "w-48 min-w-[192px] text-center",
      cell: (item) => (
        <div className="flex justify-center">
          {renderStatusBadge(item.status)}
        </div>
      ),
    },
    {
      key: "action",
      header: "Action",
      className: "w-28 min-w-[112px] pr-4 text-center",
      cell: (item) => (
        <button
          type="button"
          onClick={() => console.log("View details for", item.id)}
          className="inline-flex h-8 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 transition-colors hover:bg-slate-50"
        >
          <span className="font-['Manrope'] text-xs font-medium leading-3 text-slate-700">
            View Details
          </span>
        </button>
      ),
    },
  ];

  return (
    <div>
      <TableToolbar
        onSortClick={() => setSortBy(sortBy === "asc" ? "desc" : "asc")}
        onExportClick={() => console.log("Export clicked")}
        filterSchema={verificationFilterSchema}
      />
      <div>
        <DataTable
          columns={columns}
          data={sampleVerifications}
          pagination={false}
        />
      </div>
    </div>
  );
}

export default VerificationTable;