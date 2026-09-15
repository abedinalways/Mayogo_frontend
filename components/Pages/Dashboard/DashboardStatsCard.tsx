// StatCards.tsx
import React from "react";
import {
  AlertCircle,
  Briefcase,
  CircleDollarSign,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";
import { StatCard, StatCardProps } from "./StatCard";

const stats: StatCardProps[] = [
  {
    title: "Total Revenue",
    value: "$480",
    subtitle: "vs last month",
    icon: CircleDollarSign,
    glowColor: "#ffedd5",
    trend: { value: "-16%", positive: false },
  },
  {
    title: "Active Jobs",
    value: "14",
    subtitle: "3 new today",
    icon: Briefcase,
    glowColor: "#fae8ff",
    trend: { value: "+16%", positive: true },
  },
  {
    title: "Active Experts",
    value: "36",
    subtitle: "12 New This Week",
    icon: Users,
    glowColor: "#e0f2fe",
    trend: { value: "+16%", positive: true },
  },
  {
    title: "Open Disputes",
    value: "40",
    subtitle: "7 New This Week",
    icon: AlertCircle,
    glowColor: "#ffedd5",
  },
  {
    title: "Pending Verifications",
    value: "32",
    subtitle: "Awaiting moderation approval",
    icon: ShieldCheck,
    glowColor: "#edfbd8",
  },
  {
    title: "Pending Payouts",
    value: "20",
    subtitle: "$4,500 awaiting release",
    icon: Wallet,
    glowColor: "#fce7f3",
  },
];

export default function DashboardStatsCard() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}