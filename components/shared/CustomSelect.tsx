"use client";

import React from "react";
import { cn } from "cn";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface CustomSelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface CustomSelectProps {
    label?: string;
    placeholder?: string;
    options: CustomSelectOption[];
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    disabled?: boolean;
    error?: string;
    helperText?: string;
    containerClassName?: string;
    triggerClassName?: string;
    contentClassName?: string;
    itemClassName?: string;
    isRequired?: boolean;
}

export function CustomSelect({
    label,
    placeholder = "Select an option",
    options,
    value,
    defaultValue,
    onValueChange,
    disabled,
    error,
    helperText,
    containerClassName = "",
    triggerClassName = "",
    contentClassName = "",
    itemClassName = "",
    isRequired,
}: CustomSelectProps) {
  const selectId = React.useId();

    return (
        <div
            className={cn(
                "w-full flex flex-col gap-1.5 font-['Manrope']",
                containerClassName
            )}
        >
            {label && (
                <label
                    htmlFor={selectId}
                    className="text-sm font-normal text-slate-600 leading-6 inline-flex items-center gap-0.5"
                >
                    <span>{label}</span>
                    {isRequired && (
                        <span className="text-red-500 text-base font-medium font-['Work_Sans'] leading-6">*</span>
                    )}
                </label>
            )}

      <Select
        value={value}
        defaultValue={defaultValue}
        onValueChange={(val) => onValueChange?.(val ?? "")}
        disabled={disabled}
      >
        <SelectTrigger
          id={selectId}
          className={cn(
            "w-full h-10 px-3 py-2 bg-white rounded-lg border border-slate-200 text-sm font-normal text-slate-800",
            "focus-visible:border-[#0a3558] focus-visible:ring-1 focus-visible:ring-[#0a3558]",
            "disabled:opacity-60 disabled:cursor-not-allowed",
            error &&
              "border-rose-500 focus-visible:border-rose-500 focus-visible:ring-rose-500 text-rose-500",
            triggerClassName,
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent
          side="bottom"
          sideOffset={4}
          align="start" // optional, but usually looks better
          alignItemWithTrigger={false}
          className={cn(
            "p-3 bg-slate-50 border border-slate-200 rounded-xl shadow-lg",
            "flex flex-col gap-2 font-['Manrope'] min-w-[var(--anchor-width)] ",
            contentClassName,
          )}
        >
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              className={cn(
                // base item styles
                "w-full h-10 px-2 py-3 rounded-lg text-sm transition-colors cursor-pointer",
                "flex items-center justify-start gap-2.5 outline-none select-none mb-2",
                // normal / unselected
                "bg-slate-100 text-slate-800 font-normal",
                // hover / highlighted (Base UI uses data-highlighted)
                "data-[highlighted]:bg-slate-200 data-[highlighted]:text-slate-900",
                // selected (Base UI uses data-[selected] or aria-selected)
                "data-[selected]:bg-[#0a3558] data-[selected]:text-white data-[selected]:font-medium",
                "aria-selected:bg-[#0a3558] aria-selected:text-white aria-selected:font-medium",
                // disabled
                "data-disabled:opacity-50 data-disabled:pointer-events-none",
                itemClassName,
              )}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {(error || helperText) && (
        <span
          className={cn(
            "text-xs font-normal leading-3",
            error ? "text-rose-500" : "text-slate-600",
          )}
        >
          {error || helperText}
        </span>
      )}
    </div>
  );
}

export default CustomSelect;
