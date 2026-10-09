"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { SettingsSidebar, SettingsSection } from "./SettingsSidebar";
import NotificationsClientSettings from "./subpages/NotificationsClientSettings";
import NotificationsExpertSettings from "./subpages/NotificationsExpertSettings";
import GeneralSettings from "./subpages/GeneralSettings";
import PlanPricingSettings from "./subpages/PlanPricingSettings";
import PaymentEscrowSettings from "./subpages/PaymentEscrowSettings";
import SecuritySettings from "./subpages/SecuritySettings";
import SystemSettings from "./subpages/SystemSettings";

export function SettingsContainer() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sectionParam = searchParams.get("section") as SettingsSection | null;

  const validSection: SettingsSection =
    sectionParam === "general" ||
    sectionParam === "plan-pricing" ||
    sectionParam === "payment-escrow" ||
    sectionParam === "notifications-client" ||
    sectionParam === "notifications-expert" ||
    sectionParam === "security" ||
    sectionParam === "system"
      ? sectionParam
      : "notifications-client";

  const [activeSection, setActiveSection] = useState<SettingsSection>(validSection);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (sectionParam && sectionParam !== activeSection) {
      setActiveSection(validSection);
    }
  }, [sectionParam]);

  const handleSelectSection = (section: SettingsSection) => {
    setActiveSection(section);
    const params = new URLSearchParams(searchParams.toString());
    params.set("section", section);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Settings saved successfully!");
    }, 600);
  };

  return (
    <div className="w-full font-['Manrope']">
      <div className="w-full bg-white rounded-2xl shadow-[0px_2px_4px_-1px_rgba(13,13,18,0.06)] border border-[#E4EBF1] flex flex-col justify-start items-start overflow-hidden">
        {/* Top Header inside Card */}
        <div className="self-stretch p-4 bg-white rounded-t-2xl border-b border-[#E4EBF1] flex justify-between items-center">
          <div className="flex-1 text-[#103D5C] text-lg font-semibold leading-6">
            Settings
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="h-10 px-4 py-2 bg-[#103D5C] hover:bg-[#0b2841] text-white text-sm font-medium rounded-lg flex justify-center items-center gap-2 transition-colors disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Card Body with Sidebar and Content */}
        <div className="self-stretch flex flex-col lg:flex-row justify-start items-start">
          <SettingsSidebar
            activeSection={activeSection}
            onSelectSection={handleSelectSection}
          />

          <div className="flex-1 min-h-[500px]">
            {activeSection === "notifications-client" && (
              <NotificationsClientSettings />
            )}
            {activeSection === "notifications-expert" && (
              <NotificationsExpertSettings />
            )}
            {activeSection === "general" && <GeneralSettings />}
            {activeSection === "plan-pricing" && <PlanPricingSettings />}
            {activeSection === "payment-escrow" && <PaymentEscrowSettings />}
            {activeSection === "security" && <SecuritySettings />}
            {activeSection === "system" && <SystemSettings />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsContainer;

