"use client";

import React from "react";

export type ActivityType = "amber" | "blue" | "emerald" | "rose";

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: ActivityType;
}

const defaultActivities: ActivityItem[] = [
  {
    id: "1",
    title: "Verification Submitted",
    description: "John Smith submitted verification documents",
    time: "3 minutes ago",
    type: "amber",
  },
  {
    id: "2",
    title: "New Job Requested",
    description: "Sarah Johnson requested a Plumbing Repair job",
    time: "4 minutes ago",
    type: "blue",
  },
  {
    id: "3",
    title: "Payout Approved",
    description: "Payout #PAY-124 approved for Michael Brown",
    time: "1 hour ago",
    type: "emerald",
  },
  {
    id: "4",
    title: "New Job Requested",
    description: "Sarah Johnson requested a Plumbing Repair job",
    time: "4 minutes ago",
    type: "blue",
  },
  {
    id: "5",
    title: "Dispute Created",
    description: "Dispute #DSP-032 opened for Job #JOB-1245",
    time: "2 hours ago",
    type: "rose",
  },
];

const dotColorMap: Record<ActivityType, string> = {
  amber: "bg-[#f2ad1b]",
  blue: "bg-[#0075ff]",
  emerald: "bg-[#0a8a43]",
  rose: "bg-[#ec448a]",
};

export interface RecentActivityCardProps {
  title?: string;
  activities?: ActivityItem[];
  className?: string;
}

export function RecentActivityCard({
  title = "Recent Activity",
  activities = defaultActivities,
  className = "",
}: RecentActivityCardProps) {
  return (
    <div
      className={`w-full  overflow-hidden card-container ${className}`}
    >
      {/* Card Header */}
      <div className="border-b border-slate-100 pt-2 pb-6 px-4 -mx-4">
        <h2 className="text-lg font-semibold text-[#0f3453]">{title}</h2>
      </div>

      {/* Activity List */}
      <div className="">
        {activities.map((item, index) => {
          const isLast = index === activities.length - 1;
          return (
            <div
              key={item.id}
              className={`flex items-start justify-between py-4 last:pb-0 ${
                !isLast ? "border-b border-slate-100/70" : ""
              }`}
            >
              {/* Left Content */}
              <div className="flex items-start gap-3.5 pr-4">
                <span
                  className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                    dotColorMap[item.type] || "bg-slate-400"
                  }`}
                  aria-hidden="true"
                />
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-sm font-semibold text-[#0f3453] leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs font-normal text-slate-500 leading-normal">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Timestamp */}
              <span className="shrink-0 text-xs font-medium text-slate-500">
                {item.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RecentActivityCard;