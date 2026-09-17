"use client";

import React from "react";
import { X } from "lucide-react";
import CustomButton from "@/components/shared/CustomButton";

export interface DeleteFaqProps {
  onCancel: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export default function DeleteFaq({
  onCancel,
  onConfirm,
  isDeleting = false,
}: DeleteFaqProps) {
  return (
    <div className="font-['Manrope']">
      <div className="self-stretch flex flex-col justify-start items-end gap-2">
        {/* Close Icon Button */}
        <button
          type="button"
          onClick={onCancel}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content Container */}
        <div className="self-stretch flex flex-col justify-start items-start gap-6 w-full">
          {/* Header & Subtitle */}
          <div className="self-stretch flex flex-col justify-center items-center gap-2">
            <h3 className="text-[#103D5C] text-center text-[20px] font-medium leading-[132%]">
              Delete FAQ?
            </h3>
            <p className="text-[#5A5A5A] text-center text-[14px] font-normal leading-[160%]">
              Are you sure you want to delete this?
            </p>
          </div>

          {/* Action Buttons */}
          <div className="self-stretch inline-flex justify-start items-start gap-4 w-full mt-2">
            <CustomButton
              type="button"
              variant="tertiary"
              size="md"
              className="flex-1 rounded-lg border-slate-200 text-slate-700 hover:bg-slate-50"
              onClick={onCancel}
              disabled={isDeleting}
            >
              Cancel
            </CustomButton>
            <CustomButton
              type="button"
              variant="tertiary"
              size="md"
              className="flex-1 rounded-lg border-[#EB3D4D] text-[#EB3D4D] hover:bg-rose-50"
              onClick={onConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Yes, Delete It!"}
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
}
