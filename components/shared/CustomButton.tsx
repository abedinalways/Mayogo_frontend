"use client";

import React from "react";

export interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary";
  size?: "sm" | "md" | "lg";
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  children: React.ReactNode;
}

export default function CustomButton({
  variant = "primary",
  size = "sm",
  leadingIcon,
  trailingIcon,
  children,
  className = "",
  ...props
}: CustomButtonProps) {
  // Base styles matching design system specs
  const baseStyles =
    "inline-flex justify-center items-center gap-2 font-medium font-['Manrope'] transition-all focus:outline-none cursor-pointer active:scale-[0.98]";

  // Variant mappings
  const variantStyles = {
    primary: "bg-[#0a3558] hover:bg-[#07253e] text-white",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-800",
    tertiary:
      "bg-transparent text-[#0a3558] border border-[#0a3558] hover:bg-[#0a3558]/5",
  };

  // Size mappings matching Figma tokens (h-8 px-4 py-2 for 'sm')
  const sizeStyles = {
    sm: "h-8 px-4 py-2 text-sm rounded-lg leading-4",
    md: "h-10 px-6 py-3 text-sm rounded-lg leading-4",
    lg: "h-12 px-6 py-3.5 text-base rounded-lg leading-5",
  };

  return (
    <button
      type="button"
      data-property-1={variant}
      data-property-2={size}
      data-leading-icon={Boolean(leadingIcon)}
      data-trailing-icon={Boolean(trailingIcon)}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {leadingIcon && <span className="inline-flex shrink-0">{leadingIcon}</span>}
      <span className="justify-start">{children}</span>
      {trailingIcon && <span className="inline-flex shrink-0">{trailingIcon}</span>}
    </button>
  );
}