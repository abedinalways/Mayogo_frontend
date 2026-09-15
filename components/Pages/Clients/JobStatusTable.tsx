"use client";

import React, { useState } from "react";
import {
  Search,
  ArrowUpDown,
  SlidersHorizontal,
  MoreVertical,
} from "lucide-react";
import { Column, DataTable } from "../../shared/DataTable";
import TableToolbar from "../../shared/TableToolbar";
import { SortOption } from "@/components/shared/SortDropdown";
import { jobsFilterSchema } from "@/components/shared/filter-presets";

export type JobStatusType = "Pending" | "In Progress" | "Completed" | "Disputed";

export interface JobRecord {
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
  quote: string;
  appointment: {
    date: string;
    time: string;
  };
  status: JobStatusType;
}
const renderStatusBadge = (status: JobStatusType) => {
  const config = {
    Pending: {
      bg: "bg-amber-50",
      outline: "outline-amber-200/50",
      text: "text-amber-700",
      dot: "bg-amber-500",
    },
    "In Progress": {
      bg: "bg-sky-50",
      outline: "outline-sky-200/50",
      text: "text-sky-600",
      dot: "bg-sky-500",
    },
    Completed: {
      bg: "bg-emerald-50",
      outline: "outline-emerald-200/50",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
    },
    Disputed: {
      bg: "bg-rose-50",
      outline: "outline-rose-200/50",
      text: "text-rose-600",
      dot: "bg-rose-500",
    },
  }[status];

  return (
    <div
      className={`h-5 px-2 py-0.5 rounded-sm outline outline-1 outline-offset-[-1px] text-nowrap inline-flex justify-center items-center gap-1 ${config.bg} ${config.outline}`}
    >
      <span className={`h-2 w-2 rounded-full ${config.dot}`} />
      <span className={`text-center text-xs font-medium font-['Manrope'] leading-4 ${config.text}`}>
        {status}
      </span>
    </div>
  );
};
const sampleJobs: JobRecord[] = [
  {
    id: "1",
    jobId: "#J124",
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
    quote: "$80",
    appointment: {
      date: "27 Jul, 2026",
      time: "08:00 AM- 11:00 PM",
    },
    status: "Pending",
  },
  {
    id: "2",
    jobId: "#J124",
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
    quote: "$80",
    appointment: {
      date: "27 Jul, 2026",
      time: "08:00 AM- 11:00 PM",
    },
    status: "In Progress",
  },
  {
    id: "3",
    jobId: "#J124",
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
    quote: "$80",
    appointment: {
      date: "27 Jul, 2026",
      time: "08:00 AM- 11:00 PM",
    },
    status: "In Progress",
  },
  {
    id: "4",
    jobId: "#J124",
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
    quote: "$80",
    appointment: {
      date: "27 Jul, 2026",
      time: "08:00 AM- 11:00 PM",
    },
    status: "Pending",
  },
  {
    id: "5",
    jobId: "#J124",
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
    quote: "$80",
    appointment: {
      date: "27 Jul, 2026",
      time: "08:00 AM- 11:00 PM",
    },
    status: "Completed",
  },
  {
    id: "6",
    jobId: "#J124",
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
    quote: "$80",
    appointment: {
      date: "27 Jul, 2026",
      time: "08:00 AM- 11:00 PM",
    },
    status: "In Progress",
  },
  {
    id: "7",
    jobId: "#J124",
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
    quote: "$80",
    appointment: {
      date: "27 Jul, 2026",
      time: "08:00 AM- 11:00 PM",
    },
    status: "Completed",
  },
  {
    id: "8",
    jobId: "#J124",
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
    quote: "$80",
    appointment: {
      date: "27 Jul, 2026",
      time: "08:00 AM- 11:00 PM",
    },
    status: "Disputed",
  },
];


const sortOptions: SortOption<string>[] = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "A-Z", value: "a-z" },
  { label: "Z-A", value: "z-a" },
];

export function JobStatusTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);



  const columns: Column<JobRecord>[] = [
    {
      key: "jobId",
      header: "Job ID",
      className: "w-36 min-w-[144px] pl-4",
      cell: (item) => (
        <span className="text-sm font-normal text-[#103D5C] font-['Manrope'] leading-6">
          {item.jobId}
        </span>
      ),
    },
    {
      key: "service",
      header: "Service Name",
      className: "w-64 min-w-[256px]",
      cell: (item) => (
        <div className="flex items-center gap-2">
          <img
            src={item.service.image}
            alt={item.service.name}
            className="h-7 w-7 rounded-sm border border-slate-200 object-cover shrink-0 shadow-[-3.75px_7.5px_7.5px_0px_rgba(0,0,0,0.05)]"
          />
          <div className="flex flex-col justify-center">
            <span className="text-xs font-medium text-[#103D5C] font-['Manrope'] leading-5">
              {item.service.name}
            </span>
            <span className="text-[10px] font-medium text-[#667085] font-['Manrope'] leading-[10px]">
              {item.service.category}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "client",
      header: "Client Name",
      className: "w-60",
      cell: (item) => (
        <div className="flex items-center gap-2">
          <img
            src={item.client.avatar}
            alt={item.client.name}
            className="h-7 w-7 rounded-full border border-slate-200 object-cover shrink-0 shadow-[-3.75px_7.5px_7.5px_0px_rgba(0,0,0,0.05)]"
          />
          <span className="text-xs font-medium text-slate-900 font-['Manrope'] leading-4">
            {item.client.name}
          </span>
        </div>
      ),
    },
    {
      key: "quote",
      header: "Quote",
      className: "w-32 min-w-[128px]",
      cell: (item) => (
        <span className="text-xs font-medium text-slate-700 font-['Manrope'] leading-4">
          {item.quote}
        </span>
      ),
    },
    {
      key: "appointment",
      header: "Appointment",
      className: "w-40 min-w-[160px]",
      cell: (item) => (
        <div className="flex flex-col justify-center">
          <span className="text-xs font-medium text-slate-700 font-['Manrope'] leading-5">
            {item.appointment.date}
          </span>
          <span className="text-[10px] font-medium text-slate-400 font-['Manrope'] leading-[10px]">
            {item.appointment.time}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      className: "w-32",
      cell: (item) => renderStatusBadge(item.status),
    },
    {
      key: "action",
      header: "Action",
      className: "w-24 min-w-[96px] pr-4 text-center",
      cell: () => (
        <button
          type="button"
          className="inline-flex h-8 items-center justify-center rounded-sm outline outline-1 outline-offset-[-1px] outline-slate-200 bg-white px-2 py-1.5 text-slate-500 transition-colors hover:bg-slate-50"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return (
    <div >
      <TableToolbar
        title="Job Status"
        onSortClick={() => setSortBy(sortBy === "newest" ? "oldest" : "newest")}
        sortOptions={sortOptions}
        onSortChange={(value) => setSortBy(value)}
        filterSchema={jobsFilterSchema}
      />
      <div className="">
        <DataTable columns={columns} data={sampleJobs} pagination={false} />
      </div>
    </div>
  );
}

export default JobStatusTable;