"use client";

import React from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export interface SegmentedControlOption<T extends string> {
  label: string;
  value: T;
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentedControlOption<T>[];
  value?: T;
  onChange?: (value: T) => void;
  className?: string;
  /**
   * If provided, SegmentedControl automatically reads/writes tab selection to this URL query parameter.
   * e.g., paramKey="tab" -> updates ?tab=value in URL
   */
  paramKey?: string;
  defaultValue?: T;
  /**
   * Whether to use router.replace instead of router.push when updating URL params.
   * Default: false (uses router.push so browser history back/forward works)
   */
  replaceUrl?: boolean;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className = "",
  paramKey,
  defaultValue,
  replaceUrl = false,
}: SegmentedControlProps<T>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Determine active value
  const paramValue = paramKey ? searchParams.get(paramKey) : null;
  const isParamValid = paramValue ? options.some((opt) => opt.value === paramValue) : false;

  const activeValue = isParamValid
    ? (paramValue as T)
    : value !== undefined
    ? value
    : defaultValue !== undefined
    ? defaultValue
    : options[0]?.value;

  const handleSelect = (newValue: T) => {
    if (paramKey) {
      const params = new URLSearchParams(searchParams.toString());
      params.set(paramKey, newValue);
      const queryString = params.toString();
      const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;
      if (replaceUrl) {
        router.replace(targetUrl, { scroll: false });
      } else {
        router.push(targetUrl, { scroll: false });
      }
    }
    onChange?.(newValue);
  };

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-xl bg-[#F1F5F9] p-1 ${className}`}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => handleSelect(option.value)}
          className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition-all ${
            option.value === activeValue
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