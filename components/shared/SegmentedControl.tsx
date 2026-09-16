"use client";

import React from "react";

export interface SegmentedControlOption<T extends string> {
  label: string;
  value: T;
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className = "",
}: SegmentedControlProps<T>) {
  return (
    <div
      className={`inline-flex items-center gap-1 rounded-xl bg-[#F1F5F9] p-1 ${className}`}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition-all ${
            option.value === value
              ? "bg-[#103D5C] text-white shadow-sm"
              : "text-slate-600 hover:text-[#103D5C]"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default SegmentedControl;