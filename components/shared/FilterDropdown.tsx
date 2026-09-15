"use client";

import { SlidersHorizontal } from "lucide-react";
import { CustomDropdown } from "./CustomDropdown";
import { FilterPanel } from "./FilterPanel";
import {
  getDefaultFilterValues,
  type FilterField,
  type FilterValues,
} from "./filter-schema";
import { defaultFilterSchema } from "./filter-presets";
import { cn } from "@/lib/utils";

export type FilterDropdownProps = {
  schema?: FilterField[];
  value?: FilterValues;
  onApply?: (value: FilterValues) => void;
  className?: string;
};

export function FilterDropdown({
  schema = defaultFilterSchema,
  value,
  onApply,
  className,
}: FilterDropdownProps) {
  const applied = value ?? getDefaultFilterValues(schema);

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
          schema={schema}
          value={applied}
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
