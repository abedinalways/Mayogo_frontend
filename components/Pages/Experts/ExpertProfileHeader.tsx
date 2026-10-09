"use client";

import React from "react";
import { Phone, Mail, MapPin, Calendar, CheckCircle2, Loader2 } from "lucide-react";
import { Expert, ExpertStatusAction } from "@/types/expert.types";

export interface ExpertProfileHeaderProps {
  expert?: Expert | null;
  onUpdateStatus?: (action: ExpertStatusAction, reason?: string) => void;
  isUpdatingStatus?: boolean;
}

export function ExpertProfileHeader({
  expert,
  onUpdateStatus,
  isUpdatingStatus = false,
}: ExpertProfileHeaderProps) {
  const displayName = expert?.fullName || "Expert Name";
  const displayId = expert?.expertId || (expert?.id ? `#${expert.id.slice(0, 8)}` : "#E000");
  const avatarUrl =
    expert?.avatar ||
    `https://placehold.co/120x120?text=${encodeURIComponent(displayName.charAt(0))}`;

  const rawStatus = (expert?.status || "active").toLowerCase();
  const isActive = rawStatus === "active";
  const isSuspended = rawStatus === "suspended";
  const isBusy = rawStatus === "busy";

  let statusLabel = "Active";
  let statusBadgeStyle = "bg-sky-50 outline-sky-200/50 text-sky-600";
  let statusDotColor = "bg-sky-500";

  if (isBusy) {
    statusLabel = "Busy";
    statusBadgeStyle = "bg-amber-50 outline-amber-200/50 text-amber-600";
    statusDotColor = "bg-amber-500";
  } else if (isSuspended) {
    statusLabel = "Suspended";
    statusBadgeStyle = "bg-rose-50 outline-rose-200/50 text-rose-700";
    statusDotColor = "bg-rose-700";
  } else if (rawStatus === "inactive") {
    statusLabel = "Inactive";
    statusBadgeStyle = "bg-rose-50 outline-rose-200/50 text-rose-500";
    statusDotColor = "bg-rose-500";
  }

  const rawLevel = (expert?.verificationLevel || "").toUpperCase();
  let verificationLabel = "Level 1 Verified";
  let completedSteps = 1;

  if (rawLevel.includes("LEVEL_4") || rawLevel.includes("LEVEL 4")) {
    verificationLabel = "Level 4 Verified (All Docs)";
    completedSteps = 4;
  } else if (rawLevel.includes("LEVEL_3") || rawLevel.includes("LEVEL 3")) {
    verificationLabel = "Level 3 - Face ID Verified";
    completedSteps = 3;
  } else if (rawLevel.includes("LEVEL_2") || rawLevel.includes("LEVEL 2")) {
    verificationLabel = "Level 2 - Identity Verified";
    completedSteps = 2;
  } else if (expert?.verificationStatus?.toLowerCase() === "verified") {
    verificationLabel = "Fully Verified";
    completedSteps = 4;
  } else if (rawLevel === "UNVERIFIED") {
    verificationLabel = "Unverified";
    completedSteps = 0;
  }

  let joinedDate = "N/A";
  if (expert?.createdAt) {
    try {
      joinedDate = new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(expert.createdAt));
    } catch {
      joinedDate = expert.createdAt;
    }
  }

  const location = expert?.location || expert?.city || expert?.country || "Mikocheni, Dar es Salaam";
  const planName = expert?.subscription?.plan || "Standard Plan";
  const startedOn = expert?.subscription?.startedOn || joinedDate;
  const nextRenewal = expert?.subscription?.nextRenewal || "Auto-renews monthly";

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-2 border-amber-400 bg-slate-100">
            <img
              src={avatarUrl}
              alt={displayName}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-4 font-['Manrope']">
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-xl font-semibold text-[#103D5C]">
                  {displayName}
                </h1>

                <span
                  className={`inline-flex h-5 items-center gap-1 rounded px-2 text-xs font-medium outline outline-1 outline-offset-[-1px] ${statusBadgeStyle}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${statusDotColor}`} />
                  {statusLabel}
                </span>

                <span className="inline-flex h-5 items-center rounded bg-emerald-50 px-2 text-xs font-medium text-emerald-700 outline outline-1 outline-offset-[-1px] outline-emerald-200">
                  {verificationLabel}
                </span>
              </div>

              <span className="text-sm text-slate-500">
                Expert ID {displayId}
              </span>
            </div>

            <div className="flex flex-col gap-2.5 text-sm text-slate-600">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2 min-w-[180px]">
                  <Phone className="h-4 w-4 text-amber-500 shrink-0" />
                  <span>{expert?.phone || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-amber-500 shrink-0" />
                  <span>{expert?.email || "N/A"}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2 min-w-[180px]">
                  <MapPin className="h-4 w-4 text-amber-500 shrink-0" />
                  <span>{location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-amber-500 shrink-0" />
                  <span>Joined: {joinedDate}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <div className="flex w-44 items-center gap-1">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-1 flex-1 rounded-full ${
                      step <= completedSteps ? "bg-emerald-600" : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-emerald-600">
                {verificationLabel}
              </span>
            </div>
          </div>
        </div>

        {expert && onUpdateStatus && (
          <div className="flex flex-wrap items-center gap-3 self-start">
            {isSuspended ? (
              <button
                type="button"
                disabled={isUpdatingStatus}
                onClick={() => onUpdateStatus("unsuspend")}
                className="h-10 rounded-lg bg-emerald-600 px-4 py-2 font-['Manrope'] text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50 cursor-pointer inline-flex items-center gap-2"
              >
                {isUpdatingStatus ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : null}
                <span>Unsuspend Account</span>
              </button>
            ) : (
              <>
                {isActive ? (
                  <button
                    type="button"
                    disabled={isUpdatingStatus}
                    onClick={() => onUpdateStatus("mark_busy")}
                    className="h-10 rounded-lg border border-slate-300 bg-white px-4 py-2 font-['Manrope'] text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
                  >
                    Mark as Busy
                  </button>
                ) : isBusy ? (
                  <button
                    type="button"
                    disabled={isUpdatingStatus}
                    onClick={() => onUpdateStatus("mark_available")}
                    className="h-10 rounded-lg border border-sky-300 bg-sky-50 px-4 py-2 font-['Manrope'] text-sm font-medium text-sky-700 transition-colors hover:bg-sky-100 disabled:opacity-50 cursor-pointer"
                  >
                    Mark Available
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isUpdatingStatus}
                    onClick={() => onUpdateStatus("activate")}
                    className="h-10 rounded-lg bg-[#103D5C] px-4 py-2 font-['Manrope'] text-sm font-medium text-white transition-colors hover:bg-[#0c2f47] disabled:opacity-50 cursor-pointer"
                  >
                    Activate Account
                  </button>
                )}

                <button
                  type="button"
                  disabled={isUpdatingStatus}
                  onClick={() =>
                    onUpdateStatus("suspend", "Policy review by administrator")
                  }
                  className="h-10 rounded-lg border border-rose-300 bg-white px-4 py-2 font-['Manrope'] text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 disabled:opacity-50 cursor-pointer inline-flex items-center gap-2"
                >
                  {isUpdatingStatus ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : null}
                  <span>Suspend Account</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 border-t border-slate-100 pt-4 font-['Manrope'] text-sm text-slate-600">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-1.5">
            <span>Current Plan:</span>
            <span className="font-semibold text-slate-900">{planName}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>Started On:</span>
            <span className="font-semibold text-slate-900">{startedOn}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>Next Renewal:</span>
            <span className="font-semibold text-slate-900">{nextRenewal}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExpertProfileHeader;