"use client";

import React, { useState } from "react";
import { Search, ArrowUpDown, Download, ChevronDown, SlidersHorizontal } from "lucide-react";
import { CustomDropdown, Option } from "./CustomDropdown";

export interface TableToolbarProps {
  title?: string;
  searchQuery?: string;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSortClick?: () => void;
  onFilterClick?: () => void;
  onExportClick?: () => void;
}

export function TableToolbar({
  title,
  searchQuery,
  onSearchChange,
  onSortClick,
  onFilterClick,
  onExportClick,
}: TableToolbarProps) {
  const sortOptions: Option<string>[] = [
    { label: "Newest First", value: "newest" },
    { label: "Oldest First", value: "oldest" },
    { label: "A-Z", value: "a-z" },
    { label: "Z-A", value: "z-a" },
    { label: "Highest Amount", value: "highest" },
    { label: "Lowest Amount", value: "lowest" },
  ];
  const [sort, setSort] = useState<string>("newest");

  const hasTitle = Boolean(title);

  // Shared actions (Search + Sort + Filter)
  const actions = (
    <div className="flex flex-wrap items-center gap-4">
      {/* Search Input */}
      <label className="flex h-10 w-40 items-center gap-2 rounded-lg border border-[#e4ebf1] bg-white px-4 py-2.5">
        <span className="sr-only">Search Clients</span>
        <Search className="h-4 w-4 shrink-0 text-[#9aaab5]" />
        <input
          type="text"
          placeholder="Search Clients"
          value={searchQuery}
          onChange={onSearchChange}
          className="w-full bg-transparent text-xs font-normal text-[#0f3453] placeholder:text-[#9aaab5] outline-none"
        />
      </label>

      {/* Sort Dropdown */}
     {
      onSortClick && (
        <CustomDropdown
          options={sortOptions}
          value={sort}
          onChange={setSort}
          icon={ArrowUpDown}
          width="w-40"
        />
      )
     }

      {/* Filter Button */}
      {onFilterClick && (
        <button
          type="button"
          onClick={onFilterClick}
          className="flex h-10 items-center gap-2 rounded-lg border border-[#e4ebf1] px-4 py-2 text-sm font-medium text-[#0f3453] transition-colors hover:bg-slate-50"
        >
          <SlidersHorizontal className="h-4 w-4 text-[#0f3453]" />
          <span>Filter</span>
        </button>
      )}
    </div>
  );

  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-4 border border-b-0 border-[#e4ebf1] p-4 font-['Manrope'] rounded-t-lg">
      {/* LEFT SIDE */}
      {hasTitle ? (
        <h2 className="text-[color:var(--Deep-Navy-Brand-800,#103D5C)] [font-family:Manrope] text-lg font-semibold leading-[132%]">{title}</h2>
      ) : (
        actions
      )}

      {/* RIGHT SIDE */}
      {hasTitle ? (
        actions
      ) : (
        onExportClick && (
          <button
            type="button"
            onClick={onExportClick}
            className="flex h-10 items-center gap-2 rounded-lg bg-[#0f3453] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0b2841]"
          >
            <Download className="h-4 w-4 text-white" />
            <span>Export</span>
            <ChevronDown className="h-4 w-4 text-white" />
          </button>
        )
      )}
    </div>
  );
}

export default TableToolbar;