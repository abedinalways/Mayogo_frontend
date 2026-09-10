"use client";

import React, { useState } from "react";
import { ChevronDown, RotateCw } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface EarningsData {
  month: string;
  revenue: number;
  commission: number;
}

const data: EarningsData[] = [
  { month: "Jan", revenue: 2650, commission: 2250 },
  { month: "Feb", revenue: 2950, commission: 2680 },
  { month: "Mar", revenue: 3880, commission: 3550 },
  { month: "Apr", revenue: 3480, commission: 3200 },
  { month: "May", revenue: 2850, commission: 2600 },
  { month: "Jun", revenue: 3480, commission: 3200 },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (

      <div className="rounded-xl border border-slate-100 bg-white p-3.5 shadow-xl font-['Manrope'] min-w-[180px]">
        <p className="text-xs font-semibold text-slate-800 mb-2">Apr 17, 2026</p>
        <div className="flex items-center justify-between gap-4 text-xs mb-1">
          <span className="text-slate-500">Total Revenue</span>
          <span className="font-bold text-[#0e3a5b]">$124.5K</span>
        </div>
        <div className="flex items-center justify-between gap-4 text-xs">
          <span className="text-slate-500">Total Commission</span>
          <span className="font-bold text-[#f2ad1b]">$18.4k</span>
        </div>
      </div>
    );
  }
  return null;
};

export function MonthlyEarnings() {
  const [timeRange, setTimeRange] = useState("Last 6 months");

  return (
    <div className="card-container">

    {/* <div className="w-full rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)] font-['Manrope']"> */}
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-100/60">
        <h2 className="card-title">Monthly Earnings</h2>

        <div className="flex items-center gap-2">
          {/* Dropdown */}
          <div className="relative">
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <span>{timeRange}</span>
              <ChevronDown className="h-4 w-4 text-amber-500" />
            </button>
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-amber-500 hover:bg-slate-50 transition-colors"
            aria-label="Refresh data"
          >
            <RotateCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-6 h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
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
              domain={[0, 5000]}
              ticks={[1000, 2000, 3000, 4000, 5000]}
              tickFormatter={(val) => `$${val / 1000}K`}
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

      {/* Legend */}
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