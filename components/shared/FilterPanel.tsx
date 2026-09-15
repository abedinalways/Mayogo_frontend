"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type FilterValues = {
  statuses: string[];
  dateRange: string;
};

export const defaultFilterValues: FilterValues = {
  statuses: ["all"],
  dateRange: "all",
};

const defaultStatusOptions = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Suspended", value: "suspended" },
  { label: "Inactive", value: "inactive" },
];

const defaultDateRangeOptions = [
  { label: "All", value: "all" },
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Last 3 Months", value: "3m" },
  { label: "Last 6 Months", value: "6m" },
];

const defaultServiceCategoryOptions = [
  { label: "All", value: "all" },
  { label: "Service Category 1", value: "service-category-1" },
  { label: "Service Category 2", value: "service-category-2" },
  { label: "Service Category 3", value: "service-category-3" },
];

export type FilterPanelProps = {
  open?: boolean;
  value?: FilterValues;
  statusOptions?: { label: string; value: string }[];
  dateRangeOptions?: { label: string; value: string }[];
  serviceCategoryOptions?: { label: string; value: string }[];
  onApply: (value: FilterValues) => void;
  onCancel: () => void;
};

function CheckOption({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span
        className={cn(
          "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[4px] border",
          checked
            ? "border-[#e9b83f] bg-[#e9b83f]"
            : "border-[#d3dbe3] bg-white",
        )}
      >
        {checked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
      </span>
      <span className="text-sm font-normal text-[#123e5e]">{label}</span>
    </label>
  );
}

function RadioOption({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5">
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span
        className={cn(
          "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border",
          checked ? "border-[#e9b83f] bg-[#e9b83f]" : "border-[#d3dbe3] bg-white",
        )}
      />
      <span className="text-sm font-normal text-[#123e5e]">{label}</span>
    </label>
  );
}

function ServiceCategoryOption({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span
        className={cn(
          "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[4px] border",
          checked ? "border-[#e9b83f] bg-[#e9b83f]" : "border-[#d3dbe3] bg-white",
        )}
      />
      <span className="text-sm font-normal text-[#123e5e]">{label}</span>
    </label>
  );
}

export function FilterPanel({
  open = true,
  value = defaultFilterValues,
  statusOptions = defaultStatusOptions,
  dateRangeOptions = defaultDateRangeOptions,
  serviceCategoryOptions = defaultServiceCategoryOptions,
  onApply,
  onCancel,
}: FilterPanelProps) {
  const [draft, setDraft] = useState<FilterValues>(value);

  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  const toggleStatus = (next: string) => {
    setDraft((prev) => {
      if (next === "all") {
        return { ...prev, statuses: ["all"] };
      }

      const withoutAll = prev.statuses.filter((item) => item !== "all");
      const statuses = withoutAll.includes(next)
        ? withoutAll.filter((item) => item !== next)
        : [...withoutAll, next];

      return {
        ...prev,
        statuses: statuses.length === 0 ? ["all"] : statuses,
      };
    });
  };

  return (
    <div className="w-[268px] rounded-2xl border border-[#e4ebf1] bg-white p-5 font-['Manrope'] shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-[#123e5e]">Filters</h3>
        <button
          type="button"
          onClick={() => setDraft(defaultFilterValues)}
          className="text-sm font-medium text-[#e9b83f] transition-colors hover:text-[#d4a52e]"
        >
          Reset
        </button>
      </div>

      <div className="space-y-2.5">
        <p className="text-sm font-semibold text-[#123e5e]">Status</p>
        {statusOptions.map((option) => (
          <CheckOption
            key={option.value}
            label={option.label}
            checked={draft.statuses.includes(option.value)}
            onChange={() => toggleStatus(option.value)}
          />
        ))}
      </div>
      

      <div className="mt-5 space-y-2.5">
        <p className="text-sm font-semibold text-[#123e5e]">Service Category</p>
        {serviceCategoryOptions.map((option) => (
          <RadioOption
            key={option.value}
            label={option.label}
            checked={draft.dateRange === option.value}
            onChange={() => setDraft((prev) => ({ ...prev, dateRange: option.value }))}
          />
        ))}
      </div>


      <div className="mt-5 space-y-2.5">
        <p className="text-sm font-semibold text-[#123e5e]">Date Range</p>
        {dateRangeOptions.map((option) => (
          <RadioOption
            key={option.value}
            label={option.label}
            checked={draft.dateRange === option.value}
            onChange={() => setDraft((prev) => ({ ...prev, dateRange: option.value }))}
          />
        ))}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="h-10 flex-1 rounded-full border border-[#e4ebf1] bg-white text-sm font-medium text-[#123e5e] transition-colors hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onApply(draft)}
          className="h-10 flex-1 rounded-full bg-[#0a3558] text-sm font-medium text-white transition-colors hover:bg-[#07253e]"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
 
export default FilterPanel;
