"use client";

import React from "react";
import { AdminJobItem } from "@/types/job.types";

export interface JobHeaderProps {
  job?: AdminJobItem | null;
  jobId?: string;
  title?: string;
  category?: string;
  level?: string;
  status?: "Completed" | "Pending" | "In Progress" | string;
  date?: string;
  time?: string;
}

export function JobHeader({
  job,
  jobId = "Job ID #JB001",
  title = "Teaching Mathematics",
  category = "Education & Tutoring",
  level = "Primary Level (From 1-4)",
  status = "Completed",
  date = "Jul 27, 2026",
  time = "11:00 AM",
}: JobHeaderProps) {
  const displayJobId = job?.requestNumber || job?.jobId || jobId;
  const displayTitle = job?.title || job?.service?.name || title;
  const displayCategory = job?.category?.name || job?.service?.category || category;
  const displayLevel =
    job?.serviceType ||
    (job?.appointment?.estimatedDuration
      ? job.appointment.estimatedDuration.replace(/_/g, " ")
      : level);
  const displayStatus = job?.status || status;

  let displayDate = date;
  let displayTime = time;

  const rawDateTime =
    job?.appointment?.scheduledAt || job?.submittedAt || job?.createdAt;
  if (rawDateTime) {
    try {
      const dt = new Date(rawDateTime);
      displayDate = new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(dt);
      displayTime = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }).format(dt);
    } catch {
      displayDate = String(rawDateTime);
    }
  } else if (job?.appointment?.date) {
    displayDate = job.appointment.date;
    displayTime = job.appointment.time || time;
  }

  const normalizedStatus = String(displayStatus).toLowerCase();
  const isCompleted = normalizedStatus.includes("complete");
  const isPending = normalizedStatus.includes("pending");
  const isDisputed = normalizedStatus.includes("dispute");

  let statusBadgeClasses = "border-[#c1f0e2] bg-[#ebfbf5] text-[#108a00]";
  let statusDotClass = "bg-[#108a00]";

  if (isPending) {
    statusBadgeClasses = "border-amber-200 bg-amber-50 text-amber-700";
    statusDotClass = "bg-amber-500";
  } else if (isDisputed) {
    statusBadgeClasses = "border-rose-200 bg-rose-50 text-rose-700";
    statusDotClass = "bg-rose-500";
  } else if (!isCompleted) {
    statusBadgeClasses = "border-sky-200 bg-sky-50 text-sky-700";
    statusDotClass = "bg-sky-500";
  }

  return (
    <section>
      <div className="mb-6 rounded-2xl overflow-hidden max-h-56 bg-slate-100">
        <img
          className="w-full h-full object-cover"
          src={
            job?.thumbnailUrl ||
            job?.images?.[0]?.fileUrl ||
            job?.service?.image ||
            "/job-cover.png"
          }
          alt="job cover"
        />
      </div>

      <div className="flex w-full flex-col gap-3 font-['Manrope']">
        <div className="flex w-full items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-[#5c7285]">
              {displayJobId}
            </span>

            <h2 className="text-xl font-semibold text-[#0a2540]">
              {displayTitle}
            </h2>

            <div className="flex items-center gap-1.5 text-xs font-medium text-[#627382]">
              <span>{displayCategory}</span>
              <span className="h-1 w-1 rounded-full bg-[#9aaab5]" />
              <span>{displayLevel}</span>
            </div>
          </div>

          <div
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${statusBadgeClasses}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${statusDotClass}`} />
            <span>{displayStatus.replace(/_/g, " ")}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-normal text-[#5c7285]">
          <div className="flex items-center gap-1">
            <span className="font-medium text-[#0a2540]">Date:</span>
            <span>{displayDate}</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="font-medium text-[#0a2540]">Time:</span>
            <span>{displayTime}</span>
          </div>
        </div>
      </div>
    </section>
  );
}