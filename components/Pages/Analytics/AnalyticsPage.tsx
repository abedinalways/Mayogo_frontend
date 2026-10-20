"use client";

import { useState } from "react";
import { ChevronDown, Download, Loader2 } from "lucide-react";
import AnalyticsStats from "./AnalyticsStats";
import RevenueTrend from "./RevenueTrend";
import RevenueByCategory from "./RevenueByCategory";
import JobTrendByStatus from "./JobTrendByStatus";
import UserGrowth from "./UserGrowth";
import PopularServiceCategories from "./PopularServiceCategories";
import DashboardMetricsOverview from "./MetricCard";
import { AnalyticsTimeframe } from "@/types/analytics.types";
import { downloadAnalyticsReport } from "@/lib/redux/api/analyticsApi";

const DATE_RANGE_OPTIONS: { label: string; value: AnalyticsTimeframe }[] = [
  { label: "Last 7 days", value: "last_7_days" },
  { label: "Last 30 days", value: "last_30_days" },
  { label: "Last 90 days", value: "last_90_days" },
  { label: "Last 12 months", value: "last_12_months" },
];

export default function AnalyticsPage() {
  const [selectedRange, setSelectedRange] = useState("Last 30 days");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const selectedTimeframe: AnalyticsTimeframe =
    DATE_RANGE_OPTIONS.find((opt) => opt.label === selectedRange)?.value ||
    "last_30_days";

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setExportError(null);
      await downloadAnalyticsReport({
        timeframe: selectedTimeframe,
        format: "csv",
      });
    } catch (err: any) {
      setExportError(err?.message || "Failed to export report");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 font-['Manrope']">
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
                  {DATE_RANGE_OPTIONS.map((opt) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => {
                        setSelectedRange(opt.label);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                        selectedRange === opt.label
                          ? "bg-[#103D5C] text-white"
                          : "text-[#103D5C] hover:bg-slate-50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Export Button */}
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="h-10 px-4 py-2 bg-[#103D5C] hover:bg-[#0b2841] text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{isExporting ? "Exporting..." : "Export"}</span>
          </button>
        </div>
      </div>

      {exportError && (
        <div className="p-3 text-xs bg-red-50 text-red-600 rounded-lg border border-red-200">
          {exportError}
        </div>
      )}

      {/* Stats Cards */}
      <AnalyticsStats timeframe={selectedTimeframe} />

      {/* Revenue Trend & Category Breakdown Grid */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.9fr)]">
        <RevenueTrend timeframe={selectedTimeframe} />
        <RevenueByCategory timeframe={selectedTimeframe} />
      </div>

      {/* Job Trend & User Growth Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <JobTrendByStatus timeframe={selectedTimeframe} />
        <UserGrowth timeframe={selectedTimeframe} />
      </div>

      {/* Popular Categories & Metrics Overview Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PopularServiceCategories timeframe={selectedTimeframe} />
        <DashboardMetricsOverview timeframe={selectedTimeframe} />
      </div>
    </div>
  );
}
