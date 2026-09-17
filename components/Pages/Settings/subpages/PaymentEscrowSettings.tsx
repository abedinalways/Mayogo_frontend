"use client";

import React, { useState } from "react";
import LeftsideTitleSubtitle from "../LeftsideTitleSubtitle";
import { CustomInput } from "@/components/shared/CustomInput";

export function PaymentEscrowSettings() {
  // Escrow Configuration state
  const [autoReleaseDuration, setAutoReleaseDuration] = useState("7 Days");
  const [escrowHoldDuration, setEscrowHoldDuration] = useState("3 Days");

  // Withdrawal Configuration state
  const [minWithdrawalAmount, setMinWithdrawalAmount] = useState("$20");
  const [processingTime, setProcessingTime] = useState("2 Business Days");

  // Refund Configuration state
  const [refundProcessingTime, setRefundProcessingTime] = useState("5 Days");

  return (
    <div className="space-y-8 p-5 font-['Manrope']">
      {/* SECTION 1: ESCROW CONFIGURATION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <LeftsideTitleSubtitle
          title="Escrow Configuration"
          subtitle="Funds will be automatically released after job completion."
          subtitleWidth="max-w-[280px]"
        />

        {/* Right Column */}
        <div className="lg:col-span-7 space-y-5">
          <CustomInput
            label="Auto Release Duration"
            type="text"
            value={autoReleaseDuration}
            onChange={(e) => setAutoReleaseDuration(e.target.value)}
          />

          <CustomInput
            label="Escrow Hold Duration"
            type="text"
            value={escrowHoldDuration}
            onChange={(e) => setEscrowHoldDuration(e.target.value)}
          />
        </div>
      </div>

      {/* HORIZONTAL DIVIDER LINE */}
      <div className="border-t border-[#E4EBF1] w-full" />

      {/* SECTION 2: WITHDRAWAL CONFIGURATION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <LeftsideTitleSubtitle
          title="Withdrawal Configuration"
          subtitle="Admin will approve withdrawal request."
          subtitleWidth="max-w-[280px]"
        />

        {/* Right Column */}
        <div className="lg:col-span-7 space-y-5">
          <CustomInput
            label="Minimum Withdrawal Amount"
            type="text"
            value={minWithdrawalAmount}
            onChange={(e) => setMinWithdrawalAmount(e.target.value)}
          />

          <CustomInput
            label="Processing Time"
            type="text"
            value={processingTime}
            onChange={(e) => setProcessingTime(e.target.value)}
          />
        </div>
      </div>

      {/* HORIZONTAL DIVIDER LINE */}
      <div className="border-t border-[#E4EBF1] w-full" />

      {/* SECTION 3: REFUND CONFIGURATION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <LeftsideTitleSubtitle
          title="Refund Configuration"
          subtitle="Admin will approve withdrawal request."
          subtitleWidth="max-w-[280px]"
        />

        {/* Right Column */}
        <div className="lg:col-span-7 space-y-5">
          <CustomInput
            label="Refund Processing Time"
            type="text"
            value={refundProcessingTime}
            onChange={(e) => setRefundProcessingTime(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default PaymentEscrowSettings;
