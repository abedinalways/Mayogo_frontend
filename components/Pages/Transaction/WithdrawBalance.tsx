"use client";

import React, { useState } from "react";
import CustomInput from "@/components/Reuasable/CustomInput";
import CustomSelect, {
  CustomSelectOption,
} from "@/components/shared/CustomSelect";

interface WithdrawBalanceProps {
  availableBalance?: string;
  onSuccess?: (amount: string, method: string) => void;
  onClose?: () => void;
  onProcessingChange?: (isProcessing: boolean) => void;
}

const payoutMethodOptions: CustomSelectOption[] = [
  { label: "Bank Transfer", value: "bank_transfer" },
  { label: "PayPal", value: "paypal" },
  { label: "Stripe", value: "stripe" },
  { label: "Direct Deposit", value: "direct_deposit" },
];

export default function WithdrawBalance({
  availableBalance = "$1,842.00",
  onSuccess,
  onClose,
  onProcessingChange,
}: WithdrawBalanceProps) {
  const [amount, setAmount] = useState<string>("$1,000");
  const [payoutMethod, setPayoutMethod] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsProcessing(true);
      onProcessingChange?.(true);

      // Simulated API withdrawal request
      await new Promise((resolve) => setTimeout(resolve, 800));

      onSuccess?.(amount, payoutMethod);
      onClose?.();
    } finally {
      setIsProcessing(false);
      onProcessingChange?.(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 font-['Manrope']">
      {/* Withdraw Earnings Info Box */}
      <div className="rounded-xl bg-[#F1F4F6] p-4 flex flex-col gap-1">
        <h4 className="text-[#103D5C] text-[16px] font-medium leading-[132%]">
          Withdraw Earnings
        </h4>
        <p className="text-[#5A5A5A] text-[14px] font-normal leading-[160%]">
          Available Balance: {availableBalance}
        </p>
      </div>

      {/* Withdraw Amount */}
      <div>
        <label className="text-[#103D5C] text-[16px] font-medium leading-[160%] block mb-1.5">
          Withdraw Amount
        </label>

        <CustomInput
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="$1,000"
          className="w-full rounded-lg border border-[#E8E8E8] h-12 px-3.5 text-sm text-[#103D5C] outline-none focus:border-[#103D5C] transition-colors"
          required
        />

        <p className="mt-1.5 text-[#5A5A5A] text-[14px] font-normal leading-[140%]">
          Applied to every completed job
        </p>
      </div>

      {/* Payout Method */}
      <div>
        <label className="text-[#103D5C] text-[16px] font-medium leading-[160%] block mb-1.5">
          Payout Method
        </label>

        <CustomSelect
          placeholder="Select payment method"
          options={payoutMethodOptions}
          value={payoutMethod}
          onValueChange={setPayoutMethod}
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
          {isProcessing ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
}
