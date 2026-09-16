"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, Lock } from "lucide-react";
import CustomModal from "@/components/shared/CustomModal";
import { CustomInput } from "@/components/shared/CustomInput";
import { CustomSelect } from "@/components/shared/CustomSelect";
import CustomButton from "@/components/shared/CustomButton";
import {
  CATEGORY_OPTIONS,
  CATEGORY_TEMPLATE_FIELDS,
  CATEGORY_DESCRIPTIONS,
} from "./ServiceData";

interface AddServiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (data: {
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

export default function AddServiceModal({
  open,
  onOpenChange,
  onCreated,
}: AddServiceModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("Active");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const templateFields = category ? CATEGORY_TEMPLATE_FIELDS[category] : null;
  const categoryDescription = category ? CATEGORY_DESCRIPTIONS[category] : null;

  const handleClose = (next: boolean) => {
    if (!next) {
      setName("");
      setCategory("");
      setStatus("Active");
      setImage(null);
      setImagePreview(null);
    }
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
    onCreated?.({ name, category, status, image });
    handleClose(false);
  };

  return (
    <CustomModal
      open={open}
      onOpenChange={handleClose}
      title="Add New Service"
      description="Add a new service to the platform"
      size="xsm"
      showCloseButton
    >
      <div className="space-y-4">
        {/* Service Name */}
        <CustomInput
          label="Service Name"
          placeholder="e.g Language Learning"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Category */}
        <div className="space-y-2">
          <CustomSelect
            label="Category"
            placeholder="Select category"
            options={CATEGORY_OPTIONS.filter((o) => o.value !== "")}
            value={category}
            onValueChange={setCategory}
          />

          {/* Template Fields (shown when category selected) */}
          {templateFields && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2">
              <div className="flex items-center gap-1.5">
                <Lock size={13} className="text-amber-500 shrink-0" />
                <p className="text-xs font-medium text-amber-500 font-['Manrope']">
                  Template fields are predefined and cannot be modified
                </p>
              </div>
              {categoryDescription && (
                <p className="text-xs text-slate-500 font-['Manrope']">
                  {categoryDescription}
                </p>
              )}
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {templateFields.map((field) => (
                  <span
                    key={field}
                    className="inline-flex items-center rounded-full border border-slate-300 bg-white px-2.5 py-0.5 text-xs text-slate-600 font-['Manrope']"
                  >
                    {field}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

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
              <img
                src={imagePreview}
                alt="Preview"
                className="h-20 w-20 rounded-lg object-cover"
              />
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
            Create Service
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  );
}
