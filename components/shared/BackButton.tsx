"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";

export interface BackButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export default function BackButton({
  label = "Back",
  onClick,
  className = "",
  ...props
}: BackButtonProps) {
  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e);
    } else if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`inline-flex items-center gap-1 text-sm font-medium text-slate-800 hover:text-slate-600 transition-colors cursor-pointer font-['Manrope'] leading-4 ${className}`}
      {...props}
    >
      <ArrowLeft className="h-4 w-4 text-[#0a3558]" />
      <span>{label}</span>
    </button>
  );
}