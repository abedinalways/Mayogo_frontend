import React from "react";
import { DollarSign } from "lucide-react";

export interface PaymentSummaryProps {
  paymentStatus?: "Paid" | "Pending" | "Failed" | string;
  quotedAmount?: string;
  finalAmount?: string;
  escrowStatus?: "Released" | "Held" | "Pending" | string;
  commissionRate?: string;
  commissionAmount?: string;
  expertEarnings?: string;
}

export function PaymentSummaryCard({
  paymentStatus = "Paid",
  quotedAmount = "$520.00",
  finalAmount = "$520.00",
  escrowStatus = "Released",
  commissionRate = "10%",
  commissionAmount = "$52.00",
  expertEarnings = "$500.00",
}: PaymentSummaryProps) {
  return (
    <div className="flex w-full  flex-col gap-5 rounded-2xl bg-white p-4 shadow-[0px_2px_4px_-1px_rgba(13,13,18,0.06)] border border-[#e4ebf1] font-['Manrope']">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f59e0b] text-white">
          <DollarSign className="h-4 w-4 stroke-[2.5]" />
        </div>
        <h3 className="text-base font-semibold text-[#0f3453]">
          Payment Summary
        </h3>
      </div>

      {/* Summary Items List */}
      <div className="flex flex-col gap-3">
        {/* Top Details Section */}
        <div className="flex flex-col gap-3 border-b border-[#f0f4f8] pb-3">
          {/* Payment Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-normal text-[#5c7285]">
              Payment Status
            </span>
            <div className="inline-flex items-center gap-1.5 rounded-md border border-[#c1f0e2] bg-[#ebfbf5] px-2.5 py-0.5 text-xs font-medium text-[#108a00]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#108a00]" />
              <span>{paymentStatus}</span>
            </div>
          </div>

          {/* Quoted Amount */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-normal text-[#5c7285]">
              Quoted Amount
            </span>
            <span className="text-sm font-semibold text-[#0f3453]">
              {quotedAmount}
            </span>
          </div>

          {/* Final Amount */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-normal text-[#5c7285]">
              Final Amount
            </span>
            <span className="text-sm font-semibold text-[#0f3453]">
              {finalAmount}
            </span>
          </div>

          {/* Escrow */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-normal text-[#5c7285]">
              Escrow
            </span>
            <span className="text-sm font-medium text-[#108a00]">
              {escrowStatus}
            </span>
          </div>

          {/* Commission */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-normal text-[#5c7285]">
              Commission ({commissionRate})
            </span>
            <span className="text-sm font-semibold text-[#0f3453]">
              {commissionAmount}
            </span>
          </div>
        </div>

        {/* Expert Earnings Footer Row */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-sm font-normal text-[#5c7285]">
            Expert’s Earnings
          </span>
          <span className="text-sm font-semibold text-[#0f3453]">
            {expertEarnings}
          </span>
        </div>
      </div>
    </div>
  );
}

export default PaymentSummaryCard;