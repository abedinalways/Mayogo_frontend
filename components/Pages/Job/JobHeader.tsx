import { Section } from "lucide-react";
import React from "react";
import JobDetails from "./JobDetails";
import JobCompletionEvidence from "./JobCompletionEvidence";

export interface JobHeaderProps {
  jobId?: string;
  title?: string;
  category?: string;
  level?: string;
  status?: "Completed" | "Pending" | "In Progress" | string;
  date?: string;
  time?: string;
}

export function JobHeader({
  jobId = "Job ID #JB001",
  title = "Teaching Mathematics",
  category = "Education & Tutoring",
  level = "Primary Level (From 1-4)",
  status = "Completed",
  date = "Jul 27, 2026",
  time = "11:00 AM",
}: JobHeaderProps) {
  return (
    <section>

      <div className="mb-6">
        <img className="w-full h-full object-cover " src="/job-cover.png" alt="job cover" />
      </div>

      <div className="flex w-full flex-col gap-3 font-['Manrope'] ">
        {/* Top Row: Job Meta & Status Badge */}
        <div className="flex w-full items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            {/* Job ID */}
            <span className="text-sm font-medium text-[#5c7285]">
              {jobId}
            </span>

            {/* Job Title */}
            <h2 className="text-xl font-semibold text-[#0a2540]">
              {title}
            </h2>

            {/* Category & Level */}
            <div className="flex items-center gap-1.5 text-xs font-medium text-[#627382]">
              <span>{category}</span>
              <span className="h-1 w-1 rounded-full bg-[#9aaab5]" />
              <span>{level}</span>
            </div>
          </div>

          {/* Status Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-md border border-[#c1f0e2] bg-[#ebfbf5] px-2.5 py-1 text-xs font-medium text-[#108a00]">
            <span className="h-2 w-2 rounded-full bg-[#108a00]" />
            <span>{status}</span>
          </div>
        </div>

        {/* Bottom Row: Date & Time Badges */}
        <div className="flex items-center gap-1.5">
          <span className="rounded border border-[#d2e9fb] bg-[#f0f7ff] px-2 py-0.5 text-xs font-medium text-[#1e72e2]">
            {date}
          </span>
          <span className="rounded border border-[#d2e9fb] bg-[#f0f7ff] px-2 py-0.5 text-xs font-medium text-[#1e72e2]">
            {time}
          </span>
        </div>
      </div>

     
    </section>
  );
}

export default JobHeader;