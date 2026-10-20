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

interface NotificationsExpertSettingsProps {
  onSavingChange?: (isSaving: boolean) => void;
}

const INITIAL_SETTINGS: NotificationSetting[] = [
  {
    id: "job-invitations",
    categoryKey: "JOB_INVITATIONS",
    categoryTokens: ["job_invitation", "invitation", "lead", "job_lead"],
    title: "Job Invitations & Leads",
    description:
      "Notify experts when clients invite them directly to bid on new project requests.",
    enabled: true,
  },
  {
    id: "proposal-accepted",
    categoryKey: "PROPOSAL_ACCEPTED",
    categoryTokens: [
      "proposal_accepted",
      "proposal",
      "contract_start",
      "contract",
    ],
    title: "Proposal Accepted & Contract Start",
    description:
      "Send instant alerts when a client accepts a proposal or deposits funds into escrow.",
    enabled: true,
  },
  {
    id: "milestone-released",
    categoryKey: "MILESTONE_RELEASED",
    categoryTokens: [
      "milestone_released",
      "milestone",
      "payout_approval",
      "payout",
    ],
    title: "Milestone & Payout Approvals",
    description:
      "Notify experts when milestone deliverables are approved and funds are transferred.",
    enabled: true,
  },
  {
    id: "client-messages",
    categoryKey: "CLIENT_MESSAGES",
    categoryTokens: ["client_message", "direct_message", "message", "chat"],
    title: "Client Direct Messages",
    description:
      "Notify experts when active clients send project messages or attachments.",
    enabled: true,
  },
  {
    id: "review-ratings",
    categoryKey: "REVIEWS",
    categoryTokens: [
      "review",
      "rating",
      "feedback",
      "client_review",
      "customer_review",
      "new_review",
    ],
    title: "Reviews & Feedback",
    description:
      "Send notifications when a client leaves a rating, review, or public feedback.",
    enabled: false,
  },
  {
    id: "badge-verification",
    categoryKey: "BADGE_VERIFICATION",
    categoryTokens: [
      "badge_verification",
      "badge",
      "verification",
      "compliance",
    ],
    title: "Verification & Compliance Alerts",
    description:
      "Notify experts about document renewal requirements, badge statuses, or policy checks.",
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
    // Check target specific properties
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

    // Key-value map like { JOB_INVITATIONS: true, ... }
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

export function NotificationsExpertSettings({
  onSavingChange,
}: NotificationsExpertSettingsProps = {}) {
  const { data: remoteData } = useGetNotificationsByTargetTypeQuery("EXPERT");
  const { data: rawCategories } = useGetNotificationCategoriesQuery();
  const [updateNotification] = useUpdateNotificationMutation();
  const { success, error } = useToast();

  const [settings, setSettings] = useState<NotificationSetting[]>(INITIAL_SETTINGS);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Combine and parse all valid categories from both categories endpoint and targetType endpoint
  const backendCategories = useMemo<ParsedBackendCategory[]>(() => {
    const fromCat = parseNotificationPayload(rawCategories, "EXPERT");
    const fromRemote = parseNotificationPayload(remoteData, "EXPERT");

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

    const list = Array.from(map.values());
    if (typeof window !== "undefined" && list.length > 0) {
      console.log(
        "[EXPERT_NOTIFICATIONS] Valid categories for EXPERT:",
        list.map((c) => c.category)
      );
    }
    return list;
  }, [rawCategories, remoteData]);

  // Sync settings with backend categories
  useEffect(() => {
    if (backendCategories.length === 0) return;

    setSettings((prev) => {
      const updated = [...prev];
      const matchedCategories = new Set<string>();

      updated.forEach((item, idx) => {
        // Try finding a matching category from backend
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

      // Append any extra backend categories not in our curated initial rows
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
        // Try to find if any backend category matches the tokens
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
            `"${target.title}" notification category is not supported for Expert accounts on the server.`
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
