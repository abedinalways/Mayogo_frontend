"use client";

import React, { useState } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import CustomButton from "../../shared/CustomButton";
import { CustomInput } from "../../shared/CustomInput";
import CustomSelect from "../../shared/CustomSelect";

type DecisionType =
  | "full_refund"
  | "partial_refund"
  | "release_fund"
  | "request_info";

export interface AdminDecisionPanelProps {
  ticketId?: string;
  totalAmount?: number;
  currentStatus?: string;
  onSubmitDecision?: (decision: {
    type: DecisionType;
    status: "OPEN" | "UNDER_REVIEW" | "RESOLVED" | "CLOSED";
    refundAmount: number;
    reason: string;
    notes: string;
  }) => Promise<void> | void;
  isLoading?: boolean;
}

const reasonOptions = [
  { label: "Incomplete Service", value: "Incomplete Service" },
  { label: "Quality Issues", value: "Quality Issues" },
  { label: "Late Delivery", value: "Late Delivery" },
  { label: "Expert Behavior", value: "Expert Behavior" },
  { label: "Other", value: "Other" },
];

export function AdminDecisionPanel({
  totalAmount = 500.0,
  currentStatus,
  onSubmitDecision,
  isLoading = false,
}: AdminDecisionPanelProps) {
  const [selectedDecision, setSelectedDecision] =
    useState<DecisionType>("partial_refund");
  const [refundAmount, setRefundAmount] = useState<string>("250.00");
  const [reason, setReason] = useState<string>("Other");
  const [notes, setNotes] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const parsedRefund = parseFloat(refundAmount) || 0;
  const remainingToExpert = Math.max(0, totalAmount - parsedRefund);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    let statusPayload: "OPEN" | "UNDER_REVIEW" | "RESOLVED" | "CLOSED" = "RESOLVED";
    if (selectedDecision === "request_info") {
      statusPayload = "UNDER_REVIEW";
    }

    try {
      await onSubmitDecision?.({
        type: selectedDecision,
        status: statusPayload,
        refundAmount: parsedRefund,
        reason,
        notes,
      });
      setSuccessMessage("Decision submitted successfully.");
    } catch {
      setErrorMessage("Failed to submit decision. Please try again.");
    }
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
      <div className="w-full flex items-center justify-between">
        <h3 className="text-xl font-semibold text-[#0a3558] leading-5">
          Admin Decision Panel
        </h3>
        {currentStatus && (
          <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
            Current: {currentStatus}
          </span>
        )}
      </div>

      {successMessage && (
        <div className="w-full p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-700">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="w-full p-2.5 rounded-lg bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

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

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        <h4 className="text-lg font-semibold text-[#0a3558] leading-4">
          Resolution Notes
        </h4>

        <div className="w-full flex flex-col gap-2">
          <div className="flex flex-col gap-1.5">
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

        <div className="w-full flex flex-col gap-1.5">
          <CustomSelect
            label="Refund Reason"
            options={reasonOptions}
            value={reason ?? ""}
            onValueChange={(value) => setReason(value ?? "")}
          />
        </div>

        <div className="w-full flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-700">
            Resolution Summary
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Provide resolution details or reason for parties involved..."
            className="w-full p-2.5 text-xs rounded-lg border border-slate-200 outline-none focus:border-[#0a3558] transition-colors"
          />
        </div>

        <CustomButton
          type="submit"
          size="md"
          variant="primary"
          disabled={isLoading}
          className="w-full h-10 mt-1 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-white" />
              <span>Submitting...</span>
            </>
          ) : (
            getSubmitButtonLabel()
          )}
        </CustomButton>
      </form>
    </div>
  );
}

export default AdminDecisionPanel;
