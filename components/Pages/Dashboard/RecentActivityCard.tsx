"use client";

import React from "react";
import { useGetRecentActivityQuery } from "@/lib/redux/api/dashboardApi";
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

function resolveActivityType(type?: string, title?: string): ActivityType {
  const t = (type || "").toLowerCase();
  const tit = (title || "").toLowerCase();

  if (t === "amber" || t === "blue" || t === "emerald" || t === "rose") {
    return t as ActivityType;
  }
  if (t.includes("dispute") || tit.includes("dispute")) {
    return "rose";
  }
  if (
    t.includes("verif") ||
    tit.includes("verif") ||
    tit.includes("document")
  ) {
    return "amber";
  }
  if (
    t.includes("complete") ||
    tit.includes("completed") ||
    t.includes("payout") ||
    tit.includes("payout")
  ) {
    return "emerald";
  }
  return "blue";
}

function formatRelativeTime(dateStr?: string | number): string {
  if (!dateStr) return "Just now";
  try {
    const timeVal =
      typeof dateStr === "number" ? dateStr : new Date(dateStr).getTime();
    const diff = Date.now() - timeVal;
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
  const {
    data: apiActivities,
    isLoading: isActivitiesLoading,
  } = useGetRecentActivityQuery({ limit: 5 });

  const hasApiData = Array.isArray(apiActivities) && apiActivities.length > 0;

  const { data: verifData } = useGetVerificationRequestsQuery(
    { limit: 3 },
    { skip: hasApiData }
  );
  const { data: disputesData } = useGetDisputesQuery(
    { limit: 3 },
    { skip: hasApiData }
  );
  const { data: jobsData } = useGetJobsQuery(
    { limit: 3, sortBy: "NEWEST_FIRST" },
    { skip: hasApiData }
  );

  let displayActivities: ActivityItem[] = [];

  if (hasApiData) {
    displayActivities = apiActivities.map((act, index) => {
      const type = resolveActivityType(act.type || act.eventType, act.title);
      const timeStr =
        act.time ||
        formatRelativeTime(act.timestamp || act.createdAt || Date.now() - index * 600000);

      return {
        id: act.id || `activity-${index}`,
        title: act.title || "Platform Event",
        description: act.description || "",
        time: timeStr,
        type,
      };
    });
  } else {
    const rawVerif: VerificationRequestItem[] = Array.isArray(verifData?.data)
      ? verifData.data
      : (verifData?.data as { requests?: VerificationRequestItem[]; items?: VerificationRequestItem[] })
          ?.requests ||
        (verifData?.data as { requests?: VerificationRequestItem[]; items?: VerificationRequestItem[] })
          ?.items ||
        [];

    const rawDisputes: DisputeItem[] = Array.isArray(disputesData?.data)
      ? disputesData.data
      : (disputesData as unknown as { disputes?: DisputeItem[]; items?: DisputeItem[] })?.disputes ||
        (disputesData as unknown as { disputes?: DisputeItem[]; items?: DisputeItem[] })?.items ||
        [];

    const rawJobs: AdminJobItem[] = Array.isArray(jobsData?.data)
      ? jobsData.data
      : (jobsData?.data as unknown as { jobs?: AdminJobItem[]; data?: AdminJobItem[] })?.jobs ||
        (jobsData?.data as unknown as { jobs?: AdminJobItem[]; data?: AdminJobItem[] })?.data ||
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

    displayActivities =
      dynamicActivities.length > 0
        ? dynamicActivities.slice(0, 5)
        : defaultActivities;
  }

  return (
    <div className={`w-full overflow-hidden card-container ${className}`}>
      <div className="border-b border-slate-100 pt-2 pb-6 px-4 -mx-4">
        <h2 className="text-lg font-semibold text-[#0f3453]">{title}</h2>
      </div>

      <div>
        {isActivitiesLoading && !displayActivities.length ? (
          <div className="flex flex-col gap-4 py-4 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                  <div className="flex flex-col gap-1">
                    <div className="h-3.5 w-28 rounded bg-slate-200" />
                    <div className="h-2.5 w-48 rounded bg-slate-100" />
                  </div>
                </div>
                <div className="h-3 w-14 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        ) : (
          displayActivities.map((item, index) => {
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
          })
        )}
      </div>
    </div>
  );
}

export default RecentActivityCard;