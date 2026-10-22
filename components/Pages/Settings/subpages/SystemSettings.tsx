"use client";

import React, { useState, useEffect, useCallback } from "react";
import LeftsideTitleSubtitle from "../LeftsideTitleSubtitle";
import {
  useGetSystemSettingsQuery,
  useUpdateSystemSettingsMutation,
  useResetSystemSettingsMutation,
  useToggleMaintenanceModeMutation,
} from "@/lib/redux/api/settingsApi";
import { useToast } from "@/components/shared/Toast/ToastContext";
import {
  Loader2,
  RotateCcw,
  Copy,
  Check,
  AlertTriangle,
  ShieldAlert,
  Server,
  Users,
  Briefcase,
  CreditCard,
  Gift,
  Star,
} from "lucide-react";

interface SystemSettingsProps {
  onSavingChange?: (isSaving: boolean) => void;
}

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

const getErrorMessage = (err: any, fallback: string): string => {
  if (!err) return fallback;
  const data = err?.data || err?.response?.data;
  if (data) {
    if (typeof data.message === "string") return data.message;
    if (Array.isArray(data.message) && data.message.length > 0) {
      return data.message
        .map((m: any) =>
          typeof m === "string" ? m : m?.message || JSON.stringify(m)
        )
        .join(", ");
    }
    if (Array.isArray(data.details) && data.details.length > 0) {
      return data.details
        .map((d: any) =>
          typeof d === "string" ? d : d?.message || JSON.stringify(d)
        )
        .join(", ");
    }
    if (typeof data.error === "string") return data.error;
  }
  if (typeof err.message === "string") return err.message;
  return fallback;
};

export function SystemSettings({ onSavingChange }: SystemSettingsProps = {}) {
  const { data: systemData, isLoading: isLoadingSystem } =
    useGetSystemSettingsQuery();
  const [updateSystemSettings, { isLoading: isUpdatingSystem }] =
    useUpdateSystemSettingsMutation();
  const [resetSystemSettings, { isLoading: isResettingSystem }] =
    useResetSystemSettingsMutation();
  const [toggleMaintenanceMode, { isLoading: isTogglingMaintenance }] =
    useToggleMaintenanceModeMutation();

  const { success, error, info } = useToast();

  // Core feature toggles (UpdateSystemDto)
  const [userRegistration, setUserRegistration] = useState(true);
  const [expertRegistration, setExpertRegistration] = useState(true);
  const [subscriptionPlans, setSubscriptionPlans] = useState(true);
  const [referralProgram, setReferralProgram] = useState(false);
  const [reviewsRatings, setReviewsRatings] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Existing Diagnostics & Integration state
  const [apiKey] = useState("myg_live_9f8a37b12c5e4d11a8b9");
  const [enableDebugLogs, setEnableDebugLogs] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [isPurgingCache, setIsPurgingCache] = useState(false);

  // Sync state from server
  useEffect(() => {
    if (!systemData) return;
    if (typeof systemData.userRegistration === "boolean") {
      setUserRegistration(systemData.userRegistration);
    }
    if (typeof systemData.expertRegistration === "boolean") {
      setExpertRegistration(systemData.expertRegistration);
    }
    if (typeof systemData.subscriptionPlans === "boolean") {
      setSubscriptionPlans(systemData.subscriptionPlans);
    }
    if (typeof systemData.referralProgram === "boolean") {
      setReferralProgram(systemData.referralProgram);
    }
    if (typeof systemData.reviewsRatings === "boolean") {
      setReviewsRatings(systemData.reviewsRatings);
    }
    if (typeof systemData.maintenanceMode === "boolean") {
      setMaintenanceMode(systemData.maintenanceMode);
    }
  }, [systemData]);

  // Copy API key to clipboard
  const handleCopyApiKey = useCallback(() => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(apiKey);
      setCopiedKey(true);
      success("Live API Secret Key copied to clipboard");
      setTimeout(() => setCopiedKey(false), 2500);
    } else {
      info("API Key: " + apiKey);
    }
  }, [apiKey, success, info]);

  // Purge cache simulation
  const handlePurgeCache = () => {
    setIsPurgingCache(true);
    setTimeout(() => {
      setIsPurgingCache(false);
      success("Transient cache flushed successfully! Fresh queries forced.");
    }, 800);
  };

  // Save all feature flags
  const handleSaveFeatures = async () => {
    try {
      await updateSystemSettings({
        userRegistration,
        expertRegistration,
        subscriptionPlans,
        referralProgram,
        reviewsRatings,
        maintenanceMode,
      }).unwrap();

      success("Platform system settings saved successfully");
    } catch (err: any) {
      const msg = getErrorMessage(err, "Failed to save system settings");
      error(msg);
    }
  };

  // Toggle Maintenance Mode
  const handleToggleMaintenance = async () => {
    const nextVal = !maintenanceMode;
    setMaintenanceMode(nextVal);
    try {
      await toggleMaintenanceMode().unwrap();
      success(
        `Maintenance mode ${
          nextVal ? "enabled" : "disabled"
        } successfully`
      );
    } catch (err: any) {
      setMaintenanceMode(!nextVal);
      const msg = getErrorMessage(err, "Failed to toggle maintenance mode");
      error(msg);
    }
  };

  // Reset System Settings to factory defaults
  const handleResetDefaults = async () => {
    try {
      const res = await resetSystemSettings().unwrap();
      if (res) {
        if (typeof res.userRegistration === "boolean") {
          setUserRegistration(res.userRegistration);
        }
        if (typeof res.expertRegistration === "boolean") {
          setExpertRegistration(res.expertRegistration);
        }
        if (typeof res.subscriptionPlans === "boolean") {
          setSubscriptionPlans(res.subscriptionPlans);
        }
        if (typeof res.referralProgram === "boolean") {
          setReferralProgram(res.referralProgram);
        }
        if (typeof res.reviewsRatings === "boolean") {
          setReviewsRatings(res.reviewsRatings);
        }
        if (typeof res.maintenanceMode === "boolean") {
          setMaintenanceMode(res.maintenanceMode);
        }
      }
      success("System settings reset to default values");
    } catch (err: any) {
      const msg = getErrorMessage(err, "Failed to reset system settings");
      error(msg);
    }
  };

  // Global Save Handler (dispatched from SettingsContainer header button)
  useEffect(() => {
    const handleGlobalSave = async (e: Event) => {
      const customEvent = e as CustomEvent<{ section: string }>;
      if (customEvent.detail?.section === "system") {
        onSavingChange?.(true);
        try {
          await updateSystemSettings({
            userRegistration,
            expertRegistration,
            subscriptionPlans,
            referralProgram,
            reviewsRatings,
            maintenanceMode,
          }).unwrap();

          success("All system settings saved successfully");
        } catch (err: any) {
          const msg = getErrorMessage(err, "Failed to save system settings");
          error(msg);
        } finally {
          onSavingChange?.(false);
        }
      }
    };

    window.addEventListener("SETTINGS_SAVE_REQUEST", handleGlobalSave);
    return () => {
      window.removeEventListener("SETTINGS_SAVE_REQUEST", handleGlobalSave);
    };
  }, [
    onSavingChange,
    updateSystemSettings,
    userRegistration,
    expertRegistration,
    subscriptionPlans,
    referralProgram,
    reviewsRatings,
    maintenanceMode,
    success,
    error,
  ]);

  const featureItems = [
    {
      id: "userRegistration",
      title: "User (Client) Registration",
      description: "Allow new customers to create accounts and request services.",
      icon: Users,
      enabled: userRegistration,
      toggle: () => setUserRegistration((v) => !v),
    },
    {
      id: "expertRegistration",
      title: "Expert Registration",
      description: "Allow new service professionals and experts to register on the platform.",
      icon: Briefcase,
      enabled: expertRegistration,
      toggle: () => setExpertRegistration((v) => !v),
    },
    {
      id: "subscriptionPlans",
      title: "Subscription Plans",
      description: "Enable premium subscription tiers and membership benefits for experts.",
      icon: CreditCard,
      enabled: subscriptionPlans,
      toggle: () => setSubscriptionPlans((v) => !v),
    },
    {
      id: "referralProgram",
      title: "Referral Program",
      description: "Allow users and experts to earn reward credits by inviting others.",
      icon: Gift,
      enabled: referralProgram,
      toggle: () => setReferralProgram((v) => !v),
    },
    {
      id: "reviewsRatings",
      title: "Reviews & Ratings",
      description: "Allow clients and experts to submit ratings, reviews, and feedback on completed jobs.",
      icon: Star,
      enabled: reviewsRatings,
      toggle: () => setReviewsRatings((v) => !v),
    },
  ];

  return (
    <div className="space-y-8 p-5 font-['Manrope']">
      {/* SECTION 1: PLATFORM FEATURE AVAILABILITY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <LeftsideTitleSubtitle
          title="Platform Features"
          subtitle="Control which core platform features and registration modules are currently active."
          subtitleWidth="max-w-[280px]"
        />

        <div className="lg:col-span-7 space-y-4">
          {isLoadingSystem ? (
            <div className="flex items-center gap-2 text-xs text-slate-400 py-4">
              <Loader2 className="w-4 h-4 animate-spin text-[#103D5C]" />
              Loading platform settings...
            </div>
          ) : (
            featureItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-white rounded-xl border border-[#E4EBF1] hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-start gap-3.5 pr-4">
                    <div className="w-10 h-10 rounded-lg border border-[#E4EBF1] bg-[#F8FAFC] flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-5 h-5 text-[#103D5C]" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-semibold text-[#103D5C]">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <AmberToggle
                    enabled={item.enabled}
                    disabled={isUpdatingSystem}
                    onChange={item.toggle}
                  />
                </div>
              );
            })
          )}

          <div className="flex justify-end pt-2">
            <button
              type="button"
              disabled={isUpdatingSystem}
              onClick={handleSaveFeatures}
              className="bg-[#103D5C] hover:bg-[#0b2841] text-white text-sm font-medium px-6 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {isUpdatingSystem ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* HORIZONTAL DIVIDER LINE */}
      <div className="border-t border-[#E4EBF1] w-full" />

      {/* SECTION 2: MAINTENANCE MODE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <LeftsideTitleSubtitle
          title="Maintenance Mode"
          subtitle="Temporarily disable platform access for maintenance or emergency updates."
          subtitleWidth="max-w-[280px]"
        />

        <div className="lg:col-span-7 space-y-4">
          {maintenanceMode ? (
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-amber-900">
                  Platform is in Maintenance Mode
                </h4>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Regular clients and experts cannot access the platform. Only administrators can log in to perform updates and maintenance.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E4EBF1] flex items-start gap-3">
              <Server className="w-5 h-5 text-[#103D5C] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-[#103D5C]">
                  Platform is Live and Operational
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  All customer applications, expert portals, and public APIs are active and operating normally.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-[#E4EBF1]">
            <div className="space-y-0.5 pr-4">
              <h4 className="text-sm font-semibold text-[#103D5C]">
                Toggle Maintenance Mode
              </h4>
              <p className="text-xs text-slate-500">
                Immediately take the platform offline or bring it back online.
              </p>
            </div>

            <button
              type="button"
              disabled={isTogglingMaintenance}
              onClick={handleToggleMaintenance}
              className={`px-4 py-2 text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
                maintenanceMode
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-amber-600 hover:bg-amber-700 text-white"
              } disabled:opacity-50`}
            >
              {isTogglingMaintenance && (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              )}
              {maintenanceMode ? "Disable Maintenance (Go Live)" : "Enable Maintenance Mode"}
            </button>
          </div>
        </div>
      </div>

      {/* HORIZONTAL DIVIDER LINE */}
      <div className="border-t border-[#E4EBF1] w-full" />

      {/* SECTION 3: SYSTEM RESET & DEFAULTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <LeftsideTitleSubtitle
          title="Reset System Settings"
          subtitle="Revert all platform feature toggles and system flags back to default values."
          subtitleWidth="max-w-[280px]"
        />

        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E4EBF1] flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-[#103D5C]">
                Default Configuration Reset
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                This will reset User Registration, Expert Registration, Subscription Plans, Referral Program, and Reviews &amp; Ratings to default values.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              disabled={isResettingSystem}
              onClick={handleResetDefaults}
              className="px-5 py-2.5 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {isResettingSystem ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                  Resetting...
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4 text-rose-600" />
                  Reset to Defaults
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* HORIZONTAL DIVIDER LINE */}
      <div className="border-t border-[#E4EBF1] w-full" />

      {/* SECTION 4: SYSTEM INTEGRATION & API KEYS (Preserved from original design) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <LeftsideTitleSubtitle
          title="System Integration & API Keys"
          subtitle="Manage system webhook secret keys, environment logs, and system cache flushes."
          subtitleWidth="max-w-[280px]"
        />

        <div className="lg:col-span-7 space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#103D5C]">
              Live API Secret Key
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={apiKey}
                className="w-full h-10 px-3.5 text-xs rounded-xl border border-[#E4EBF1] bg-slate-50 text-[#103D5C] font-mono outline-none"
              />
              <button
                type="button"
                onClick={handleCopyApiKey}
                className="h-10 px-4 text-xs font-semibold text-[#103D5C] bg-[#F1F5F9] rounded-xl hover:bg-slate-200 transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                {copiedKey ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#103D5C]" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-[#103D5C]">
                Verbose Audit & Debug Logging
              </h4>
              <p className="text-xs text-slate-500">
                Log detailed API transactions and system tracebacks for troubleshooting.
              </p>
            </div>
            <AmberToggle
              enabled={enableDebugLogs}
              onChange={() => setEnableDebugLogs((prev) => !prev)}
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-[#103D5C]">
                Flush Redis & Server Cache
              </h4>
              <p className="text-xs text-slate-500">
                Clear transient cache keys to force fresh database queries across all services.
              </p>
            </div>
            <button
              type="button"
              disabled={isPurgingCache}
              onClick={handlePurgeCache}
              className="h-9 px-4 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              {isPurgingCache ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Purging...
                </>
              ) : (
                "Purge Cache"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SystemSettings;
