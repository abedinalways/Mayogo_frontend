"use client";

import React from "react";
import Image from "next/image";
import { X, Star, Eye, EyeOff } from "lucide-react";
import CustomButton from "@/components/shared/CustomButton";

export interface ReviewDetailsProps {
  jobId?: string;
  serviceTitle?: string;
  serviceCategory?: string;
  serviceImage?: string;
  clientName?: string;
  clientRole?: string;
  clientAvatar?: string;
  rating?: number;
  date?: string;
  comment?: string;
  expertName?: string;
  expertRole?: string;
  expertAvatar?: string;
  status?: "Visible" | "Hidden";
  onClose?: () => void;
  onToggleStatus?: () => void;
}

export function ReviewDetails({
  jobId = "#JB003",
  serviceTitle = "Air Conditioner (AC) Repair",
  serviceCategory = "Repair & Diagnostic",
  serviceImage = "https://placehold.co/44x44",
  clientName = "Sarah William",
  clientRole = "Client",
  clientAvatar = "https://placehold.co/40x40",
  rating = 1,
  date = "Jan 12, 2026",
  comment = "Terrible experience. AC not installed correctly, caused damage. Do not use this person!",
  expertName = "Daniel Green",
  expertRole = "Expert",
  expertAvatar = "https://placehold.co/30x30",
  status = "Hidden",
  onClose,
  onToggleStatus,
}: ReviewDetailsProps) {
  const isHidden = status === "Hidden";

  return (
    <div className="w-full inline-flex flex-col justify-center items-center gap-6">
      {/* Header */}
      <div className="self-stretch pb-4 border-b border-slate-100 inline-flex justify-between items-start">
        <div className="inline-flex flex-col justify-center items-start gap-1">
          <h3 className="text-lg font-semibold text-slate-900 leading-none">
            Review Details
          </h3>
          <span className="text-sm font-normal text-slate-500 leading-none">
            {jobId}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content Area */}
      <div className="self-stretch flex flex-col justify-start items-start gap-4">
        {/* Service Card */}
        <div className="self-stretch p-3 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 inline-flex justify-start items-center gap-3">
          <Image
            src={serviceImage}
            alt={serviceTitle}
            width={44}
            height={44}
            className="h-11 w-11 rounded-md border border-slate-200 object-cover shrink-0"
            unoptimized
          />
          <div className="inline-flex flex-col justify-start items-start gap-0.5">
            <span className="text-sm font-medium text-slate-900 line-clamp-1">
              {serviceTitle}
            </span>
            <span className="text-xs font-medium text-slate-500">
              {serviceCategory}
            </span>
          </div>
        </div>

        {/* Review Box */}
        <div className="self-stretch p-4 bg-slate-50/80 rounded-2xl flex flex-col justify-start items-start gap-4">
          {/* Client & Rating Header */}
          <div className="self-stretch pb-4 border-b border-slate-200/60 flex flex-col justify-start items-start gap-3">
            <div className="self-stretch inline-flex justify-between items-start">
              <div className="flex justify-center items-center gap-2">
                <Image
                  src={clientAvatar}
                  alt={clientName}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full outline outline-1 outline-amber-400 object-cover shrink-0"
                  unoptimized
                />
                <div className="inline-flex flex-col justify-center items-start">
                  <span className="text-base font-semibold text-slate-900 leading-tight">
                    {clientName}
                  </span>
                  <span className="text-[10px] font-normal text-slate-400 leading-none">
                    {clientRole}
                  </span>
                </div>
              </div>

              {/* Stars & Date */}
              <div className="inline-flex flex-col justify-center items-end gap-1">
                <div className="inline-flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-3.5 w-3.5 ${
                        star <= rating
                          ? "fill-amber-500 text-amber-500"
                          : "fill-slate-200 text-slate-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-normal text-slate-400">
                  {date}
                </span>
              </div>
            </div>

            {/* Comment Body */}
            <p className="self-stretch text-sm font-normal text-slate-600 leading-6">
              {comment}
            </p>
          </div>

          {/* Expert Footer & Status Badge */}
          <div className="self-stretch inline-flex justify-between items-center">
            <div className="flex justify-center items-center gap-2">
              <Image
                src={expertAvatar}
                alt={expertName}
                width={30}
                height={30}
                className="h-7 w-7 rounded-full outline outline-1 outline-amber-400 object-cover shrink-0"
                unoptimized
              />
              <div className="inline-flex flex-col justify-center items-start">
                <span className="text-sm font-semibold text-slate-900 leading-tight">
                  {expertName}
                </span>
                <span className="text-[10px] font-normal text-slate-400 leading-none">
                  {expertRole}
                </span>
              </div>
            </div>

            {/* Status Capsule */}
            <div
              className={`h-5 px-2 py-0.5 rounded-sm outline outline-1 outline-offset-[-1px] inline-flex justify-center items-center gap-1 ${
                isHidden
                  ? "bg-rose-50 outline-red-100 text-red-500"
                  : "bg-emerald-50 outline-emerald-100 text-emerald-600"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isHidden ? "bg-red-500" : "bg-emerald-500"
                }`}
              />
              <span className="text-xs font-medium leading-none">
                {status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="self-stretch inline-flex justify-start items-start gap-3">
        <CustomButton
          variant="secondary"
          size="md"
          className="flex-1"
          onClick={onClose}
        >
          Cancel
        </CustomButton>

        <CustomButton
          variant="primary"
          size="md"
          className="flex-1"
          onClick={onToggleStatus}
          leadingIcon={
            isHidden ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )
          }
        >
          {isHidden ? "Make it Visible" : "Hide Review"}
        </CustomButton>
      </div>
    </div>
  );
}

    export default ReviewDetails ;