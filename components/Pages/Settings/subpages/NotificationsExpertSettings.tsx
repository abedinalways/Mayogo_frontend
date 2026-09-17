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
    id: "job-invitations",
    title: "Job Invitations & Leads",
    description:
      "Notify experts when clients invite them directly to bid on new project requests.",
    enabled: true,
  },
  {
    id: "proposal-accepted",
    title: "Proposal Accepted & Contract Start",
    description:
      "Send instant alerts when a client accepts a proposal or deposits funds into escrow.",
    enabled: true,
  },
  {
    id: "milestone-released",
    title: "Milestone & Payout Approvals",
    description:
      "Notify experts when milestone deliverables are approved and funds are transferred.",
    enabled: true,
  },
  {
    id: "client-messages",
    title: "Client Direct Messages",
    description:
      "Notify experts when active clients send project messages or attachments.",
    enabled: true,
  },
  {
    id: "review-ratings",
    title: "Reviews & Feedback",
    description:
      "Send notifications when a client leaves a rating, review, or public feedback.",
    enabled: false,
  },
  {
    id: "badge-verification",
    title: "Verification & Compliance Alerts",
    description:
      "Notify experts about document renewal requirements, badge statuses, or policy checks.",
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

export function NotificationsExpertSettings() {
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
        title="Expert Push Notifications"
        subtitle="Manage alert notifications sent to service experts regarding jobs, proposals, and payouts."
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

export default NotificationsExpertSettings;
