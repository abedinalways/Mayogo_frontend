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

interface JobStatusData {
  month: string;
  completed: number;
  active: number;
  disputed: number;
}

const data: JobStatusData[] = [
  { month: "Jan", completed: 350, active: 200, disputed: 40 },
  { month: "Feb", completed: 510, active: 110, disputed: 35 },
  { month: "Mar", completed: 420, active: 170, disputed: 30 },
  { month: "Apr", completed: 720, active: 210, disputed: 45 },
  { month: "May", completed: 850, active: 160, disputed: 50 },
  { month: "Jun", completed: 1400, active: 190, disputed: 60 },
];

const TIME_RANGES = ["Last 7 days", "Last 30 days", "Last 90 days", "Last 6 months", "Last 12 months"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    // Collect data for each status
    let completedVal = 0;
    let activeVal = 0;
    let disputedVal = 0;

    payload.forEach((entry: any) => {
      if (entry.dataKey === "completed") completedVal = entry.value;
      if (entry.dataKey === "active") activeVal = entry.value;
      if (entry.dataKey === "disputed") disputedVal = entry.value;
    });

    return (
      <div className="rounded-xl border border-slate-100 bg-white p-3.5 shadow-xl font-['Manrope'] min-w-[160px]">
        <p className="text-xs font-semibold text-slate-800 mb-2">{label}</p>
        <div className="flex items-center justify-between gap-4 text-xs mb-1.5">
          <span className="text-slate-500">Completed</span>
          <span className="font-bold text-[#0a8a43]">{completedVal}</span>
        </div>
        <div className="flex items-center justify-between gap-4 text-xs mb-1.5">
          <span className="text-slate-500">Active</span>
          <span className="font-bold text-[#0075ff]">{activeVal}</span>
        </div>
        <div className="flex items-center justify-between gap-4 text-xs">
          <span className="text-slate-500">Disputed</span>
          <span className="font-bold text-[#ef4444]">{disputedVal}</span>
        </div>
      </div>
    );
  }
  return null;
};

export function JobTrendByStatus() {
  const [timeRange, setTimeRange] = useState("Last 6 months");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="card-container">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-100/60">
        <h2 className="card-title">Job Trend By Status</h2>

        <div className="flex items-center gap-2">
          {/* Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <span>{timeRange}</span>
              <ChevronDown className="h-4 w-4 text-amber-500" />
            </button>

            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-slate-200 rounded-lg shadow-lg py-1 min-w-[140px]">
                  {TIME_RANGES.map((range) => (
                    <button
                      key={range}
                      type="button"
                      onClick={() => {
                        setTimeRange(range);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                        timeRange === range
                          ? "bg-amber-50 text-amber-700"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-amber-500 hover:bg-slate-50 transition-colors cursor-pointer"
            aria-label="Refresh data"
          >
            <RotateCw className="h-3.5 w-3.5 text-amber-500" />
          </button>
        </div>
      </div>

      {/* Stacked Bar Chart */}
      <div className="mt-6 h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
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
              domain={[0, 2800]}
              ticks={[0, 350, 700, 1400, 2800]}
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
              dataKey="completed"
              stackId="a"
              fill="#0a8a43"
              barSize={24}
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="active"
              stackId="a"
              fill="#0075ff"
              barSize={24}
            />
            <Bar
              dataKey="disputed"
              stackId="a"
              fill="#ef4444"
              barSize={24}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-[#0a8a43]" />
          <span className="text-xs font-medium text-slate-600">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-[#0075ff]" />
          <span className="text-xs font-medium text-slate-600">Active</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-[#ef4444]" />
          <span className="text-xs font-medium text-slate-600">Disputed</span>
        </div>
      </div>
    </div>
  );
}

export default JobTrendByStatus;
