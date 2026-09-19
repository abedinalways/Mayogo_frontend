"use client";

import React, { forwardRef } from "react";

// ==========================================
// 1. Custom Form Input Component
// ==========================================
export interface CustomInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leadingPrefix?: React.ReactNode;
  trailingSuffix?: React.ReactNode;
  containerClassName?: string;
  isRequired?: boolean;
}

export const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  (
    {
      label,
      helperText,
      error,
      leadingPrefix,
      trailingSuffix,
      containerClassName = "",
      className = "",
      disabled,
      id,
      isRequired,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    const showRequired = props.required || isRequired;

    return (
      <div className={`w-full flex flex-col gap-1.5 font-['Manrope'] ${containerClassName}`}>
        {label && (
          <label htmlFor={inputId} className="text-sm font-normal text-slate-600 leading-6 inline-flex items-center gap-0.5">
            <span>{label}</span>
            {showRequired && (
              <span className="text-red-500 text-base font-medium font-['Work_Sans'] leading-6">*</span>
            )}
          </label>
        )}

        <div
          className={`w-full h-10 px-3 bg-white rounded-lg border transition-all flex items-center gap-1 ${
            error
              ? "border-rose-500 focus-within:border-rose-500 focus-within:ring-1 focus-within:ring-rose-500"
              : "border-slate-200 focus-within:border-[#0a3558] focus-within:ring-1 focus-within:ring-[#0a3558]"
          } ${disabled ? "bg-slate-50 opacity-60 cursor-not-allowed" : ""}`}
        >
          {leadingPrefix && (
            <span className="text-base font-medium text-slate-800 shrink-0 select-none">
              {leadingPrefix}
            </span>
          )}

          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            className={`w-full text-base font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden bg-transparent disabled:cursor-not-allowed ${className}`}
            {...props}
          />

          {trailingSuffix && (
            <span className="shrink-0 text-slate-400 select-none">
              {trailingSuffix}
            </span>
          )}
        </div>

        {(error || helperText) && (
          <span
            className={`text-xs font-normal leading-3 ${
              error ? "text-rose-500" : "text-slate-600"
            }`}
          >
            {error || helperText}
          </span>
        )}
      </div>
    );
  }
);

CustomInput.displayName = "CustomInput";
