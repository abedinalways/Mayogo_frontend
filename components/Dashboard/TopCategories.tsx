"use client";

import React from "react";
import { RotateCw } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface CategoryData {
  name: string;
  value: number;
  jobs: number;
  revenue: string;
  color: string;
}

const data: CategoryData[] = [
  { name: "Home Services", value: 28, jobs: 124, revenue: "$5,400", color: "#0a8a43" },
  { name: "Repair & Diagnostics", value: 20, jobs: 85, revenue: "$3,800", color: "#0075ff" },
  { name: "Installation", value: 18, jobs: 62, revenue: "$2,900", color: "#ec448a" },
  { name: "Education & Tutoring", value: 17, jobs: 45, revenue: "$2,100", color: "#8b52f5" },
  { name: "Remote Development", value: 17, jobs: 40, revenue: "$1,850", color: "#f2ad1b" },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload as CategoryData;
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-xl font-['Manrope'] min-w-[180px]">
        <p className="text-sm font-semibold text-slate-800 mb-2">{item.name}</p>
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-400">Jobs:</span>
          <span className="font-bold text-[#0f3453]">{item.jobs}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Revenue:</span>
          <span className="font-bold text-[#0f3453]">{item.revenue}</span>
        </div>
      </div>
    );
  }
  return null;
};

export function TopCategoriesCard() {
  return (
    <div className="card-container">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-100/60">
        <h2 className="card-title">Top Categories</h2>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-amber-500 hover:bg-slate-50 transition-colors"
          aria-label="Refresh data"
        >
          <RotateCw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Chart Section */}
      <div className="relative mt-6 h-[260px] w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={6}
              cornerRadius={8}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs font-medium text-slate-600">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopCategoriesCard;