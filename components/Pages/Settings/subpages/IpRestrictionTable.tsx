"use client";

import React from "react";
import { Trash2 } from "lucide-react";

export interface IpRestrictionItem {
  id: string;
  ip: string;
  label: string;
  addedBy: string;
  date: string;
  status: "Active" | "Disabled";
}

export interface IpRestrictionTableProps {
  ipList: IpRestrictionItem[];
  onDeleteIp?: (id: string) => void;
  className?: string;
}

export function IpRestrictionTable({
  ipList,
  onDeleteIp,
  className = "",
}: IpRestrictionTableProps) {
  return (
    <div className={`w-full border border-[#E4EBF1] rounded-2xl overflow-hidden bg-white ${className}`}>
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
        {ipList.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-12 px-4 py-3.5 text-xs text-slate-700 items-center font-medium"
          >
            <div className="col-span-3 text-[#103D5C] font-semibold">
              {item.ip}
            </div>
            <div className="col-span-3 text-slate-600">{item.label}</div>
            <div className="col-span-2 text-slate-600">{item.addedBy}</div>
            <div className="col-span-2 text-slate-500">{item.date}</div>
            <div className="col-span-1 flex justify-center">
              {item.status === "Active" ? (
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
                onClick={() => onDeleteIp?.(item.id)}
                className="p-1 rounded border border-[#E4EBF1] hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-rose-500" />
              </button>
            </div>
          </div>
        ))}
        {ipList.length === 0 && (
          <div className="p-4 text-center text-xs text-slate-400">
            No whitelisted IP addresses added yet.
          </div>
        )}
      </div>
    </div>
  );
}

export default IpRestrictionTable;
