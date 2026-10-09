"use client";

import React from "react";
import { useGetVerificationRequestsQuery } from "@/lib/redux/api/expertApi";
import { useGetDisputesQuery } from "@/lib/redux/api/disputeApi";
import { useGetJobsQuery } from "@/lib/redux/api/jobApi";
import { VerificationRequestItem } from "@/types/expert.types";
import { DisputeItem } from "@/types/dispute.types";
import { AdminJobItem } from "@/types/job.types";

export type ActivityType = "amber" | "blue" | "emerald" | "rose";

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: ActivityType;
  timestamp?: number;
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
    time: "15 minutes ago",
    type: "blue",
  },
  {
    id: "3",
    title: "Job Completed",
    description: "Air Conditioner repair completed by Daniel Green",
    time: "1 hour ago",
    type: "emerald",
  },
  {
    id: "4",
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

function formatRelativeTime(dateStr?: string): string {
  if (!dateStr) return "Just now";
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } catch {
    return "Recently";
  }
}

export interface RecentActivityCardProps {
  title?: string;
  activities?: ActivityItem[];
  className?: string;
}

export function RecentActivityCard({
  title = "Recent Activity",
  className = "",
}: RecentActivityCardProps) {
  const { data: verifData } = useGetVerificationRequestsQuery({ limit: 3 });
  const { data: disputesData } = useGetDisputesQuery({ limit: 3 });
  const { data: jobsData } = useGetJobsQuery({ limit: 3, sortBy: "NEWEST_FIRST" });

  const rawVerif: VerificationRequestItem[] = Array.isArray(verifData?.data)
    ? verifData.data
    : (verifData?.data as { requests?: VerificationRequestItem[]; items?: VerificationRequestItem[] })
        ?.requests ||
      (verifData?.data as { requests?: VerificationRequestItem[]; items?: VerificationRequestItem[] })
        ?.items ||
      [];

  const rawDisputes: DisputeItem[] =
    disputesData?.disputes ||
    disputesData?.data ||
    disputesData?.items ||
    [];

  const rawJobs: AdminJobItem[] = Array.isArray(jobsData?.data)
    ? jobsData.data
    : (jobsData?.data as { jobs?: AdminJobItem[]; data?: AdminJobItem[] })?.jobs ||
      (jobsData?.data as { jobs?: AdminJobItem[]; data?: AdminJobItem[] })?.data ||
      [];

  const dynamicActivities: ActivityItem[] = [];

  rawVerif.forEach((item) => {
    dynamicActivities.push({
      id: `verif-${item.id}`,
      title: "Verification Submitted",
      description: `${item.expert?.name || "An expert"} submitted verification documents`,
      time: formatRelativeTime(item.submittedAt || item.submissionDate),
      type: "amber",
      timestamp: item.submittedAt
        ? new Date(item.submittedAt).getTime()
        : Date.now() - 300000,
    });
  });

  rawDisputes.forEach((item) => {
    dynamicActivities.push({
      id: `disp-${item.id}`,
      title: "Dispute Created",
      description: `Dispute #${item.ticketNumber || item.ticketId || item.id.slice(0, 8)} opened for ${
        item.service?.name || item.subject || "a job"
      }`,
      time: formatRelativeTime(item.createdAt),
      type: "rose",
      timestamp: item.createdAt
        ? new Date(item.createdAt).getTime()
        : Date.now() - 7200000,
    });
  });

  rawJobs.forEach((item) => {
    const isCompleted = item.status === "COMPLETED";
    dynamicActivities.push({
      id: `job-${item.id}`,
      title: isCompleted ? "Job Completed" : "New Job Requested",
      description: `${
        item.client?.fullName || item.client?.name || "Client"
      } requested ${item.title || item.service?.name || "service"}`,
      time: formatRelativeTime(item.createdAt),
      type: isCompleted ? "emerald" : "blue",
      timestamp: item.createdAt
        ? new Date(item.createdAt).getTime()
        : Date.now() - 900000,
    });
  });

  dynamicActivities.sort(
    (a, b) => (b.timestamp || 0) - (a.timestamp || 0)
  );

  const displayActivities =
    dynamicActivities.length > 0
      ? dynamicActivities.slice(0, 5)
      : defaultActivities;

  return (
    <div className={`w-full overflow-hidden card-container ${className}`}>
      <div className="border-b border-slate-100 pt-2 pb-6 px-4 -mx-4">
        <h2 className="text-lg font-semibold text-[#0f3453]">{title}</h2>
      </div>

      <div>
        {displayActivities.map((item, index) => {
          const isLast = index === displayActivities.length - 1;
          return (
            <div
              key={item.id}
              className={`flex items-start justify-between py-4 last:pb-0 ${
                !isLast ? "border-b border-slate-100/70" : ""
              }`}
            >
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