"use client";

import React, { useState } from "react";
import { Search, Download, ChevronDown } from "lucide-react";
import {
  SortDropdown,
  defaultSortOptions,
  type SortOption,
} from "./SortDropdown";
import { FilterDropdown } from "./FilterDropdown";
import { getDefaultFilterValues, type FilterField, type FilterValues } from "./filter-schema";
import { defaultFilterSchema } from "./filter-presets";

export interface TableToolbarProps {
  title?: string;
  searchQuery?: string;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSortClick?: () => void;
  sortOptions?: SortOption[];
  onSortChange?: (value: string) => void;
  onFilterClick?: () => void;
  filterSchema?: FilterField[];
  onFilterChange?: (value: FilterValues) => void;
  onExportClick?: () => void;
}

export function TableToolbar({
  title,
  searchQuery,
  onSearchChange,
  onSortClick,
  sortOptions = defaultSortOptions,
  onSortChange,
  onFilterClick,
  filterSchema,
  onFilterChange,
  onExportClick,
}: TableToolbarProps) {
  const schema = filterSchema ?? defaultFilterSchema;
  const [sort, setSort] = useState<string | undefined>(undefined);
  const [filter, setFilter] = useState<FilterValues>(() =>
    getDefaultFilterValues(schema),
  );
  const hasTitle = Boolean(title);
  const showFilter = onFilterClick !== undefined || filterSchema !== undefined;

  const actions = (
    <div className="flex flex-wrap items-center gap-4">
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

      {onSortClick && (
        <SortDropdown
          options={sortOptions}
          value={sort}
          onChange={(value) => {
            setSort(value);
            onSortChange?.(value);
          }}
        />
      )}

      {showFilter && (
        <FilterDropdown
          schema={schema}
          value={filter}
          onApply={(next) => {
            setFilter(next);
            onFilterChange?.(next);
          }}
        />
      )}
    </div>
  );

  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-4 border border-b-0 border-[#e4ebf1] p-4 font-['Manrope'] rounded-t-lg">
      {hasTitle ? (
        <h2 className="text-[color:var(--Deep-Navy-Brand-800,#103D5C)] [font-family:Manrope] text-lg font-semibold leading-[132%]">
          {title}
        </h2>
      ) : (
        actions
      )}

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
