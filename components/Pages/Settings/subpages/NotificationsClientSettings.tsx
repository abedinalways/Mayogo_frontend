"use client";

import React, { useState, useEffect, useMemo } from "react";
import LeftsideTitleSubtitle from "../LeftsideTitleSubtitle";
import {
  useGetNotificationsByTargetTypeQuery,
  useGetNotificationCategoriesQuery,
  useUpdateNotificationMutation,
} from "@/lib/redux/api/settingsApi";
import { useToast } from "@/components/shared/Toast/ToastContext";

interface NotificationSetting {
  id: string;
  categoryKey: string;
  categoryTokens: string[];
  title: string;
  description: string;
  enabled: boolean;
}

interface NotificationsClientSettingsProps {
  onSavingChange?: (isSaving: boolean) => void;
}

const INITIAL_SETTINGS: NotificationSetting[] = [
  {
    id: "quotations",
    categoryKey: "QUOTATIONS",
    categoryTokens: ["quotations", "quotation", "offers", "offer"],
    title: "Quotations & Offers",
    description:
      "Notify clients when experts send quotations, counter offers, or when a quotation requires attention before expiration.",
    enabled: true,
  },
  {
    id: "job-updates",
    categoryKey: "JOB_UPDATES",
    categoryTokens: ["job_updates", "job_update", "jobs", "job"],
    title: "Job Updates",
    description:
      "Notify clients about job requests, quotes, job progress, completion, and cancellations.",
    enabled: true,
  },
  {
    id: "payments-refunds",
    categoryKey: "PAYMENTS_REFUNDS",
    categoryTokens: [
      "payments_refunds",
      "payment_refund",
      "payments",
      "payment",
      "refunds",
      "refund",
    ],
    title: "Payments & Refunds",
    description:
      "Notify clients about successful payments, failed transactions, and refund processing updates.",
    enabled: true,
  },
  {
    id: "messages-comm",
    categoryKey: "MESSAGES_COMMUNICATION",
    categoryTokens: [
      "messages_communication",
      "messages",
      "message",
      "communication",
    ],
    title: "Messages & Communication",
    description:
      "Notify clients when experts send new messages or important conversation updates.",
    enabled: true,
  },
  {
    id: "support-disputes",
    categoryKey: "SUPPORT_DISPUTES",
    categoryTokens: [
      "support_disputes",
      "support_dispute",
      "support",
      "disputes",
      "dispute",
    ],
    title: "Support & Disputes",
    description:
      "Notify clients when support tickets or dispute cases receive updates, responses, or resolutions.",
    enabled: true,
  },
  {
    id: "account-settings",
    categoryKey: "ACCOUNT_SETTINGS",
    categoryTokens: [
      "account_settings",
      "account_setting",
      "account",
      "security",
    ],
    title: "Account Settings",
    description:
      "Notify clients about important account-related activities and security updates.",
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

function findBestCategoryMatch(
  itemId: string,
  categoryTokens: string[],
  availableCategories: string[]
): string | null {
  const normId = normalize(itemId);

  // 1. Exact normalized equality with ID
  const exact = availableCategories.find((c) => normalize(c) === normId);
  if (exact) return exact;

  // 2. Token match
  for (const token of categoryTokens) {
    const normToken = normalize(token);
    const match = availableCategories.find((c) => {
      const normC = normalize(c);
      return (
        normC === normToken ||
        normC.includes(normToken) ||
        normToken.includes(normC)
      );
    });
    if (match) return match;
  }

  return null;
}

export function NotificationsClientSettings({
  onSavingChange,
}: NotificationsClientSettingsProps = {}) {
  const { data: remoteData } = useGetNotificationsByTargetTypeQuery("CLIENT");
  const { data: rawCategories } = useGetNotificationCategoriesQuery();
  const [updateNotification] = useUpdateNotificationMutation();
  const { success, error } = useToast();

  const [settings, setSettings] = useState<NotificationSetting[]>(INITIAL_SETTINGS);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Extract all available categories for CLIENT from categories query
  const availableClientCategories = useMemo<string[]>(() => {
    const categories: string[] = [];

    if (Array.isArray(rawCategories)) {
      rawCategories.forEach((item: any) => {
        if (typeof item === "string") {
          categories.push(item);
        } else if (item && typeof item === "object") {
          if (
            !item.targetType ||
            String(item.targetType).toUpperCase() === "CLIENT"
          ) {
            const cat = item.category || item.name || item.key;
            if (cat) categories.push(String(cat));
          }
        }
      });
    } else if (rawCategories && typeof rawCategories === "object") {
      const list =
        (rawCategories as any).client ||
        (rawCategories as any).CLIENT ||
        (rawCategories as any).categories;
      if (Array.isArray(list)) {
        list.forEach((c: any) => {
          if (typeof c === "string") categories.push(c);
          else if (c?.category) categories.push(String(c.category));
        });
      }
    }

    // Also include any categories present in remoteData
    if (Array.isArray(remoteData)) {
      remoteData.forEach((r) => {
        if (r.category && !categories.includes(r.category)) {
          categories.push(r.category);
        }
      });
    }

    return Array.from(new Set(categories));
  }, [rawCategories, remoteData]);

  // Sync settings with remote data and valid categories
  useEffect(() => {
    setSettings((prev) => {
      const updated = [...prev];
      const matchedRemoteIndices = new Set<number>();

      updated.forEach((item, idx) => {
        // Find best match in available categories
        const matchedCat = findBestCategoryMatch(
          item.id,
          item.categoryTokens,
          availableClientCategories
        );

        let finalCategory = matchedCat || item.categoryKey;
        let finalEnabled = item.enabled;
        let finalTitle = item.title;
        let finalDescription = item.description;

        // Check if remoteData has an item for this category or id
        if (Array.isArray(remoteData) && remoteData.length > 0) {
          const rIndex = remoteData.findIndex(
            (r, i) =>
              !matchedRemoteIndices.has(i) &&
              (r.category === finalCategory ||
                normalize(r.category || "") === normalize(item.id) ||
                normalize(r.category || "") === normalize(item.categoryKey) ||
                item.categoryTokens.some((t) =>
                  normalize(r.category || "").includes(normalize(t))
                ))
          );

          if (rIndex !== -1) {
            matchedRemoteIndices.add(rIndex);
            const rItem = remoteData[rIndex];
            if (rItem.category) finalCategory = rItem.category;
            if (typeof rItem.enabled === "boolean") finalEnabled = rItem.enabled;
            const fetchedTitle = rItem.title || rItem.name;
            if (fetchedTitle) finalTitle = fetchedTitle;
            if (rItem.description) finalDescription = rItem.description;
          }
        }

        updated[idx] = {
          ...item,
          categoryKey: finalCategory,
          enabled: finalEnabled,
          title: finalTitle,
          description: finalDescription,
        };
      });

      // Append any extra remote categories from backend not in initial list
      if (Array.isArray(remoteData)) {
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
              categoryTokens: [rawCat.toLowerCase()],
              title: prettyTitle,
              description:
                r.description ||
                `Control ${prettyTitle.toLowerCase()} notifications.`,
              enabled: Boolean(r.enabled),
            });
          }
        });
      }

      return updated;
    });
  }, [remoteData, availableClientCategories]);

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
        targetType: "CLIENT",
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
        err?.data?.details?.[0]?.message ||
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
      if (customEvent.detail?.section === "notifications-client") {
        onSavingChange?.(true);
        setTimeout(() => {
          onSavingChange?.(false);
          success("Client notification settings are up to date");
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
              disabled={updatingId === setting.id}
              onChange={() => toggleSetting(setting.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationsClientSettings;
