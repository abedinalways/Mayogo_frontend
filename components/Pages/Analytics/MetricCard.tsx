"use client";

import React from "react";

export interface MetricItem {
  label: string;
  value: string | number;
}

export interface MetricCardProps {
  title: string;
  primaryValue: string | number;
  subtitle: string;
  metrics: MetricItem[];
  className?: string;
}

export  function MetricCard({
  title,
  primaryValue,
  subtitle,
  metrics,
  className = "",
}: MetricCardProps) {
  return (
    <div
      className={`flex flex-1 flex-col rounded-2xl bg-white p-5 font-['Manrope'] shadow-[0px_2px_4px_-1px_rgba(13,13,18,0.06)] outline outline-1 outline-offset-[-1px] outline-slate-200 ${className}`}
    >
      {/* Header */}
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-lg font-semibold text-[#103D5C]">{title}</h3>
      </div>

      {/* Main Metric Section */}
      <div className="flex flex-col gap-1 border-b border-slate-100 py-5">
        <span className="text-3xl font-semibold tracking-tight text-[#103D5C]">
          {primaryValue}
        </span>
        <span className="text-sm font-normal text-slate-500">{subtitle}</span>
      </div>

      {/* Itemized Breakdown List */}
      <div className="flex flex-col gap-3.5 pt-5">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="flex items-center justify-between text-sm font-medium"
          >
            <span className="text-[#103D5C]">{metric.label}</span>
            <span className="text-slate-500">{metric.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export interface DashboardMetricsOverviewProps {
  disputeData?: {
    rate?: string;
    subtitle?: string;
    metrics?: MetricItem[];
  };
  verificationData?: {
    total?: number | string;
    subtitle?: string;
    metrics?: MetricItem[];
  };
}

export default function DashboardMetricsOverview({
  disputeData = {
    rate: "3.2%",
    subtitle: "31 Dispute Job Raised",
    metrics: [
      { label: "Open Disputed", value: 18 },
      { label: "Solved Disputed", value: 40 },
    ],
  },
  verificationData = {
    total: 245,
    subtitle: "Requested from experts",
    metrics: [
      { label: "Approved", value: 203 },
      { label: "Pending", value: 27 },
      { label: "Rejected", value: 14 },
    ],
  },
}: DashboardMetricsOverviewProps) {
  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
      {/* Dispute Rate Card */}
      <MetricCard
        title="Dispute Rate"
        primaryValue={disputeData.rate ?? "3.2%"}
        subtitle={disputeData.subtitle ?? "31 Dispute Job Raised"}
        metrics={disputeData.metrics ?? []}
      />

      {/* Verification Requests Card */}
      <MetricCard
        title="Verification Requests"
        primaryValue={verificationData.total ?? 245}
        subtitle={verificationData.subtitle ?? "Requested from experts"}
        metrics={verificationData.metrics ?? []}
      />
    </div>
  );
}