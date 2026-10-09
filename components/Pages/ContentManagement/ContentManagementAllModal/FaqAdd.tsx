"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import CustomButton from "@/components/shared/CustomButton";
import { CustomInput } from "@/components/shared/CustomInput";

export interface FaqFormData {
  id?: string;
  title: string;
  description: string;
  status: string;
}

export interface FaqAddProps {
  initialData?: FaqFormData | null;
  onCancel: () => void;
  onSubmit: (data: FaqFormData) => void;
  isSubmitting?: boolean;
}

export default function FaqAdd({
  initialData,
  onCancel,
  onSubmit,
  isSubmitting = false,
}: FaqAddProps) {
  const isEdit = Boolean(initialData?.id);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setIsLive(initialData.status.toLowerCase() === "live");
    } else {
      setTitle("");
      setDescription("");
      setIsLive(false);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: initialData?.id,
      title,
      description,
      status: isLive ? "Live" : "Draft",
    });
  };

  return (
    <div className="font-['Manrope']">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-[#103D5C] text-center text-[18px] font-semibold leading-[100%]">
          {isEdit ? "Edit FAQ" : "Add FAQ"}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
        <div>
          <CustomInput
            label="Title"
            placeholder="How do I hire an expert?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-normal text-slate-600 leading-6">
            Description
          </label>
          <textarea
            rows={4}
            placeholder="Enter the detailed answer for this FAQ..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm font-normal text-slate-800 placeholder:text-slate-400 transition-all focus:border-[#0a3558] focus:outline-none focus:ring-1 focus:ring-[#0a3558] resize-none"
          />
        </div>

        <div className="flex items-center justify-between py-1">
          <span className="text-[#103D5C] text-[16px] font-medium leading-[160%]">
            Status
          </span>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              role="switch"
              aria-checked={isLive}
              onClick={() => setIsLive((prev) => !prev)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isLive ? "bg-[#103D5C]" : "bg-slate-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  isLive ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
            <span className="text-sm font-normal text-slate-600 min-w-10">
              {isLive ? "Live" : "Draft"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <CustomButton
            type="button"
            variant="tertiary"
            size="md"
            className="flex-1 rounded-lg border-[#103D5C] text-[#103D5C] hover:bg-slate-50"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </CustomButton>
          <CustomButton
            type="submit"
            variant="primary"
            size="md"
            disabled={isSubmitting}
            className="flex-1 rounded-lg bg-[#103D5C] hover:bg-[#0b2841] text-white flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isEdit ? (
              "Save Changes"
            ) : (
              "Add FAQ"
            )}
          </CustomButton>
        </div>
      </form>
    </div>
  );
}
