"use client";

import React from "react";

interface CustomAmberCheckboxProps {
  checked: boolean;
  onChange: () => void;
  ariaLabel?: string;
}

export function CustomAmberCheckbox({
  checked,
  onChange,
  ariaLabel,
}: CustomAmberCheckboxProps) {
  return (
    <label className="inline-flex items-center justify-center cursor-pointer p-1">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        aria-label={ariaLabel}
        className="sr-only"
      />
      <div
        className={`h-5 w-5 rounded-md border-2 transition-all flex items-center justify-center ${
          checked
            ? "border-[#F59E0B] bg-[#F59E0B] text-white"
            : "border-[#F59E0B] bg-transparent hover:border-[#D97706]"
        }`}
      >
        {checked && (
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
          </svg>
        )}
      </div>
    </label>
  );
}