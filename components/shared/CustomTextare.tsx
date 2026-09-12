import React, { forwardRef } from "react";

// ==========================================
// 2. Custom Textarea Component
// ==========================================
export interface CustomTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  showCharacterCount?: boolean;
  containerClassName?: string;
}

export const CustomTextarea = forwardRef<HTMLTextAreaElement, CustomTextareaProps>(
  (
    {
      label,
      helperText,
      error,
      showCharacterCount = true,
      maxLength,
      value,
      defaultValue,
      onChange,
      containerClassName = "",
      className = "",
      disabled,
      rows = 3,
      id,
      ...props
    },
    ref
  ) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    const currentLength =
      typeof value === "string"
        ? value.length
        : typeof defaultValue === "string"
        ? defaultValue.length
        : 0;

    return (
      <div className={`w-full flex flex-col gap-1.5 font-['Manrope'] ${containerClassName}`}>
        {label && (
          <label htmlFor={textareaId} className="text-sm font-normal text-slate-600 leading-6">
            {label}
          </label>
        )}

        <div
          className={`w-full p-3 bg-white rounded-lg border transition-all flex flex-col gap-2 ${
            error
              ? "border-rose-500 focus-within:border-rose-500 focus-within:ring-1 focus-within:ring-rose-500"
              : "border-slate-200 focus-within:border-[#0a3558] focus-within:ring-1 focus-within:ring-[#0a3558]"
          } ${disabled ? "bg-slate-50 opacity-60 cursor-not-allowed" : ""}`}
        >
          <textarea
            id={textareaId}
            ref={ref}
            rows={rows}
            maxLength={maxLength}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            disabled={disabled}
            className={`w-full text-sm font-normal text-slate-800 placeholder-slate-400 focus:outline-hidden resize-none leading-6 bg-transparent disabled:cursor-not-allowed ${className}`}
            {...props}
          />

          {showCharacterCount && maxLength !== undefined && (
            <div className="text-right text-xs font-normal text-slate-400 leading-6 select-none">
              {currentLength}/{maxLength}
            </div>
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

CustomTextarea.displayName = "CustomTextarea";