"use client";

import React, { useMemo } from "react";
import { RotateCw } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useGetRevenueByCategoryQuery } from "@/lib/redux/api/analyticsApi";
import { AnalyticsTimeframe } from "@/types/analytics.types";

interface CategoryData {
  name: string;
  value: number;
  jobs: number;
  revenue: string;
  color: string;
}

const DEFAULT_DATA: CategoryData[] = [
  { name: "Home Services", value: 25, jobs: 124, revenue: "$5,400", color: "#0a8a43" },
  { name: "Repair & Diagnostics", value: 18, jobs: 85, revenue: "$3,800", color: "#0075ff" },
  { name: "Installation", value: 15, jobs: 62, revenue: "$2,900", color: "#ec448a" },
  { name: "Education & Tutoring", value: 14, jobs: 45, revenue: "$2,100", color: "#8b52f5" },
  { name: "Remote Development", value: 12, jobs: 40, revenue: "$1,850", color: "#f2ad1b" },
  { name: "Care Services", value: 9, jobs: 32, revenue: "$1,400", color: "#f97316" },
  { name: "Construction & Property", value: 7, jobs: 24, revenue: "$1,100", color: "#06b6d4" },
];

const PALETTE = [
  "#0a8a43",
  "#0075ff",
  "#ec448a",
  "#8b52f5",
  "#f2ad1b",
  "#f97316",
  "#06b6d4",
  "#10b981",
  "#6366f1",
];

interface TooltipPayloadEntry {
  payload?: CategoryData;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const item = payload[0]?.payload as CategoryData | undefined;
    if (!item) return null;
    return (
      <div className="rounded-xl border border-slate-100 bg-white p-3.5 shadow-xl font-['Manrope'] min-w-[170px]">
        <p className="text-xs font-semibold text-slate-800 mb-2">{item.name}</p>
        <div className="flex items-center justify-between text-xs mb-1.5 gap-3">
          <span className="text-slate-400">Jobs:</span>
          <span className="font-bold text-[#0f3453]">{item.jobs}</span>
        </div>
        <div className="flex items-center justify-between text-xs gap-3">
          <span className="text-slate-400">Revenue:</span>
          <span className="font-bold text-[#0f3453]">{item.revenue}</span>
        </div>
      </div>
    );
  }
  return null;
};

interface RevenueByCategoryProps {
  timeframe?: AnalyticsTimeframe;
}

export function RevenueByCategory({ timeframe = "last_30_days" }: RevenueByCategoryProps) {
  const {
    data: apiResponse,
    isFetching,
    refetch,
  } = useGetRevenueByCategoryQuery({ timeframe });

  const chartData = useMemo<CategoryData[]>(() => {
    const rawList = Array.isArray(apiResponse)
      ? apiResponse
      : apiResponse?.categories || apiResponse?.items || apiResponse?.data || [];

    if (!rawList || rawList.length === 0) {
      return DEFAULT_DATA;
    }

    return rawList.map((item, idx) => {
      const name = item.name || item.categoryName || `Category ${idx + 1}`;
      const revNum =
        typeof item.revenue === "number"
          ? item.revenue
          : parseFloat(String(item.revenue || "0").replace(/[^0-9.-]+/g, "")) || 0;
      const formattedRevenue =
        typeof item.revenue === "string" && item.revenue.startsWith("$")
          ? item.revenue
          : `$${revNum.toLocaleString()}`;

      const valueNum =
        typeof item.value === "number"
          ? item.value
          : typeof item.percentage === "number"
          ? item.percentage
          : revNum;

      const jobsNum = Number(item.jobs ?? item.jobCount ?? 0);
      const color = item.color || PALETTE[idx % PALETTE.length];

      return {
        name,
        value: valueNum,
        jobs: jobsNum,
        revenue: formattedRevenue,
        color,
      };
    });
  }, [apiResponse]);

  return (
    <div className="card-container flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-100/60">
        <h2 className="card-title">Revenue by Service Category</h2>
        <button
          type="button"
          onClick={() => refetch()}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-amber-500 hover:bg-slate-50 transition-colors cursor-pointer"
          aria-label="Refresh data"
          title="Refresh Revenue by Category"
        >
          <RotateCw className={`h-3.5 w-3.5 text-amber-500 ${isFetching ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Chart Section */}
      <div className="relative mt-4 h-[240px] w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
              cornerRadius={6}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2.5">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-sm shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs font-medium text-slate-600 whitespace-nowrap">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RevenueByCategory;
