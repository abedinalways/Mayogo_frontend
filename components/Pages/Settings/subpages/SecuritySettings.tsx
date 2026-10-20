"use client";

import React, { useState, useEffect, useMemo } from "react";
import LeftsideTitleSubtitle from "../LeftsideTitleSubtitle";
import { CustomInput } from "@/components/shared/CustomInput";
import { CustomSelect } from "@/components/shared/CustomSelect";
import { Eye, EyeOff, Monitor, Loader2 } from "lucide-react";
import IpRestrictionTable, { IpRestrictionItem } from "./IpRestrictionTable";
import {
  useGetSecuritySettingsQuery,
  useUpdateSecuritySettingsMutation,
  useChangePasswordMutation,
  useGetIpRestrictionsQuery,
  useCreateIpRestrictionMutation,
  useToggleIpRestrictionMutation,
  useDeleteIpRestrictionMutation,
  useGetActiveSessionsQuery,
  useEndSessionMutation,
} from "@/lib/redux/api/settingsApi";
import { useToast } from "@/components/shared/Toast/ToastContext";

interface SessionItem {
  id: string;
  device: string;
  location: string;
  ip: string;
}

interface SecuritySettingsProps {
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

const INACTIVITY_OPTIONS = [
  { label: "1 hour", value: "1h" },
  { label: "2 hours", value: "2h" },
  { label: "4 hours", value: "4h" },
  { label: "8 hours", value: "8h" },
  { label: "12 hours", value: "12h" },
  { label: "24 hours", value: "24h" },
];

const WARNING_TIME_OPTIONS = [
  { label: "2 minutes before logout", value: "2m" },
  { label: "5 minutes before logout", value: "5m" },
  { label: "10 minutes before logout", value: "10m" },
  { label: "15 minutes before logout", value: "15m" },
];

const parseHours = (val: string | number): number => {
  if (typeof val === "number") return val;
  const num = parseInt(String(val).replace(/[^0-9]/g, ""), 10);
  return isNaN(num) || num < 1 ? 1 : Math.min(24, num);
};

const parseMinutes = (val: string | number): number => {
  if (typeof val === "number") return val;
  const num = parseInt(String(val).replace(/[^0-9]/g, ""), 10);
  return isNaN(num) || num < 1 ? 5 : Math.min(15, num);
};

export function SecuritySettings({ onSavingChange }: SecuritySettingsProps = {}) {
  const { data: securityData, isLoading: isLoadingSecurity } =
    useGetSecuritySettingsQuery();
  const [updateSecuritySettings, { isLoading: isUpdatingSecurity }] =
    useUpdateSecuritySettingsMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();

  const { data: ipRestrictionsData, isLoading: isLoadingIps } =
    useGetIpRestrictionsQuery();
  const [createIpRestriction, { isLoading: isAddingIp }] =
    useCreateIpRestrictionMutation();
  const [toggleIpRestriction] = useToggleIpRestrictionMutation();
  const [deleteIpRestriction] = useDeleteIpRestrictionMutation();

  const { data: sessionsData, isLoading: isLoadingSessions } =
    useGetActiveSessionsQuery();
  const [endSession] = useEndSessionMutation();

  const { success, error } = useToast();

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 2FA state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Session Timeout state
  const [inactivityDuration, setInactivityDuration] = useState("1h");
  const [warnBeforeLogout, setWarnBeforeLogout] = useState(true);
  const [warningTime, setWarningTime] = useState("5m");

  // IP Restriction state
  const [ipRestrictionEnabled, setIpRestrictionEnabled] = useState(false);
  const [newIpAddress, setNewIpAddress] = useState("");
  const [deletingIpId, setDeletingIpId] = useState<string | null>(null);
  const [togglingIpId, setTogglingIpId] = useState<string | null>(null);

  // Ending session state
  const [endingSessionId, setEndingSessionId] = useState<string | null>(null);

  // Sync security settings from remote API
  useEffect(() => {
    if (!securityData) return;

    if (typeof securityData.twoFactorEnabled === "boolean") {
      setTwoFactorEnabled(securityData.twoFactorEnabled);
    }
    if (securityData.sessionTimeoutHours) {
      setInactivityDuration(`${securityData.sessionTimeoutHours}h`);
    }
    if (typeof securityData.warnBeforeLogout === "boolean") {
      setWarnBeforeLogout(securityData.warnBeforeLogout);
    }
    if (securityData.warningMinutes) {
      setWarningTime(`${securityData.warningMinutes}m`);
    }
    if (typeof securityData.ipRestrictionEnabled === "boolean") {
      setIpRestrictionEnabled(securityData.ipRestrictionEnabled);
    }
  }, [securityData]);

  // Transform active sessions list
  const sessions: SessionItem[] = useMemo(() => {
    if (Array.isArray(sessionsData) && sessionsData.length > 0) {
      return sessionsData.map((s: any, idx: number) => ({
        id: s.id || s.sessionId || String(idx),
        device:
          s.device ||
          s.deviceName ||
          (s.browser
            ? `${s.browser} ${s.os ? `on ${s.os}` : ""}`
            : "MacBook Pro - Chrome"),
        location: s.location || "Jakarta, ID",
        ip: s.ipAddress || s.ip || "114.120.0.0",
      }));
    }
    return [
      {
        id: "current",
        device: "MacBook Pro - Chrome",
        location: "Jakarta, ID",
        ip: "114.120.0.0",
      },
    ];
  }, [sessionsData]);

  // Transform IP list
  const ipList: IpRestrictionItem[] = useMemo(() => {
    if (Array.isArray(ipRestrictionsData) && ipRestrictionsData.length > 0) {
      return ipRestrictionsData.map((item: any, idx: number) => ({
        id: item.id || String(idx),
        ip: item.ipAddress || item.ip || "-",
        label: item.label || "Office Network",
        addedBy: item.addedBy || item.creator?.fullName || "Super Admin",
        date: item.createdAt || item.date || new Date().toISOString(),
        status:
          String(item.status).toUpperCase() === "ACTIVE"
            ? "Active"
            : "Disabled",
      }));
    }
    return [];
  }, [ipRestrictionsData]);

  // Handle password change
  const handleChangePassword = async () => {
    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      error("Please fill in all password fields");
      return;
    }

    if (newPassword.length < 8) {
      error("New password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      error("New password and confirm password do not match");
      return;
    }

    if (newPassword === currentPassword) {
      error("New password must be different from the current password");
      return;
    }

    try {
      await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      }).unwrap();

      success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.data?.details?.[0]?.message ||
        err?.message ||
        "Failed to change password";
      error(msg);
    }
  };

  // Toggle 2FA instantly
  const handleToggle2FA = async () => {
    const nextVal = !twoFactorEnabled;
    setTwoFactorEnabled(nextVal);

    try {
      await updateSecuritySettings({ twoFactorEnabled: nextVal }).unwrap();
      success(
        `Two-Factor Authentication ${nextVal ? "enabled" : "disabled"}`
      );
    } catch (err: any) {
      setTwoFactorEnabled(!nextVal);
      const msg =
        err?.data?.message ||
        err?.data?.details?.[0]?.message ||
        err?.message ||
        "Failed to update 2FA setting";
      error(msg);
    }
  };

  // Save session timeout settings
  const handleSaveSessionTimeout = async () => {
    try {
      await updateSecuritySettings({
        sessionTimeoutHours: parseHours(inactivityDuration),
        warnBeforeLogout,
        warningMinutes: parseMinutes(warningTime),
      }).unwrap();

      success("Session timeout settings saved successfully");
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.data?.details?.[0]?.message ||
        err?.message ||
        "Failed to save session timeout settings";
      error(msg);
    }
  };

  // End an active session
  const handleEndSession = async (id: string) => {
    setEndingSessionId(id);
    try {
      await endSession(id).unwrap();
      success("Session ended successfully");
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.data?.details?.[0]?.message ||
        err?.message ||
        "Failed to end session";
      error(msg);
    } finally {
      setEndingSessionId(null);
    }
  };

  // Toggle IP restriction feature enabled
  const handleToggleIpRestriction = async () => {
    const nextVal = !ipRestrictionEnabled;
    setIpRestrictionEnabled(nextVal);

    try {
      await updateSecuritySettings({ ipRestrictionEnabled: nextVal }).unwrap();
      success(
        `IP Access Restriction ${nextVal ? "enabled" : "disabled"}`
      );
    } catch (err: any) {
      setIpRestrictionEnabled(!nextVal);
      const msg =
        err?.data?.message ||
        err?.data?.details?.[0]?.message ||
        err?.message ||
        "Failed to update IP restriction setting";
      error(msg);
    }
  };

  // Add new IP restriction
  const handleAddIp = async () => {
    const ip = newIpAddress.trim();
    if (!ip) {
      error("Please enter a valid IP address");
      return;
    }

    try {
      await createIpRestriction({
        ipAddress: ip,
        label: "Office Network",
      }).unwrap();

      success(`IP address ${ip} added to whitelist`);
      setNewIpAddress("");
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.data?.details?.[0]?.message ||
        err?.message ||
        "Failed to add IP restriction";
      error(msg);
    }
  };

  // Toggle single IP status
  const handleToggleIpStatus = async (id: string) => {
    setTogglingIpId(id);
    try {
      await toggleIpRestriction(id).unwrap();
      success("IP restriction status updated");
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.data?.details?.[0]?.message ||
        err?.message ||
        "Failed to toggle IP status";
      error(msg);
    } finally {
      setTogglingIpId(null);
    }
  };

  // Delete single IP
  const handleDeleteIp = async (id: string) => {
    setDeletingIpId(id);
    try {
      await deleteIpRestriction(id).unwrap();
      success("IP restriction deleted successfully");
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.data?.details?.[0]?.message ||
        err?.message ||
        "Failed to delete IP restriction";
      error(msg);
    } finally {
      setDeletingIpId(null);
    }
  };

  // Save all IP settings
  const handleSaveIpSettings = async () => {
    try {
      await updateSecuritySettings({
        ipRestrictionEnabled,
      }).unwrap();

      success("IP access settings saved successfully");
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.data?.details?.[0]?.message ||
        err?.message ||
        "Failed to save IP access settings";
      error(msg);
    }
  };

  // Global Save Handler (dispatched from SettingsContainer header button)
  useEffect(() => {
    const handleGlobalSave = async (e: Event) => {
      const customEvent = e as CustomEvent<{ section: string }>;
      if (customEvent.detail?.section === "security") {
        onSavingChange?.(true);
        try {
          await updateSecuritySettings({
            twoFactorEnabled,
            sessionTimeoutHours: parseHours(inactivityDuration),
            warnBeforeLogout,
            warningMinutes: parseMinutes(warningTime),
            ipRestrictionEnabled,
          }).unwrap();

          success("All security settings saved successfully");
        } catch (err: any) {
          const msg =
            err?.data?.message ||
            err?.data?.details?.[0]?.message ||
            err?.message ||
            "Failed to save security settings";
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
    updateSecuritySettings,
    twoFactorEnabled,
    inactivityDuration,
    warnBeforeLogout,
    warningTime,
    ipRestrictionEnabled,
    success,
    error,
  ]);

  return (
    <div className="space-y-8 p-5 font-['Manrope']">
      {/* SECTION 1: CHANGE PASSWORD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <LeftsideTitleSubtitle
          title="Change Password"
          subtitle="Ensure your account is using a long, random password to stay secure."
          subtitleWidth="max-w-[280px]"
        />

        <div className="lg:col-span-7 space-y-5">
          <CustomInput
            label="Current Password"
            type={showCurrentPassword ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
            trailingSuffix={
              <button
                type="button"
                onClick={() => setShowCurrentPassword((prev) => !prev)}
                className="hover:text-slate-600 cursor-pointer focus:outline-none"
              >
                {showCurrentPassword ? (
                  <EyeOff className="w-5 h-5 text-slate-400" />
                ) : (
                  <Eye className="w-5 h-5 text-slate-400" />
                )}
              </button>
            }
          />

          <CustomInput
            label="New Password"
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            trailingSuffix={
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="hover:text-slate-600 cursor-pointer focus:outline-none"
              >
                {showNewPassword ? (
                  <EyeOff className="w-5 h-5 text-slate-400" />
                ) : (
                  <Eye className="w-5 h-5 text-slate-400" />
                )}
              </button>
            }
          />

          <CustomInput
            label="Confirm New Password"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            trailingSuffix={
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="hover:text-slate-600 cursor-pointer focus:outline-none"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5 text-slate-400" />
                ) : (
                  <Eye className="w-5 h-5 text-slate-400" />
                )}
              </button>
            }
          />

          <div className="flex justify-end pt-2">
            <button
              type="button"
              disabled={isChangingPassword}
              onClick={handleChangePassword}
              className="bg-[#103D5C] hover:bg-[#0b2841] text-white text-sm font-medium px-6 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {isChangingPassword ? (
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

      {/* SECTION 2: SECURITY & SIGN-IN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <LeftsideTitleSubtitle
          title="Security & Sign-In"
          subtitle="Manage your security verification."
          subtitleWidth="max-w-[280px]"
        />

        <div className="lg:col-span-7 flex items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-[#103D5C]">
              Two-Factor Authentication (2FA)
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Enhance your account security by requiring more than just a password to log in.
            </p>
          </div>

          <AmberToggle
            enabled={twoFactorEnabled}
            disabled={isUpdatingSecurity}
            onChange={handleToggle2FA}
          />
        </div>
      </div>

      {/* HORIZONTAL DIVIDER LINE */}
      <div className="border-t border-[#E4EBF1] w-full" />

      {/* SECTION 3: SESSION TIMEOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <LeftsideTitleSubtitle
          title="Session Timeout"
          subtitle="Automatically log out inactive administrators."
          subtitleWidth="max-w-[280px]"
        />

        <div className="lg:col-span-7 space-y-5">
          <CustomSelect
            label="Inactivity Duration"
            options={INACTIVITY_OPTIONS}
            value={inactivityDuration}
            onValueChange={setInactivityDuration}
          />

          <div className="flex items-center justify-between pt-1">
            <div className="space-y-0.5">
              <h4 className="text-sm font-semibold text-[#103D5C]">
                Warn Before Logout
              </h4>
              <p className="text-xs text-slate-500">
                Show a warning notification before the session expires.
              </p>
            </div>
            <AmberToggle
              enabled={warnBeforeLogout}
              onChange={() => setWarnBeforeLogout((prev) => !prev)}
            />
          </div>

          <CustomSelect
            label="Warning Time"
            options={WARNING_TIME_OPTIONS}
            value={warningTime}
            onValueChange={setWarningTime}
          />

          <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E4EBF1] text-xs text-slate-500 leading-relaxed">
            Inactive sessions may expose admin data. Setting a timeout helps secure your platform automatically.
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              disabled={isUpdatingSecurity}
              onClick={handleSaveSessionTimeout}
              className="bg-[#103D5C] hover:bg-[#0b2841] text-white text-sm font-medium px-6 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {isUpdatingSecurity ? (
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

      {/* SECTION 4: ACTIVE SESSIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <LeftsideTitleSubtitle
          title="Active Sessions"
          subtitle="Devices that have logged into your account."
          subtitleWidth="max-w-[280px]"
        />

        <div className="lg:col-span-7 space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-4 bg-white rounded-xl border border-[#E4EBF1]"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-lg border border-[#E4EBF1] bg-[#F8FAFC] flex items-center justify-center shrink-0">
                  <Monitor className="w-5 h-5 text-[#103D5C]" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#103D5C]">
                    {session.device}
                  </h4>
                  <p className="text-xs text-slate-500 font-normal mt-0.5">
                    {session.location} • IP: {session.ip}
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={endingSessionId === session.id}
                onClick={() => handleEndSession(session.id)}
                className="bg-[#103D5C] hover:bg-[#0b2841] text-white text-xs font-medium px-4 py-2.5 rounded-lg transition-colors cursor-pointer shrink-0 disabled:opacity-50 flex items-center gap-1.5"
              >
                {endingSessionId === session.id && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                )}
                End Session
              </button>
            </div>
          ))}
          {sessions.length === 0 && (
            <p className="text-xs text-slate-400 py-2">No active sessions found.</p>
          )}
        </div>
      </div>

      {/* HORIZONTAL DIVIDER LINE */}
      <div className="border-t border-[#E4EBF1] w-full" />

      {/* SECTION 5: IP ACCESS RESTRICTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <LeftsideTitleSubtitle
          title="IP Access Restriction"
          subtitle="Allow admin dashboard access only from approved IP addresses."
          subtitleWidth="max-w-[280px]"
        />

        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="text-sm font-semibold text-[#103D5C]">
                Enable IP Restriction
              </h4>
              <p className="text-xs text-slate-500">
                Only whitelisted IP addresses will be able to log in.
              </p>
            </div>
            <AmberToggle
              enabled={ipRestrictionEnabled}
              disabled={isUpdatingSecurity}
              onChange={handleToggleIpRestriction}
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1">
              <CustomInput
                placeholder="Enter IP Address..."
                value={newIpAddress}
                onChange={(e) => setNewIpAddress(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddIp();
                  }
                }}
              />
            </div>
            <button
              type="button"
              disabled={isAddingIp}
              onClick={handleAddIp}
              className="h-10 px-5 bg-[#103D5C] hover:bg-[#0b2841] text-white text-sm font-medium rounded-lg shadow-sm transition-colors shrink-0 cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {isAddingIp ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add IP"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* IP Table */}
      <IpRestrictionTable
        ipList={ipList}
        onDeleteIp={handleDeleteIp}
        onToggleStatus={handleToggleIpStatus}
        deletingId={deletingIpId}
        togglingId={togglingIpId}
      />

      <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E4EBF1] text-xs text-slate-600 leading-relaxed">
        <span className="font-semibold text-[#103D5C]">Important:</span> If your
        current IP is not listed and you enable this feature, you may lose
        access to the admin dashboard.
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          disabled={isUpdatingSecurity}
          onClick={handleSaveIpSettings}
          className="bg-[#103D5C] hover:bg-[#0b2841] text-white text-sm font-medium px-6 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50"
        >
          {isUpdatingSecurity ? (
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
  );
}

export default SecuritySettings;
