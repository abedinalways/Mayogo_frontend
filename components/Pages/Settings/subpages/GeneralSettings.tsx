"use client";

import React, { useState } from "react";
import LeftsideTitleSubtitle from "../LeftsideTitleSubtitle";
import { CustomInput } from "@/components/shared/CustomInput";
import { CustomSelect } from "@/components/shared/CustomSelect";

export function GeneralSettings() {
  // Account Details state
  const [companyName, setCompanyName] = useState("Nepotech");
  const [companyEmail, setCompanyEmail] = useState("nepotech@gmail.com");
  const [companyPhone, setCompanyPhone] = useState("999-(1234)-555");
  const [industry, setIndustry] = useState("Local Services");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  // Address state
  const [address, setAddress] = useState("123 Sunset Boulevard, Los Angeles, CA");
  const [country, setCountry] = useState("United States");
  const [city, setCity] = useState("Los Angeles");
  const [postalCode, setPostalCode] = useState("90028");

  // Localization state
  const [timezone, setTimezone] = useState("(UTC+09:00) USA");
  const [currency, setCurrency] = useState("USD");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");

  const countryOptions = [
    { label: "United States", value: "United States" },
    { label: "Canada", value: "Canada" },
    { label: "United Kingdom", value: "United Kingdom" },
    { label: "Bangladesh", value: "Bangladesh" },
  ];

  const timezoneOptions = [
    { label: "(UTC+09:00) USA", value: "(UTC+09:00) USA" },
    { label: "(UTC+06:00) Dhaka", value: "(UTC+06:00) Dhaka" },
    { label: "(UTC+00:00) London", value: "(UTC+00:00) London" },
  ];

  const currencyOptions = [
    { label: "USD", value: "USD" },
    { label: "EUR", value: "EUR" },
    { label: "GBP", value: "GBP" },
    { label: "BDT", value: "BDT" },
  ];

  const dateFormatOptions = [
    { label: "DD/MM/YYYY", value: "DD/MM/YYYY" },
    { label: "MM/DD/YYYY", value: "MM/DD/YYYY" },
    { label: "YYYY-MM-DD", value: "YYYY-MM-DD" },
  ];

  return (
    <div className="space-y-8 p-5 font-['Manrope']">
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
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0E2F44] text-[#F59E0B] font-bold border-2 border-[#F59E0B] shadow-sm text-xs text-center p-1 leading-none overflow-hidden select-none">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-[9px] tracking-tighter uppercase font-extrabold text-[#F59E0B]">NEPOTECH</span>
                    <span className="text-[6px] text-slate-300">Refine skills</span>
                  </div>
                )}
              </div>

              {/* Upload text and format instruction */}
              <div className="flex flex-col">
                <label htmlFor="logo-upload" className="text-sm font-medium text-slate-700 hover:text-[#103D5C] cursor-pointer">
                  Upload your company logo
                </label>
                <span className="text-xs text-slate-400">
                  (SVG,PNG,JPG)
                </span>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/svg+xml,image/png,image/jpeg"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setLogoUrl(URL.createObjectURL(file));
                    }
                  }}
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
    </div>
  );
}

export default GeneralSettings;
