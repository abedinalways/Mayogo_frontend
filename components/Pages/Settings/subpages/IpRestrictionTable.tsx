"use client";

import React from "react";
import { Trash2, Loader2 } from "lucide-react";

export interface IpRestrictionItem {
  id: string;
  ip?: string;
  ipAddress?: string;
  label?: string;
  addedBy?: string;
  date?: string;
  createdAt?: string;
  status: "Active" | "Disabled" | "ACTIVE" | "DISABLED" | string;
}

export interface IpRestrictionTableProps {
  ipList: IpRestrictionItem[];
  onDeleteIp?: (id: string) => void;
  onToggleStatus?: (id: string) => void;
  deletingId?: string | null;
  togglingId?: string | null;
  isLoading?: boolean;
  className?: string;
}

export function IpRestrictionTable({
  ipList,
  onDeleteIp,
  onToggleStatus,
  deletingId,
  togglingId,
  isLoading = false,
  className = "",
}: IpRestrictionTableProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      className={`w-full border border-[#E4EBF1] rounded-2xl overflow-hidden bg-white ${className}`}
    >
      {/* Table Header */}
      <div className="w-full bg-[#F8FAFC] border-b border-[#E4EBF1] grid grid-cols-12 px-4 py-3 text-xs font-semibold text-[#103D5C] items-center">
        <div className="col-span-3">IP Address</div>
        <div className="col-span-3">Label</div>
        <div className="col-span-2">Added By</div>
        <div className="col-span-2">Date</div>
        <div className="col-span-1 text-center">Status</div>
        <div className="col-span-1 text-center">Actions</div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-[#E4EBF1]">
        {ipList.map((item) => {
          const isActive =
            String(item.status).toUpperCase() === "ACTIVE";
          const displayIp = item.ipAddress || item.ip || "-";
          const displayLabel = item.label || "Office Network";
          const displayAddedBy = item.addedBy || "Admin";
          const displayDate = formatDate(item.date || item.createdAt);
          const isDeleting = deletingId === item.id;
          const isToggling = togglingId === item.id;

          return (
            <div
              key={item.id}
              className="grid grid-cols-12 px-4 py-3.5 text-xs text-slate-700 items-center font-medium"
            >
              <div className="col-span-3 text-[#103D5C] font-semibold break-all">
                {displayIp}
              </div>
              <div className="col-span-3 text-slate-600 break-words pr-2">
                {displayLabel}
              </div>
              <div className="col-span-2 text-slate-600">{displayAddedBy}</div>
              <div className="col-span-2 text-slate-500">{displayDate}</div>
              <div className="col-span-1 flex justify-center">
                {onToggleStatus ? (
                  <button
                    type="button"
                    disabled={isToggling}
                    onClick={() => onToggleStatus(item.id)}
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-xs font-medium cursor-pointer transition-colors ${
                      isActive
                        ? "bg-sky-50 text-sky-600 border border-sky-200 hover:bg-sky-100"
                        : "bg-rose-50 text-rose-500 border border-rose-200 hover:bg-rose-100"
                    } ${isToggling ? "opacity-50 cursor-wait" : ""}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isActive ? "bg-sky-500" : "bg-rose-500"
                      }`}
                    />
                    {isToggling ? "..." : isActive ? "Active" : "Disabled"}
                  </button>
                ) : isActive ? (
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-xs font-medium bg-sky-50 text-sky-600 border border-sky-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                    Active
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-xs font-medium bg-rose-50 text-rose-500 border border-rose-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    Disabled
                  </div>
                )}
              </div>
              <div className="col-span-1 flex justify-center">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => onDeleteIp?.(item.id)}
                  className="p-1 rounded border border-[#E4EBF1] hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer disabled:opacity-50"
                  title="Delete IP"
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                  ) : (
                    <Trash2 className="w-4 h-4 text-rose-500" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
        {isLoading && (
          <div className="p-4 flex items-center justify-center gap-2 text-xs text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin text-[#103D5C]" />
            Loading IP restrictions...
          </div>
        )}
        {!isLoading && ipList.length === 0 && (
          <div className="p-4 text-center text-xs text-slate-400">
            No whitelisted IP addresses added yet.
          </div>
        )}
      </div>
    </div>
  );
}

export default IpRestrictionTable;
