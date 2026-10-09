"use client";

import React, { useState } from "react";
import { Info, X } from "lucide-react";
import CustomButton from "../../shared/CustomButton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DisputeMessage } from "@/types/dispute.types";

export interface DisputeHeaderProps {
  ticketId?: string;
  status?: string;
  category?: string;
  serviceName?: string;
  onViewChatHistory?: () => void;
  messages?: DisputeMessage[];
}

export default function DisputeHeader({
  ticketId = "#DSP-10482",
  status = "Under Review",
  category = "Repair & Diagnostic",
  serviceName = "Air Conditioner (AC) Repair",
  onViewChatHistory,
  messages = [],
}: DisputeHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && onViewChatHistory) {
      onViewChatHistory();
    }
  };

  return (
    <div className="w-full flex items-center justify-between gap-4 font-['Manrope']">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-[#0a3558] leading-none">
            {ticketId}
          </h1>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-amber-200 bg-amber-50">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span className="text-xs font-semibold text-amber-600 leading-none">
              {status}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
          <span>{category}</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span>{serviceName}</span>
        </div>
      </div>

      <Sheet open={isOpen} onOpenChange={handleOpenChange}>
        <SheetTrigger
          render={
            <CustomButton variant="primary" size="lg">
              View Chat History
            </CustomButton>
          }
        />

        <SheetContent
          side="right"
          className="w-full sm:max-w-[560px] p-5 bg-white rounded-l-2xl shadow-2xl border-l border-slate-100 flex flex-col gap-6 overflow-y-auto font-['Manrope'] [&>button]:hidden custom-scrollbar"
        >
          <SheetHeader className="pb-4 border-b border-slate-100 flex-row items-center justify-between space-y-0">
            <SheetTitle className="text-lg font-semibold text-[#0a3558] font-['Manrope']">
              Chat History
            </SheetTitle>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="size-5" />
            </button>
          </SheetHeader>

          <div className="p-3 bg-rose-50 rounded-xl flex items-center gap-2.5 border border-rose-100">
            <Info className="size-5 text-rose-500 shrink-0" />
            <span className="text-sm font-normal text-rose-500 leading-snug">
              Read-only · This chat is being reviewed as part of dispute {ticketId}
            </span>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 flex flex-col gap-5 bg-white">
            {messages.length === 0 ? (
              <p className="text-center text-xs text-slate-500 py-6">
                No chat messages available for this dispute.
              </p>
            ) : (
              messages.map((msg) => {
                const isClient = msg.senderRole === "Client";

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3.5 w-full ${
                      isClient ? "justify-start" : "justify-end"
                    }`}
                  >
                    {isClient && (
                      <img
                        src={
                          msg.avatar ||
                          `https://placehold.co/40x40?text=${encodeURIComponent(
                            msg.senderName.charAt(0)
                          )}`
                        }
                        alt={msg.senderName}
                        className="size-10 rounded-full border border-amber-400 shrink-0 object-cover"
                      />
                    )}

                    <div className="max-w-[360px] flex flex-col gap-1.5">
                      <div
                        className={`flex items-center gap-1.5 ${
                          isClient ? "justify-start" : "justify-end"
                        }`}
                      >
                        <span className="text-xs font-medium text-slate-800">
                          {msg.senderName}
                        </span>
                        <span className="size-1 rounded-full bg-slate-400" />
                        <span className="text-xs font-normal text-slate-500">
                          {msg.senderRole}
                        </span>
                      </div>

                      <div
                        className={`p-4 bg-slate-50 border border-slate-100 text-slate-700 text-sm font-normal leading-relaxed ${
                          isClient
                            ? "rounded-t-2xl rounded-br-2xl"
                            : "rounded-t-2xl rounded-bl-2xl"
                        }`}
                      >
                        {msg.text || msg.message}
                      </div>

                      <span
                        className={`text-[11px] font-normal text-slate-400 ${
                          isClient ? "text-left" : "text-right"
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>

                    {!isClient && (
                      <img
                        src={
                          msg.avatar ||
                          `https://placehold.co/40x40?text=${encodeURIComponent(
                            msg.senderName.charAt(0)
                          )}`
                        }
                        alt={msg.senderName}
                        className="size-10 rounded-full border border-amber-400 shrink-0 object-cover"
                      />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}