"use client";

import { useState } from "react";
import { ChevronDown, Download } from "lucide-react";
import AnalyticsStats from "./AnalyticsStats";
import RevenueTrend from "./RevenueTrend";
import RevenueByCategory from "./RevenueByCategory";
import JobTrendByStatus from "./JobTrendByStatus";
import UserGrowth from "./UserGrowth";
import PopularServiceCategories from "./PopularServiceCategories";
import DashboardMetricsOverview, { MetricCard } from "./MetricCard";

const DATE_RANGES = ["Last 7 days", "Last 30 days", "Last 90 days", "Last 12 months"];

export default function AnalyticsPage() {
  const [selectedRange, setSelectedRange] = useState("Last 30 days");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6  font-['Manrope']">
      {/* Page Header */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-[#103D5C] text-xl font-medium leading-7">Analytics</h1>

        <div className="flex items-center gap-4">
          {/* Date Range Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen((v) => !v)}
              className="h-10 pl-4 pr-3 py-1 rounded-lg border border-[#E4EBF1] flex items-center gap-1.5 text-[#103D5C] text-sm font-medium hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <span>{selectedRange}</span>
              <ChevronDown className="w-4 h-4 text-[#103D5C]" />
            </button>

            {dropdownOpen && (
              <>
                {/* backdrop */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-[#E4EBF1] rounded-xl shadow-lg py-1 min-w-[160px]">
                  {DATE_RANGES.map((range) => (
                    <button
                      key={range}
                      type="button"
                      onClick={() => {
                        setSelectedRange(range);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                        selectedRange === range
                          ? "bg-[#103D5C] text-white"
                          : "text-[#103D5C] hover:bg-slate-50"
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Export Button */}
          <button
            type="button"
            className="h-10 px-4 py-2 bg-[#103D5C] hover:bg-[#0b2841] text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <AnalyticsStats />

      {/* Revenue Trend & Category Breakdown Grid */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.9fr)]">
        <RevenueTrend />
        <RevenueByCategory />
      </div>

      {/* Job Trend & User Growth Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <JobTrendByStatus />
        <UserGrowth />
      </div>


      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PopularServiceCategories />
        <DashboardMetricsOverview/>
      </div>
    </div>
  );
}


