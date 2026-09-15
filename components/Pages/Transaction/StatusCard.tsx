// StatCards.tsx
import React from "react";

import { StatCard, StatCardProps } from "../Dashboard/StatCard";

const stats: StatCardProps[] = [
  {
    title: "Total Revenue",
    value: "$480",
    glowColor: "#ffedd5",
  },
  {
    title: "Active Jobs",
    value: "14",
    glowColor: "#fae8ff",
  },
  {
    title: "Active Experts",
    value: "36",

    glowColor: "#e0f2fe",
  },
  {
    title: "Open Disputes",
    value: "40",

    glowColor: "#ffedd5",
  },
  {
    title: "Pending Verifications",
    value: "32",

    glowColor: "#edfbd8",
  },
];

export default function TransactionStatsCard() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-5">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
