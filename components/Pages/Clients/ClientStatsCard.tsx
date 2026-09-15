import React from "react";
import {
  AlertCircle,
  Briefcase,
  CheckCircle2,
  CircleDollarSign,
  Clock,
  Wallet,
} from "lucide-react";
import { StatCard, StatCardProps } from "../Dashboard/StatCard";

const stats: StatCardProps[] = [
  {
    title: "Total Job Requested",
    value: "14",
    icon: Briefcase,
    glowColor: "#ffedd5", // Orange gradient glow (top-right)
  },
  {
    title: "Available Balance",
    value: "$ 2,800",
    icon: Wallet,
    glowColor: "#fae8ff", // Purple gradient glow
  },
  {
    title: "Total Pendings",
    value: "$4,800",
    icon: Clock,
    glowColor: "#e0f2fe", // Light blue gradient glow
  },
  {
    title: "Total Spent",
    value: "$5,600",
    icon: CircleDollarSign,
    glowColor: "#e0f2fe", // Blue gradient glow
  },
  {
    title: "Job Cancelled",
    value: "0",
    icon: CheckCircle2,
    glowColor: "#edfbd8", // Greenish gradient glow
  },
  {
    title: "Dispute Raised",
    value: "0",
    icon: AlertCircle,
    glowColor: "#fce7f3", // Pinkish/red gradient glow
  },
];

export default function ClientStatsCard() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}