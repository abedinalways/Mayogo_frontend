"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import CustomModal from "@/components/shared/CustomModal";
import { CustomTextarea } from "@/components/shared/CustomInput";
import type { ExpertRecord } from "./ExpertTable";
import CustomButton from "@/components/shared/CustomButton";

interface ExpertProcessPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expert: ExpertRecord | null;
  /** Which flow to start in */
  initialAction: "approve" | "reject";
  onBack: () => void;
  onConfirm: (action: "approve" | "reject", note: string) => void;
}

export default function ExpertProcessPaymentModal({
  open,
  onOpenChange,
  expert,
  initialAction,
  onBack,
  onConfirm,
}: ExpertProcessPaymentModalProps) {
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = (next: boolean) => {
    if (!next) {
      setNote("");
    }
    onOpenChange(next);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    setIsSubmitting(false);
    onConfirm(initialAction, note);
    setNote("");
  };

  const handleBack = () => {
    setNote("");
    onOpenChange(false);
    onBack();
  };

  if (!expert) return null;

  const isReject = initialAction === "reject";

  return (
    <CustomModal
      open={open}
      onOpenChange={handleClose}
      size="xsm"
      showCloseButton={false}
      preventClose={isSubmitting}
      className="p-0 gap-0 rounded-2xl overflow-hidden"
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between  pb-4">
        <h2 className="text-[#103D5C] text-center text-[18px] font-semibold leading-[132%]">
          {isReject ? "Reason Required" : "Confirm Approval"}
        </h2>
        <button
          type="button"
          onClick={() => handleClose(false)}
          disabled={isSubmitting}
          className="flex h-6 w-6 items-center justify-center rounded-full text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
        >
          <X size={15} />
        </button>
      </div>

      {/* ── Body ── */}
      <div className=" pb-5 pt-4 space-y-4">
        {isReject ? (
          <CustomTextarea
            label="Admin Notes"
            placeholder="Write the reason behind the rejection........"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={200}
            rows={4}
            showCharacterCount
          />
        ) : (
          <div className="space-y-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-['Manrope']">
                    Approving amount for
                  </p>
                  <p className="text-sm font-bold text-[#0a3558] font-['Manrope'] mt-0.5">
                    {expert.expert.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 font-['Manrope']">
                    Amount
                  </p>
                  <p className="text-xl font-bold text-[#0a3558] font-['Manrope'] mt-0.5">
                    {expert.requestAmount}
                  </p>
                </div>
              </div>
            </div>

            <CustomTextarea
              label="Admin Notes (optional)"
              placeholder="Add a note for this approval..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={200}
              rows={3}
              showCharacterCount
            />
          </div>
        )}

        {/* ── Footer Buttons ── */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <CustomButton
            size="md"
            variant="tertiary"
            type="button"
            onClick={handleBack}
            disabled={isSubmitting}
          >
            Back
          </CustomButton>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || (isReject && !note.trim())}
            className={`h-10 rounded-lg text-sm font-semibold text-white font-['Manrope'] transition-all active:scale-[0.98] disabled:opacity-50 ${
              isReject
                ? "border-1 border-[#EB3D4D] bg-white !text-[#EB3D4D]  hover:bg-rose-50"
                : "bg-[#0a3558] hover:bg-[#07253e]"
            }`}
          >
            {isSubmitting
              ? "Processing..."
              : isReject
                ? "Reject Request"
                : "Confirm Approval"}
          </button>
        </div>
      </div>
    </CustomModal>
  );
}
