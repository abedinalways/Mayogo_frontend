"use client";

import React, { useState } from "react";
import { Search, ChevronDown, Edit3, Eye } from "lucide-react";

interface StaticPage {
  id: string;
  name: string;
  description: string;
  updatedBy: string;
  status: "Live" | "Draft";
  lastUpdated: string;
}

const INITIAL_PAGES: StaticPage[] = [
  {
    id: "page-1",
    name: "Terms & Conditions",
    description:
      "We have added a new service for smart home device setup an...",
    updatedBy: "Super Admin",
    status: "Live",
    lastUpdated: "Jul 27, 2026",
  },
  {
    id: "page-2",
    name: "Privacy Policy",
    description:
      "We have added a new service for smart home device setup an...",
    updatedBy: "Super Admin",
    status: "Draft",
    lastUpdated: "Jul 27, 2026",
  },
  {
    id: "page-3",
    name: "Refund Policy",
    description:
      "Standard refund timeline and client disputes resolution procedures...",
    updatedBy: "Super Admin",
    status: "Live",
    lastUpdated: "Jul 20, 2026",
  },
  {
    id: "page-4",
    name: "Cookie Policy",
    description:
      "Cookie tracking, session analytics, and user consent settings...",
    updatedBy: "Super Admin",
    status: "Live",
    lastUpdated: "Jun 15, 2026",
  },
];

export function StaticPagesTab() {
  const [pages] = useState<StaticPage[]>(INITIAL_PAGES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPageFilter, setSelectedPageFilter] = useState("All Pages");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("All Status");

  const filteredPages = pages.filter((page) => {
    const matchesSearch =
      page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatusFilter === "All Status" ||
      page.status.toLowerCase() === selectedStatusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white rounded-2xl border border-[#E4EBF1] shadow-sm overflow-hidden font-['Manrope']">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-[#E4EBF1] flex flex-wrap items-center gap-3">
        {/* Search Bar */}
        <div className="flex h-10 w-52 items-center gap-2 rounded-xl border border-[#E4EBF1] bg-white px-3.5 py-2 text-xs">
          <Search className="h-4 w-4 text-[#9aaab5] shrink-0" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-[#0F3453] placeholder:text-[#9aaab5] outline-none"
          />
        </div>

        {/* Dropdown Filter 1: All Pages */}
        <div className="relative">
          <select
            value={selectedPageFilter}
            onChange={(e) => setSelectedPageFilter(e.target.value)}
            className="h-10 appearance-none rounded-xl border border-[#E4EBF1] bg-white pl-4 pr-9 text-xs font-semibold text-[#103D5C] outline-none cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <option value="All Pages">All Pages</option>
            <option value="Terms">Terms & Conditions</option>
            <option value="Privacy">Privacy Policy</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#103D5C]" />
        </div>

        {/* Dropdown Filter 2: All Status */}
        <div className="relative">
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="h-10 appearance-none rounded-xl border border-[#E4EBF1] bg-white pl-4 pr-9 text-xs font-semibold text-[#103D5C] outline-none cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <option value="All Status">All Status</option>
            <option value="Live">Live</option>
            <option value="Draft">Draft</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#103D5C]" />
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E4EBF1] text-xs font-medium text-slate-500">
              <th className="py-3.5 px-5">Page Name</th>
              <th className="py-3.5 px-5">Description</th>
              <th className="py-3.5 px-5">Updated By</th>
              <th className="py-3.5 px-5">Status</th>
              <th className="py-3.5 px-5">Last Updated</th>
              <th className="py-3.5 px-5 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4EBF1] text-xs">
            {filteredPages.map((page) => (
              <tr key={page.id} className="hover:bg-slate-50/60 transition-colors">
                {/* Page Name */}
                <td className="py-4 px-5">
                  <span className="font-semibold text-[#103D5C] cursor-pointer hover:underline">
                    {page.name}
                  </span>
                </td>

                {/* Description */}
                <td className="py-4 px-5 text-slate-500 max-w-xs truncate">
                  {page.description}
                </td>

                {/* Updated By */}
                <td className="py-4 px-5 text-slate-600 font-medium">
                  {page.updatedBy}
                </td>

                {/* Status Badge */}
                <td className="py-4 px-5">
                  {page.status === "Live" ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#E0F2FE] text-[#0284C7]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#0284C7]" />
                      Live
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#FEF3C7] text-[#D97706]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#D97706]" />
                      Draft
                    </span>
                  )}
                </td>

                {/* Last Updated */}
                <td className="py-4 px-5 text-slate-500 font-medium">
                  {page.lastUpdated}
                </td>

                {/* Action Buttons */}
                <td className="py-4 px-5 text-center">
                  <div className="flex items-center justify-center gap-2">
                    {/* Yellow Edit button */}
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#FDE68A] bg-amber-50/50 text-[#D97706] hover:bg-amber-100 transition-colors"
                      title="Edit"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>

                    {/* Yellow Eye button */}
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#FDE68A] bg-amber-50/50 text-[#D97706] hover:bg-amber-100 transition-colors"
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StaticPagesTab;
