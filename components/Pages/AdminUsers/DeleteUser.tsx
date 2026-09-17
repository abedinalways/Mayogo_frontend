"use client";

import React from "react";
import { X } from "lucide-react";
import CustomButton from "@/components/shared/CustomButton";

export interface DeleteUserConfirmationProps {
  userName?: string;
  onCancel: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export function DeleteUser({
  userName = "Sarah Willam",
  onCancel,
  onConfirm,
  isDeleting = false,
}: DeleteUserConfirmationProps) {
  return (
    <div >
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
        <div className="self-stretch flex flex-col justify-start items-start gap-8">
          {/* Header & Subtitle */}
          <div className="self-stretch flex flex-col justify-center items-center gap-4">
            <h3 className="text-center text-[#103D5C] text-xl font-medium leading-7">
              Are you sure want to delete
              <br />
              “{userName}”?
            </h3>
            <p className="self-stretch text-center text-slate-500 text-sm font-normal leading-6">
              This user will be deleted permanently.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="self-stretch inline-flex justify-start items-start gap-4 font-['Inter']">
            <CustomButton
              variant="tertiary"
              size="lg"
              className="flex-1"
              onClick={onCancel}
              disabled={isDeleting}
            >
              Cancel
            </CustomButton>
            <CustomButton
              variant="tertiary"
              size="lg"
              className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
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