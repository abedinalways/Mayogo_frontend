"use client";

import React, { useState } from "react";
import { Column, DataTable } from "../../shared/DataTable";
import { StatusBadge, type StatusType } from "../../shared/StatusBadge";
import TableToolbar from "../../shared/TableToolbar";
import { jobsFilterSchema } from "../../shared/filter-presets";
import Link from "next/link";

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
  commission: string;
  paymentStructure: string;
  serviceFee: string;
  escrowStatus: string;
  paymentStatus: string;
  earnings: string;
  expertEarnings: string;
  serviceType: string;
  payment: StatusType;
  method: string;
  amount: string;
  quote: string;
  location: string;
  date: string;
  status: StatusType;
}

const fullSampleJobs: FullJobRecord[] = [
  {
    id: "1",
    jobId: "#JB001",
    service: {
      name: "Air Conditioner (AC) Repair",
      category: "Repair & Diagnostic",
      image:
        "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=100&auto=format&fit=crop&q=80",
    },
    client: {
      name: "Sarah William",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    },
    expert: {
      name: "Daniel Green",
      avatar:
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80",
    },
    amount: "$120",
    commission: "10%",
    paymentStructure: "Single",
    serviceFee: "$12",
    escrowStatus: "Released",
    paymentStatus: "Refunded",
    earnings: "$2,450",
    expertEarnings: "$108",
    serviceType: "On-site",
    payment: "Pending",
    method: "Selcome",
    quote: "$120",
    location: "New York",
    date: "12 Jul, 2026",
    status: "Completed",
  },
];

export function TransactionTable() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const statusColors: Record<string, string> = {
    Released: "text-[#04913E]",
    Held: "text-[#F5B517]",
    Refunded: "text-[#EB3D4D]",
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(fullSampleJobs.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const columns: Column<FullJobRecord>[] = [
    {
      key: "checkbox",
      header: (
        <input
          type="checkbox"
          onChange={handleSelectAll}
          checked={
            selectedIds.length === fullSampleJobs.length &&
            fullSampleJobs.length > 0
          }
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
        <span className="text-sm font-semibold text-[#123e5e] hover:underline cursor-pointer">
          {item.jobId}
        </span>
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
      key: "amount",
      header: "Amount",
      className: "w-24 min-w-[90px]",
      cell: (item) => (
        <span className="text-[#5A5A5A] text-[12px] font-medium leading-[124%]">
          {item.amount}
        </span>
      ),
    },
    {
      key: "commission",
      header: "Commission",
      className: "w-28 min-w-[100px]",
      cell: (item) => (
        <span className="text-[#5A5A5A] text-[12px] font-medium leading-[124%]">
          {item.commission}
        </span>
      ),
    },
    {
      key: "paymentStructure",
      header: "Payment Structure",
      className: "min-w-[140px]",
      cell: (item) => (
        <span className="text-[#5A5A5A] text-[12px] font-medium leading-[124%]">
          {item.paymentStructure}
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
      key: "escrowStatus",
      header: "Escrow Status",
      className: "min-w-[130px]",
      cell: (item) => (
        <span
          className={`text-[12px] font-semibold leading-[124%] ${
            statusColors[item.escrowStatus] || "text-[#5A5A5A]"
          }`}
        >
          {item.escrowStatus}
        </span>
      ),
    },
    {
      key: "paymentStatus",
      header: "Payment Status",
      className: "min-w-[130px]",
      cell: (item) => <StatusBadge status={item.paymentStatus} />,
    },
    {
      key: "earnings",
      header: "Earning",
      className: "min-w-[110px]",
      cell: (item) => (
        <span className="text-[#5A5A5A] text-[12px] font-medium leading-[124%]">
          {item.earnings}
        </span>
      ),
    },
    {
      key: "method",
      header: "Method",
      className: "min-w-[110px]",
      cell: (item) => (
        <span className="text-[#5A5A5A] text-[12px] font-medium leading-[124%]">
          {item.method}
        </span>
      ),
    },
    {
      key: "action",
      header: "Action",
      className: "w-28 min-w-[110px] text-center",
      cell: (item) => (
        <Link
          href={`/dashboard/transactions/${item.id}`}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 text-nowrap"
        >
          View Details
        </Link>
      ),
    },
  ];

  return (
    <div className="w-full font-['Manrope']">
      {/* Top Controls Toolbar */}
      <TableToolbar
        onSortClick={() => {}}
        onExportClick={() => {}}
        filterSchema={jobsFilterSchema}
      />

      {/* Main Data Table */}
      <div className="border-x border-b border-[#E8E8E8] rounded-b-xl overflow-hidden bg-white">
        <DataTable columns={columns} data={fullSampleJobs} pagination={true} />
      </div>
    </div>
  );
}

export default TransactionTable;
