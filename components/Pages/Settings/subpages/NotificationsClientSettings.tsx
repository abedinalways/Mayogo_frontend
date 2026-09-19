"use client";

import React, { useState } from "react";
import LeftsideTitleSubtitle from "../LeftsideTitleSubtitle";

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

const INITIAL_SETTINGS: NotificationSetting[] = [
  {
    id: "quotations",
    title: "Quotations & Offers",
    description:
      "Notify clients when experts send quotations, counter offers, or when a quotation requires attention before expiration.",
    enabled: true,
  },
  {
    id: "job-updates",
    title: "Job Updates",
    description:
      "Notify clients about job requests, quotes, job progress, completion, and cancellations.",
    enabled: true,
  },
  {
    id: "payments-refunds",
    title: "Payments & Refunds",
    description:
      "Notify clients about successful payments, failed transactions, and refund processing updates.",
    enabled: true,
  },
  {
    id: "messages-comm",
    title: "Messages & Communication",
    description:
      "Notify clients when experts send new messages or important conversation updates.",
    enabled: true,
  },
  {
    id: "support-disputes",
    title: "Support & Disputes",
    description:
      "Notify clients when support tickets or dispute cases receive updates, responses, or resolutions.",
    enabled: true,
  },
  {
    id: "account-settings",
    title: "Account Settings",
    description:
      "Notify clients about important account-related activities and security updates.",
    enabled: true,
  },
];

function AmberToggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={onChange}
      className={`w-9 h-5 p-0.5 rounded-xl flex items-center transition-colors duration-200 cursor-pointer overflow-hidden shrink-0 ${
        enabled ? "bg-[#F59E0B] justify-end" : "bg-slate-200 justify-start"
      }`}
    >
      <span className="w-4 h-4 bg-white rounded-full shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)] shadow-[0px_1px_3px_0px_rgba(16,24,40,0.10)]" />
    </button>
  );
}

export function NotificationsClientSettings() {
  const [settings, setSettings] = useState<NotificationSetting[]>(INITIAL_SETTINGS);

  const toggleSetting = (id: string) => {
    setSettings((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  return (
    <div className="w-full p-5 flex flex-col lg:flex-row justify-between items-start gap-12 font-['Manrope']">
      {/* Left Column */}
      <LeftsideTitleSubtitle
        title="Client Push Notifications"
        subtitle="Control notifications sent to customers regarding service, expert, payments."
        subtitleWidth="max-w-[360px]"
      />

      {/* Right Column */}
      <div className="w-full lg:w-[470px] flex flex-col justify-center items-start gap-5">
        {settings.map((setting) => (
          <div
            key={setting.id}
            className="self-stretch flex justify-between items-center gap-12"
          >
            <div className="flex-1 flex flex-col justify-center items-start gap-1">
              <div className="text-[#103D5C] text-sm font-medium leading-5">
                {setting.title}
              </div>
              <div className="self-stretch text-slate-500 text-xs font-normal leading-5">
                {setting.description}
              </div>
            </div>

            <AmberToggle
              enabled={setting.enabled}
              onChange={() => toggleSetting(setting.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationsClientSettings;
