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

export interface Message {
  id: string;
  senderName: string;
  senderRole: "Client" | "Expert" | "Admin";
  avatar: string;
  text: string;
  timestamp: string;
}

export interface DisputeHeaderProps {
  ticketId?: string;
  status?: string;
  category?: string;
  serviceName?: string;
  onViewChatHistory?: () => void;
  messages?: Message[];
}

const DEFAULT_MESSAGES: Message[] = [
  {
    id: "1",
    senderName: "Sarah Willam",
    senderRole: "Client",
    avatar: "https://placehold.co/40x40",
    text: "Hi, I need the AC units installed as discussed. Can you come on the agreed date?",
    timestamp: "02:00 PM",
  },
  {
    id: "2",
    senderName: "Daniel Green",
    senderRole: "Expert",
    avatar: "https://placehold.co/40x40",
    text: "Good morning! Yes, I will be there at 10 AM. Please make sure the units are unpacked and ready.",
    timestamp: "02:02 PM",
  },
  {
    id: "3",
    senderName: "Sarah Willam",
    senderRole: "Client",
    avatar: "https://placehold.co/40x40",
    text: "They are ready. See you then.",
    timestamp: "02:00 PM",
  },
  {
    id: "4",
    senderName: "Daniel Green",
    senderRole: "Expert",
    avatar: "https://placehold.co/40x40",
    text: "Installation is complete. Both units are running. Please check and confirm.",
    timestamp: "02:02 PM",
  },
  {
    id: "5",
    senderName: "Sarah Willam",
    senderRole: "Client",
    avatar: "https://placehold.co/40x40",
    text: "The bedroom unit is blowing warm air. This is not right. I need you to come back and fix it.",
    timestamp: "02:00 PM",
  },
  {
    id: "6",
    senderName: "Daniel Green",
    senderRole: "Expert",
    avatar: "https://placehold.co/40x40",
    text: "This is normal for the first few hours. Give it time to cool down.",
    timestamp: "02:02 PM",
  },
  {
    id: "7",
    senderName: "Sarah Willam",
    senderRole: "Client",
    avatar: "https://placehold.co/40x40",
    text: "Next week is not acceptable.",
    timestamp: "02:00 PM",
  },
];

export default function DisputeHeader({
  ticketId = "#DSP-10482",
  status = "Under Review",
  category = "Repair & Diagnostic",
  serviceName = "Air Conditioner (AC) Repair",
  onViewChatHistory,
  messages = DEFAULT_MESSAGES,
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
      {/* Left Content */}
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

      {/* Sheet Integration */}
      <Sheet open={isOpen} onOpenChange={handleOpenChange}>
        <SheetTrigger >
          <CustomButton variant="primary" size="lg">
            View Chat History
          </CustomButton>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="w-full sm:max-w-[560px] p-5 bg-white rounded-l-2xl shadow-2xl border-l border-slate-100 flex flex-col gap-6 overflow-y-auto font-['Manrope'] [&>button]:hidden custom-scrollbar"
        >
          {/* Custom Header */}
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

          {/* Read-Only Notice Banner */}
          <div className="p-3 bg-rose-50 rounded-xl flex items-center gap-2.5 border border-rose-100">
            <Info className="size-5 text-rose-500 shrink-0" />
            <span className="text-sm font-normal text-rose-500 leading-snug">
              Read-only · This chat is being reviewed as part of dispute TKT-2024-089
            </span>
          </div>

          {/* Conversation Stream Container */}
          <div className="p-4 rounded-2xl border border-slate-200 flex flex-col gap-5 bg-white">
            {/* Date Divider */}
            <div className="flex items-center gap-3 w-full">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs font-normal text-slate-400 whitespace-nowrap">
                Jul 27, 2026
              </span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Message Items */}
            {messages.map((msg) => {
              const isClient = msg.senderRole === "Client";

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3.5 w-full ${isClient ? "justify-start" : "justify-end"
                    }`}
                >
                  {/* Client Avatar Left */}
                  {isClient && (
                    <img
                      src={msg.avatar}
                      alt={msg.senderName}
                      className="size-10 rounded-full border border-amber-400 shrink-0 object-cover"
                    />
                  )}

                  <div className="max-w-[360px] flex flex-col gap-1.5">
                    {/* Header Info */}
                    <div
                      className={`flex items-center gap-1.5 ${isClient ? "justify-start" : "justify-end"
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

                    {/* Message Bubble */}
                    <div
                      className={`p-4 bg-slate-50 border border-slate-100 text-slate-700 text-sm font-normal leading-relaxed ${isClient
                          ? "rounded-t-2xl rounded-br-2xl"
                          : "rounded-t-2xl rounded-bl-2xl"
                        }`}
                    >
                      {msg.text}
                    </div>

                    {/* Timestamp */}
                    <span
                      className={`text-[11px] font-normal text-slate-400 ${isClient ? "text-left" : "text-right"
                        }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* Expert Avatar Right */}
                  {!isClient && (
                    <img
                      src={msg.avatar}
                      alt={msg.senderName}
                      className="size-10 rounded-full border border-amber-400 shrink-0 object-cover"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}