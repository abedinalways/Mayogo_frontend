"use client";

import React from "react";

export interface EscrowPaymentProps {
  paymentHeld?: string;
  payoutFrozen?: boolean | string;
  refundIssued?: boolean | string;
}

export function EscrowPayment({
  paymentHeld = "$500.00",
  payoutFrozen = true,
  refundIssued = false,
}: EscrowPaymentProps) {
  const formatBooleanLabel = (val: boolean | string) => {
    if (typeof val === "boolean") {
      return val ? "Yes" : "No";
    }
    return val;
  };

  return (
    <div className="w-full rounded-xl bg-white p-3 border border-slate-200 shadow-[0px_2px_4px_-1px_rgba(13,13,18,0.06)] flex flex-col justify-start items-start gap-5 font-['Manrope']">
      {/* Title */}
      <h3 className="text-xl font-semibold text-[#0a3558] leading-5">
        Escrow &amp; Payment
      </h3>

      {/* Metrics Row */}
      <div className="w-full flex flex-wrap sm:flex-nowrap justify-start items-center gap-3">
        {/* Payment Held */}
        <div className="flex-1 min-w-[120px] flex items-center gap-1">
          <span className="text-base font-normal text-slate-500 leading-5">
            Payment Held:
          </span>
          <span className="text-base font-normal text-[#0a3558] leading-5">
            {paymentHeld}
          </span>
        </div>

        {/* Payout Frozen */}
        <div className="flex-1 min-w-[120px] flex items-center gap-1">
          <span className="text-base font-normal text-slate-500 leading-5">
            Payout Frozen:
          </span>
          <span className="text-base font-normal text-[#0a3558] leading-5">
            {formatBooleanLabel(payoutFrozen)}
          </span>
        </div>

        {/* Refund Issued */}
        <div className="flex-1 min-w-[120px] flex items-center gap-1">
          <span className="text-base font-normal text-slate-500 leading-5">
            Refund Issued:
          </span>
          <span className="text-base font-normal text-[#0a3558] leading-5">
            {formatBooleanLabel(refundIssued)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default EscrowPayment;