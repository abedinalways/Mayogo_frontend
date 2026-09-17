"use client";

import React, { useState } from "react";
import { Plus, Image as ImageIcon, ExternalLink, Edit2, Trash2, Eye } from "lucide-react";

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaUrl: string;
  imageBg: string;
  status: "Active" | "Inactive";
  order: number;
}

const INITIAL_BANNERS: Banner[] = [
  {
    id: "banner-1",
    title: "Hire World-Class Vetted Experts",
    subtitle: "Connect with top 1% talent in design, engineering, and consulting within hours.",
    ctaText: "Explore Talents",
    ctaUrl: "/dashboard/experts",
    imageBg: "from-[#103D5C] to-[#0A2540]",
    status: "Active",
    order: 1,
  },
  {
    id: "banner-2",
    title: "Fast-Track Project Delivery with Escrow",
    subtitle: "Secure payment protection and milestone verification built for high-stakes projects.",
    ctaText: "Post a Job",
    ctaUrl: "/dashboard/jobs/create",
    imageBg: "from-[#0F4C81] to-[#1E3A8A]",
    status: "Active",
    order: 2,
  },
  {
    id: "banner-3",
    title: "Special Autumn Referral Discount 2026",
    subtitle: "Earn 5% platform cashback when you invite business partners.",
    ctaText: "Learn More",
    ctaUrl: "/dashboard/promotions",
    imageBg: "from-[#047857] to-[#065F46]",
    status: "Inactive",
    order: 3,
  },
];

export function HomepageBannerTab() {
  const [banners, setBanners] = useState<Banner[]>(INITIAL_BANNERS);

  const toggleStatus = (id: string) => {
    setBanners((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, status: b.status === "Active" ? "Inactive" : "Active" }
          : b
      )
    );
  };

  const handleDelete = (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="space-y-6 font-['Manrope']">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#E4EBF1] shadow-sm">
        <div>
          <h3 className="text-base font-bold text-[#103D5C]">
            Homepage Hero & Promotional Banners
          </h3>
          <p className="text-xs text-slate-500">
            Manage main hero slides, promotional copy, and CTA buttons on the landing page.
          </p>
        </div>

        <button
          type="button"
          className="flex h-10 items-center gap-2 rounded-lg bg-[#103D5C] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0b2841] shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Add Banner</span>
        </button>
      </div>

      {/* Banner Cards */}
      <div className="space-y-4">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="bg-white rounded-xl border border-[#E4EBF1] overflow-hidden shadow-sm flex flex-col lg:flex-row"
          >
            {/* Visual Preview Box */}
            <div
              className={`lg:w-1/3 p-6 bg-gradient-to-br ${banner.imageBg} text-white flex flex-col justify-between relative overflow-hidden`}
            >
              <div className="absolute right-[-20px] top-[-20px] opacity-10">
                <ImageIcon className="h-40 w-40" />
              </div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded bg-white/20 w-max backdrop-blur-sm">
                Order #{banner.order}
              </span>
              <div className="my-4 relative z-10">
                <h4 className="text-lg font-bold leading-tight mb-1">
                  {banner.title}
                </h4>
                <p className="text-xs text-slate-200 line-clamp-2">
                  {banner.subtitle}
                </p>
              </div>
              <button
                type="button"
                className="w-max px-3 py-1.5 rounded bg-white text-[#103D5C] text-xs font-bold flex items-center gap-1 shadow-sm"
              >
                <span>{banner.ctaText}</span>
                <ExternalLink className="h-3 w-3" />
              </button>
            </div>

            {/* Banner Details & Settings */}
            <div className="flex-1 p-5 flex flex-col justify-between space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-base font-bold text-[#103D5C]">
                      {banner.title}
                    </h4>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-md font-semibold ${
                        banner.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {banner.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mb-2">
                    {banner.subtitle}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">Target Link:</span>
                    <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                      {banner.ctaUrl}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => toggleStatus(banner.id)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                    banner.status === "Active"
                      ? "border-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100"
                      : "border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                  }`}
                >
                  {banner.status === "Active" ? "Deactivate" : "Activate Banner"}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#E4EBF1] text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Edit2 className="h-3.5 w-3.5 text-slate-500" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(banner.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomepageBannerTab;
