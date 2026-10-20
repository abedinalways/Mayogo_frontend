"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, RotateCw, Loader2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useGetMonthlyEarningsQuery } from "@/lib/redux/api/dashboardApi";
import { DashboardTimeframe } from "@/types/dashboard.types";

interface EarningsData {
  month: string;
  revenue: number;
  commission: number;
}

const defaultData: EarningsData[] = [
  { month: "Jan", revenue: 2650, commission: 2250 },
  { month: "Feb", revenue: 2950, commission: 2680 },
  { month: "Mar", revenue: 3880, commission: 3550 },
  { month: "Apr", revenue: 3480, commission: 3200 },
  { month: "May", revenue: 2850, commission: 2600 },
  { month: "Jun", revenue: 3480, commission: 3200 },
];

const TIMEFRAME_OPTIONS: { label: string; value: DashboardTimeframe }[] = [
  { label: "Last 7 days", value: "last_7_days" },
  { label: "Last 30 days", value: "last_30_days" },
  { label: "Last 6 months", value: "last_6_months" },
  { label: "Last 12 months", value: "last_12_months" },
  { label: "This year", value: "this_year" },
  { label: "All time", value: "all_time" },
];

interface TooltipPayloadItem {
  value: number;
  dataKey: string;
  payload: EarningsData;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="rounded-xl border border-slate-100 bg-white p-3.5 shadow-xl font-['Manrope'] min-w-[180px]">
        <p className="text-xs font-semibold text-slate-800 mb-2">
          {item.month}
        </p>
        <div className="flex items-center justify-between gap-4 text-xs mb-1">
          <span className="text-slate-500">Total Revenue</span>
          <span className="font-bold text-[#0e3a5b]">
            ${Number(item.revenue || 0).toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4 text-xs">
          <span className="text-slate-500">Total Commission</span>
          <span className="font-bold text-[#f2ad1b]">
            ${Number(item.commission || 0).toLocaleString()}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export function MonthlyEarnings() {
  const [selectedTimeframe, setSelectedTimeframe] =
    useState<DashboardTimeframe>("last_12_months");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    data: apiEarnings,
    isLoading,
    isFetching,
    refetch,
  } = useGetMonthlyEarningsQuery({ timeframe: selectedTimeframe });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const chartData: EarningsData[] =
    Array.isArray(apiEarnings) && apiEarnings.length > 0
      ? apiEarnings.map((item) => ({
          month: item.month || "",
          revenue:
            typeof item.revenue === "number"
              ? item.revenue
              : Number(item.totalRevenue || item.revenue || 0),
          commission:
            typeof item.commission === "number"
              ? item.commission
              : Number(item.platformCommission || item.commission || 0),
        }))
      : defaultData;

  const maxVal = Math.max(
    ...chartData.map((d) => Math.max(d.revenue || 0, d.commission || 0)),
    3000
  );
  const upperDomain = Math.max(5000, Math.ceil((maxVal * 1.15) / 1000) * 1000);

  const activeLabel =
    TIMEFRAME_OPTIONS.find((opt) => opt.value === selectedTimeframe)?.label ||
    "Last 12 months";

  return (
    <div className="card-container">
      <div className="flex items-center justify-between pb-6 border-b border-slate-100/60">
        <h2 className="card-title">Monthly Earnings</h2>

        <div className="flex items-center gap-2">
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <span>{activeLabel}</span>
              <ChevronDown
                className={`h-4 w-4 text-amber-500 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 z-20 w-36 rounded-lg border border-slate-200 bg-white py-1 shadow-lg font-['Manrope']">
                {TIMEFRAME_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setSelectedTimeframe(option.value);
                      setIsDropdownOpen(false);
                    }}
                    className={`flex w-full items-center px-3 py-1.5 text-left text-xs transition-colors hover:bg-slate-50 ${
                      selectedTimeframe === option.value
                        ? "font-semibold text-amber-600 bg-amber-50/50"
                        : "text-slate-700"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isLoading || isFetching}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-amber-500 hover:bg-slate-50 transition-colors disabled:opacity-50"
            aria-label="Refresh data"
          >
            {isFetching ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RotateCw className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      <div className="mt-6 h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            barGap={4}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e2e8f0"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#8a9bab", fontSize: 12 }}
              domain={[0, upperDomain]}
              tickFormatter={(val) => `$${val >= 1000 ? `${val / 1000}K` : val}`}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#8a9bab", fontSize: 12 }}
              dy={10}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "transparent" }}
            />
            <Bar
              dataKey="revenue"
              fill="#0e3a5b"
              radius={[3, 3, 0, 0]}
              barSize={14}
            />
            <Bar
              dataKey="commission"
              fill="#f2ad1b"
              radius={[3, 3, 0, 0]}
              barSize={14}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-[#0e3a5b]" />
          <span className="text-xs font-medium text-slate-600">Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-[#f2ad1b]" />
          <span className="text-xs font-medium text-slate-600">Commission</span>
        </div>
      </div>
    </div>
  );
}

export default MonthlyEarnings;