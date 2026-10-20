"use client";

import React, { useState, useEffect, useRef } from "react";
import LeftsideTitleSubtitle from "../LeftsideTitleSubtitle";
import { CustomInput } from "@/components/shared/CustomInput";
import {
  useGetEscrowSettingsQuery,
  useUpdateEscrowSettingsMutation,
  useResetEscrowSettingsMutation,
} from "@/lib/redux/api/settingsApi";
import { useToast } from "@/components/shared/Toast/ToastContext";
import { RotateCcw, Loader2 } from "lucide-react";

interface PaymentEscrowSettingsProps {
  onSavingChange?: (isSaving: boolean) => void;
}

const parseDays = (val: string | number, fallback: number = 7): number => {
  if (typeof val === "number") return val;
  const match = String(val).match(/\d+/);
  return match ? parseInt(match[0], 10) : fallback;
};

const parseAmount = (val: string | number, fallback: number = 20): number => {
  if (typeof val === "number") return val;
  const cleaned = String(val).replace(/[^0-9.]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? fallback : num;
};

export function PaymentEscrowSettings({
  onSavingChange,
}: PaymentEscrowSettingsProps) {
  const { data: escrowSettings, isLoading: isFetchingData } =
    useGetEscrowSettingsQuery();
  const [updateEscrow, { isLoading: isUpdating }] =
    useUpdateEscrowSettingsMutation();
  const [resetEscrow, { isLoading: isResetting }] =
    useResetEscrowSettingsMutation();

  const { success, error } = useToast();

  // Escrow Configuration state
  const [autoReleaseDuration, setAutoReleaseDuration] = useState("7 Days");
  const [escrowHoldDuration, setEscrowHoldDuration] = useState("3 Days");

  // Withdrawal Configuration state
  const [minWithdrawalAmount, setMinWithdrawalAmount] = useState("$20");
  const [processingTime, setProcessingTime] = useState("2 Business Days");

  // Refund Configuration state
  const [refundProcessingTime, setRefundProcessingTime] = useState("5 Days");

  const hasInitialized = useRef(false);
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    if (escrowSettings && !hasInitialized.current) {
      if (escrowSettings.escrowReleaseDays !== undefined) {
        setAutoReleaseDuration(`${escrowSettings.escrowReleaseDays} Days`);
      }
      if (escrowSettings.escrowHoldDuration !== undefined) {
        const val = escrowSettings.escrowHoldDuration;
        setEscrowHoldDuration(
          typeof val === "number" ? `${val} Days` : String(val)
        );
      }
      if (escrowSettings.minWithdrawalAmount !== undefined) {
        setMinWithdrawalAmount(`$${escrowSettings.minWithdrawalAmount}`);
      }
      if (escrowSettings.withdrawalProcessingDays !== undefined) {
        setProcessingTime(
          `${escrowSettings.withdrawalProcessingDays} Business Days`
        );
      }
      if (escrowSettings.refundProcessingDays !== undefined) {
        setRefundProcessingTime(`${escrowSettings.refundProcessingDays} Days`);
      }
      hasInitialized.current = true;
    }
  }, [escrowSettings]);

  const isSaving = isUpdating || isResetting;

  useEffect(() => {
    onSavingChange?.(isSaving);
  }, [isSaving, onSavingChange]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (isSubmittingRef.current || isSaving) return;

    isSubmittingRef.current = true;
    try {
      const releaseDays = parseDays(autoReleaseDuration, 7);
      const minAmount = parseAmount(minWithdrawalAmount, 20);
      const withDays = parseDays(processingTime, 2);
      const refDays = parseDays(refundProcessingTime, 5);

      await updateEscrow({
        escrowReleaseDays: Math.min(30, Math.max(1, releaseDays)),
        minWithdrawalAmount: Math.max(0, minAmount),
        withdrawalProcessingDays: Math.min(10, Math.max(1, withDays)),
        refundProcessingDays: Math.min(30, Math.max(1, refDays)),
      }).unwrap();

      success("Payment & Escrow settings updated successfully");
    } catch (err: any) {
      const msg =
        err?.data?.message || err?.message || "Failed to update escrow settings";
      error(msg);
    } finally {
      isSubmittingRef.current = false;
    }
  };

  useEffect(() => {
    const handleSaveRequest = (evt: Event) => {
      const customEvent = evt as CustomEvent<{ section?: string }>;
      if (
        !customEvent.detail ||
        customEvent.detail.section === "payment-escrow"
      ) {
        handleSubmit();
      }
    };

    window.addEventListener("SETTINGS_SAVE_REQUEST", handleSaveRequest);
    return () => {
      window.removeEventListener("SETTINGS_SAVE_REQUEST", handleSaveRequest);
    };
  }, [
    autoReleaseDuration,
    escrowHoldDuration,
    minWithdrawalAmount,
    processingTime,
    refundProcessingTime,
  ]);

  const handleResetDefaults = async () => {
    if (isSaving) return;
    try {
      const res = await resetEscrow().unwrap();
      setAutoReleaseDuration("7 Days");
      setEscrowHoldDuration("3 Days");
      setMinWithdrawalAmount("$20");
      setProcessingTime("2 Business Days");
      setRefundProcessingTime("5 Days");
      hasInitialized.current = false;
      success(res?.message || "Escrow settings reset to default values");
    } catch (err: any) {
      const msg =
        err?.data?.message || err?.message || "Failed to reset escrow settings";
      error(msg);
    }
  };

  if (isFetchingData && !hasInitialized.current) {
    return (
      <div className="space-y-8 p-5 font-['Manrope'] animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-2">
            <div className="h-5 w-44 rounded bg-slate-200" />
            <div className="h-4 w-60 rounded bg-slate-100" />
          </div>
          <div className="lg:col-span-7 space-y-4">
            <div className="h-10 w-full rounded bg-slate-100" />
            <div className="h-10 w-full rounded bg-slate-100" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      id="payment-escrow-settings-form"
      onSubmit={handleSubmit}
      className="space-y-8 p-5 font-['Manrope']"
    >
      {/* SECTION 1: ESCROW CONFIGURATION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <LeftsideTitleSubtitle
          title="Escrow Configuration"
          subtitle="Funds will be automatically released after job completion."
          subtitleWidth="max-w-[280px]"
        />

        {/* Right Column */}
        <div className="lg:col-span-7 space-y-5">
          <CustomInput
            label="Auto Release Duration"
            type="text"
            value={autoReleaseDuration}
            onChange={(e) => setAutoReleaseDuration(e.target.value)}
            placeholder="e.g. 7 Days"
            isRequired
          />

          <CustomInput
            label="Escrow Hold Duration"
            type="text"
            value={escrowHoldDuration}
            onChange={(e) => setEscrowHoldDuration(e.target.value)}
            placeholder="e.g. 3 Days"
          />
        </div>
      </div>

      {/* HORIZONTAL DIVIDER LINE */}
      <div className="border-t border-[#E4EBF1] w-full" />

      {/* SECTION 2: WITHDRAWAL CONFIGURATION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <LeftsideTitleSubtitle
          title="Withdrawal Configuration"
          subtitle="Admin will approve withdrawal request."
          subtitleWidth="max-w-[280px]"
        />

        {/* Right Column */}
        <div className="lg:col-span-7 space-y-5">
          <CustomInput
            label="Minimum Withdrawal Amount"
            type="text"
            value={minWithdrawalAmount}
            onChange={(e) => setMinWithdrawalAmount(e.target.value)}
            placeholder="e.g. $20"
            isRequired
          />

          <CustomInput
            label="Processing Time"
            type="text"
            value={processingTime}
            onChange={(e) => setProcessingTime(e.target.value)}
            placeholder="e.g. 2 Business Days"
            isRequired
          />
        </div>
      </div>

      {/* HORIZONTAL DIVIDER LINE */}
      <div className="border-t border-[#E4EBF1] w-full" />

      {/* SECTION 3: REFUND CONFIGURATION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <LeftsideTitleSubtitle
          title="Refund Configuration"
          subtitle="Admin will approve withdrawal request."
          subtitleWidth="max-w-[280px]"
        />

        {/* Right Column */}
        <div className="lg:col-span-7 space-y-5">
          <CustomInput
            label="Refund Processing Time"
            type="text"
            value={refundProcessingTime}
            onChange={(e) => setRefundProcessingTime(e.target.value)}
            placeholder="e.g. 5 Days"
            isRequired
          />

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleResetDefaults}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#103D5C] transition-colors disabled:opacity-50"
            >
              {isResetting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RotateCcw className="h-3.5 w-3.5" />
              )}
              <span>Reset to Defaults</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default PaymentEscrowSettings;
