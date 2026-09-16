"use client";

import React, { useState } from "react";
import { User, Wrench, Tag, Clock, MapPin } from "lucide-react";

export interface VerificationDetailsProps {
  data?: {
    personalInfo: {
      fullName: string;
      phoneNumber: string;
      homeAddress: string;
      about: string;
    };
    emergencyContact: {
      fullName: string;
      phoneNumber: string;
      relation: string;
    };
    expertise: {
      category: string;
      servicesCount: number;
      yearsOfExperience: string;
      language: string;
    };
    pricing: {
      serviceType: string;
      frequency: string;
      minimumCost: string;
    };
    availability: {
      workingDays: string;
      workingHours: string;
      temporaryAvailability: string;
    };
    serviceArea: {
      location: string;
      coverage: string;
    };
  };
}

const DEFAULT_DATA = {
  personalInfo: {
    fullName: "Daniel Green",
    phoneNumber: "+1 (555) 2345 5987",
    homeAddress: "House 18, Mwai Kibaki Road, Mikocheni, Dar es Salaam",
    about:
      "I specialize in residential and commercial electrical installations, repair and maintenance services with a strong focus on safety and standards.",
  },
  emergencyContact: {
    fullName: "Daniel Green",
    phoneNumber: "+1 (555) 2345 5987",
    relation: "Spouse",
  },
  expertise: {
    category: "Electrical Services, Home Care and Services",
    servicesCount: 6,
    yearsOfExperience: "1-2 yrs",
    language: "English",
  },
  pricing: {
    serviceType: "In- Person",
    frequency: "One-Time",
    minimumCost: "$60",
  },
  availability: {
    workingDays: "Sun-Thu, Sat",
    workingHours: "08:00AM-05:00PM",
    temporaryAvailability: "Jul 20 – Jul 25, 2026/ Not Scheduled",
  },
  serviceArea: {
    location: "House 18, Mwai Kibaki Road, Mikocheni, Dar es Salaam",
    coverage: "35km",
  },
};

export default function VerificationDetails({
  data = DEFAULT_DATA,
}: VerificationDetailsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex flex-col gap-4 font-['Manrope']">
      {/* Row 1: Personal Info (Left) & Expertise + Pricing (Right) */}
      <div className="flex flex-col items-start justify-start gap-4 lg:flex-row">
        {/* Left Column: Personal Information Box */}
        <div className="flex flex-1 flex-col items-start justify-start gap-5 rounded-2xl p-4 outline outline-1 outline-offset-[-1px] outline-slate-200">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-amber-500" />
            <h3 className="text-lg font-medium leading-6 text-[#103D5C]">
              Personal Information
            </h3>
          </div>

          <div className="flex w-full flex-col gap-4">
            <div className="flex flex-col gap-3 border-b border-slate-100 pb-4">
              <div className="flex gap-3">
                <div className="flex flex-1 flex-col gap-1">
                  <span className="text-sm font-medium leading-6 text-slate-700">
                    Full Name
                  </span>
                  <span className="text-base font-normal leading-6 text-slate-900">
                    {data.personalInfo.fullName}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <span className="text-sm font-medium leading-6 text-slate-700">
                    Phone Number
                  </span>
                  <span className="text-base font-normal leading-6 text-slate-900">
                    {data.personalInfo.phoneNumber}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium leading-6 text-slate-700">
                  Home Address
                </span>
                <span className="text-base font-normal leading-6 text-slate-900">
                  {data.personalInfo.homeAddress}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium leading-6 text-slate-700">
                  About
                </span>
                <div className="text-base font-normal leading-6 text-slate-900">
                  {isExpanded
                    ? data.personalInfo.about
                    : `${data.personalInfo.about.slice(0, 68)}... `}
                  <button
                    type="button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="inline text-sm font-medium text-amber-500 hover:text-amber-600 focus:outline-none"
                  >
                    {isExpanded ? " Show less" : "Read more"}
                  </button>
                </div>
              </div>
            </div>

            {/* Emergency Contact Subcard */}
            <div className="flex w-full flex-col gap-4 rounded-2xl bg-slate-50 p-3">
              <h4 className="text-base font-medium leading-5 text-[#103D5C]">
                Emergency Contact
              </h4>
              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <div className="flex flex-1 flex-col gap-1">
                    <span className="text-sm font-medium leading-6 text-slate-700">
                      Full Name
                    </span>
                    <span className="text-base font-normal leading-6 text-slate-900">
                      {data.emergencyContact.fullName}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <span className="text-sm font-medium leading-6 text-slate-700">
                      Phone Number
                    </span>
                    <span className="text-base font-normal leading-6 text-slate-900">
                      {data.emergencyContact.phoneNumber}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium leading-6 text-slate-700">
                    Relation
                  </span>
                  <span className="text-base font-normal leading-6 text-slate-900">
                    {data.emergencyContact.relation}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Expertise & Types/Pricing */}
        <div className="flex flex-1 flex-col justify-center gap-4 ">
          {/* Expertise Box */}
          <div className="flex flex-col gap-5 rounded-2xl p-4 outline outline-1 outline-offset-[-1px] outline-slate-200">
            <div className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-amber-500" />
              <h3 className="text-lg font-medium leading-6 text-[#103D5C]">
                Expertise
              </h3>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium leading-6 text-slate-700">
                  Category
                </span>
                <span className="text-base font-normal leading-6 text-slate-900">
                  {data.expertise.category}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium leading-6 text-slate-700">
                  Services
                </span>
                <span className="text-base font-normal leading-6 text-slate-900">
                  {data.expertise.servicesCount} services selected
                </span>
              </div>
              <div className="flex gap-3">
                <div className="flex flex-1 flex-col gap-1">
                  <span className="text-sm font-medium leading-6 text-slate-700">
                    Year of Experience
                  </span>
                  <span className="text-base font-normal leading-6 text-slate-900">
                    {data.expertise.yearsOfExperience}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <span className="text-sm font-medium leading-6 text-slate-700">
                    Language
                  </span>
                  <span className="text-base font-normal leading-6 text-slate-900">
                    {data.expertise.language}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Types & Pricing Box */}
          <div className="flex flex-col gap-5 rounded-2xl p-4 outline outline-1 outline-offset-[-1px] outline-slate-200">
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-amber-500" />
              <h3 className="text-lg font-medium leading-6 text-[#103D5C]">
                Types &amp; Pricing
              </h3>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <div className="flex flex-1 flex-col gap-1">
                  <span className="text-sm font-medium leading-6 text-slate-700">
                    Service Type
                  </span>
                  <span className="text-base font-normal leading-6 text-slate-900">
                    {data.pricing.serviceType}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <span className="text-sm font-medium leading-6 text-slate-700">
                    Frequency
                  </span>
                  <span className="text-base font-normal leading-6 text-slate-900">
                    {data.pricing.frequency}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium leading-6 text-slate-700">
                  Minimum Cost
                </span>
                <span className="text-base font-normal leading-6 text-slate-900">
                  {data.pricing.minimumCost}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Availability & Service Area */}
      <div className="flex flex-col items-start justify-start gap-4 lg:flex-row">
        {/* Availability Box */}
        <div className="flex flex-1 flex-col gap-5 rounded-2xl p-4 outline outline-1 outline-offset-[-1px] outline-slate-200">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            <h3 className="text-lg font-medium leading-6 text-[#103D5C]">
              Availability
            </h3>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <div className="flex w-36 flex-col gap-1">
                <span className="text-sm font-medium leading-6 text-slate-700">
                  Working Days
                </span>
                <span className="text-base font-normal leading-6 text-slate-900">
                  {data.availability.workingDays}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <span className="text-sm font-medium leading-6 text-slate-700">
                  Working Hours
                </span>
                <span className="text-base font-normal leading-6 text-slate-900">
                  {data.availability.workingHours}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium leading-6 text-slate-700">
                Temporary Availability
              </span>
              <span className="text-base font-normal leading-6 text-slate-900">
                {data.availability.temporaryAvailability}
              </span>
            </div>
          </div>
        </div>

        {/* Service Area Box */}
        <div className="flex flex-1 flex-col gap-5 rounded-2xl p-4 outline outline-1 outline-offset-[-1px] outline-slate-200">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-amber-500" />
            <h3 className="text-lg font-medium leading-6 text-[#103D5C]">
              Service Area
            </h3>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium leading-6 text-slate-700">
                Location
              </span>
              <span className="text-base font-normal leading-6 text-slate-900">
                {data.serviceArea.location}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium leading-6 text-slate-700">
                Area Coverage
              </span>
              <span className="text-base font-normal leading-6 text-slate-900">
                {data.serviceArea.coverage}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}