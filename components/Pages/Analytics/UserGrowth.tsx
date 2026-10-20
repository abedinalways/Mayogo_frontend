"use client";

import React, { useState, useMemo } from "react";
import { ChevronDown, RotateCw } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useGetUserGrowthQuery } from "@/lib/redux/api/analyticsApi";
import { AnalyticsTimeframe } from "@/types/analytics.types";

interface UserGrowthData {
  month: string;
  clients: number;
  experts: number;
}

const DEFAULT_DATA: UserGrowthData[] = [
  { month: "Jan", clients: 650, experts: 100 },
  { month: "Feb", clients: 1100, experts: 400 },
  { month: "Mar", clients: 500, experts: 1950 },
  { month: "Apr", clients: 2350, experts: 1650 },
  { month: "May", clients: 950, experts: 300 },
  { month: "Jun", clients: 950, experts: 1800 },
  { month: "Jul", clients: 1900, experts: 1300 },
  { month: "Aug", clients: 1900, experts: 1200 },
  { month: "Sep", clients: 1650, experts: 2300 },
  { month: "Oct", clients: 3000, experts: 450 },
  { month: "Nov", clients: 250, experts: 1100 },
  { month: "Dec", clients: 500, experts: 950 },
];

const TIME_RANGE_MAP: Record<string, AnalyticsTimeframe> = {
  "Last 7 days": "last_7_days",
  "Last 30 days": "last_30_days",
  "Last 90 days": "last_90_days",
  "Last 12 months": "last_12_months",
};

const TIME_RANGES = ["Last 7 days", "Last 30 days", "Last 90 days", "Last 12 months"];

interface TooltipEntry {
  dataKey?: string;
  value?: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    let clientsVal = 0;
    let expertsVal = 0;

    payload.forEach((entry) => {
      if (entry.dataKey === "clients") clientsVal = entry.value || 0;
      if (entry.dataKey === "experts") expertsVal = entry.value || 0;
    });

    return (
      <div className="rounded-xl border border-slate-100 bg-white p-3.5 shadow-xl font-['Manrope'] min-w-[150px]">
        <p className="text-xs font-semibold text-slate-800 mb-2">{label}</p>
        <div className="flex items-center justify-between gap-4 text-xs mb-1.5">
          <span className="text-slate-500">Clients</span>
          <span className="font-bold text-[#0e3a5b]">{clientsVal}</span>
        </div>
        <div className="flex items-center justify-between gap-4 text-xs">
          <span className="text-slate-500">Experts</span>
          <span className="font-bold text-[#f2ad1b]">{expertsVal}</span>
        </div>
      </div>
    );
  }
  return null;
};

interface UserGrowthProps {
  timeframe?: AnalyticsTimeframe;
}

export function UserGrowth({ timeframe: parentTimeframe }: UserGrowthProps) {
  const [timeRange, setTimeRange] = useState("Last 12 months");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  React.useEffect(() => {
    if (parentTimeframe) {
      const matched = Object.keys(TIME_RANGE_MAP).find(
        (key) => TIME_RANGE_MAP[key] === parentTimeframe
      );
      if (matched) {
        setTimeRange(matched);
      }
    }
  }, [parentTimeframe]);

  const activeTimeframe = TIME_RANGE_MAP[timeRange] || parentTimeframe || "last_12_months";

  const {
    data: apiResponse,
    isFetching,
    refetch,
  } = useGetUserGrowthQuery({ timeframe: activeTimeframe });

  const chartData = useMemo<UserGrowthData[]>(() => {
    const rawList = Array.isArray(apiResponse)
      ? apiResponse
      : apiResponse?.growth || apiResponse?.trend || apiResponse?.items || apiResponse?.data || [];

    if (!rawList || rawList.length === 0) {
      return DEFAULT_DATA;
    }

    return rawList.map((item) => ({
      month: String(item.month || ""),
      clients: Number(item.clients || 0),
      experts: Number(item.experts || 0),
    }));
  }, [apiResponse]);

  const maxVal = useMemo(() => {
    const highest = Math.max(
      ...chartData.map((d) => Math.max(d.clients, d.experts)),
      1000
    );
    return Math.ceil(highest / 900) * 900;
  }, [chartData]);

  const ticks = useMemo(() => {
    const step = maxVal / 4;
    return [0, step, step * 2, step * 3, maxVal];
  }, [maxVal]);

  return (
    <div className="card-container">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-100/60">
        <h2 className="card-title">User Growth</h2>

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
            onClick={() => refetch()}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-amber-500 hover:bg-slate-50 transition-colors cursor-pointer"
            aria-label="Refresh data"
            title="Refresh User Growth"
          >
            <RotateCw className={`h-3.5 w-3.5 text-amber-500 ${isFetching ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Multi-Line Chart */}
      <div className="mt-6 h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
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
              domain={[0, maxVal]}
              ticks={ticks}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#8a9bab", fontSize: 12 }}
              dy={10}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="clients"
              stroke="#0e3a5b"
              strokeWidth={2.5}
              dot={{ fill: "#0e3a5b", r: 3 }}
              activeDot={{ r: 6, fill: "#0e3a5b" }}
            />
            <Line
              type="monotone"
              dataKey="experts"
              stroke="#f2ad1b"
              strokeWidth={2.5}
              dot={{ fill: "#f2ad1b", r: 3 }}
              activeDot={{ r: 6, fill: "#f2ad1b" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-[#0e3a5b]" />
          <span className="text-xs font-medium text-slate-600">New Clients</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-[#f2ad1b]" />
          <span className="text-xs font-medium text-slate-600">New Experts</span>
        </div>
      </div>
    </div>
  );
}

export default UserGrowth;
