"use client";

import React, { useState } from "react";
import CustomButton from "@/components/shared/CustomButton";
import CustomInput from "@/components/Reuasable/CustomInput";
import CustomSelect, {
  CustomSelectOption,
} from "@/components/shared/CustomSelect";

interface EditCommisionRateProps {
  currentRate?: number;
  currentCurrency?: string;
  onSuccess?: (rate: number, currency: string) => void;
  onClose?: () => void;
  onProcessingChange?: (isProcessing: boolean) => void;
}

const currencyOptions: CustomSelectOption[] = [
  { label: "USD", value: "USD" },
  { label: "EUR", value: "EUR" },
  { label: "GBP", value: "GBP" },
  { label: "CAD", value: "CAD" },
  { label: "BDT", value: "BDT" },
];

export default function EditCommisionRate({
  currentRate = 10,
  currentCurrency = "USD",
  onSuccess,
  onClose,
  onProcessingChange,
}: EditCommisionRateProps) {
  const [rate, setRate] = useState<number>(currentRate);
  const [currency, setCurrency] = useState<string>(currentCurrency);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsProcessing(true);
      onProcessingChange?.(true);

      // API call simulation
      await new Promise((resolve) => setTimeout(resolve, 800));

      onSuccess?.(rate, currency);
      onClose?.();
    } finally {
      setIsProcessing(false);
      onProcessingChange?.(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-['Manrope']">
      {/* Commission Rate (%) */}
      <div>
        <label className="text-[#103D5C] text-[14px] font-medium block mb-2">
          Commission Rate (%)
        </label>

        <CustomInput
          type="number"
          min={0}
          max={100}
          step={0.1}
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          placeholder="10"
          className="w-full rounded-lg border border-[#E8E8E8] h-12 px-3.5 text-sm text-[#103D5C] outline-none focus:border-[#103D5C] transition-colors"
          required
        />

        <p className="mt-1.5 text-[#5A5A5A] text-[14px] font-normal leading-[140%]">
          Applied to every completed job
        </p>
      </div>

      {/* Currency */}
      <div>
        <label className="text-[#103D5C] text-[14px] font-medium block mb-2">
          Currency
        </label>

        <CustomSelect
          options={currencyOptions}
          value={currency}
          onValueChange={setCurrency}
          triggerClassName="w-full h-12 px-3.5 bg-white rounded-lg border border-[#E8E8E8] text-sm text-[#103D5C] font-normal"
        />
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-4 pt-3">
        <button
          type="button"
          onClick={onClose}
          disabled={isProcessing}
          className="w-full h-11 rounded-lg border border-[#103D5C] bg-white text-[#103D5C] text-sm font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isProcessing}
          className="w-full h-11 rounded-lg bg-[#0f3453] hover:bg-[#0a2740] text-white text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer"
        >
          {isProcessing ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
