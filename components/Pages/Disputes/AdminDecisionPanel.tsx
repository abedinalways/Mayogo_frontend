"use client";

import React, { useState } from "react";
import CustomButton from "../../shared/CustomButton";
import { CustomInput } from "../../shared/CustomInput";
import CustomSelect from "../../shared/CustomSelect";

type DecisionType =
  | "full_refund"
  | "partial_refund"
  | "release_fund"
  | "request_info";

export interface AdminDecisionPanelProps {
  totalAmount?: number;
  onSubmitDecision?: (decision: {
    type: DecisionType;
    refundAmount: number;
    reason: string;
    notes: string;
  }) => void;
}

const reasonOptions = [
  { label: "Incomplete Service", value: "Incomplete Service" },
  { label: "Quality Issues", value: "Quality Issues" },
  { label: "Late Delivery", value: "Late Delivery" },
  { label: "Other", value: "Other" },
];

export function AdminDecisionPanel({
  totalAmount = 500.0,
  onSubmitDecision,
}: AdminDecisionPanelProps) {
  const [selectedDecision, setSelectedDecision] =
    useState<DecisionType>("partial_refund");
  const [refundAmount, setRefundAmount] = useState<string>("250.00");
  const [reason, setReason] = useState<string>("Other");
  const [notes, setNotes] = useState<string>("");

  const parsedRefund = parseFloat(refundAmount) || 0;
  const remainingToExpert = Math.max(0, totalAmount - parsedRefund);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitDecision?.({
      type: selectedDecision,
      refundAmount: parsedRefund,
      reason,
      notes,
    });
  };

  const getSubmitButtonLabel = () => {
    switch (selectedDecision) {
      case "full_refund":
        return "Submit for Full Refund";
      case "partial_refund":
        return "Submit for Partial Refund";
      case "release_fund":
        return "Release Funds to Expert";
      case "request_info":
        return "Send Request for Information";
      default:
        return "Submit Decision";
    }
  };

  return (
    <div className="w-full rounded-xl bg-white p-3 border border-slate-200 shadow-[0px_2px_4px_-1px_rgba(13,13,18,0.06)] flex flex-col justify-start items-start gap-5 font-['Manrope']">
      {/* Title */}
      <h3 className="text-xl font-semibold text-[#0a3558] leading-5">
        Admin Decision Panel
      </h3>

      {/* Decision Type Buttons Grid */}
      <div className="w-full flex flex-col gap-2">
        <div className="w-full flex flex-wrap sm:flex-nowrap gap-2">
          <CustomButton
            size="md"
            variant={
              selectedDecision === "full_refund" ? "primary" : "tertiary"
            }
            onClick={() => {
              setSelectedDecision("full_refund");
              setRefundAmount(totalAmount.toFixed(2));
            }}
            className="flex-1 whitespace-nowrap"
          >
            Approve Full Refund
          </CustomButton>

          <CustomButton
            size="md"
            variant={
              selectedDecision === "partial_refund" ? "primary" : "tertiary"
            }
            onClick={() => setSelectedDecision("partial_refund")}
            className="flex-1 whitespace-nowrap"
          >
            Approve Partial Refund
          </CustomButton>
        </div>

        <div className="w-full flex flex-wrap sm:flex-nowrap gap-2">
          <CustomButton
            size="md"
            variant={
              selectedDecision === "release_fund" ? "primary" : "tertiary"
            }
            onClick={() => {
              setSelectedDecision("release_fund");
              setRefundAmount("0.00");
            }}
            className="flex-1 whitespace-nowrap"
          >
            Release Fund to Expert
          </CustomButton>

          <CustomButton
            size="md"
            variant={
              selectedDecision === "request_info" ? "primary" : "tertiary"
            }
            onClick={() => setSelectedDecision("request_info")}
            className="flex-1 whitespace-nowrap"
          >
            Request Additional Information
          </CustomButton>
        </div>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        <h4 className="text-lg font-semibold text-[#0a3558] leading-4">
          Resolution Notes
        </h4>

        {/* Refund Amount Input Field */}
        <div className="w-full flex flex-col gap-2">
          <div className="flex flex-col gap-1.5">
            {/* Custom Input */}
            <CustomInput
              label="Refund Amount"
              type="number"
              step="0.01"
              min="0"
              max={totalAmount}
              leadingPrefix="$"
              disabled={selectedDecision === "release_fund"}
              value={refundAmount}
              onChange={(e) => setRefundAmount(e.target.value)}
              helperText={`Remaining to expert : $${remainingToExpert.toFixed(2)}`}
            />
          </div>
        </div>

        {/* Refund Reason Select Field & Internal Notes */}
        <div className="w-full flex flex-col gap-1.5">
          <CustomSelect
            label="Refund Reason"
            options={reasonOptions}
            value={reason ?? ""}
            onValueChange={(value) => setReason(value ?? "")}
          />
        </div>

        {/* Submit Action Button */}
        <CustomButton
          type="submit"
          size="md"
          variant="primary"
          className="w-full h-10 mt-1"
        >
          {getSubmitButtonLabel()}
        </CustomButton>
      </form>
    </div>
  );
}

export default AdminDecisionPanel;
