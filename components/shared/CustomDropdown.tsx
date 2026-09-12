"use client";

import React, { useState } from "react";
import { ChevronDown, LucideIcon, ArrowUpDown, SlidersHorizontal } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface Option<T extends string = string> {
  label: string;
  value: T;
}


export interface CustomDropdownProps<T extends string = string> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  placeholder?: string;
  icon?: LucideIcon;
  width?: string;
  className?: string;
}

export function CustomDropdown<T extends string>({
  options,
  value,
  onChange,
  placeholder = "Select...",
  icon: Icon,
  width = "w-40",
  className = "",
}: CustomDropdownProps<T>) {
  const [open, setOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={`flex h-10 items-center gap-2 rounded-lg border border-[#e4ebf1] bg-white px-4 py-2 text-sm font-medium text-[#0f3453] transition-colors hover:bg-slate-50 focus:outline-none ${className}`}
      >
        {Icon && <Icon className="h-4 w-4 shrink-0 text-[#0f3453]" />}
        <span>{displayLabel}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[#0f3453] transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-auto p-0 border-none bg-transparent shadow-none"
      >
        <div
          className={`${width} rounded-xl border border-slate-100 bg-[#f8fbfd] p-3 shadow-lg inline-flex flex-col justify-center items-start gap-2 font-['Manrope']`}
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`self-stretch h-10 px-2 py-3 rounded-lg inline-flex justify-start items-center gap-2.5 transition-colors text-left cursor-pointer focus:outline-none ${
                  isSelected
                    ? "bg-[#0f3453] text-white font-medium"
                    : "bg-transparent text-[#0f3453] font-normal hover:bg-slate-200/50"
                }`}
              >
                <span className="text-sm leading-4">{option.label}</span>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default CustomDropdown;    