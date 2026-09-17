"use client";

import React from "react";
import { X } from "lucide-react";

export interface PreviewBannerProps {
  banner?: {
    title?: string;
    subtitle?: string;
    description?: string;
    ctaText?: string;
    image?: string;
  } | null;
  onClose: () => void;
}

export default function PreviewBanner({ banner, onClose }: PreviewBannerProps) {
  const title = banner?.title || "Trusted Experts Near You";
  const subtitle =
    banner?.subtitle ||
    banner?.description ||
    "Hire verified experts for every service in minutes.";
  const ctaText = banner?.ctaText || "Explore Experts";
  const image =
    banner?.image ||
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=80";

  return (
    <div className="font-['Manrope']">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#F0F4F8]">
        <h3 className="text-[#103D5C] text-[18px] font-semibold leading-6">
          Preview
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 transition-colors p-1"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Preview Container */}
      <div className="mt-4 p-4 rounded-2xl bg-[#F4F7F9]">
        <h4 className="text-[#103D5C] text-[16px] font-medium leading-[160%] mb-1.5">
          Live Preview
        </h4>

        {/* Live Card */}
        <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-r from-[#0C3859] via-[#0E466F] to-[#0A2E49] p-4 sm:p-5 flex items-center justify-between text-white shadow-md">
          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-400/15 via-transparent to-transparent pointer-events-none" />

          {/* Left Text & CTA */}
          <div className="relative z-10 flex-1 max-w-[55%] flex flex-col justify-center gap-1.5">
            <h4 className="text-sm sm:text-base font-bold leading-tight text-white">
              {title}
            </h4>
            <p className="text-[10px] sm:text-xs text-white/80 leading-relaxed line-clamp-2">
              {subtitle}
            </p>
            <div className="pt-1.5">
              <span className="inline-block bg-[#F5B517] text-[#103D5C] text-[10px] sm:text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm">
                {ctaText}
              </span>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative z-10 w-[42%] h-28 sm:h-32 flex items-end justify-end">
            <img
              src={image}
              alt="Banner preview"
              className="max-h-full max-w-full object-cover rounded-lg shadow"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
