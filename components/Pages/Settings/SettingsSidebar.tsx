"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export type SettingsSection =
  | "general"
  | "plan-pricing"
  | "payment-escrow"
  | "notifications-client"
  | "notifications-expert"
  | "security"
  | "system";

interface SettingsSidebarProps {
  activeSection: SettingsSection;
  onSelectSection: (section: SettingsSection) => void;
}

export function SettingsSidebar({
  activeSection,
  onSelectSection,
}: SettingsSidebarProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(true);

  const isNotificationsActive =
    activeSection === "notifications-client" ||
    activeSection === "notifications-expert";

  return (
    <div className="self-stretch p-4 bg-white rounded-bl-2xl border-r border-[#E4EBF1] inline-flex flex-col justify-start items-start gap-6 font-['Manrope'] shrink-0">
      <div className="self-stretch flex flex-col justify-start items-start gap-2">
        {/* General */}
        <button
          type="button"
          onClick={() => onSelectSection("general")}
          className={`w-52 p-2.5 rounded-lg inline-flex justify-start items-center text-sm font-medium leading-4 transition-colors ${
            activeSection === "general"
              ? "bg-[#F1F5F9] text-[#103D5C]"
              : "text-[#475569] hover:bg-slate-50 hover:text-[#103D5C]"
          }`}
        >
          General
        </button>

        {/* Plan & Pricing */}
        <button
          type="button"
          onClick={() => onSelectSection("plan-pricing")}
          className={`w-52 p-2.5 rounded-lg inline-flex justify-start items-center text-sm font-medium leading-4 transition-colors ${
            activeSection === "plan-pricing"
              ? "bg-[#F1F5F9] text-[#103D5C]"
              : "text-[#475569] hover:bg-slate-50 hover:text-[#103D5C]"
          }`}
        >
          Plan &amp; Pricing
        </button>

        {/* Payment & Escrow */}
        <button
          type="button"
          onClick={() => onSelectSection("payment-escrow")}
          className={`w-52 p-2.5 rounded-lg inline-flex justify-start items-center text-sm font-medium leading-4 transition-colors ${
            activeSection === "payment-escrow"
              ? "bg-[#F1F5F9] text-[#103D5C]"
              : "text-[#475569] hover:bg-slate-50 hover:text-[#103D5C]"
          }`}
        >
          Payment &amp; Escrow
        </button>

        {/* Notifications Header */}
        <button
          type="button"
          onClick={() => setNotificationsOpen((prev) => !prev)}
          className={`w-52 p-2.5 rounded-lg inline-flex justify-between items-center text-sm font-medium leading-4 cursor-pointer hover:bg-slate-50 transition-colors ${
            isNotificationsActive ? "text-[#103D5C]" : "text-[#475569]"
          }`}
        >
          <span>Notifications</span>
          {notificationsOpen ? (
            <ChevronUp className="h-4 w-4 text-[#103D5C]" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[#103D5C]" />
          )}
        </button>

        {/* Sub-items */}
        {notificationsOpen && (
          <>
            {/* Client */}
            <button
              type="button"
              onClick={() => onSelectSection("notifications-client")}
              className={`w-52 p-2.5 rounded-lg inline-flex justify-start items-center text-sm font-medium leading-4 transition-colors ${
                activeSection === "notifications-client"
                  ? "bg-[#F1F5F9] text-[#103D5C]"
                  : "text-[#475569] hover:bg-slate-50 hover:text-[#103D5C]"
              }`}
            >
              Client
            </button>

            {/* Expert */}
            <button
              type="button"
              onClick={() => onSelectSection("notifications-expert")}
              className={`w-52 p-2.5 rounded-lg inline-flex justify-start items-center text-sm font-medium leading-4 transition-colors ${
                activeSection === "notifications-expert"
                  ? "bg-[#F1F5F9] text-[#103D5C]"
                  : "text-[#475569] hover:bg-slate-50 hover:text-[#103D5C]"
              }`}
            >
              Expert
            </button>
          </>
        )}

        {/* Security */}
        <button
          type="button"
          onClick={() => onSelectSection("security")}
          className={`w-52 p-2.5 rounded-lg inline-flex justify-start items-center text-sm font-medium leading-4 transition-colors ${
            activeSection === "security"
              ? "bg-[#F1F5F9] text-[#103D5C]"
              : "text-[#475569] hover:bg-slate-50 hover:text-[#103D5C]"
          }`}
        >
          Security
        </button>

        {/* System */}
        <button
          type="button"
          onClick={() => onSelectSection("system")}
          className={`w-52 p-2.5 rounded-lg inline-flex justify-start items-center text-sm font-medium leading-4 transition-colors ${
            activeSection === "system"
              ? "bg-[#F1F5F9] text-[#103D5C]"
              : "text-[#475569] hover:bg-slate-50 hover:text-[#103D5C]"
          }`}
        >
          System
        </button>
      </div>
    </div>
  );
}

export default SettingsSidebar;

