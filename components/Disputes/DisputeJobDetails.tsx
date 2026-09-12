"use client";

import React from "react";

export interface DisputeJobDetailsProps {
  jobId?: string;
  startDate?: string;
  reason?: string;
  paymentType?: string;
  escrowStatus?: string;
  disputedAmount?: string;
  assignedAdmin?: string;
}

export default function DisputeJobDetails({
  jobId = "#JB001",
  startDate = "Jul 27, 2026",
  reason = "Poor Work Quality",
  paymentType = "Milestone Based",
  escrowStatus = "Partially Released",
  disputedAmount = "$50.00",
  assignedAdmin = "Sarah Park",
}: DisputeJobDetailsProps) {
  return (
    <div className="w-full p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-6 font-['Manrope']">
      {/* Top Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-normal text-slate-500 leading-5">
            Related Job ID
          </span>
          <span className="text-xl font-medium text-[#0a3558] leading-7">
            {jobId}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-sm font-normal text-slate-500 leading-5">
            Date of Job Started
          </span>
          <span className="text-xl font-medium text-[#0a3558] leading-7">
            {startDate}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-sm font-normal text-slate-500 leading-5">
            Reason
          </span>
          <span className="text-xl font-medium text-[#0a3558] leading-7">
            {reason}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-sm font-normal text-slate-500 leading-5">
            Payment Type
          </span>
          <span className="text-xl font-medium text-[#0a3558] leading-7">
            {paymentType}
          </span>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-normal text-slate-500 leading-5">
            Escrow Status
          </span>
          <span className="text-xl font-medium text-[#0a3558] leading-7">
            {escrowStatus}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-sm font-normal text-slate-500 leading-5">
            Disputed Amount
          </span>
          <span className="text-xl font-medium text-[#0a3558] leading-7">
            {disputedAmount}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-sm font-normal text-slate-500 leading-5">
            Assigned Admin
          </span>
          <span className="text-xl font-medium text-[#0a3558] leading-7">
            {assignedAdmin}
          </span>
        </div>
      </div>
    </div>
  );
}