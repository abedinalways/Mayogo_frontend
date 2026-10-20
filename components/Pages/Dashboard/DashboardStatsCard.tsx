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
import { StatCardSkeleton } from "./DashboardSkeleton";
import { useGetKpiCardsQuery } from "@/lib/redux/api/dashboardApi";
import { useGetJobStatsQuery } from "@/lib/redux/api/jobApi";
import { useGetDisputeStatsQuery } from "@/lib/redux/api/disputeApi";
import {
  useGetExpertsQuery,
  useGetVerificationRequestsQuery,
} from "@/lib/redux/api/expertApi";

function extractCardData(
  kpiItem: any,
  fallbackVal: string | number,
  fallbackSubtitle: string,
  isCurrency: boolean = false
) {
  if (!kpiItem && kpiItem !== 0) {
    const formattedFallback =
      typeof fallbackVal === "number"
        ? fallbackVal.toLocaleString()
        : fallbackVal;
    return {
      value: isCurrency ? `$${formattedFallback}` : formattedFallback,
      subtitle: fallbackSubtitle,
      trend: undefined,
    };
  }

  if (typeof kpiItem === "number" || typeof kpiItem === "string") {
    const formatted =
      typeof kpiItem === "number" ? kpiItem.toLocaleString() : kpiItem;
    return {
      value: isCurrency ? `$${formatted}` : formatted,
      subtitle: fallbackSubtitle,
      trend: undefined,
    };
  }

  const rawVal =
    kpiItem.value ??
    kpiItem.count ??
    kpiItem.total ??
    kpiItem.amount ??
    fallbackVal;

  const formattedVal =
    typeof rawVal === "number" ? rawVal.toLocaleString() : rawVal;

  const value = isCurrency
    ? String(formattedVal).startsWith("$")
      ? formattedVal
      : `$${formattedVal}`
    : formattedVal;

  const subtitle =
    kpiItem.subtitle ||
    kpiItem.description ||
    kpiItem.note ||
    fallbackSubtitle;

  let trend: { value: string; positive: boolean } | undefined = undefined;
  if (kpiItem.trend) {
    trend = kpiItem.trend;
  } else if (
    kpiItem.changePercentage !== undefined ||
    kpiItem.change !== undefined ||
    kpiItem.percentage !== undefined
  ) {
    const pct =
      kpiItem.changePercentage ?? kpiItem.change ?? kpiItem.percentage;
    const num = typeof pct === "number" ? pct : parseFloat(String(pct));
    if (!isNaN(num)) {
      trend = {
        value: `${num > 0 ? "+" : ""}${num}%`,
        positive: num >= 0,
      };
    }
  }

  return { value, subtitle, trend };
}

export default function DashboardStatsCard() {
  const { data: kpiData, isLoading: isLoadingKpi } = useGetKpiCardsQuery();

  const { data: jobStatsData, isLoading: isLoadingJobStats } =
    useGetJobStatsQuery();
  const { data: disputeStats, isLoading: isLoadingDisputes } =
    useGetDisputeStatsQuery();
  const { data: expertsData, isLoading: isLoadingExperts } = useGetExpertsQuery({
    limit: 1,
  });
  const { data: verifData, isLoading: isLoadingVerif } =
    useGetVerificationRequestsQuery({ limit: 1 });

  const isAllLoading =
    isLoadingKpi &&
    isLoadingJobStats &&
    isLoadingDisputes &&
    isLoadingExperts &&
    isLoadingVerif;

  if (isAllLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const jobStats = jobStatsData?.data;

  const totalExperts = Array.isArray(expertsData?.data)
    ? expertsData.data.length
    : (expertsData?.data as { total?: number })?.total ?? 0;

  const pendingVerificationsCount = Array.isArray(verifData?.data)
    ? verifData.data.length
    : (verifData?.data as { total?: number })?.total ?? 0;

  const openDisputesCount =
    (disputeStats?.open ?? 0) + (disputeStats?.underReview ?? 0);

  const rawCards = Array.isArray(kpiData)
    ? kpiData
    : Array.isArray(kpiData?.cards)
    ? kpiData.cards
    : null;

  // 1. Total Revenue
  const revItem =
    rawCards?.[0] ||
    (kpiData as any)?.totalRevenue ||
    (kpiData as any)?.revenue;
  const revCard = extractCardData(
    revItem,
    jobStats?.totalRevenue || 0,
    "Gross platform revenue",
    true
  );

  // 2. Active Jobs
  const jobsItem =
    rawCards?.[1] ||
    (kpiData as any)?.activeJobs ||
    (kpiData as any)?.jobs;
  const jobsCard = extractCardData(
    jobsItem,
    jobStats?.inProgress ?? 0,
    `${jobStats?.pending ?? 0} pending acceptance`
  );
  if (!jobsCard.trend && jobsItem?.trend) {
    jobsCard.trend = jobsItem.trend;
  } else if (!jobsCard.trend) {
    jobsCard.trend = { value: "+12%", positive: true };
  }

  // 3. Active Experts
  const expertsItem =
    rawCards?.[2] ||
    (kpiData as any)?.activeExperts ||
    (kpiData as any)?.experts;
  const expertsCard = extractCardData(
    expertsItem,
    totalExperts,
    "Registered professionals"
  );
  if (!expertsCard.trend && expertsItem?.trend) {
    expertsCard.trend = expertsItem.trend;
  } else if (!expertsCard.trend) {
    expertsCard.trend = { value: "+8%", positive: true };
  }

  // 4. Open Disputes
  const disputesItem =
    rawCards?.[3] ||
    (kpiData as any)?.openDisputes ||
    (kpiData as any)?.disputes;
  const disputesCard = extractCardData(
    disputesItem,
    openDisputesCount,
    `${disputeStats?.underReview ?? 0} under review`
  );

  // 5. Pending Verifications
  const verifItem =
    rawCards?.[4] ||
    (kpiData as any)?.pendingVerifications ||
    (kpiData as any)?.verifications;
  const verifCard = extractCardData(
    verifItem,
    pendingVerificationsCount,
    "Awaiting moderation approval"
  );

  // 6. Pending Payouts / Completed Jobs
  const payoutsItem =
    rawCards?.[5] ||
    (kpiData as any)?.pendingPayouts ||
    (kpiData as any)?.payouts ||
    (kpiData as any)?.completedJobs;
  const payoutsCard = extractCardData(
    payoutsItem,
    jobStats?.completed ?? 0,
    "Finished successfully"
  );
  const card6Title =
    payoutsItem?.title ||
    ((kpiData as any)?.pendingPayouts ? "Pending Payouts" : "Completed Jobs");

  const stats: StatCardProps[] = [
    {
      title: "Total Revenue",
      value: revCard.value,
      subtitle: revCard.subtitle,
      icon: CircleDollarSign,
      glowColor: "#ffedd5",
      trend: revCard.trend,
    },
    {
      title: "Active Jobs",
      value: jobsCard.value,
      subtitle: jobsCard.subtitle,
      icon: Briefcase,
      glowColor: "#fae8ff",
      trend: jobsCard.trend,
    },
    {
      title: "Active Experts",
      value: expertsCard.value,
      subtitle: expertsCard.subtitle,
      icon: Users,
      glowColor: "#e0f2fe",
      trend: expertsCard.trend,
    },
    {
      title: "Open Disputes",
      value: disputesCard.value,
      subtitle: disputesCard.subtitle,
      icon: AlertCircle,
      glowColor: "#ffedd5",
      trend: disputesCard.trend,
    },
    {
      title: "Pending Verifications",
      value: verifCard.value,
      subtitle: verifCard.subtitle,
      icon: ShieldCheck,
      glowColor: "#edfbd8",
      trend: verifCard.trend,
    },
    {
      title: card6Title,
      value: payoutsCard.value,
      subtitle: payoutsCard.subtitle,
      icon: Wallet,
      glowColor: "#fce7f3",
      trend: payoutsCard.trend,
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