"use client";

import React from "react";
import { ChevronDown, Check } from "lucide-react";
import CustomDropdown from "./CustomDropdown";
import { cn } from "@/lib/utils";

export interface FilterDropdownProps {
  label?: string;
  placeholder?: string;
  options: { label: string; value: string }[];
  value?: string;
  onChange: (value: string) => void;
  className?: string;
}

export function FilterDropdown({
  label,
  placeholder = "Select option",
  options,
  value,
  onChange,
  className,
}: FilterDropdownProps) {
  const selectedLabel = options.find((option) => option.value === value)?.label;

  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      {label && (
        <label className="text-xs font-semibold text-[#103D5C]">{label}</label>
      )}
      <CustomDropdown
        triggerClassName={cn(
          "flex h-10 items-center justify-between gap-2 rounded-lg border border-[#e4ebf1] bg-white px-4 py-2.5 text-sm font-medium text-[#0f3453] transition-colors hover:bg-slate-50 focus:outline-none",
        )}
        trigger={
          <>
            <span>{selectedLabel || placeholder}</span>
            <ChevronDown className="h-4 w-4 shrink-0 text-[#9aaab5]" />
          </>
        }
        contentClassName="min-w-[120px] rounded-lg bg-white p-1 shadow-lg outline outline-1 outline-slate-100"
      >
        {({ close }) => (
          <div className="flex flex-col">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  close();
                }}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-xs font-medium hover:bg-slate-50 font-['Manrope']",
                  option.value === value
                    ? "bg-slate-50 text-[#103D5C]"
                    : "text-slate-700",
                )}
              >
                {option.label}
                {option.value === value && (
                  <Check className="h-3.5 w-3.5 text-[#103D5C]" />
                )}
              </button>
            ))}
          </div>
        )}
      </CustomDropdown>
    </div>
  );
}

export default FilterDropdown;