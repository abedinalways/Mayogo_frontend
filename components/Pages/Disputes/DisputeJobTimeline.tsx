"use client";

import React from "react";

export type TimelineStatus = "info" | "warning" | "success" | "error";

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timeAgo: string;
  status: TimelineStatus;
}

export interface DisputeJobTimelineProps {
  title?: string;
  events?: TimelineEvent[];
}

const defaultEvents: TimelineEvent[] = [
  {
    id: "1",
    title: "Dispute Raised",
    description: "Customer reported incomplete AC repair service",
    timeAgo: "3 minutes ago",
    status: "info",
  },
  {
    id: "2",
    title: "Assigned to Admin",
    description: "Case assigned to Sarah Parker for review",
    timeAgo: "3 minutes ago",
    status: "warning",
  },
  {
    id: "3",
    title: "Evidence Submitted",
    description: "Photos and service records were uploaded",
    timeAgo: "1 hour ago",
    status: "success",
  },
  {
    id: "4",
    title: "Decision Issued",
    description: "Partial refund of $50 approved",
    timeAgo: "4 minutes ago",
    status: "info",
  },
  {
    id: "5",
    title: "Case Closed",
    description: "Refund processed and dispute resolved",
    timeAgo: "2 hours ago",
    status: "error",
  },
];

const statusColorMap: Record<TimelineStatus, string> = {
  info: "bg-sky-500",
  warning: "bg-amber-400",
  success: "bg-emerald-500",
  error: "bg-rose-500",
};

export function DisputeJobTimeline({
  title = "Dispute Job Timeline",
  events = defaultEvents,
}: DisputeJobTimelineProps) {
  return (
    <div className="w-full rounded-2xl bg-white border border-slate-200 shadow-[0px_2px_4px_-1px_rgba(13,13,18,0.06)] flex flex-col justify-start items-start overflow-hidden font-['Manrope']">
      {/* Header */}
      <div className="w-full h-16 p-4 border-b border-slate-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#0a3558] leading-6">
          {title}
        </h3>
      </div>

      {/* Timeline List */}
      <div className="w-full px-4 flex flex-col justify-start items-start">
        {events.map((event, index) => {
          const isLast = index === events.length - 1;

          return (
            <div
              key={event.id}
              className={`w-full py-4 flex items-center justify-between gap-4 ${
                !isLast ? "border-b border-slate-100" : ""
              }`}
            >
              {/* Event Details */}
              <div className="flex-1 flex items-start gap-3 min-w-0">
                <div className="h-4 w-4 relative shrink-0 flex items-center justify-center">
                  <div
                    className={`h-2.5 w-2.5 rounded-full ${
                      statusColorMap[event.status] || "bg-sky-500"
                    }`}
                  />
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-sm font-normal text-slate-800 leading-4 truncate">
                    {event.title}
                  </span>
                  <span className="text-xs font-normal text-slate-500 leading-5">
                    {event.description}
                  </span>
                </div>
              </div>

              {/* Time Badge */}
              <span className="text-sm font-medium text-slate-500 leading-6 shrink-0">
                {event.timeAgo}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DisputeJobTimeline;