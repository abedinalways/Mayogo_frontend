"use client";

import React, { useState } from "react";
import { CustomSelect, CustomSelectOption } from "@/components/shared/CustomSelect";
import CustomButton from "@/components/shared/CustomButton";
export type VerificationOutcome = "approve" | "resubmit" | "reject";

export interface VerificationDecisionPanelProps {
  onConfirm?: (data: {
    outcome: VerificationOutcome;
    level?: string;
    resubmissionReason?: string;
    rejectionReason?: string;
    notes?: string;
  }) => void;
  onCancel?: () => void;
  defaultOutcome?: VerificationOutcome;
  defaultLevel?: string;
  defaultNotes?: string;
  defaultResubmission?: string;
  defaultRejectionReason?: string;
}

const LEVEL_OPTIONS: CustomSelectOption[] = [
  { label: "Level 1", value: "Level 1" },
  { label: "Level 2", value: "Level 2" },
  { label: "Level 3", value: "Level 3" },
  { label: "Level 4", value: "Level 4" },
];

const RESUBMISSION_OPTIONS: CustomSelectOption[] = [
  { label: "Document Blurry", value: "Document Blurry" },
  { label: "Document Cropped", value: "Document Cropped" },
  { label: "Document Missing", value: "Document Missing" },
  { label: "Document Incomplete", value: "Document Incomplete" },
];

const REJECTION_OPTIONS: CustomSelectOption[] = [
  { label: "Fraudulent document", value: "Fraudulent document" },
  { label: "Identity mismatch", value: "Identity mismatch" },
  { label: "Invalid certification", value: "Invalid certification" },
  { label: "Others", value: "Others" },
];

export default function VerificationDecisionPanel({
  onConfirm,
  onCancel,
  defaultOutcome = "approve",
  defaultLevel = "Level 1",
  defaultNotes = "Your Documents are cropped and blurry. To verified up to level 4 re-upload the documents.",
  defaultResubmission = "Document Blurry",
  defaultRejectionReason = "Fraudulent document",
}: VerificationDecisionPanelProps) {
  const [outcome, setOutcome] = useState<VerificationOutcome>(defaultOutcome);
  const [selectedLevel, setSelectedLevel] = useState<string>(defaultLevel);
  const [selectedResubmission, setSelectedResubmission] =
    useState<string>(defaultResubmission);
  const [selectedRejection, setSelectedRejection] = useState<string>(
    defaultRejectionReason
  );
  const [notes, setNotes] = useState<string>(defaultNotes);

  const handleConfirm = () => {
    const data = {
      outcome,
      ...(outcome === "approve" ? { level: selectedLevel } : {}),
      ...(outcome === "resubmit"
        ? { resubmissionReason: selectedResubmission }
        : {}),
      ...(outcome === "reject" ? { rejectionReason: selectedRejection } : {}),
      notes,
    };
    console.log("Verification form data:", data);
    onConfirm?.(data);
  };

  const radioInputClass =
    "h-3.5 w-3.5 appearance-none rounded-full border border-amber-200 checked:bg-amber-500 checked:border-amber-500 checked:ring-2 checked:ring-amber-100 checked:ring-offset-1 cursor-pointer transition-all";

  return (
    <div className="flex w-full flex-col items-end gap-6">
      {/* Header */}
      <div className="flex w-full flex-col justify-center gap-1 text-left">
        <h2 className="mb-2 text-xl font-semibold leading-5 text-[#103D5C]">
          Verification Decision Panel
        </h2>
        <p className="text-sm font-normal leading-4 text-slate-500">
          Select the outcome for this verification review.
        </p>
      </div>

      {/* Decision Options */}
      <div className="flex w-full flex-col gap-3">
        {/* Option 1: Approve Verification */}
        <div
          onClick={() => setOutcome("approve")}
          className={`group flex cursor-pointer flex-col justify-center rounded-lg border transition-all ${
            outcome === "approve"
              ? "border-[#FFEFA8] bg-white pt-2 pb-4 px-4 shadow-sm"
              : "border-[#E8E8E8] bg-white px-4 py-2 hover:border-[#FFEFA8]"
          }`}
        >
          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="outcome-approve"
              name="verification-outcome"
              checked={outcome === "approve"}
              onChange={() => setOutcome("approve")}
              className={radioInputClass}
            />
            <label
              htmlFor="outcome-approve"
              className="cursor-pointer text-base font-normal leading-6 text-[#103D5C]"
            >
              Approve Verification
            </label>
          </div>

          {outcome === "approve" && (
            <div className="mt-3 flex flex-col gap-3">
              <p className="max-w-xs text-xs font-normal leading-5 text-slate-500">
                Assign a verification level and make the expert verified on the
                platform.
              </p>

              {/* Custom Level Select */}
              <CustomSelect
                options={LEVEL_OPTIONS}
                value={selectedLevel}
                onValueChange={(val) => setSelectedLevel(val)}
                placeholder="Select level"
              />

              {/* Notes Input Area */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium leading-5 text-[#103D5C]">
                  Notes:
                </span>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes..."
                  className="w-full resize-none rounded-lg bg-white p-3 text-xs font-normal leading-5 text-slate-500 outline-1 outline-slate-200 focus:outline-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Option 2: Request Resubmission */}
        <div
          onClick={() => setOutcome("resubmit")}
          className={`group flex cursor-pointer flex-col justify-center rounded-lg border transition-all ${
            outcome === "resubmit"
              ? "border-[#FFEFA8] bg-white pt-2 pb-4 px-4 shadow-sm"
              : "border-[#E8E8E8] bg-white px-4 py-2 hover:border-[#FFEFA8]"
          }`}
        >
          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="outcome-resubmit"
              name="verification-outcome"
              checked={outcome === "resubmit"}
              onChange={() => setOutcome("resubmit")}
              className={radioInputClass}
            />
            <label
              htmlFor="outcome-resubmit"
              className="cursor-pointer text-base font-normal leading-6 text-[#103D5C]"
            >
              Request Resubmission
            </label>
          </div>

          {outcome === "resubmit" && (
            <div className="mt-3 flex flex-col gap-3">
              <p className="max-w-xs text-xs font-normal leading-5 text-slate-500">
                Select the reason for resubmission.
              </p>

              {/* Custom Resubmission Select */}
              <CustomSelect
                options={RESUBMISSION_OPTIONS}
                value={selectedResubmission}
                onValueChange={(val) => setSelectedResubmission(val)}
                placeholder="Select resubmission reason"
              />

              {/* Notes Input Area */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium leading-5 text-[#103D5C]">
                  Notes:
                </span>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes..."
                  className="w-full resize-none rounded-lg bg-white p-3 text-xs font-normal leading-5 text-slate-500 outline-1 outline-slate-200 focus:outline-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Option 3: Reject Verification */}
        <div
          onClick={() => setOutcome("reject")}
          className={`group flex cursor-pointer flex-col justify-center rounded-lg border transition-all ${
            outcome === "reject"
              ? "border-[#FFEFA8] bg-white pt-2 pb-4 px-4 shadow-sm"
              : "border-[#E8E8E8] bg-white px-4 py-2 hover:border-[#FFEFA8]"
          }`}
        >
          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="outcome-reject"
              name="verification-outcome"
              checked={outcome === "reject"}
              onChange={() => setOutcome("reject")}
              className={radioInputClass}
            />
            <label
              htmlFor="outcome-reject"
              className="cursor-pointer text-base font-normal leading-6 text-[#103D5C]"
            >
              Reject Verification
            </label>
          </div>

          {outcome === "reject" && (
            <div className="mt-3 flex flex-col gap-3">
              <p className="max-w-xs text-xs font-normal leading-5 text-slate-500">
                Select the reason for rejection.
              </p>

              {/* Custom Rejection Select */}
              <CustomSelect
                options={REJECTION_OPTIONS}
                value={selectedRejection}
                onValueChange={(val) => setSelectedRejection(val)}
                placeholder="Select rejection reason"
              />

              {/* Notes Input Area */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium leading-5 text-[#103D5C]">
                  Notes:
                </span>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes..."
                  className="w-full resize-none rounded-lg bg-white p-3 text-xs font-normal leading-5 text-slate-500 outline-1 outline-slate-200 focus:outline-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center gap-4 font-['Inter']">
        <CustomButton variant="secondary" size="lg" onClick={onCancel}>
          Cancel
        </CustomButton>
        <CustomButton variant="primary" size="lg" onClick={handleConfirm}>
          Confirm
        </CustomButton>
      </div>
    </div>
  );
}