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
  description = "No description provided for this job.",
  requirements,
  location,
}: JobDetailsProps) {
  const displayDescription = job?.description || description;

  let displayRequirements: RequirementItem[] = requirements || [];
  if (!requirements) {
    if (job) {
      let appointmentDate = "N/A";
      let appointmentTime = "N/A";
      const rawScheduled =
        job.appointment?.scheduledAt || job.submittedAt || job.createdAt;
      if (rawScheduled) {
        try {
          const dt = new Date(rawScheduled);
          appointmentDate = new Intl.DateTimeFormat("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }).format(dt);
          appointmentTime = new Intl.DateTimeFormat("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }).format(dt);
        } catch {
          appointmentDate = String(rawScheduled);
        }
      } else if (job.appointment?.date) {
        appointmentDate = job.appointment.date;
        appointmentTime = job.appointment.time || "N/A";
      }

      let paymentStatusStr = "Pending";
      if (typeof job.payment === "object" && job.payment !== null) {
        paymentStatusStr = String((job.payment as any).status || "Pending");
      } else if (typeof job.paymentStatus === "string") {
        paymentStatusStr = job.paymentStatus;
      } else if (typeof job.payment === "string") {
        paymentStatusStr = job.payment;
      }

      displayRequirements = [
        { label: "Service", value: job.service?.name || job.title || "Standard Service" },
        {
          label: "Category",
          value: job.category?.name || job.service?.category || "General",
        },
        {
          label: "Service Type",
          value:
            job.serviceType ||
            (job.appointment?.estimatedDuration
              ? job.appointment.estimatedDuration.replace(/_/g, " ")
              : "In-Person"),
        },
        { label: "Appointment Date", value: appointmentDate },
        { label: "Appointment Time", value: appointmentTime },
        {
          label: "Estimated Duration",
          value:
            job.appointment?.estimatedDuration?.replace(/_/g, " ") ||
            job.appointment?.duration ||
            "Standard",
        },
        { label: "Payment Status", value: paymentStatusStr },
      ];

      // Add dynamic fields if available
      if (job.dynamicFields && job.dynamicFields.length > 0) {
        job.dynamicFields.forEach((df) => {
          if (df.label && df.values && df.values.length > 0) {
            displayRequirements.push({
              label: df.label,
              value: df.values.join(", "),
            });
          }
        });
      }
    } else {
      displayRequirements = [
        { label: "Service", value: "Standard Service" },
        { label: "Service Type", value: "In-Person" },
        { label: "Frequency", value: "One-Time" },
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
      const loc = job.location as any;
      const addrParts = [loc.addressLine1, loc.addressLine2].filter(Boolean);
      addressText = addrParts.length > 0 ? addrParts.join(", ") : loc.address || addressText;

      const cityParts = [loc.city, loc.state, loc.country].filter(Boolean);
      cityText = cityParts.length > 0 ? cityParts.join(", ") : cityText;
    } else if (typeof job.location === "string" && job.location.trim()) {
      cityText = job.location;
    }
  }

  return (
    <div className="flex w-full flex-col gap-6 font-['Manrope']">
      <div className="flex items-center gap-1.5">
        <Briefcase className="h-4 w-4 text-[#e1b12c]" />
        <h3 className="text-base font-semibold text-[#0a2540]">{title}</h3>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h4 className="text-sm font-medium text-[#0a2540]">Description</h4>
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
                  <span className="font-normal text-[#6c8294]">{item.label}</span>
                  <span className="font-semibold text-[#0f3453]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-2xl border border-[#e4ebf1] bg-white p-4">
            <div className="flex items-center gap-1.5 border-b border-[#f0f4f8] pb-3">
              <MapPin className="h-4 w-4 text-[#f59e0b]" />
              <h4 className="text-sm font-semibold text-[#0f3453]">
                Service Location
              </h4>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-[#0f3453]">
                {addressText}
              </span>
              <span className="text-xs font-normal text-[#6c8294]">
                {cityText}
              </span>
            </div>

            <div className="mt-2 h-36 w-full overflow-hidden rounded-xl bg-slate-100 border border-[#e4ebf1]">
              <img
                src={
                  location?.mapImageUrl ||
                  "/map.png"
                }
                alt="service location map"
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