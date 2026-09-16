"use client";

import React, { useRef, useState, useEffect } from "react";
import { UploadCloud } from "lucide-react";
import CustomModal from "@/components/shared/CustomModal";
import { CustomInput } from "@/components/shared/CustomInput";
import { CustomSelect } from "@/components/shared/CustomSelect";
import CustomButton from "@/components/shared/CustomButton";
import { CATEGORY_OPTIONS } from "./ServiceData";
import type { ServiceRecord } from "./ServiceData";

interface EditServiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: ServiceRecord | null;
  onSaved?: (data: {
    id: string;
    name: string;
    category: string;
    status: string;
    image: File | null;
  }) => void;
}

const STATUS_OPTIONS = [
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
];

export default function EditServiceModal({
  open,
  onOpenChange,
  service,
  onSaved,
}: EditServiceModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("Active");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pre-fill when a service is selected
  useEffect(() => {
    if (service) {
      setName(service.name);
      setCategory(service.category);
      setStatus(service.status ? "Active" : "Inactive");
      setImagePreview(service.image);
      setImage(null);
    }
  }, [service]);

  const handleClose = (next: boolean) => {
    onOpenChange(next);
  };

  const handleFile = (file: File) => {
    if (!file.type.match(/image\/(jpeg|png|gif|webp)/)) return;
    setImage(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleSubmit = () => {
    if (!service) return;
    onSaved?.({ id: service.id, name, category, status, image });
    handleClose(false);
  };

  if (!service) return null;

  return (
    <CustomModal
      open={open}
      onOpenChange={handleClose}
      title="Edit Service"
      size="xsm"
      showCloseButton
    >
      <div className="space-y-4">
        {/* Service Name */}
        <CustomInput
          label="Service Name"
          placeholder="e.g Wall Painting"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Category */}
        <CustomSelect
          label="Category"
          placeholder="Select category"
          options={CATEGORY_OPTIONS.filter((o) => o.value !== "")}
          value={category}
          onValueChange={setCategory}
        />

        {/* Status */}
        <CustomSelect
          label="Status"
          options={STATUS_OPTIONS}
          value={status}
          onValueChange={setStatus}
        />

        {/* Service Image */}
        <div className="space-y-1.5">
          <p className="text-sm font-normal text-slate-600 leading-6 font-['Manrope']">
            Service Image
          </p>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex min-h-[120px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-colors ${
              isDragging
                ? "border-[#0a3558] bg-[#0a3558]/5"
                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            {imagePreview ? (
              <div className="flex flex-col items-center gap-2 py-3">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-20 w-20 rounded-lg object-cover border border-slate-100"
                />
                <p className="text-xs text-slate-400 font-['Manrope']">
                  Click to change image
                </p>
              </div>
            ) : (
              <>
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white">
                  <UploadCloud size={18} className="text-slate-400" />
                </div>
                <p className="text-sm font-['Manrope'] text-slate-600 text-center">
                  Drag &amp; Drop image or{" "}
                  <span className="font-semibold text-amber-500">Browse</span>
                </p>
                <p className="text-xs text-slate-400 font-['Manrope']">
                  JPG, PNG or PDF (Max 5MB)
                </p>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <CustomButton
            variant="tertiary"
            size="md"
            className="w-full"
            onClick={() => handleClose(false)}
          >
            Cancel
          </CustomButton>
          <CustomButton
            variant="primary"
            size="md"
            className="w-full"
            onClick={handleSubmit}
            disabled={!name || !category}
          >
            Save Changes
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  );
}
