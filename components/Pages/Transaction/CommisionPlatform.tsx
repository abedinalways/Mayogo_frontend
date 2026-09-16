"use client";
import CustomButton from "@/components/shared/CustomButton";
import CustomModal from "@/components/shared/CustomModal";
import React from "react";
import { useState } from "react";
import EditCommisionRate from "./EditCommisionRate";
import WithdrawBalance from "./WithdrawBalance";

export default function CommisionPlatform() {
  const [open, setOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [commissionRate, setCommissionRate] = useState(10);

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-[#103D5C] font-['Manrope'] text-[18px] not-italic font-semibold leading-[132%]">
          Commission & Platform Earnings
        </h1>

        <CustomButton type="button" size="sm" onClick={() => setOpen(true)}>
          Edit Commission Rate
        </CustomButton>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-[1.25fr_0.91fr_1.56fr] gap-5 items-stretch">
        {/* Available Funds */}
        <div className="mt-5 flex flex-col">
          <p className="text-[#103D5C] text-[16px] font-semibold leading-[132%]">
            Available Funds
          </p>

          <div className="border rounded-2xl p-4 min-h-[273px] flex-1 flex flex-col justify-between mt-4">
            <p className="text-[#5A5A5A] text-[14px] font-medium leading-[100%]">
              Balance Available for use
            </p>

            <div>
              <h3 className="text-[#103D5C] text-[32px] font-semibold leading-[124%]">
                US $5,000
              </h3>

              <p className="text-[#5A5A5A] text-[14px] font-normal leading-[100%] mt-4">
                Withdrawn to date:
              </p>

              <p className="text-[#5A5A5A] text-[14px] font-normal leading-[100%]">
                USD 80.00
              </p>
            </div>

            <CustomButton type="button" onClick={() => setWithdrawOpen(true)}>
              Withdraw Balance
            </CustomButton>
          </div>
        </div>

        {/* Overview */}
        <div className="mt-5 flex flex-col">
          <p className="text-[#103D5C] text-[16px] font-semibold leading-[132%]">
            Overview
          </p>

          <div className="flex-1 flex flex-col gap-4 mt-4">
            {/* Platform Commission */}
            <div className="border rounded-2xl p-4 flex-1">
              <p className="text-[#5A5A5A] text-[14px] font-medium leading-[100%]">
                Platform Commission
              </p>

              <h3 className="text-[#103D5C] text-[32px] font-semibold leading-[124%] mt-4">
                {commissionRate}%
              </h3>
            </div>

            {/* Already Withdrawn */}
            <div className="border rounded-2xl p-4 flex-1">
              <p className="text-[#5A5A5A] text-[14px] font-medium leading-[100%]">
                Already Withdrawn
              </p>

              <h3 className="text-[#103D5C] text-[32px] font-semibold leading-[124%] mt-4">
                $600
              </h3>
            </div>
          </div>
        </div>

        {/* Upcoming Commission */}
        <div className="mt-5 flex flex-col">
          <p className="text-[#103D5C] text-[16px] not-italic font-semibold leading-[132%]">
            Upcoming Commission
          </p>

          <div className="border rounded-2xl overflow-hidden mt-4 flex-1">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F1F3F5]">
                  <th className="text-left px-4 py-3 text-[#5A5A5A] text-[13px] font-medium">
                    Date
                  </th>

                  <th className="text-left px-4 py-3 text-[#5A5A5A] text-[13px] font-medium">
                    Amount
                  </th>

                  <th className="text-left px-4 py-3 text-[#5A5A5A] text-[13px] font-medium">
                    Experts
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-3 text-[#5A5A5A] text-[13px]">
                    Today
                  </td>

                  <td className="px-4 py-3 text-[#103D5C] text-[13px]">
                    $5,000
                  </td>

                  <td className="px-4 py-3 text-[#5A5A5A] text-[13px]">35</td>
                </tr>

                <tr className="border-t">
                  <td className="px-4 py-3 text-[#5A5A5A] text-[13px]">
                    Tomorrow
                  </td>

                  <td className="px-4 py-3 text-[#103D5C] text-[13px]">
                    $4,000
                  </td>

                  <td className="px-4 py-3 text-[#5A5A5A] text-[13px]">10</td>
                </tr>

                <tr className="border-t">
                  <td className="px-4 py-3 text-[#5A5A5A] text-[13px]">
                    Friday
                  </td>

                  <td className="px-4 py-3 text-[#103D5C] text-[13px]">
                    $4,100
                  </td>

                  <td className="px-4 py-3 text-[#5A5A5A] text-[13px]">15</td>
                </tr>

                <tr className="border-t">
                  <td className="px-4 py-3 text-[#5A5A5A] text-[13px]">
                    Saturday
                  </td>

                  <td className="px-4 py-3 text-[#103D5C] text-[13px]">
                    $4,100
                  </td>

                  <td className="px-4 py-3 text-[#5A5A5A] text-[13px]">15</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <CustomModal
        open={open}
        onOpenChange={setOpen}
        title="Edit Commission Rate"
        description="Update the platform commission percentage"
        preventClose={isProcessing}
      >
        <EditCommisionRate
          currentRate={commissionRate}
          onSuccess={(newRate) => {
            setCommissionRate(newRate);
            setOpen(false);
          }}
          onClose={() => setOpen(false)}
          onProcessingChange={setIsProcessing}
        />
      </CustomModal>

      <CustomModal
        open={withdrawOpen}
        onOpenChange={setWithdrawOpen}
        title="Withdraw Balance"
        description="Transfer available earnings to your account"
      >
        <WithdrawBalance
          availableBalance="$1,842.00"
          onClose={() => setWithdrawOpen(false)}
        />
      </CustomModal>
    </div>
  );
}
