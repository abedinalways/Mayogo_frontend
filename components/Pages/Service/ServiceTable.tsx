"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Search,
  ChevronDown,
  ArrowUpDown,
  Plus,
  Pencil,
  SquarePen,
} from "lucide-react";
import { Column, DataTable } from "@/components/shared/DataTable";
import AddServiceModal from "./AddServiceModal";
import EditServiceModal from "./EditServiceModal";
import { sampleServices, type ServiceRecord } from "./ServiceData";

// ── Toggle Switch ──────────────────────────────────────────────────────────
function ToggleSwitch({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
        enabled ? "bg-[#F5B517]" : "bg-slate-200"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          enabled ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}

// ── Main ServiceTable Component ────────────────────────────────────────────
export default function ServiceTable() {
  const [services, setServices] = useState<ServiceRecord[]>(sampleServices);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceRecord | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleToggleStatus = (id: string, value: boolean) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: value } : s)),
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedIds(e.target.checked ? services.map((s) => s.id) : []);
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const columns: Column<ServiceRecord>[] = [
    {
      key: "checkbox",
      header: (
        <input
          type="checkbox"
          onChange={handleSelectAll}
          checked={
            selectedIds.length === services.length && services.length > 0
          }
          className="h-4 w-4 cursor-pointer rounded border-slate-300"
        />
      ),
      className: "w-12 pl-6 pr-2",
      cell: (item) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(item.id)}
          onChange={() => handleSelectRow(item.id)}
          className="h-4 w-4 cursor-pointer rounded border-slate-300"
        />
      ),
    },
    {
      key: "name",
      header: "Service Name",
      className: "min-w-[200px]",
      cell: (item) => (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-slate-100">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
            />
          </div>
          <span className="text-sm font-medium text-primary font-['Manrope']">
            {item.name}
          </span>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      className: "min-w-[180px]",
      cell: (item) => (
        <span className="text-sm text-[#0777F6] font-['Manrope'] bg-[#EFF9FF] p-1 rounded">
          {item.category}
        </span>
      ),
    },
    {
      key: "commission",
      header: "Commission",
      className: "min-w-[120px] text-center",
      cell: (item) => (
        <span className="text-sm text-[#5A5A5A] font-['Manrope']">
          {item.commission}
        </span>
      ),
    },
    {
      key: "totalJobs",
      header: "Total Jobs",
      className: "min-w-[110px] text-center",
      cell: (item) => (
        <span className="text-sm text-[#5A5A5A] font-['Manrope']">
          {String(item.totalJobs).padStart(2, "0")}
        </span>
      ),
    },
    {
      key: "createdBy",
      header: "Created By",
      className: "min-w-[140px]",
      cell: (item) => (
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0a3558] text-xs font-bold text-white border border-[#F5B517]">
            {item.createdBy.slice(0, 2).toUpperCase()}
          </div>
          <span className="text-sm text-[#103D5C] font-['Manrope']">
            {item.createdBy}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      className: "min-w-[100px] text-center",
      cell: (item) => (
        <ToggleSwitch
          enabled={item.status}
          onChange={(v) => handleToggleStatus(item.id, v)}
        />
      ),
    },
    {
      key: "action",
      header: "Action",
      className: "w-20 text-center",
      cell: (item) => (
        <button
          type="button"
          onClick={() => {
            setSelectedService(item);
            setEditOpen(true);
          }}
          className="inline-flex items-center justify-center rounded border border-[#E8E8E8] bg-white p-2 text-slate-500 hover:bg-slate-50 hover:text-[#0a3558] transition-colors"
        >
          <SquarePen className="text-[#F5B517]" size={15} />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-9 flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 min-w-[180px] max-w-[260px]">
          <Search size={15} className="shrink-0 text-slate-400" />
          <input
            type="text"
            placeholder="Search Services"
            value={searchTerm}
            onChange={handleSearchChange}
            className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none font-['Manrope']"
          />
        </div>

        <button
          type="button"
          className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 font-['Manrope']"
        >
          All Categories <ChevronDown size={14} className="text-slate-400" />
        </button>

        <button
          type="button"
          className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 font-['Manrope']"
        >
          All Status <ChevronDown size={14} className="text-slate-400" />
        </button>

        <button
          type="button"
          className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 font-['Manrope']"
        >
          <ArrowUpDown size={14} className="text-slate-400" />
          Sort by <ChevronDown size={14} className="text-slate-400" />
        </button>

        <div className="flex-1" />

        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="flex h-9 items-center gap-1.5 rounded-lg bg-[#0a3558] px-4 text-sm font-semibold text-white hover:bg-[#07253e] active:scale-[0.98] transition-colors font-['Manrope']"
        >
          <Plus size={15} />
          Add New Service
        </button>
      </div>

      {/* ── Table ── */}
      <DataTable columns={columns} data={services} pagination={false} />

      {/* ── Modals ── */}
      <AddServiceModal open={addOpen} onOpenChange={setAddOpen} />
      <EditServiceModal
        open={editOpen}
        onOpenChange={setEditOpen}
        service={selectedService}
      />
    </div>
  );
}
