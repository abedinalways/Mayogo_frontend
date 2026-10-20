"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import LeftsideTitleSubtitle from "../LeftsideTitleSubtitle";
import { CustomInput } from "@/components/shared/CustomInput";
import { CustomSelect } from "@/components/shared/CustomSelect";
import {
  useGetCompanySettingsQuery,
  useUpdateCompanySettingsMutation,
  useUploadCompanyLogoMutation,
  useRemoveCompanyLogoMutation,
} from "@/lib/redux/api/settingsApi";
import { useToast } from "@/components/shared/Toast/ToastContext";
import { Loader2, Trash2 } from "lucide-react";

interface GeneralSettingsProps {
  onSavingChange?: (isSaving: boolean) => void;
}

const DEFAULT_COUNTRY_OPTIONS = [
  { label: "United States", value: "United States" },
  { label: "Canada", value: "Canada" },
  { label: "United Kingdom", value: "United Kingdom" },
  { label: "Bangladesh", value: "Bangladesh" },
  { label: "Tanzania", value: "Tanzania" },
  { label: "Kenya", value: "Kenya" },
  { label: "Germany", value: "Germany" },
  { label: "Australia", value: "Australia" },
];

const DEFAULT_TIMEZONE_OPTIONS = [
  { label: "(UTC+09:00) USA", value: "(UTC+09:00) USA" },
  { label: "(UTC+06:00) Dhaka", value: "(UTC+06:00) Dhaka" },
  { label: "(UTC+03:00) East Africa", value: "(UTC+03:00) East Africa" },
  { label: "(UTC+00:00) London", value: "(UTC+00:00) London" },
  { label: "(UTC-05:00) New York", value: "(UTC-05:00) New York" },
  { label: "(UTC-08:00) Pacific", value: "(UTC-08:00) Pacific" },
];

const DEFAULT_CURRENCY_OPTIONS = [
  { label: "USD", value: "USD" },
  { label: "TZS", value: "TZS" },
  { label: "KES", value: "KES" },
  { label: "EUR", value: "EUR" },
  { label: "GBP", value: "GBP" },
  { label: "BDT", value: "BDT" },
];

const DEFAULT_DATE_FORMAT_OPTIONS = [
  { label: "DD/MM/YYYY", value: "DD/MM/YYYY" },
  { label: "MM/DD/YYYY", value: "MM/DD/YYYY" },
  { label: "YYYY-MM-DD", value: "YYYY-MM-DD" },
];

function ensureOption(
  options: { label: string; value: string }[],
  currentVal?: string
) {
  if (!currentVal) return options;
  if (!options.some((opt) => opt.value === currentVal)) {
    return [{ label: currentVal, value: currentVal }, ...options];
  }
  return options;
}

export function GeneralSettings({ onSavingChange }: GeneralSettingsProps) {
  const { data: companyData, isLoading: isFetchingData } =
    useGetCompanySettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] =
    useUpdateCompanySettingsMutation();
  const [uploadLogo, { isLoading: isUploadingLogo }] =
    useUploadCompanyLogoMutation();
  const [removeLogo, { isLoading: isRemovingLogo }] =
    useRemoveCompanyLogoMutation();

  const { success, error } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Account Details state
  const [companyName, setCompanyName] = useState("Nepotech");
  const [companyEmail, setCompanyEmail] = useState("nepotech@gmail.com");
  const [companyPhone, setCompanyPhone] = useState("999-(1234)-555");
  const [industry, setIndustry] = useState("Local Services");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  // Address state
  const [address, setAddress] = useState(
    "123 Sunset Boulevard, Los Angeles, CA"
  );
  const [country, setCountry] = useState("United States");
  const [city, setCity] = useState("Los Angeles");
  const [postalCode, setPostalCode] = useState("90028");

  // Localization state
  const [timezone, setTimezone] = useState("(UTC+09:00) USA");
  const [currency, setCurrency] = useState("USD");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");

  // Track if we initialized from API
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (companyData && !hasInitialized.current) {
      if (companyData.companyName) setCompanyName(companyData.companyName);
      if (companyData.companyEmail) setCompanyEmail(companyData.companyEmail);
      if (companyData.companyPhone) setCompanyPhone(companyData.companyPhone);
      if (companyData.industry) setIndustry(companyData.industry);
      if (companyData.logoUrl !== undefined) setLogoUrl(companyData.logoUrl);
      if (companyData.address) setAddress(companyData.address);
      if (companyData.country) setCountry(companyData.country);
      if (companyData.city) setCity(companyData.city);
      if (companyData.postalCode) setPostalCode(companyData.postalCode);
      if (companyData.timezone) setTimezone(companyData.timezone);
      if (companyData.currency) setCurrency(companyData.currency);
      if (companyData.dateFormat) setDateFormat(companyData.dateFormat);
      hasInitialized.current = true;
    }
  }, [companyData]);

  const countryOptions = useMemo(
    () => ensureOption(DEFAULT_COUNTRY_OPTIONS, country),
    [country]
  );
  const timezoneOptions = useMemo(
    () => ensureOption(DEFAULT_TIMEZONE_OPTIONS, timezone),
    [timezone]
  );
  const currencyOptions = useMemo(
    () => ensureOption(DEFAULT_CURRENCY_OPTIONS, currency),
    [currency]
  );
  const dateFormatOptions = useMemo(
    () => ensureOption(DEFAULT_DATE_FORMAT_OPTIONS, dateFormat),
    [dateFormat]
  );

  const isSaving = isUpdating || isUploadingLogo || isRemovingLogo;

  useEffect(() => {
    onSavingChange?.(isSaving);
  }, [isSaving, onSavingChange]);

  const isSubmittingRef = useRef(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (isSubmittingRef.current || isUpdating) return;

    isSubmittingRef.current = true;
    try {
      await updateSettings({
        companyName: companyName.trim(),
        companyEmail: companyEmail.trim(),
        companyPhone: companyPhone.trim(),
        industry: industry.trim(),
        logoUrl: logoUrl || undefined,
        address: address.trim(),
        country: country.trim(),
        city: city.trim(),
        postalCode: postalCode.trim(),
        timezone: timezone.trim(),
        currency: currency.trim(),
        dateFormat: dateFormat.trim(),
      }).unwrap();

      success("Company settings updated successfully");
    } catch (err: any) {
      const msg =
        err?.data?.message || err?.message || "Failed to update company settings";
      error(msg);
    } finally {
      isSubmittingRef.current = false;
    }
  };

  // Listen for save request dispatched from parent container header button
  useEffect(() => {
    const handleSaveRequest = (evt: Event) => {
      const customEvent = evt as CustomEvent<{ section?: string }>;
      if (!customEvent.detail || customEvent.detail.section === "general") {
        handleSubmit();
      }
    };

    window.addEventListener("SETTINGS_SAVE_REQUEST", handleSaveRequest);
    return () => {
      window.removeEventListener("SETTINGS_SAVE_REQUEST", handleSaveRequest);
    };
  }, [
    companyName,
    companyEmail,
    companyPhone,
    industry,
    logoUrl,
    address,
    country,
    city,
    postalCode,
    timezone,
    currency,
    dateFormat,
  ]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      error("Logo file size must be less than 5MB");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const localUrl = URL.createObjectURL(file);
    setLogoUrl(localUrl);

    try {
      const formData = new FormData();
      formData.append("logo", file);
      const res = await uploadLogo(formData).unwrap();
      const newLogoUrl = res.logoUrl || res.url;
      if (newLogoUrl) {
        setLogoUrl(newLogoUrl);
      }
      success("Company logo uploaded successfully");
    } catch (err: any) {
      const msg =
        err?.data?.message || err?.message || "Failed to upload company logo";
      error(msg);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveLogo = async () => {
    try {
      await removeLogo().unwrap();
      setLogoUrl(null);
      success("Company logo removed");
    } catch (err: any) {
      const msg =
        err?.data?.message || err?.message || "Failed to remove company logo";
      error(msg);
    }
  };

  if (isFetchingData && !hasInitialized.current) {
    return (
      <div className="space-y-8 p-5 font-['Manrope'] animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-2">
            <div className="h-5 w-36 rounded bg-slate-200" />
            <div className="h-4 w-56 rounded bg-slate-100" />
          </div>
          <div className="lg:col-span-7 space-y-4">
            <div className="h-10 w-full rounded bg-slate-100" />
            <div className="h-10 w-full rounded bg-slate-100" />
            <div className="h-10 w-full rounded bg-slate-100" />
            <div className="h-10 w-full rounded bg-slate-100" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      id="general-settings-form"
      onSubmit={handleSubmit}
      className="space-y-8 p-5 font-['Manrope']"
    >
      {/* SECTION 1: ACCOUNT DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <LeftsideTitleSubtitle
          title="Account Details"
          subtitle="Your users will use this information to contact you."
          subtitleWidth="max-w-[280px]"
        />

        {/* Right Column: Form Inputs */}
        <div className="lg:col-span-7 space-y-5">
          <CustomInput
            label="Company Name"
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            isRequired
          />

          <CustomInput
            label="Company Email"
            type="email"
            value={companyEmail}
            onChange={(e) => setCompanyEmail(e.target.value)}
            isRequired
          />

          <CustomInput
            label="Company Phone"
            type="tel"
            value={companyPhone}
            onChange={(e) => setCompanyPhone(e.target.value)}
            isRequired
          />

          <CustomInput
            label="Industry"
            type="text"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            isRequired
          />

          {/* Logo Field */}
          <div className="flex flex-col gap-1.5 font-['Manrope']">
            <label className="text-sm font-normal text-slate-600 leading-6">
              Logo
            </label>
            <div className="flex items-center gap-3">
              {/* Circular Avatar Badge */}
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0E2F44] text-[#F59E0B] font-bold border-2 border-[#F59E0B] shadow-sm text-xs text-center p-1 leading-none overflow-hidden select-none">
                {isUploadingLogo ? (
                  <Loader2 className="h-5 w-5 animate-spin text-[#F59E0B]" />
                ) : logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Logo"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-[9px] tracking-tighter uppercase font-extrabold text-[#F59E0B]">
                      {companyName.slice(0, 8).toUpperCase() || "MAYOGO"}
                    </span>
                    <span className="text-[6px] text-slate-300">Platform</span>
                  </div>
                )}
              </div>

              {/* Upload text and format instruction */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="logo-upload"
                    className="text-sm font-medium text-slate-700 hover:text-[#103D5C] cursor-pointer"
                  >
                    {logoUrl ? "Change logo" : "Upload your company logo"}
                  </label>
                  {logoUrl && (
                    <>
                      <span className="text-slate-300" aria-hidden="true">
                        |
                      </span>
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        disabled={isRemovingLogo}
                        className="inline-flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                      >
                        {isRemovingLogo ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Trash2 className="h-3 w-3" />
                        )}
                        <span>Remove</span>
                      </button>
                    </>
                  )}
                </div>
                <span className="text-xs text-slate-400">
                  (SVG, PNG, JPG, WEBP, max 5MB)
                </span>
                <input
                  ref={fileInputRef}
                  id="logo-upload"
                  type="file"
                  accept="image/svg+xml,image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleLogoUpload}
                  disabled={isUploadingLogo}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HORIZONTAL DIVIDER LINE */}
      <div className="border-t border-[#E4EBF1] w-full -mx-5" />

      {/* SECTION 2: ADDRESS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <LeftsideTitleSubtitle
          title="Address"
          subtitle="This address will appear on your invoice."
          subtitleWidth="max-w-[280px]"
        />

        {/* Right Column: Address Form Inputs */}
        <div className="lg:col-span-7 space-y-5">
          <CustomInput
            label="Address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            isRequired
          />

          {/* Country or Region Select Dropdown */}
          <CustomSelect
            label="Country or Region"
            options={countryOptions}
            value={country}
            onValueChange={setCountry}
            isRequired
          />

          <CustomInput
            label="City"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            isRequired
          />

          <CustomInput
            label="Postal Code"
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            isRequired
          />
        </div>
      </div>

      {/* HORIZONTAL DIVIDER LINE */}
      <div className="border-t border-[#E4EBF1] w-full -mx-5" />

      {/* SECTION 3: LOCALIZATION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <LeftsideTitleSubtitle
          title="Localization"
          subtitle="This address will appear on your invoice."
          subtitleWidth="max-w-[280px]"
        />

        {/* Right Column: Localization Form Inputs */}
        <div className="lg:col-span-7 space-y-5">
          {/* Timezone */}
          <CustomSelect
            label="Timezone"
            options={timezoneOptions}
            value={timezone}
            onValueChange={setTimezone}
          />

          {/* Currency */}
          <CustomSelect
            label="Currency"
            options={currencyOptions}
            value={currency}
            onValueChange={setCurrency}
          />

          {/* Date Format */}
          <CustomSelect
            label="Date Format"
            options={dateFormatOptions}
            value={dateFormat}
            onValueChange={setDateFormat}
          />
        </div>
      </div>
    </form>
  );
}

export default GeneralSettings;
