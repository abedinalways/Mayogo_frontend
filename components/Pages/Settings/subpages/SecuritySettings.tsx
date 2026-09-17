"use client";

import React, { useState } from "react";
import LeftsideTitleSubtitle from "../LeftsideTitleSubtitle";
import { CustomInput } from "@/components/shared/CustomInput";
import { CustomSelect } from "@/components/shared/CustomSelect";
import { Eye, EyeOff, Monitor } from "lucide-react";
import IpRestrictionTable, { IpRestrictionItem } from "./IpRestrictionTable";

interface SessionItem {
  id: string;
  device: string;
  location: string;
  ip: string;
}

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

const INACTIVITY_OPTIONS = [
  { label: "15 minutes", value: "15m" },
  { label: "30 minutes", value: "30m" },
  { label: "1 hour", value: "1h" },
  { label: "2 hours", value: "2h" },
  { label: "4 hours", value: "4h" },
];

const WARNING_TIME_OPTIONS = [
  { label: "2 minutes before logout", value: "2m" },
  { label: "5 minutes before logout", value: "5m" },
  { label: "10 minutes before logout", value: "10m" },
];

const INITIAL_IP_LIST: IpRestrictionItem[] = [
  {
    id: "1",
    ip: "192.168.11",
    label: "Office Network",
    addedBy: "Super Admin",
    date: "Jul 27, 2026",
    status: "Active",
  },
  {
    id: "2",
    ip: "192.168.11",
    label: "Company VPN",
    addedBy: "Super Admin",
    date: "Jul 27, 2026",
    status: "Active",
  },
  {
    id: "3",
    ip: "192.168.11",
    label: "Office Network",
    addedBy: "Admin",
    date: "Jul 27, 2026",
    status: "Disabled",
  },
];

export function SecuritySettings() {
  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 2FA state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // Session Timeout state
  const [inactivityDuration, setInactivityDuration] = useState("1h");
  const [warnBeforeLogout, setWarnBeforeLogout] = useState(true);
  const [warningTime, setWarningTime] = useState("5m");

  // Active Sessions state
  const [sessions, setSessions] = useState<SessionItem[]>([
    {
      id: "1",
      device: "MacBook Pro - Chrome",
      location: "Jakarta, ID",
      ip: "114.120.0.0",
    },
    {
      id: "2",
      device: "MacBook Pro - Chrome",
      location: "Jakarta, ID",
      ip: "114.120.0.0",
    },
  ]);

  // IP Restriction state
  const [ipRestrictionEnabled, setIpRestrictionEnabled] = useState(true);
  const [newIpAddress, setNewIpAddress] = useState("");
  const [ipList, setIpList] = useState<IpRestrictionItem[]>(INITIAL_IP_LIST);

  const handleEndSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const handleAddIp = () => {
    if (!newIpAddress.trim()) return;
    const newItem: IpRestrictionItem = {
      id: Date.now().toString(),
      ip: newIpAddress.trim(),
      label: "Custom IP",
      addedBy: "Admin",
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      status: "Active",
    };
    setIpList((prev) => [...prev, newItem]);
    setNewIpAddress("");
  };

  const handleDeleteIp = (id: string) => {
    setIpList((prev) => prev.filter((item) => item.id !== id));
  };

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
              className="bg-[#103D5C] hover:bg-[#0b2841] text-white text-sm font-medium px-6 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Save Changes
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
            onChange={() => setTwoFactorEnabled((prev) => !prev)}
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
              className="bg-[#103D5C] hover:bg-[#0b2841] text-white text-sm font-medium px-6 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Save Changes
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
                onClick={() => handleEndSession(session.id)}
                className="bg-[#103D5C] hover:bg-[#0b2841] text-white text-xs font-medium px-4 py-2.5 rounded-lg transition-colors cursor-pointer shrink-0"
              >
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
      <div className="border-t border-[#E4EBF1] w-full " />

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
              onChange={() => setIpRestrictionEnabled((prev) => !prev)}
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1">
              <CustomInput
                placeholder="Enter IP Address..."
                value={newIpAddress}
                onChange={(e) => setNewIpAddress(e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={handleAddIp}
              className="h-10 px-5 bg-[#103D5C] hover:bg-[#0b2841] text-white text-sm font-medium rounded-lg shadow-sm transition-colors shrink-0 cursor-pointer"
            >
              Add IP
            </button>
          </div>

        
        </div>
      </div>


        {/* IP Table */}
          <IpRestrictionTable
            ipList={ipList}
            onDeleteIp={handleDeleteIp}
          />

          <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E4EBF1] text-xs text-slate-600 leading-relaxed">
            <span className="font-semibold text-[#103D5C]">Important:</span> If your current IP is not listed and you enable this feature, you may lose access to the admin dashboard.
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              className="bg-[#103D5C] hover:bg-[#0b2841] text-white text-sm font-medium px-6 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Save Changes
            </button>
          </div>
    </div>
  );
}

export default SecuritySettings;


