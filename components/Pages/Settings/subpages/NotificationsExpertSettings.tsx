"use client";

import React, { useState, useEffect } from "react";
import LeftsideTitleSubtitle from "../LeftsideTitleSubtitle";
import {
  useGetNotificationsByTargetTypeQuery,
  useUpdateNotificationMutation,
} from "@/lib/redux/api/settingsApi";
import { useToast } from "@/components/shared/Toast/ToastContext";

interface NotificationSetting {
  id: string;
  categoryKey: string;
  title: string;
  description: string;
  enabled: boolean;
}

interface NotificationsExpertSettingsProps {
  onSavingChange?: (isSaving: boolean) => void;
}

const INITIAL_SETTINGS: NotificationSetting[] = [
  {
    id: "job-invitations",
    categoryKey: "JOB_INVITATIONS",
    title: "Job Invitations & Leads",
    description:
      "Notify experts when clients invite them directly to bid on new project requests.",
    enabled: true,
  },
  {
    id: "proposal-accepted",
    categoryKey: "PROPOSAL_ACCEPTED",
    title: "Proposal Accepted & Contract Start",
    description:
      "Send instant alerts when a client accepts a proposal or deposits funds into escrow.",
    enabled: true,
  },
  {
    id: "milestone-released",
    categoryKey: "MILESTONE_RELEASED",
    title: "Milestone & Payout Approvals",
    description:
      "Notify experts when milestone deliverables are approved and funds are transferred.",
    enabled: true,
  },
  {
    id: "client-messages",
    categoryKey: "CLIENT_MESSAGES",
    title: "Client Direct Messages",
    description:
      "Notify experts when active clients send project messages or attachments.",
    enabled: true,
  },
  {
    id: "review-ratings",
    categoryKey: "REVIEWS_FEEDBACK",
    title: "Reviews & Feedback",
    description:
      "Send notifications when a client leaves a rating, review, or public feedback.",
    enabled: false,
  },
  {
    id: "badge-verification",
    categoryKey: "BADGE_VERIFICATION",
    title: "Verification & Compliance Alerts",
    description:
      "Notify experts about document renewal requirements, badge statuses, or policy checks.",
    enabled: true,
  },
];

function AmberToggle({
  enabled,
  disabled = false,
  onChange,
}: {
  enabled: boolean;
  disabled?: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      disabled={disabled}
      onClick={onChange}
      className={`w-9 h-5 p-0.5 rounded-xl flex items-center transition-colors duration-200 cursor-pointer overflow-hidden shrink-0 ${
        enabled ? "bg-[#F59E0B] justify-end" : "bg-slate-200 justify-start"
      } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
    >
      <span className="w-4 h-4 bg-white rounded-full shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)] shadow-[0px_1px_3px_0px_rgba(16,24,40,0.10)]" />
    </button>
  );
}

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

export function NotificationsExpertSettings({
  onSavingChange,
}: NotificationsExpertSettingsProps = {}) {
  const { data: remoteData } = useGetNotificationsByTargetTypeQuery("EXPERT");
  const [updateNotification] = useUpdateNotificationMutation();
  const { success, error } = useToast();

  const [settings, setSettings] = useState<NotificationSetting[]>(INITIAL_SETTINGS);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Sync with remote data when available
  useEffect(() => {
    if (!remoteData || !Array.isArray(remoteData) || remoteData.length === 0) return;

    setSettings((prev) => {
      const updated = [...prev];
      const matchedRemoteIndices = new Set<number>();

      updated.forEach((item, idx) => {
        const normId = normalize(item.id);
        const normCat = normalize(item.categoryKey);
        const normTitle = normalize(item.title);

        const rIndex = remoteData.findIndex(
          (r, i) =>
            !matchedRemoteIndices.has(i) &&
            (normalize(r.category || "") === normId ||
              normalize(r.category || "") === normCat ||
              normId.includes(normalize(r.category || "")) ||
              normalize(r.category || "").includes(normId) ||
              normalize(r.title || r.name || "") === normTitle)
        );

        if (rIndex !== -1) {
          matchedRemoteIndices.add(rIndex);
          const rItem = remoteData[rIndex];
          updated[idx] = {
            ...item,
            categoryKey: rItem.category || item.categoryKey,
            enabled: typeof rItem.enabled === "boolean" ? rItem.enabled : item.enabled,
            description: rItem.description || item.description,
            title: rItem.title || rItem.name || item.title,
          };
        }
      });

      // Append any extra categories from backend not in initial list
      remoteData.forEach((r, i) => {
        if (!matchedRemoteIndices.has(i) && r.category) {
          const rawCat = String(r.category);
          const prettyTitle =
            r.title ||
            r.name ||
            rawCat
              .toLowerCase()
              .replace(/_/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase());
          updated.push({
            id: rawCat.toLowerCase().replace(/_/g, "-"),
            categoryKey: rawCat,
            title: prettyTitle,
            description:
              r.description || `Control ${prettyTitle.toLowerCase()} notifications.`,
            enabled: Boolean(r.enabled),
          });
        }
      });

      return updated;
    });
  }, [remoteData]);

  const toggleSetting = async (id: string) => {
    const target = settings.find((s) => s.id === id);
    if (!target) return;

    const nextEnabled = !target.enabled;

    // Optimistic UI update
    setSettings((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, enabled: nextEnabled } : item
      )
    );
    setUpdatingId(id);

    try {
      await updateNotification({
        targetType: "EXPERT",
        category: target.categoryKey,
        enabled: nextEnabled,
      }).unwrap();

      success(
        `${target.title} notifications ${nextEnabled ? "enabled" : "disabled"}`
      );
    } catch (err: any) {
      // Revert optimistic update
      setSettings((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, enabled: !nextEnabled } : item
        )
      );
      const msg =
        err?.data?.message ||
        err?.message ||
        "Failed to update notification setting";
      error(msg);
    } finally {
      setUpdatingId(null);
    }
  };

  // Listen for global save button click from container
  useEffect(() => {
    const handleGlobalSave = (e: Event) => {
      const customEvent = e as CustomEvent<{ section: string }>;
      if (customEvent.detail?.section === "notifications-expert") {
        onSavingChange?.(true);
        setTimeout(() => {
          onSavingChange?.(false);
          success("Expert notification settings are up to date");
        }, 400);
      }
    };

    window.addEventListener("SETTINGS_SAVE_REQUEST", handleGlobalSave);
    return () => {
      window.removeEventListener("SETTINGS_SAVE_REQUEST", handleGlobalSave);
    };
  }, [onSavingChange, success]);

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
              disabled={updatingId === setting.id}
              onChange={() => toggleSetting(setting.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationsExpertSettings;
