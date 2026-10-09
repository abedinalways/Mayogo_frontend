"use client";

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
import { Client } from "@/types/client.types";

interface ClientStatsCardProps {
  client?: Client | null;
}

export default function ClientStatsCard({ client }: ClientStatsCardProps) {
  const jobRequested = client?.jobRequested ?? client?.totalJobs ?? 0;
  const availableBalance = client?.availableBalance
    ? `$${Number(client.availableBalance).toLocaleString()}`
    : "$0";
  const totalPending = client?.totalPending
    ? `$${Number(client.totalPending).toLocaleString()}`
    : "$0";
  const totalSpent = client?.totalSpent
    ? `$${Number(client.totalSpent).toLocaleString()}`
    : "$0";
  const jobsCancelled = client?.jobsCancelled ?? 0;
  const disputesRaised = client?.disputesRaised ?? 0;

  const stats: StatCardProps[] = [
    {
      title: "Total Job Requested",
      value: String(jobRequested),
      icon: Briefcase,
      glowColor: "#ffedd5",
    },
    {
      title: "Available Balance",
      value: availableBalance,
      icon: Wallet,
      glowColor: "#fae8ff",
    },
    {
      title: "Total Pendings",
      value: totalPending,
      icon: Clock,
      glowColor: "#e0f2fe",
    },
    {
      title: "Total Spent",
      value: totalSpent,
      icon: CircleDollarSign,
      glowColor: "#e0f2fe",
    },
    {
      title: "Job Cancelled",
      value: String(jobsCancelled),
      icon: CheckCircle2,
      glowColor: "#edfbd8",
    },
    {
      title: "Dispute Raised",
      value: String(disputesRaised),
      icon: AlertCircle,
      glowColor: "#fce7f3",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}