"use client";

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
import { useGetJobStatsQuery } from "@/lib/redux/api/jobApi";
import { useGetDisputeStatsQuery } from "@/lib/redux/api/disputeApi";
import {
  useGetExpertsQuery,
  useGetVerificationRequestsQuery,
} from "@/lib/redux/api/expertApi";

export default function DashboardStatsCard() {
  const { data: jobStatsData, isLoading: isLoadingJobStats } =
    useGetJobStatsQuery();
  const { data: disputeStats, isLoading: isLoadingDisputes } =
    useGetDisputeStatsQuery();
  const { data: expertsData, isLoading: isLoadingExperts } = useGetExpertsQuery({
    limit: 1,
  });
  const { data: verifData, isLoading: isLoadingVerif } =
    useGetVerificationRequestsQuery({ limit: 1 });

  const jobStats = jobStatsData?.data;

  const totalExperts = Array.isArray(expertsData?.data)
    ? expertsData.data.length
    : (expertsData?.data as { total?: number })?.total ?? 0;

  const pendingVerifications = Array.isArray(verifData?.data)
    ? verifData.data.length
    : (verifData?.data as { total?: number })?.total ?? 0;

  const openDisputesCount =
    (disputeStats?.open ?? 0) + (disputeStats?.underReview ?? 0);

  const stats: StatCardProps[] = [
    {
      title: "Total Revenue",
      value: isLoadingJobStats
        ? "..."
        : `$${Number(jobStats?.totalRevenue || 0).toLocaleString()}`,
      subtitle: "Gross platform revenue",
      icon: CircleDollarSign,
      glowColor: "#ffedd5",
    },
    {
      title: "Active Jobs",
      value: isLoadingJobStats ? "..." : (jobStats?.inProgress ?? 0).toString(),
      subtitle: `${jobStats?.pending ?? 0} pending acceptance`,
      icon: Briefcase,
      glowColor: "#fae8ff",
      trend: { value: "+12%", positive: true },
    },
    {
      title: "Active Experts",
      value: isLoadingExperts ? "..." : totalExperts.toString(),
      subtitle: "Registered professionals",
      icon: Users,
      glowColor: "#e0f2fe",
      trend: { value: "+8%", positive: true },
    },
    {
      title: "Open Disputes",
      value: isLoadingDisputes ? "..." : openDisputesCount.toString(),
      subtitle: `${disputeStats?.underReview ?? 0} under review`,
      icon: AlertCircle,
      glowColor: "#ffedd5",
    },
    {
      title: "Pending Verifications",
      value: isLoadingVerif ? "..." : pendingVerifications.toString(),
      subtitle: "Awaiting moderation approval",
      icon: ShieldCheck,
      glowColor: "#edfbd8",
    },
    {
      title: "Completed Jobs",
      value: isLoadingJobStats ? "..." : (jobStats?.completed ?? 0).toString(),
      subtitle: "Finished successfully",
      icon: Wallet,
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