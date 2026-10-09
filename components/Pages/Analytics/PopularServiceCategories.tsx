"use client";

import React from "react";

export interface CategoryProgressItem {
  id: string;
  name: string;
  percentage: number;
  colorClass: string;
}

export interface PopularServiceCategoriesProps {
  title?: string;
  items?: CategoryProgressItem[];
  className?: string;
}

const DEFAULT_CATEGORIES: CategoryProgressItem[] = [
  {
    id: "home-services",
    name: "Home Services",
    percentage: 78,
    colorClass: "bg-[#00875A]",
  },
  {
    id: "repair-diagnostics",
    name: "Repair & Diagnostics",
    percentage: 60,
    colorClass: "bg-[#0065FF]",
  },
  {
    id: "installation",
    name: "Installation",
    percentage: 54,
    colorClass: "bg-[#E7398B]",
  },
  {
    id: "education-tutoring",
    name: "Education & Tutoring",
    percentage: 41,
    colorClass: "bg-[#7E57C2]",
  },
  {
    id: "remote-development",
    name: "Remote Development",
    percentage: 32,
    colorClass: "bg-[#F5A623]",
  },
];

export function PopularServiceCategories({
  title = "Popular Service Categories",
  items = DEFAULT_CATEGORIES,
  className = "",
}: PopularServiceCategoriesProps) {
  return (
    <div
      className={`w-full  rounded-2xl bg-white p-5 font-['Manrope'] shadow-[0px_2px_4px_-1px_rgba(13,13,18,0.06)] outline outline-1 outline-offset-[-1px] outline-slate-200 ${className}`}
    >
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-lg font-semibold text-[#103D5C]">{title}</h2>
      </div>

      <div className="flex flex-col gap-5 pt-5">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-6">
            <span className="w-44 text-sm font-medium text-[#103D5C]">
              {item.name}
            </span>

            <div className="flex flex-1 items-center gap-4">
              <div className="relative h-3.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all duration-500 ease-out ${item.colorClass}`}
                  style={{ width: `${Math.min(Math.max(item.percentage, 0), 100)}%` }}
                />
              </div>

              <span className="w-10 text-right text-sm font-medium text-slate-500">
                {item.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PopularServiceCategories;