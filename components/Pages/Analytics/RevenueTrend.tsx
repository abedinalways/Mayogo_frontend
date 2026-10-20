"use client";

import React, { useState, useMemo } from "react";
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
import { useGetRevenueTrendQuery } from "@/lib/redux/api/analyticsApi";
import { AnalyticsTimeframe } from "@/types/analytics.types";

interface EarningsData {
  month: string;
  revenue: number;
  commission: number;
  formattedRevenue: string;
  formattedCommission: string;
}

const DEFAULT_DATA: EarningsData[] = [
  { month: "Jan", revenue: 2650, commission: 2250, formattedRevenue: "$120.5K", formattedCommission: "$16.2k" },
  { month: "Feb", revenue: 2880, commission: 2600, formattedRevenue: "$122.8K", formattedCommission: "$17.1k" },
  { month: "Mar", revenue: 2950, commission: 2680, formattedRevenue: "$123.4K", formattedCommission: "$17.8k" },
  { month: "Apr", revenue: 2650, commission: 2250, formattedRevenue: "$121.0K", formattedCommission: "$16.5k" },
  { month: "May", revenue: 2880, commission: 2600, formattedRevenue: "$122.5K", formattedCommission: "$17.0k" },
  { month: "Jun", revenue: 2950, commission: 2680, formattedRevenue: "$123.8K", formattedCommission: "$18.0k" },
  { month: "Jul", revenue: 3880, commission: 3550, formattedRevenue: "$124.5K", formattedCommission: "$18.4k" },
  { month: "Aug", revenue: 3480, commission: 3200, formattedRevenue: "$124.0K", formattedCommission: "$18.1k" },
  { month: "Sep", revenue: 2850, commission: 2600, formattedRevenue: "$122.9K", formattedCommission: "$17.2k" },
  { month: "Oct", revenue: 2700, commission: 2550, formattedRevenue: "$122.1K", formattedCommission: "$16.8k" },
  { month: "Nov", revenue: 2880, commission: 2600, formattedRevenue: "$123.0K", formattedCommission: "$17.3k" },
  { month: "Dec", revenue: 3450, commission: 3200, formattedRevenue: "$124.2K", formattedCommission: "$18.2k" },
];

const TIME_RANGE_MAP: Record<string, AnalyticsTimeframe> = {
  "Last 7 days": "last_7_days",
  "Last 30 days": "last_30_days",
  "Last 90 days": "last_90_days",
  "Last 12 months": "last_12_months",
};

const TIME_RANGES = ["Last 7 days", "Last 30 days", "Last 90 days", "Last 12 months"];

interface TooltipPayloadEntry {
  payload?: EarningsData;
  dataKey?: string;
  value?: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const itemData = payload[0]?.payload as EarningsData | undefined;
    const fullMonthNames: Record<string, string> = {
      Jan: "January", Feb: "February", Mar: "March", Apr: "April",
      May: "May", Jun: "June", Jul: "July", Aug: "August",
      Sep: "September", Oct: "October", Nov: "November", Dec: "December",
    };

    return (
      <div className="rounded-xl border border-slate-100 bg-white p-3.5 shadow-xl font-['Manrope'] min-w-[180px]">
        <p className="text-xs font-semibold text-slate-800 mb-2">
          {label && fullMonthNames[label] ? fullMonthNames[label] : label}
        </p>
        <div className="flex items-center justify-between gap-4 text-xs mb-1">
          <span className="text-slate-500">Total Revenue</span>
          <span className="font-bold text-[#0e3a5b]">
            {itemData?.formattedRevenue || `$${Number(itemData?.revenue || 0).toLocaleString()}`}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4 text-xs">
          <span className="text-slate-500">Total Commission</span>
          <span className="font-bold text-[#f2ad1b]">
            {itemData?.formattedCommission || `$${Number(itemData?.commission || 0).toLocaleString()}`}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

interface RevenueTrendProps {
  timeframe?: AnalyticsTimeframe;
}

export function RevenueTrend({ timeframe: parentTimeframe }: RevenueTrendProps) {
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
  } = useGetRevenueTrendQuery({ timeframe: activeTimeframe });

  const chartData = useMemo<EarningsData[]>(() => {
    const rawList = Array.isArray(apiResponse)
      ? apiResponse
      : apiResponse?.trend || apiResponse?.items || apiResponse?.data || [];

    if (!rawList || rawList.length === 0) {
      return DEFAULT_DATA;
    }

    return rawList.map((item) => {
      const rev = Number(item.revenue || 0);
      const comm = Number(item.commission || 0);
      return {
        month: String(
          item.month ||
            item.name ||
            item.label ||
            item.day ||
            item.date ||
            item.period ||
            ""
        ),
        revenue: rev,
        commission: comm,
        formattedRevenue:
          item.formattedRevenue ||
          (rev >= 1000 ? `$${(rev / 1000).toFixed(1)}K` : `$${rev.toLocaleString()}`),
        formattedCommission:
          item.formattedCommission ||
          (comm >= 1000 ? `$${(comm / 1000).toFixed(1)}K` : `$${comm.toLocaleString()}`),
      };
    });
  }, [apiResponse]);

  const maxVal = useMemo(() => {
    const highest = Math.max(
      ...chartData.map((d) => Math.max(d.revenue, d.commission)),
      1000
    );
    return Math.ceil(highest / 1000) * 1000;
  }, [chartData]);

  const ticks = useMemo(() => {
    const step = maxVal / 5;
    return [step, step * 2, step * 3, step * 4, maxVal];
  }, [maxVal]);

  return (
    <div className="card-container">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-100/60">
        <h2 className="card-title">Revenue Trend</h2>

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
            title="Refresh Revenue Trend"
          >
            <RotateCw className={`h-3.5 w-3.5 text-amber-500 ${isFetching ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Chart */}
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
              domain={[0, maxVal]}
              ticks={ticks}
              tickFormatter={(val) => (val >= 1000 ? `$${val / 1000}K` : `$${val}`)}
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
              barSize={12}
            />
            <Bar
              dataKey="commission"
              fill="#f2ad1b"
              radius={[3, 3, 0, 0]}
              barSize={12}
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

export default RevenueTrend;
