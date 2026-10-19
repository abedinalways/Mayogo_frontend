"use client";

import React from "react";
import { Briefcase, User, MapPin } from "lucide-react";
import { AdminJobItem } from "@/types/job.types";

export interface RequirementItem {
  label: string;
  value: string;
}

export interface JobDetailsProps {
  job?: AdminJobItem | null;
  title?: string;
  description?: string;
  requirements?: RequirementItem[];
  location?: {
    address: string;
    city: string;
    mapImageUrl: string;
  };
}

export function JobDetails({
  job,
  title = "Job Details",
  description = "My son needs help improving his math grades before final exams. He is struggling with algebra and geometry and needs a qualified tutor who can provide structured lessons, regular practice, and exam-focused guidance.",
  requirements,
  location,
}: JobDetailsProps) {
  const displayDescription = job?.description || description;

  let displayRequirements: RequirementItem[] = requirements || [];
  if (!requirements) {
    if (job) {
      displayRequirements = [
        { label: "Service", value: job.service?.name || "General Service" },
        { label: "Service Type", value: job.serviceType || "In-Person" },
        { label: "Appointment Date", value: job.appointment?.date || job.date || "N/A" },
        { label: "Appointment Time", value: job.appointment?.time || "N/A" },
        { label: "Estimated Duration", value: job.appointment?.duration || "2 hours" },
        { label: "Payment Status", value: String(job.paymentStatus || job.payment || "Pending") },
      ];
    } else {
      displayRequirements = [
        { label: "Subjects", value: "Pure Mathematics" },
        { label: "Student’s Current Grade", value: "Form 3" },
        { label: "Service Type", value: "In-Person" },
        { label: "Frequency", value: "Weekly" },
        { label: "Appointment Date", value: "July 28, 2026" },
        { label: "Appointment Time", value: "02:00 PM" },
        { label: "Estimated Duration", value: "2 hours" },
      ];
    }
  }

  let addressText = location?.address || "House 18, Mwai Kibaki Road";
  let cityText = location?.city || "Mikocheni, Dar es Salaam";

  if (job?.location) {
    if (typeof job.location === "object" && job.location !== null) {
      addressText = job.location.address || addressText;
      cityText = job.location.city || cityText;
    } else if (typeof job.location === "string") {
      cityText = job.location;
    }
  }

  return (
    <div className="flex w-full flex-col gap-6 font-['Manrope']">
      <div className="flex items-center gap-1.5">
        <Briefcase className="h-4 w-4 text-[#e1b12c]" />
        <h3 className="text-base font-semibold text-[#0a2540]">
          {title}
        </h3>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h4 className="text-sm font-medium text-[#0a2540]">
            Description
          </h4>
          <p className="text-sm font-normal text-[#5c7285] leading-6">
            {displayDescription}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-3 rounded-2xl border border-[#e4ebf1] bg-white p-4">
            <div className="flex items-center gap-1.5 border-b border-[#f0f4f8] pb-3">
              <User className="h-4 w-4 text-[#f59e0b]" />
              <h4 className="text-sm font-semibold text-[#0f3453]">
                Requirements & Expectations
              </h4>
            </div>

            <div className="flex flex-col gap-2.5">
              {displayRequirements.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="font-normal text-[#5c7285]">
                    {item.label}
                  </span>
                  <span className="font-medium text-[#0f3453]">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-2xl border border-[#e4ebf1] bg-white p-4">
            <div className="flex items-center gap-1.5 border-b border-[#f0f4f8] pb-3">
              <MapPin className="h-4 w-4 text-[#f59e0b]" />
              <h4 className="text-sm font-semibold text-[#0f3453]">
                Location Details
              </h4>
            </div>

            <div className="flex flex-col gap-1 text-xs">
              <span className="font-semibold text-[#0f3453]">
                {addressText}
              </span>
              <span className="font-normal text-[#5c7285]">
                {cityText}
              </span>
            </div>

            <div className="mt-auto h-28 w-full overflow-hidden rounded-lg bg-slate-100 border border-slate-200">
              <img
                src="https://placehold.co/349x150?text=Service+Location+Map"
                alt="map preview"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetails;