"use client";

import React, { useRef, useState, useEffect } from "react";
import { UploadCloud, Loader2 } from "lucide-react";
import CustomModal from "@/components/shared/CustomModal";
import { CustomInput } from "@/components/shared/CustomInput";
import { CustomSelect } from "@/components/shared/CustomSelect";
import CustomButton from "@/components/shared/CustomButton";
import { ServiceItem } from "@/types/category.types";
import { useUpdateServiceMutation, useGetCategoriesQuery } from "@/lib/redux/api/categoryApi";

interface EditServiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: ServiceItem | null;
  onSaved?: () => void;
}

const STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

export default function EditServiceModal({
  open,
  onOpenChange,
  service,
  onSaved,
}: EditServiceModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [commission, setCommission] = useState("10");
  const [status, setStatus] = useState("active");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | File>("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: categories } = useGetCategoriesQuery();
  const [updateService, { isLoading }] = useUpdateServiceMutation();

  const categoryOptions = (categories || []).map((c) => ({
    label: c.name,
    value: c.id,
  }));

  useEffect(() => {
    if (service) {
      setName(service.name || "");
      setDescription(service.description || "");
      const catId = typeof service.category === "object" ? service.category?.id : service.categoryId;
      const matchedCat = (categories || []).find((c) => c.name === service.category || c.id === service.categoryId);
      setCategoryId(catId || matchedCat?.id || service.categoryId || "");
      const rawComm = String(service.commission ?? "10").replace("%", "");
      setCommission(rawComm || "10");
      setStatus(service.isActive ? "active" : "inactive");
      setImagePreview(service.imageUrl || service.image || null);
      setImageUrl(service.imageUrl || service.image || "");
    }
  }, [service]);

  const handleClose = (next: boolean) => {
    onOpenChange(next);
  };

  const handleFile = (file: File) => {
    if (!file.type.match(/image\/(jpeg|png|gif|webp)/)) return;
    setImageUrl(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleSubmit = async () => {
    if (!service || !name.trim()) return;

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      if (description.trim()) {
        formData.append("description", description.trim());
      }
      if (categoryId) {
        formData.append("categoryId", categoryId);
      }
      formData.append("commission", String(parseFloat(commission) || 10));
      formData.append("isActive", String(status === "active"));
      if (imageUrl instanceof File) {
        formData.append("imageUrl", imageUrl);
      } else if (typeof imageUrl === "string" && imageUrl) {
        formData.append("imageUrl", imageUrl);
      }

      await updateService({ id: service.id, formData }).unwrap();

      onSaved?.();
      handleClose(false);
    } catch {
      // handled via mutation state
    }
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
      <div className="space-y-4 font-['Manrope']">
        <CustomInput
          label="Service Name"
          placeholder="e.g Wall Painting"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="space-y-1.5">
          <label className="text-sm font-normal text-slate-600 leading-6">
            Description
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief service description..."
            className="w-full p-2.5 text-xs rounded-lg border border-slate-200 outline-none focus:border-[#0a3558] resize-none"
          />
        </div>

        <CustomSelect
          label="Category"
          placeholder="Select category"
          options={categoryOptions}
          value={categoryId}
          onValueChange={setCategoryId}
        />

        <CustomInput
          label="Commission (%)"
          type="number"
          placeholder="10"
          value={commission}
          onChange={(e) => setCommission(e.target.value)}
        />

        <CustomSelect
          label="Status"
          options={STATUS_OPTIONS}
          value={status}
          onValueChange={setStatus}
        />

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
                  JPG, PNG or WEBP (Max 5MB)
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
            className="w-full flex items-center justify-center gap-2"
            onClick={handleSubmit}
            disabled={isLoading || !name.trim()}
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin text-white" />}
            <span>Save Changes</span>
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  );
}
