import React from "react";
import { Briefcase, User, MapPin } from "lucide-react";

export interface RequirementItem {
  label: string;
  value: string;
}

export interface JobDetailsProps {
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
  title = "Job Details",
  description = "My son needs help improving his math grades before final exams. He is struggling with algebra and geometry and needs a qualified tutor who can provide structured lessons, regular practice, and exam-focused guidance.",
  requirements = [
    { label: "Subjects", value: "Pure Mathematics" },
    { label: "Student’s Current Grade", value: "Form 3" },
    { label: "Service Type", value: "In-Person" },
    { label: "Frequency", value: "Weekly" },
    { label: "Appointment Date", value: "July 28, 2026" },
    { label: "Appointment Time", value: "02:00 PM" },
    { label: "Estimated Duration", value: "2 hours" },
  ],
  location = {
    address: "House 18, Mwai Kibaki Road",
    city: "Mikocheni, Dar es Salaam",
    mapImageUrl: "https://placehold.co/349x150",
  },
}: JobDetailsProps) {
  return (
    <div className="flex w-full flex-col gap-6 font-['Manrope']">
      {/* Section Header */}
      <div className="flex items-center gap-1.5">
        <Briefcase className="h-4 w-4 text-[#e1b12c]" />
        <h3 className="text-base font-semibold text-[#0a2540]">
          {title}
        </h3>
      </div>

      <div className="flex flex-col gap-4">
        {/* Description Section */}
        <div className="flex flex-col gap-1">
          <h4 className="text-sm font-medium text-[#0a2540]">
            Description
          </h4>
          <p className="text-sm font-normal text-[#5c7285] leading-6">
            {description}
          </p>
        </div>

        {/* Two Card Layout: Requirements & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Client's Requirements Card */}
          <div className="flex flex-col gap-3 rounded-xl border border-[#e4ebf1] p-3">
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4 text-[#e1b12c]" />
              <h4 className="text-base font-medium text-[#0a2540]">
                Client’s Requirements
              </h4>
            </div>

            <div className="flex flex-col gap-2">
              {requirements.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-[#5c7285] font-normal">
                    {item.label}
                  </span>
                  <span className="text-[#0a2540] font-medium text-right">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Service Location Card */}
          <div className="flex flex-col gap-3 rounded-xl border border-[#e4ebf1] p-3">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-[#e1b12c]" />
              <h4 className="text-base font-medium text-[#0a2540]">
                Service Location
              </h4>
            </div>

            <div className="flex flex-1 flex-col gap-3">
              <div className="relative h-36 w-full overflow-hidden rounded-xl border border-[#e4ebf1]">
                <img
                  src={location.mapImageUrl}
                  alt="Service Location Map"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-[#0a2540]">
                  {location.address}
                </span>
                <span className="text-xs font-normal text-[#5c7285]">
                  {location.city}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetails;