import React from "react";

export function StatCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-100/80 bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-5 w-5 rounded-md bg-slate-200" />
        <div className="h-4 w-28 rounded bg-slate-200" />
      </div>

      {/* Content */}
      <div className="mt-6">
        <div className="h-8 w-28 rounded-md bg-slate-200" />
        <div className="mt-2.5 flex items-center gap-2">
          <div className="h-3.5 w-36 rounded bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

export function MonthlyEarningsSkeleton() {
  return (
    <div className="w-full card-container">
      {/* Header */}
      <div className="flex flex-col gap-3 pb-6 border-b border-slate-100/60 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="h-5 w-36 rounded bg-slate-200" />
          <div className="mt-1.5 h-3.5 w-48 rounded bg-slate-100" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-9 w-24 rounded-lg bg-slate-100" />
          <div className="h-9 w-9 rounded-lg bg-slate-100" />
        </div>
      </div>

      {/* Simulated Chart Bars */}
      <div className="mt-6 h-[280px] w-full flex items-end justify-between gap-3 px-4 pb-4 pt-6 border-b border-slate-100">
        {[
          { h1: "60%", h2: "45%" },
          { h1: "75%", h2: "60%" },
          { h1: "90%", h2: "80%" },
          { h1: "80%", h2: "70%" },
          { h1: "65%", h2: "55%" },
          { h1: "85%", h2: "75%" },
        ].map((item, idx) => (
          <div key={idx} className="flex flex-1 items-end justify-center gap-1.5 h-full">
            <div
              className="w-3 sm:w-4 rounded-t-sm bg-slate-200"
              style={{ height: item.h1 }}
            />
            <div
              className="w-3 sm:w-4 rounded-t-sm bg-slate-100"
              style={{ height: item.h2 }}
            />
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-xs bg-slate-300" />
          <div className="h-3 w-16 rounded bg-slate-100" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-xs bg-slate-200" />
          <div className="h-3 w-20 rounded bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

export function TopCategoriesSkeleton() {
  return (
    <div className="w-full card-container">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-100/60">
        <div className="h-5 w-32 rounded bg-slate-200" />
        <div className="h-8 w-8 rounded-lg bg-slate-100" />
      </div>

      {/* Donut Chart Skeleton */}
      <div className="relative mt-6 h-[260px] w-full flex items-center justify-center">
        <div className="h-44 w-44 rounded-full border-[22px] border-slate-100 flex items-center justify-center">
          <div className="flex flex-col items-center gap-1">
            <div className="h-4 w-12 rounded bg-slate-200" />
            <div className="h-3 w-16 rounded bg-slate-100" />
          </div>
        </div>
      </div>

      {/* Legend Pills */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
        {[1, 2, 3, 4, 5].map((idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-xs bg-slate-200" />
            <div className="h-3 w-20 rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function RecentJobsTableSkeleton() {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between border-t border-x border-[#E8E8E8] p-4 rounded-t-xl bg-white">
        <div className="h-5 w-28 rounded bg-slate-200" />
        <div className="h-9 w-24 rounded-lg bg-slate-100" />
      </div>

      {/* Table Container */}
      <div className="w-full overflow-x-auto rounded-b-xl border border-[#E8E8E8] bg-white">
        <table className="w-full min-w-[700px] text-left">
          <thead>
            <tr className="border-b border-[#E8E8E8] bg-slate-50/60">
              <th className="py-3 px-4"><div className="h-3.5 w-16 rounded bg-slate-200" /></th>
              <th className="py-3 px-4"><div className="h-3.5 w-20 rounded bg-slate-200" /></th>
              <th className="py-3 px-4"><div className="h-3.5 w-16 rounded bg-slate-200" /></th>
              <th className="py-3 px-4"><div className="h-3.5 w-16 rounded bg-slate-200" /></th>
              <th className="py-3 px-4"><div className="h-3.5 w-16 rounded bg-slate-200" /></th>
              <th className="py-3 px-4"><div className="h-3.5 w-14 rounded bg-slate-200" /></th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((row) => (
              <tr key={row} className="border-b border-slate-100 last:border-b-0">
                {/* Job ID */}
                <td className="py-4 px-4">
                  <div className="h-4 w-20 rounded bg-slate-200" />
                </td>
                {/* Service */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 shrink-0 rounded-lg bg-slate-200" />
                    <div className="flex flex-col gap-1">
                      <div className="h-3.5 w-28 rounded bg-slate-200" />
                      <div className="h-2.5 w-16 rounded bg-slate-100" />
                    </div>
                  </div>
                </td>
                {/* Client */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 shrink-0 rounded-full bg-slate-200" />
                    <div className="h-3.5 w-20 rounded bg-slate-100" />
                  </div>
                </td>
                {/* Expert */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 shrink-0 rounded-full bg-slate-200" />
                    <div className="h-3.5 w-20 rounded bg-slate-100" />
                  </div>
                </td>
                {/* Status */}
                <td className="py-4 px-4">
                  <div className="h-6 w-24 rounded-full bg-slate-100" />
                </td>
                {/* Amount */}
                <td className="py-4 px-4">
                  <div className="h-4 w-16 rounded bg-slate-200" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function RecentActivitySkeleton() {
  return (
    <div className="w-full card-container">
      {/* Header */}
      <div className="border-b border-slate-100 pt-2 pb-6 px-4 -mx-4">
        <div className="h-5 w-32 rounded bg-slate-200" />
      </div>

      {/* Activity List */}
      <div className="divide-y divide-slate-100/70">
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="flex items-start justify-between py-4">
            <div className="flex items-start gap-3.5 pr-4">
              <div className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-slate-200" />
              <div className="flex flex-col gap-1.5">
                <div className="h-4 w-36 rounded bg-slate-200" />
                <div className="h-3 w-56 rounded bg-slate-100" />
              </div>
            </div>
            <div className="h-3 w-16 shrink-0 rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TopExpertsSkeleton() {
  return (
    <div className="w-full card-container">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pt-2 pb-6 px-4 -mx-4 mb-4">
        <div className="h-5 w-28 rounded bg-slate-200" />
        <div className="h-3.5 w-16 rounded bg-slate-100" />
      </div>

      {/* Experts List */}
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="flex items-center gap-4 rounded-xl border border-slate-100 bg-[#f8fbfd] p-3.5"
          >
            <div className="h-[68px] w-[68px] shrink-0 rounded-full bg-slate-200" />
            <div className="flex flex-1 flex-col gap-2 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="h-4 w-32 rounded bg-slate-200" />
                  <div className="h-3 w-20 rounded bg-slate-100" />
                </div>
                <div className="h-4 w-12 shrink-0 rounded bg-slate-100" />
              </div>
              <div className="flex items-center gap-3">
                <div className="h-3 w-24 rounded bg-slate-100" />
                <div className="h-3 w-16 rounded bg-slate-100" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardSkeleton() {
  return (
    <div className="space-y-4 animate-pulse" aria-label="Loading dashboard...">
      {/* Top 6 Stat Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Row 1: Monthly Earnings + Top Categories */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.9fr)]">
        <MonthlyEarningsSkeleton />
        <TopCategoriesSkeleton />
      </div>

      {/* Row 2: Recent Jobs Table */}
      <RecentJobsTableSkeleton />

      {/* Row 3: Recent Activity + Top Experts */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.9fr)]">
        <RecentActivitySkeleton />
        <TopExpertsSkeleton />
      </div>
    </div>
  );
}
