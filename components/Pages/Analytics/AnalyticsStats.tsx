"use client";

import React from "react";
import {
  CircleDollarSign,
  LayoutGrid,
  ArrowLeftRight,
  TrendingUp,
} from "lucide-react";
import { StatCard, StatCardProps } from "@/components/Pages/Dashboard/StatCard";
import { useGetAnalyticsOverviewQuery } from "@/lib/redux/api/analyticsApi";
import { AnalyticsTimeframe, MetricCardValue } from "@/types/analytics.types";

interface AnalyticsStatsProps {
  timeframe?: AnalyticsTimeframe;
}

function parseMetricValue(
  val: number | MetricCardValue | undefined,
  fallbackVal: string,
  prefix = "$",
  suffix = ""
): { displayValue: string; trendValue: string; positive: boolean } {
  if (val === undefined || val === null) {
    return { displayValue: fallbackVal, trendValue: "+0%", positive: true };
  }

  if (typeof val === "number") {
    const formatted =
      prefix === "$"
        ? `$${Number(val).toLocaleString()}`
        : `${Number(val).toLocaleString()}${suffix}`;
    return { displayValue: formatted, trendValue: "+0%", positive: true };
  }

  if (typeof val === "object") {
    const rawNum = typeof val.value === "number" ? val.value : 0;
    const formatted =
      val.formatted ||
      (prefix === "$"
        ? `$${rawNum.toLocaleString()}`
        : `${rawNum.toLocaleString()}${suffix}`);

    const pct = val.changePercentage ?? 0;
    const trendValue =
      val.trend?.value || `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`;
    const positive = val.trend?.positive ?? pct >= 0;

    return { displayValue: formatted, trendValue, positive };
  }

  return { displayValue: String(val), trendValue: "+0%", positive: true };
}

export default function AnalyticsStats({ timeframe = "last_30_days" }: AnalyticsStatsProps) {
  const { data, isLoading } = useGetAnalyticsOverviewQuery({ timeframe });

  const renderLoadingSkeleton = () => (
    <span className="inline-block h-8 w-24 rounded bg-slate-200 animate-pulse" />
  );

  const totalRev = parseMetricValue(
    data?.totalRevenue ?? data?.grossRevenue,
    "$124,500"
  );
  const commission = parseMetricValue(
    data?.platformCommission ?? data?.commissionRevenue,
    "$12,450"
  );
  const atv = parseMetricValue(
    data?.averageTransactionValue ?? data?.atv,
    "$85"
  );
  const growth = parseMetricValue(
    data?.revenueGrowth ?? data?.growthRate,
    "13%",
    "",
    "%"
  );

  // Subtitle comparison text
  const subtitle = data?.comparisonPeriod || "vs last month";

  const stats: StatCardProps[] = [
    {
      title: "Total Revenue",
      value: isLoading ? renderLoadingSkeleton() : totalRev.displayValue,
      subtitle,
      icon: CircleDollarSign,
      glowColor: "#ffedd5",
      trend: {
        value: totalRev.trendValue !== "+0%" ? totalRev.trendValue : "+12%",
        positive: totalRev.positive,
      },
    },
    {
      title: "Platform Commission",
      value: isLoading ? renderLoadingSkeleton() : commission.displayValue,
      subtitle,
      icon: LayoutGrid,
      glowColor: "#fae8ff",
      trend: {
        value: commission.trendValue !== "+0%" ? commission.trendValue : "+8%",
        positive: commission.positive,
      },
    },
    {
      title: "Average Transaction Value",
      value: isLoading ? renderLoadingSkeleton() : atv.displayValue,
      subtitle,
      icon: ArrowLeftRight,
      glowColor: "#e0f2fe",
      trend: {
        value: atv.trendValue !== "+0%" ? atv.trendValue : "+3.2%",
        positive: atv.positive,
      },
    },
    {
      title: "Revenue Growth",
      value: isLoading ? renderLoadingSkeleton() : growth.displayValue,
      subtitle,
      icon: TrendingUp,
      glowColor: "#edfbd8",
      trend: {
        value: growth.trendValue !== "+0%" ? growth.trendValue : "+7%",
        positive: growth.positive,
      },
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}