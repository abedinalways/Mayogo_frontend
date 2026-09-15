'use client'

import { User, Phone, CheckCircle2, Star } from "lucide-react";

// ==========================================
// 1. Reusable UserProfileCard Component
// ==========================================

export interface UserProfileCardProps {
  title: string;
  name: string;
  idText: string;
  avatarUrl: string;
  isVerified?: boolean;
  phone?: string;
  subtitle?: string;
  rating?: number | string;
  onViewProfile?: () => void;
}

export function InfoCard({
  title,
  name,
  idText,
  avatarUrl,
  isVerified = false,
  phone,
  subtitle,
  rating,
  onViewProfile,
}: UserProfileCardProps) {
  return (
    <div className="flex w-full flex-col justify-between gap-5 rounded-2xl bg-white p-4 shadow-[0px_2px_4px_-1px_rgba(13,13,18,0.06)] border border-[#e4ebf1] font-['Manrope']">
      {/* Header Title */}
      <div className="flex items-center gap-1.5">
        <User className="h-5 w-5 text-[#f59e0b] fill-[#f59e0b]" />
        <h3 className="text-base font-semibold text-[#0f3453]">{title}</h3>
      </div>

      {/* Profile Info Row */}
      <div className="flex items-center gap-3.5">
        {/* Avatar with Amber Border */}
        <div className="relative shrink-0">
          <img
            src={avatarUrl}
            alt={name}
            className="h-20 w-20 rounded-full object-cover border-2 border-[#f59e0b]"
          />
        </div>

        {/* User Details */}
        <div className="flex flex-1 items-start justify-between">
          <div className="flex flex-col gap-1">
            {/* Name + Verification Badge */}
            <div className="flex items-center gap-1.5">
              <h4 className="text-base font-semibold text-[#0f3453]">{name}</h4>
              {isVerified && (
                <CheckCircle2 className="h-4 w-4 text-[#16a34a] fill-[#16a34a] stroke-white" />
              )}
            </div>

            {/* User ID */}
            <span className="text-sm font-normal text-[#6c8294]">{idText}</span>

            {/* Optional Phone Row (Client style) */}
            {phone && (
              <div className="flex items-center gap-1 text-xs font-normal text-[#8a9bab]">
                <Phone className="h-3 w-3 text-[#f59e0b] fill-[#f59e0b]" />
                <span>{phone}</span>
              </div>
            )}

            {/* Optional Subtitle/Role Row (Expert style) */}
            {subtitle && (
              <span className="text-sm font-normal text-[#8a9bab]">
                {subtitle}
              </span>
            )}
          </div>

          {/* Optional Rating Badge */}
          {rating !== undefined && (
            <div className="flex items-center gap-1 text-sm font-semibold text-[#0f3453]">
              <Star className="h-4 w-4 fill-[#f59e0b] text-[#f59e0b]" />
              <span>{rating}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Button */}
      <button
        type="button"
        onClick={onViewProfile}
        className="w-full rounded-lg border border-[#0f3453] bg-transparent py-2.5 text-sm font-medium text-[#0f3453] transition-colors hover:bg-slate-50 focus:outline-none"
      >
        View Profile
      </button>
    </div>
  );
}