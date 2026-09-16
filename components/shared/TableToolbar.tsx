"use client";

import React, { useState } from "react";
import { Search, Download, ChevronDown, SlidersHorizontal } from "lucide-react";
import { CustomDropdown } from "./CustomDropdown";
import { FilterDropdown } from "./FilterDropdown";
import { FilterPanel } from "./FilterPanel";
import {
  SortDropdown,
  defaultSortOptions,
  type SortOption,
} from "./SortDropdown";
import {
  getDefaultFilterValues,
  type FilterField,
  type FilterValues,
} from "./filter-schema";
import { defaultFilterSchema } from "./filter-presets";

export interface DropdownFilter {
  placeholder: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (val: string) => void;
}

export interface TableToolbarProps {
  title?: string;
  searchQuery?: string;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Simple select-style filters (e.g. rating, status) rendered as dropdowns */
  dropdownFilters?: DropdownFilter[];
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
  dropdownFilters = [],
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
    getDefaultFilterValues(schema)
  );

  const hasTitle = Boolean(title);
  const showFilter = onFilterClick !== undefined || filterSchema !== undefined;

  const actions = (
    <div className="flex flex-wrap items-center gap-4">
      {/* 1. Search Bar */}
      {(searchQuery !== undefined || onSearchChange !== undefined) && (
        <label className="flex h-10 w-40 items-center gap-2 rounded-lg border border-[#e4ebf1] bg-white px-4 py-2.5">
          <span className="sr-only">Search Clients</span>
          <Search className="h-4 w-4 shrink-0 text-[#9aaab5]" />
          <input
            type="text"
            placeholder="Search Clients"
            value={searchQuery ?? ""}
            onChange={onSearchChange}
            className="w-full bg-transparent text-xs font-normal text-[#0f3453] placeholder:text-[#9aaab5] outline-none"
          />
        </label>
      )}

      {/* 2. Dropdown filters (rating, status, etc.) */}
      {dropdownFilters.map((df, idx) => (
        <FilterDropdown
          key={`${df.placeholder}-${idx}`}
          placeholder={df.placeholder}
          options={df.options}
          value={df.value}
          onChange={df.onChange}
        />
      ))}

      {/* 3. Sort control */}
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

      {/* 4. Panel Filter Type (Expandable Panel with Checkboxes/Radios/Chips) */}
      {showFilter && (
        <CustomDropdown
          trigger={
            <button
              type="button"
              className="flex h-10 items-center gap-2 rounded-xl border border-[#e4ebf1] bg-white px-4 py-2 text-sm font-medium text-[#0f3453] transition-colors hover:bg-slate-50 focus:outline-none"
            >
              <SlidersHorizontal className="h-4 w-4 shrink-0 text-[#0f3453]" />
              <span>Filters</span>
            </button>
          }
        >
          {({ close, open }) => (
            <FilterPanel
              open={open}
              schema={schema}
              value={filter}
              onCancel={close}
              onApply={(next) => {
                setFilter(next);
                onFilterChange?.(next);
                close();
              }}
            />
          )}
        </CustomDropdown>
      )}
    </div>
  );

  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-4 border border-b-0 border-[#e4ebf1] p-4 font-['Manrope'] rounded-t-lg">
      {/* Title / Action Toggle */}
      {hasTitle ? (
        <h2 className="text-[#103D5C] text-lg font-semibold leading-[132%]">
          {title}
        </h2>
      ) : (
        actions
      )}

      {/* Export / Right Actions Toggle */}
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