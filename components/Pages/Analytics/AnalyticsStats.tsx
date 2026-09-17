// AnalyticsStats.tsx
import React from "react";
import {
  CircleDollarSign,
  LayoutGrid,
  ArrowLeftRight,
  TrendingUp,
} from "lucide-react";
import { StatCard, StatCardProps } from "@/components/Pages/Dashboard/StatCard";

const stats: StatCardProps[] = [
  {
    title: "Total Revenue",
    value: "$124,500",
    subtitle: "vs last month",
    icon: CircleDollarSign,
    glowColor: "#ffedd5",
    trend: { value: "+12%", positive: true },
  },
  {
    title: "Platform Commission",
    value: "$12,450",
    subtitle: "vs last month",
    icon: LayoutGrid,
    glowColor: "#fae8ff",
    trend: { value: "+8%", positive: true },
  },
  {
    title: "Average Transaction Value",
    value: "$85",
    subtitle: "vs last month",
    icon: ArrowLeftRight,
    glowColor: "#e0f2fe",
    trend: { value: "+3.2%", positive: true },
  },
  {
    title: "Revenue Growth",
    value: "13%",
    subtitle: "vs last month",
    icon: TrendingUp,
    glowColor: "#edfbd8",
    trend: { value: "+7%", positive: true },
  },
];

export default function AnalyticsStats() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}