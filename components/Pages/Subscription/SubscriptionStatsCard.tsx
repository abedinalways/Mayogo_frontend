import React from "react";
import { StatCard, StatCardProps } from "../Dashboard/StatCard";

const subscriptionStats: StatCardProps[] = [
  {
    title: "Total Plans",
    value: "$24,500",
    glowColor: "#fae8ff",
  },
  {
    title: "Active Subscribers",
    value: "$24,500",
    glowColor: "#ffedd5",
  },
  {
    title: "Monthly Revenue",
    value: "$1,250",
    glowColor: "#e0f2fe",
  },
  {
    title: "Expired Subscriptions",
    value: "36",
    glowColor: "#edfbd8",
  },
];

export default function SubscriptionStatsCard() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {subscriptionStats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
