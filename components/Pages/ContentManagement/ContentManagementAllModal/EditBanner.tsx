"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, UploadCloud } from "lucide-react";
import CustomButton from "@/components/shared/CustomButton";
import { CustomInput } from "@/components/shared/CustomInput";
import CustomSelect, {
  CustomSelectOption,
} from "@/components/shared/CustomSelect";
import { BannerFormData } from "./AddBanner";

export interface EditBannerProps {
  initialData?: BannerFormData | null;
  onCancel: () => void;
  onSubmit: (data: BannerFormData) => void;
}

const audienceOptions: CustomSelectOption[] = [
  { label: "Clients", value: "Clients" },
  { label: "All Users", value: "All" },
  { label: "Experts", value: "Experts" },
];

export default function EditBanner({
  initialData,
  onCancel,
  onSubmit,
}: EditBannerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaLink, setCtaLink] = useState("");
  const [audience, setAudience] = useState("Clients");
  const [isLive, setIsLive] = useState(true);
  const [image, setImage] = useState(
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=80"
  );
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setSubtitle(initialData.subtitle || "");
      setCtaText(initialData.ctaText || "");
      setCtaLink(initialData.ctaLink || "");
      setAudience(initialData.audience || "Clients");
      setIsLive(initialData.status === "Live");
      if (initialData.image) setImage(initialData.image);
    }
  }, [initialData]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: initialData?.id,
      title: title || "Trusted Experts Near You",
      subtitle:
        subtitle || "Hire verified experts for every service in minutes.",
      ctaText: ctaText || "Explore Now",
      ctaLink: ctaLink || "#",
      audience,
      status: isLive ? "Live" : "Draft",
      image,
    });
  };

  return (
    <div className="font-['Manrope'] text-[#103D5C]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#F0F4F8]">
        <h3 className="text-[#103D5C] text-[18px] font-semibold leading-6">
          Edit Banner
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-slate-400 hover:text-slate-600 transition-colors p-1"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Main Body: Two Columns */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left Column: Form Controls */}
          <div className="flex flex-col gap-3.5">
            {/* Upload Thumbnail */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#103D5C]">
                Upload Thumbnail
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full rounded-xl border border-[#E4EBF1] p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-slate-300 transition-colors text-center bg-white"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="h-10 w-10 rounded-full bg-[#F0F4F8] flex items-center justify-center text-[#103D5C]">
                  <UploadCloud className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-[#103D5C] font-normal">
                    {fileName ? (
                      <span className="font-medium text-emerald-600">
                        {fileName}
                      </span>
                    ) : (
                      <>
                        Drag & Drop image or{" "}
                        <span className="text-[#F5B517] font-semibold underline">
                          Browse
                        </span>
                      </>
                    )}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    JPG, PNG or PDF (Max 5MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Title using CustomInput */}
            <div>
              <CustomInput
                label="Title"
                placeholder="e.g. Trusted Experts Near You"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Subtitle using CustomInput */}
            <div>
              <CustomInput
                label="Subtitle"
                placeholder="e.g. Hire verified experts for every service in minutes."
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                required
              />
            </div>

            {/* CTA Text using CustomInput */}
            <div>
              <CustomInput
                label="CTA Text"
                placeholder="eg. Explore Now"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                required
              />
            </div>

            {/* CTA Link using CustomInput */}
            <div>
              <CustomInput
                label="CTA Link"
                placeholder="https:......"
                value={ctaLink}
                onChange={(e) => setCtaLink(e.target.value)}
                required
              />
            </div>

            {/* Choose Audience using CustomSelect */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#103D5C]">
                Choose Audience
              </label>
              <CustomSelect
                options={audienceOptions}
                value={audience}
                onValueChange={(val) => setAudience(val)}
                placeholder="Select audience"
                triggerClassName="h-10 rounded-lg border-slate-200 text-sm text-[#103D5C] focus-visible:border-[#0a3558] focus-visible:ring-1 focus-visible:ring-[#0a3558] bg-white px-3"
              />
            </div>
          </div>

          {/* Right Column: Live Preview Card */}
          <div className="rounded-2xl bg-[#F4F7F9] p-4 flex flex-col gap-3 sticky top-0">
            <h4 className="text-sm font-semibold text-[#103D5C]">
              Live Preview
            </h4>

            {/* Banner card */}
            <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-r from-[#0C3859] via-[#0E466F] to-[#0A2E49] p-4 sm:p-5 flex items-center justify-between text-white shadow-md">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-400/15 via-transparent to-transparent pointer-events-none" />

              {/* Left text */}
              <div className="relative z-10 flex-1 max-w-[55%] flex flex-col justify-center gap-1.5">
                <h4 className="text-sm sm:text-base font-bold leading-tight text-white line-clamp-2">
                  {title || "Trusted Experts Near You"}
                </h4>
                <p className="text-[10px] sm:text-xs text-white/80 leading-relaxed line-clamp-2">
                  {subtitle ||
                    "Hire verified experts for every service in minutes."}
                </p>
                <div className="pt-1.5">
                  <span className="inline-block bg-[#F5B517] text-[#103D5C] text-[10px] sm:text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm">
                    {ctaText || "Explore Experts"}
                  </span>
                </div>
              </div>

              {/* Right image */}
              <div className="relative z-10 w-[42%] h-28 sm:h-32 flex items-end justify-end">
                <img
                  src={image}
                  alt="Banner preview"
                  className="max-h-full max-w-full object-cover rounded-lg shadow"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Status on Left, Buttons on Right */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#F0F4F8]">
          {/* Status Switch */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-[#103D5C]">Status</span>
            <button
              type="button"
              role="switch"
              aria-checked={isLive}
              onClick={() => setIsLive((prev) => !prev)}
              className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none ${
                isLive ? "bg-[#F5B517]" : "bg-slate-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  isLive ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
            <span className="text-sm font-medium text-[#103D5C] min-w-10">
              {isLive ? "Live" : "Draft"}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <CustomButton
              type="button"
              variant="tertiary"
              size="md"
              className="h-10 rounded-xl border border-[#103D5C] text-[#103D5C] hover:bg-slate-50 font-semibold px-5 text-sm"
              onClick={onCancel}
            >
              Cancel
            </CustomButton>
            <CustomButton
              type="submit"
              variant="primary"
              size="md"
              className="h-10 rounded-xl bg-[#103D5C] hover:bg-[#0c2e46] text-white font-semibold px-5 text-sm"
            >
              Save Changes
            </CustomButton>
          </div>
        </div>
      </form>
    </div>
  );
}
