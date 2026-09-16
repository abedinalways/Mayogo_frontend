"use client";

import React from "react";
import Link from "next/link";
import { Briefcase } from "lucide-react";
import { InfoCard } from "@/components/Pages/Job/InfoCard";
import TransactionTimeline from "./TransactionTimeline";
import CustomButton from "@/components/shared/CustomButton";
import { BagIcon } from "@/components/SvgIcon/DashboardIcon";

export interface TransactionDetailsPageProps {
  txId?: string;
}

export default function TransactionDetailsPage({
  txId = "TX-012639",
}: TransactionDetailsPageProps) {
  const timelineEvents = [
    {
      title: "Payment Received",
      description: "Payment has been received from client",
      time: "3 minutes ago",
      dotColor: "bg-[#12B76A]",
    },
    {
      title: "Escrow Created",
      description: "Amount is held in escrow",
      time: "4 minutes ago",
      dotColor: "bg-[#F79009]",
    },
    {
      title: "Escrow Released",
      description: "Milestone 1 released to expert wallet",
      time: "1 hour ago",
      dotColor: "bg-[#2E90FA]",
    },
    {
      title: "Escrow Released",
      description: "Milestone 2 released to expert wallet",
      time: "1 hour ago",
      dotColor: "bg-[#2E90FA]",
    },
    {
      title: "Escrow Released",
      description: "Milestone 3 released to expert wallet",
      time: "1 hour ago",
      dotColor: "bg-[#2E90FA]",
    },
    {
      title: "Escrow Released",
      description: "Milestone 3 released to expert wallet",
      time: "1 hour ago",
      dotColor: "bg-[#2E90FA]",
    },
  ];

  return (
    <div className="w-full space-y-6 font-['Manrope'] pb-10">
      {/* Header Info */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-[#103D5C]">#{txId}</h1>

          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-sm text-xs font-semibold bg-[#E9FAF7] text-[#04913E] border border-[#A7EADE]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#12B76A] text-[#04913E] text-center text-[14px] font-medium leading-[116%]" />
            Completed
          </span>
        </div>

        <p className="text-[#5A5A5A] text-[14px] font-medium leading-[124%] mt-2">
          Related Job ID #JB124 <span className="mx-1">•</span> Created on 12
          Jul, 2026
        </p>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_390px] gap-6 items-start">
        {/* Left Column (Summaries & Timeline) */}
        <div className="flex flex-col gap-6">
          {/* Transaction Summary Card */}
          <div className="bg-white rounded-2xl border border-[#E8E8E8]  shadow-xs">
            <h2 className="text-primary text-[18px] font-semibold leading-[132%] p-4">
              Transaction Summary
            </h2>
            <hr className="w-full border border-[#E8E8E8]" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 p-4">
              {/* Row 1 */}
              <div>
                <span className="text-[#5A5A5A] text-center text-[14px] font-normal leading-[132%]">
                  Amount Paid
                </span>
                <p className="text-[#103D5C] text-[20px] font-medium leading-[132%] mt-1">
                  $2,450.00
                </p>
              </div>

              <div>
                <span className="text-[#5A5A5A] text-center text-[14px] font-normal leading-[132%]">
                  Payment Structure
                </span>
                <p className="text-[#103D5C] text-[20px] font-medium leading-[132%] mt-1">
                  Milestone Based (3 Phases)
                </p>
              </div>

              {/* Row 2 */}
              <div>
                <span className="text-[#5A5A5A] text-center text-[14px] font-normal leading-[132%]">
                  Date
                </span>
                <p className="text-[#103D5C] text-[20px] font-medium leading-[132%] mt-1">
                  Jul 27, 2026
                </p>
              </div>

              <div>
                <span className="text-[#5A5A5A] text-center text-[14px] font-normal leading-[132%]">
                  Service
                </span>
                <p className="text-[#103D5C] text-[20px] font-medium leading-[132%] mt-1">
                  Air Conditioner (AC) Repair
                </p>
              </div>

              {/* Row 3 */}
              <div>
                <span className="text-[#5A5A5A] text-center text-[14px] font-normal leading-[132%]">
                  Platform Commission (10%)
                </span>
                <p className="text-[#103D5C] text-[20px] font-medium leading-[132%] mt-1">
                  – $245.00
                </p>
              </div>

              <div>
                <span className="text-[#5A5A5A] text-center text-[14px] font-normal leading-[132%]">
                  Payment Method
                </span>
                <p className="text-[#103D5C] text-[20px] font-medium leading-[132%] mt-1">
                  Selcom
                </p>
              </div>

              {/* Row 4 */}
              <div>
                <span className="text-[#5A5A5A] text-center text-[14px] font-normal leading-[132%]">
                  Expert Net Earnings
                </span>
                <p className="text-[#103D5C] text-[20px] font-medium leading-[132%] mt-1">
                  $2,205.00
                </p>
              </div>

              <div>
                <span className="text-[#5A5A5A] text-center text-[14px] font-normal leading-[132%]">
                  Reference
                </span>
                <p className="text-[#103D5C] text-[20px] font-medium leading-[132%] mt-1">
                  SC-88213-TZS
                </p>
              </div>
            </div>
          </div>

          {/* Escrow Summary Card */}
          <div className="bg-white rounded-2xl border border-[#E8E8E8] shadow-xs">
            <h2 className="text-primary text-[18px] font-semibold leading-[132%] p-4">
              Escrow Summary
            </h2>
            <hr className="w-full border border-[#E8E8E8]" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 p-4">
              <div>
                <span className="text-[#5A5A5A] text-center text-[14px] font-normal leading-[132%]">
                  Escrow Amount
                </span>
                <p className="text-[#103D5C] text-[20px] font-medium leading-[132%] mt-1">
                  $2,205.00
                </p>
              </div>

              <div>
                <span className="text-[#5A5A5A] text-center text-[14px] font-normal leading-[132%]">
                  Escrow Status
                </span>
                <p className="text-xl font-semibold text-[#04913E] mt-1">
                  Released
                </p>
              </div>

              <div>
                <span className="text-[#5A5A5A] text-center text-[14px] font-normal leading-[132%]">
                  Created on
                </span>
                <p className="text-[#103D5C] text-[20px] font-medium leading-[132%] mt-1">
                  Jul 24, 2026
                </p>
              </div>

              <div>
                <span className="text-[#5A5A5A] text-center text-[14px] font-normal leading-[132%]">
                  Release Date
                </span>
                <p className="text-[#103D5C] text-[20px] font-medium leading-[132%] mt-1">
                  Jul 27, 2026
                </p>
              </div>
            </div>
          </div>

          {/* Transaction Timeline Card */}
          <div>
            <TransactionTimeline timeline={timelineEvents} />
          </div>
        </div>

        {/* Right Column (Side Cards) */}
        <div className="flex flex-col gap-5">
          {/* Related Job Card */}
          <div className="flex w-full flex-col justify-between gap-5 rounded-2xl bg-white p-4 shadow-xs border border-[#e4ebf1]">
            {/* Header Title */}
            <div className="flex items-center gap-2">
              <div className="">
                <BagIcon className="h-3.5 w-3.5 stroke-[2.5]" />
              </div>
              <h3 className="text-[#103D5C] text-center text-[16px] font-medium leading-[132%]">
                Related Job
              </h3>
            </div>

            {/* Job Details Row */}
            <div className="flex items-center gap-3.5">
              <img
                src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=160&auto=format&fit=crop&q=80"
                alt="Air Conditioner (AC) Repair"
                className="h-16 w-16 rounded-xl object-cover border border-[#F5B517] shrink-0"
              />

              <div className="flex flex-col gap-1 min-w-0">
                <span className="text-[#567FA0] text-[14px] font-medium leading-[100%]">
                  Job ID #JB124
                </span>
                <h4 className="text-[#103D5C] text-[16px] font-medium leading-[160%]">
                  Air Conditioner (AC) Repair
                </h4>
                <span className="text-[#5A5A5A] text-[14px] font-medium leading-[100%]">
                  Repair & Diagnostic
                </span>
              </div>
            </div>

            {/* Action Button */}
            <CustomButton variant="tertiary" size="sm" className="h-10.5">
              <Link href="/dashboard/">View Job Details</Link>
            </CustomButton>
          </div>

          {/* Client Information Card */}
          <InfoCard
            title="Client Information"
            name="Sarah William"
            idText="Client ID #CET001"
            avatarUrl="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
            phone="999-(1234)-555"
            onViewProfile={() => {}}
          />

          {/* Expert Information Card */}
          <InfoCard
            title="Expert Information"
            name="Alex Morgan"
            idText="Expert ID #EXP001"
            subtitle="Senior Electrician"
            avatarUrl="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80"
            isVerified={true}
            rating="4.8"
            onViewProfile={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
