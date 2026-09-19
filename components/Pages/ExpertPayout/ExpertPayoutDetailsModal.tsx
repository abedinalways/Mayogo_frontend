"use client";

import React, { useState } from "react";
import Image from "next/image";
import { UserCircle, X, AlertCircle } from "lucide-react";
import CustomModal from "@/components/shared/CustomModal";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { ExpertRecord } from "./ExpertTable";
import ExpertProcessPaymentModal from "./ExpertProcessPaymentModal";
import CustomButton from "@/components/shared/CustomButton";

interface ExpertPayoutDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expert: ExpertRecord | null;
}

export default function ExpertPayoutDetailsModal({
  open,
  onOpenChange,
  expert,
}: ExpertPayoutDetailsModalProps) {
  const [processOpen, setProcessOpen] = useState(false);
  const [rejectFlow, setRejectFlow] = useState(false);

  if (!expert) return null;

  const isPending = expert.status === "Pending";

  return (
    <>
      <CustomModal
        open={open}
        onOpenChange={onOpenChange}
        size="md"
        showCloseButton={false}
        className="p-5 gap-0 rounded-2xl overflow-hidden"
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between   pb-4">
          <h2 className="text-[#103D5C] text-center text-[18px] font-semibold leading-[132%]">
            Review Withdrawal Request
          </h2>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex items-center gap-1 text-[#F5B517] text-[14px] font-medium leading-[116%] underline"
            >
              <UserCircle size={14} />
              View Profile
            </button>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex h-6 w-6 items-center justify-center rounded-full text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* ── Expert Info Row ── */}
        <div className="flex items-center justify-between  pb-4">
          <div className="flex items-center gap-3">
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-[#F5B517]">
              <Image
                src={expert.expert.avatar}
                alt={expert.expert.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-[#103D5C] text-center text-[16px] font-semibold leading-[100%]">
                {expert.expert.name}
              </p>
              <p className="text-[#567FA0] text-[14px] font-normal leading-[100%] mt-1.5">
                Expert ID {expert.expertId}
              </p>
            </div>
          </div>
          <StatusBadge status={expert.status} />
        </div>

        {/* ── 3-column Summary Cards ── */}
        <div className="grid grid-cols-3 gap-3  pb-4">
          {[
            { label: "Requested Amount", value: expert.requestAmount },
            { label: "Available Balance", value: expert.availableBalance },
            { label: "Requested Date", value: expert.date },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-xl border border-slate-200 bg-white p-3"
            >
              <p className="text-[#5A5A5A] text-[14px] font-normal leading-[100%] text-nowrap">
                {label}
              </p>
              <p className="text-[#103D5C] text-[18px] font-semibold leading-[124%] mt-4">
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* ── Payout Method Card ── */}
        <div className=" mb-4 rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-[#103D5C] text-[16px] font-semibold leading-[132%] mb-3">
            Payout Method
          </p>
          <div className="space-y-2.5">
            {[
              { label: "Method", value: expert.method },
              { label: "Account Name", value: expert.accountName },
              { label: "Account Number", value: expert.accountNumber },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-[#5A5A5A] text-[14px] font-medium leading-[124%]">
                  {label}
                </span>
                <span className="text-[#103D5C] text-[14px] font-semibold leading-[124%]">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Rejected state: Rejected By / Rejected Date + error note ── */}
        {expert.status === "Rejected" && (
          <>
            <div className="grid grid-cols-2 gap-3  pb-4">
              <div className="rounded-xl border border-slate-200 bg-white p-3">
                <p className="text-[10px] font-normal text-slate-400 font-['Manrope'] leading-4">
                  Rejected By
                </p>
                <p className="text-sm font-bold text-[#0a3558] font-['Manrope'] leading-6 mt-0.5">
                  {expert.rejectedBy ?? "—"}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3">
                <p className="text-[10px] font-normal text-slate-400 font-['Manrope'] leading-4">
                  Rejected Date
                </p>
                <p className="text-sm font-bold text-[#0a3558] font-['Manrope'] leading-6 mt-0.5">
                  {expert.rejectedDate ?? "—"}
                </p>
              </div>
            </div>

            {expert.rejectionNote && (
              <div className=" mb-5 flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-3 border border-rose-100">
                <AlertCircle size={14} className="text-rose-500 shrink-0" />
                <p className="text-sm font-medium text-rose-500 font-['Manrope']">
                  {expert.rejectionNote}
                </p>
              </div>
            )}
          </>
        )}

        {/* ── Pending state: Reject + Approve buttons ── */}
        {isPending && (
          <div className="grid grid-cols-2 gap-3 pb-5">
            <button
              type="button"
              onClick={() => {
                setRejectFlow(true);
                setProcessOpen(true);
              }}
              className="h-10 rounded-lg border-1 border-[#EB3D4D] bg-white text-sm font-semibold text-rose-500 font-['Manrope'] transition-all hover:bg-rose-50 active:scale-[0.98]"
            >
              Reject
            </button>
            <CustomButton
              size="md"
              type="button"
              onClick={() => {
                setRejectFlow(false);
              }}
            >
              Approve
            </CustomButton>
          </div>
        )}
      </CustomModal>

      {/* Modal 2: Reason Required (reject) or Approve confirm */}
      <ExpertProcessPaymentModal
        open={processOpen}
        onOpenChange={(v) => {
          setProcessOpen(v);
          if (!v) setRejectFlow(false);
        }}
        expert={expert}
        initialAction={rejectFlow ? "reject" : "approve"}
        onBack={() => {
          setProcessOpen(false);
          // re-open Modal 1
          onOpenChange(true);
        }}
        onConfirm={(action, note) => {
          console.log("Payment action:", action, "Note:", note);
          setProcessOpen(false);
          onOpenChange(false);
        }}
      />
    </>
  );
}
