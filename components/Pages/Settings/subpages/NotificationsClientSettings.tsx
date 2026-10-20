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
    categoryTokens: ["quotation", "quote", "offer"],
    title: "Quotations & Offers",
    description:
      "Notify clients when experts send quotations, counter offers, or when a quotation requires attention before expiration.",
    enabled: true,
  },
  {
    id: "job-updates",
    categoryKey: "JOB_UPDATES",
    categoryTokens: ["job_update", "job"],
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
      "transaction",
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
      "chat",
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
      "ticket",
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
      "profile",
    ],
    title: "Account Settings",
    description:
      "Notify clients about important account-related activities and security updates.",
    enabled: true,
  },
];

interface ParsedBackendCategory {
  category: string;
  enabled?: boolean;
  title?: string;
  description?: string;
}

function parseNotificationPayload(
  raw: any,
  targetType: "CLIENT" | "EXPERT"
): ParsedBackendCategory[] {
  if (!raw) return [];
  const results: ParsedBackendCategory[] = [];

  const add = (
    category: string,
    enabled?: boolean,
    title?: string,
    description?: string
  ) => {
    if (!category || typeof category !== "string") return;
    const cleanCat = category.trim();
    if (!cleanCat) return;

    const existing = results.find(
      (r) => r.category.toUpperCase() === cleanCat.toUpperCase()
    );
    if (!existing) {
      results.push({ category: cleanCat, enabled, title, description });
    } else {
      if (enabled !== undefined) existing.enabled = enabled;
      if (title && !existing.title) existing.title = title;
      if (description && !existing.description)
        existing.description = description;
    }
  };

  if (Array.isArray(raw)) {
    raw.forEach((item) => {
      if (typeof item === "string") {
        add(item);
      } else if (item && typeof item === "object") {
        if (
          !item.targetType ||
          String(item.targetType).toUpperCase() === targetType
        ) {
          const cat = item.category || item.name || item.key || item.id;
          const en =
            typeof item.enabled === "boolean" ? item.enabled : undefined;
          add(cat, en, item.title || item.name, item.description);
        }
      }
    });
    return results;
  }

  if (typeof raw === "object") {
    const targetKey = targetType;
    const lowerKey = targetType.toLowerCase();
    const sub = raw[targetKey] || raw[lowerKey];
    if (sub) {
      return parseNotificationPayload(sub, targetType);
    }

    if (raw.settings && typeof raw.settings === "object") {
      return parseNotificationPayload(raw.settings, targetType);
    }
    if (raw.categories) {
      return parseNotificationPayload(raw.categories, targetType);
    }
    if (raw.items) {
      return parseNotificationPayload(raw.items, targetType);
    }
    if (raw.data) {
      return parseNotificationPayload(raw.data, targetType);
    }

    Object.entries(raw).forEach(([k, v]) => {
      if (
        ![
          "success",
          "statusCode",
          "message",
          "targetType",
          "createdAt",
          "updatedAt",
          "id",
          "_id",
        ].includes(k)
      ) {
        if (typeof v === "boolean") {
          add(k, v);
        } else if (v && typeof v === "object") {
          add(
            k,
            (v as any).enabled,
            (v as any).title || (v as any).name,
            (v as any).description
          );
        } else if (typeof v === "string") {
          add(k);
        }
      }
    });
  }

  return results;
}

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

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

export function NotificationsClientSettings({
  onSavingChange,
}: NotificationsClientSettingsProps = {}) {
  const { data: remoteData } = useGetNotificationsByTargetTypeQuery("CLIENT");
  const { data: rawCategories } = useGetNotificationCategoriesQuery();
  const [updateNotification] = useUpdateNotificationMutation();
  const { success, error } = useToast();

  const [settings, setSettings] = useState<NotificationSetting[]>(INITIAL_SETTINGS);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Combine and parse all valid categories from both categories endpoint and targetType endpoint
  const backendCategories = useMemo<ParsedBackendCategory[]>(() => {
    const fromCat = parseNotificationPayload(rawCategories, "CLIENT");
    const fromRemote = parseNotificationPayload(remoteData, "CLIENT");

    const map = new Map<string, ParsedBackendCategory>();
    fromCat.forEach((c) => map.set(c.category.toUpperCase(), c));
    fromRemote.forEach((r) => {
      const existing = map.get(r.category.toUpperCase());
      if (existing) {
        if (r.enabled !== undefined) existing.enabled = r.enabled;
        if (r.title) existing.title = r.title;
        if (r.description) existing.description = r.description;
      } else {
        map.set(r.category.toUpperCase(), r);
      }
    });

    return Array.from(map.values());
  }, [rawCategories, remoteData]);

  // Sync settings with backend categories
  useEffect(() => {
    if (backendCategories.length === 0) return;

    setSettings((prev) => {
      const updated = [...prev];
      const matchedCategories = new Set<string>();

      updated.forEach((item, idx) => {
        let matched = backendCategories.find(
          (b) =>
            !matchedCategories.has(b.category.toUpperCase()) &&
            normalize(b.category) === normalize(item.id)
        );

        if (!matched) {
          matched = backendCategories.find(
            (b) =>
              !matchedCategories.has(b.category.toUpperCase()) &&
              normalize(b.category) === normalize(item.categoryKey)
          );
        }

        if (!matched) {
          matched = backendCategories.find(
            (b) =>
              !matchedCategories.has(b.category.toUpperCase()) &&
              item.categoryTokens.some((tok) => {
                const nCat = normalize(b.category);
                const nTok = normalize(tok);
                return nCat === nTok || nCat.includes(nTok) || nTok.includes(nCat);
              })
          );
        }

        if (matched) {
          matchedCategories.add(matched.category.toUpperCase());
          updated[idx] = {
            ...item,
            categoryKey: matched.category,
            enabled:
              matched.enabled !== undefined ? matched.enabled : item.enabled,
            title: matched.title || item.title,
            description: matched.description || item.description,
          };
        }
      });

      // Append any extra backend categories not in initial list
      backendCategories.forEach((b) => {
        if (!matchedCategories.has(b.category.toUpperCase())) {
          const rawCat = b.category;
          const prettyTitle =
            b.title ||
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
              b.description ||
              `Control ${prettyTitle.toLowerCase()} notifications.`,
            enabled: b.enabled !== undefined ? b.enabled : true,
          });
        }
      });

      return updated;
    });
  }, [backendCategories]);

  const toggleSetting = async (id: string) => {
    const target = settings.find((s) => s.id === id);
    if (!target) return;

    // Check if the category is supported by the server
    if (backendCategories.length > 0) {
      const isValidOnServer = backendCategories.some(
        (b) => b.category.toUpperCase() === target.categoryKey.toUpperCase()
      );

      if (!isValidOnServer) {
        const bestAlternative = backendCategories.find((b) =>
          target.categoryTokens.some((tok) => {
            const nCat = normalize(b.category);
            const nTok = normalize(tok);
            return nCat === nTok || nCat.includes(nTok) || nTok.includes(nCat);
          })
        );

        if (bestAlternative) {
          target.categoryKey = bestAlternative.category;
        } else {
          error(
            `"${target.title}" notification category is not supported for Client accounts on the server.`
          );
          return;
        }
      }
    }

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
