"use client";

import React from "react";
import { X } from "lucide-react";

export interface PreviewStaticContentProps {
  title?: string;
  lastUpdated?: string;
  content?: string;
  onClose: () => void;
}

const defaultPreviewContent = `
<h4 style="font-weight: 600; color: #103D5C; margin-bottom: 4px; font-size: 14px;">1. Acceptance of Terms</h4>
<p style="color: #4A5568; font-size: 12px; line-height: 1.6; margin-bottom: 16px;">
By accessing or using Nepotech ("Platform"), you agree to be bound by these Terms & Conditions ("Terms"). If you do not agree, you may not use the Platform.
</p>

<h4 style="font-weight: 600; color: #103D5C; margin-bottom: 4px; font-size: 14px;">2. Platform Role</h4>
<p style="color: #4A5568; font-size: 12px; line-height: 1.6; margin-bottom: 16px;">
Nepotech is a technology marketplace that connect customers with independent service providers ("Providers"). Nepotech does not provide services directly and is not an employer, agent, or e representative of any Provider.
</p>

<h4 style="font-weight: 600; color: #103D5C; margin-bottom: 4px; font-size: 14px;">3. Independent Contractors</h4>
<p style="color: #4A5568; font-size: 12px; line-height: 1.6; margin-bottom: 16px;">
Providers operate as Independent contractors. Nepotech does not control how services are performed and does not guarantee outcomes, workmanship, or results.
</p>

<h4 style="font-weight: 600; color: #103D5C; margin-bottom: 4px; font-size: 14px;">4. Eligibility</h4>
<p style="color: #4A5568; font-size: 12px; line-height: 1.6; margin-bottom: 16px;">
Users must be at least 18 years old and legally capable of entering into contracts.
</p>

<h4 style="font-weight: 600; color: #103D5C; margin-bottom: 4px; font-size: 14px;">5. Accounts</h4>
<p style="color: #4A5568; font-size: 12px; line-height: 1.6;">
You must provide accurate information when registering and keep your account secure.
</p>
`;

export default function PreviewStaticContent({
  title = "Nepotech Terms & Conditions",
  lastUpdated = "July 2026",
  content,
  onClose,
}: PreviewStaticContentProps) {
  return (
    <div className="w-full bg-white font-['Manrope']">
      {/* Modal Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h2 className="text-lg font-bold text-[#103D5C]">Preview</h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Live Preview Container */}
      <div className="mt-4 bg-[#F4F9FD] border border-slate-100 rounded-2xl p-3 md:p-4">
        <h3 className="text-xs md:text-sm font-semibold text-slate-700 mb-2">
          Live Preview
        </h3>

        {/* Inner Card */}
        <div className="bg-white rounded-xl p-4 md:p-5 shadow-xs border border-slate-100 max-h-[460px] overflow-y-auto">
          <h2 className="text-base md:text-lg font-bold text-[#103D5C]">
            {title}
          </h2>
          <p className="text-xs text-slate-400 mt-1 mb-4">
            Last Updated, {lastUpdated}
          </p>

          <div
            className="text-xs text-slate-600 leading-relaxed space-y-3 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: content || defaultPreviewContent }}
          />
        </div>
      </div>
    </div>
  );
}
