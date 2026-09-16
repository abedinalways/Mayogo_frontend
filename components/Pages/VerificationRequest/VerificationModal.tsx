"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ClipboardCheck,
  FileSearch,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import CustomModal from "@/components/shared/CustomModal";
import VerificationDetails, {
  type VerificationDetailsProps,
} from "./VerificationDetails";
import { cn } from "@/lib/utils";
import IdentityVerification from "./IdentityVerification";
import FaceVerification from "./FaceVerification";
import CertificationsVerification from "./CertificationsVerification";

const STEPS = [
  { title: "Profile Completion" },
  { title: "Document Verification" },
  { title: "Background Check" },
  { title: "Final Approval" },
] as const;

const PLACEHOLDERS: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
    {
      icon: FileSearch,
      title: "Document Verification",
      description:
        "Review the expert's submitted documents. Placeholder step — navigation only.",
    },
    {
      icon: ShieldCheck,
      title: "Background Check",
      description:
        "Run the expert's background verification. Placeholder step — navigation only.",
    },
    {
      icon: ClipboardCheck,
      title: "Final Approval",
      description:
        "Approve or reject the expert's verification request. Placeholder step — navigation only.",
    },
  ];

export interface VerificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: VerificationDetailsProps["data"];
  onApproved: () => void;
}

function PlaceholderStep({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 px-6 py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-400/20">
        <Icon className="h-6 w-6 text-amber-500" />
      </div>
      <h3 className="text-lg font-semibold text-[#103D5C]">{title}</h3>
      <p className="max-w-sm text-sm text-slate-500">{description}</p>
    </div>
  );
}

export default function VerificationModal({
  open,
  onOpenChange,
  data,
  onApproved,
}: VerificationModalProps) {
  const [currentStep, setCurrentStep] = useState(4);
  const totalSteps = STEPS.length;

  const handleOpenChange = (next: boolean) => {
    if (next) setCurrentStep(1);
    onOpenChange(next);
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFinish = () => {
    setCurrentStep(1);
    onOpenChange(false);
    onApproved();
  };

  return (
    <CustomModal
      open={open}
      onOpenChange={handleOpenChange}
      size="lg"
      showCloseButton={false}
      className="max-w-[918px] p-5 font-['Manrope']"
    >
      <div className="flex w-full flex-col gap-6">
        {/* Figma Header Layout */}
        <div className="flex w-full items-start justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold leading-5 text-[#103D5C] mb-2">
              Expert Verification Review
            </h2>
            <p className="text-sm font-normal leading-4 text-slate-500">
              Review complete profile information
            </p>
          </div>
          <div className="flex flex-col items-end gap-1 text-right">
            <span className="text-xs font-normal leading-3 text-slate-500">
              Step {currentStep}/{totalSteps}
            </span>
            <span className="text-sm font-medium leading-4 text-slate-700">
              {STEPS[currentStep - 1].title}
            </span>
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 1 && <VerificationDetails data={data} />}
        {currentStep === 2 && <IdentityVerification />}
        {currentStep === 3 && <FaceVerification />}
        {currentStep === 4 && <CertificationsVerification />}
        {/* Modal Controls */}
        <div className="flex w-full items-center justify-between ">
          <div>
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1}
              className={cn("inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-50", currentStep === 1 && "hidden")}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          </div>

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#103D5C] px-5 text-sm font-medium text-white transition-colors hover:bg-[#0c2f47]"
            >
              Reviewed & next
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#103D5C] px-5 text-sm font-medium text-white transition-colors hover:bg-[#0c2f47]"
            >
              <Check className="h-4 w-4" />
              Finish
            </button>
          )}
        </div>
      </div>
    </CustomModal>
  );
}