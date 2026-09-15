"use client";

import { ArrowUpDown, ChevronDown } from "lucide-react";
import { CustomDropdown } from "./CustomDropdown";
import { cn } from "@/lib/utils";

export type SortOption<T extends string = string> = {
  label: string;
  value: T;
};

export const defaultSortOptions: SortOption[] = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "A-Z", value: "a-z" },
  { label: "Z-A", value: "z-a" },
  { label: "Highest Amount", value: "highest" },
  { label: "Lowest Amount", value: "lowest" },
];

export type SortDropdownProps<T extends string = string> = {
  options?: SortOption<T>[];
  value?: T;
  onChange?: (value: T) => void;
  placeholder?: string;
  className?: string;
};

export function SortDropdown<T extends string = string>({
  options = defaultSortOptions as SortOption<T>[],
  value,
  onChange,
  placeholder = "Sort by",
  className,
}: SortDropdownProps<T>) {
  const selected = options.find((option) => option.value === value);

  return (
    <CustomDropdown
      triggerClassName={cn(
        "flex h-10 items-center gap-2 rounded-lg border border-[#e4ebf1] bg-white px-4 py-2 text-sm font-medium text-[#0f3453] transition-colors hover:bg-slate-50 focus:outline-none",
        className,
      )}
      trigger={({ open }) => (
        <>
          <ArrowUpDown className="h-4 w-4 shrink-0 text-[#0f3453]" />
          <span>{selected?.label ?? placeholder}</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-[#0f3453] transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </>
      )}
    >
      {({ close }) => (
        <div className="inline-flex w-40 flex-col items-start justify-center gap-2 rounded-xl border border-slate-100 bg-[#f8fbfd] p-3 font-['Manrope'] shadow-lg">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange?.(option.value);
                  close();
                }}
                className={cn(
                  "inline-flex h-10 w-full cursor-pointer items-center justify-start rounded-lg px-2 py-3 text-left transition-colors focus:outline-none",
                  isSelected
                    ? "bg-[#0f3453] font-medium text-white"
                    : "bg-transparent font-normal text-[#0f3453] hover:bg-slate-200/50",
                )}
              >
                <span className="text-sm leading-4">{option.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </CustomDropdown>
  );
}

export default SortDropdown;
