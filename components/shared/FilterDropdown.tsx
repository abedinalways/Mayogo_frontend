"use client";

import { SlidersHorizontal } from "lucide-react";
import { CustomDropdown } from "./CustomDropdown";
import { FilterPanel, defaultFilterValues, type FilterValues } from "./FilterPanel";
import { cn } from "@/lib/utils";

export type FilterDropdownProps = {
  value?: FilterValues;
  onApply?: (value: FilterValues) => void;
  statusOptions?: { label: string; value: string }[];
  dateRangeOptions?: { label: string; value: string }[];
  className?: string;
};

export function FilterDropdown({
  value = defaultFilterValues,
  onApply,
  statusOptions,
  dateRangeOptions,
  className,
}: FilterDropdownProps) {
  return (
    <CustomDropdown
      triggerClassName={cn(
        "flex h-10 items-center gap-2 rounded-xl border border-[#e4ebf1] bg-white px-4 py-2 text-sm font-medium text-[#0f3453] transition-colors hover:bg-slate-50 focus:outline-none",
        className,
      )}
      trigger={
        <>
          <SlidersHorizontal className="h-4 w-4 shrink-0 text-[#0f3453]" />
          <span>Filter</span>
        </>
      }
    >
      {({ close, open }) => (
        <FilterPanel
          open={open}
          value={value}
          statusOptions={statusOptions}
          dateRangeOptions={dateRangeOptions}
          onCancel={close}
          onApply={(next) => {
            onApply?.(next);
            close();
          }}
        />
      )}
    </CustomDropdown>
  );
}

export default FilterDropdown;
