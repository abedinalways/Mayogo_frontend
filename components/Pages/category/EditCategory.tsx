"use client";

import React, { useState } from "react";
import CustomInput from "@/components/Reuasable/CustomInput";
import { Check, Loader2 } from "lucide-react";
import CustomButton from "@/components/shared/CustomButton";
import { CategoryItem } from "@/types/category.types";
import { useUpdateCategoryMutation } from "@/lib/redux/api/categoryApi";
import {
  HomeServiceIcon,
  RepairIcon,
  InstatalationIcon,
  EducationIcon,
  CareServiceIcon,
  ConstructionIcon,
  RemoteIcon,
} from "@/components/SvgIcon/DashboardIcon";

const AVAILABLE_ICONS = [
  { name: "home", icon: <HomeServiceIcon /> },
  { name: "repair", icon: <RepairIcon /> },
  { name: "installation", icon: <InstatalationIcon /> },
  { name: "education", icon: <EducationIcon /> },
  { name: "care", icon: <CareServiceIcon /> },
  { name: "construction", icon: <ConstructionIcon /> },
  { name: "remote", icon: <RemoteIcon /> },
];

export default function EditCategory({
  category,
  onClose,
}: {
  category: CategoryItem | null;
  onClose?: () => void;
}) {
  const [name, setName] = useState(category?.name || "");
  const [description, setDescription] = useState(category?.description || "");
  const [selectedIcon, setSelectedIcon] = useState(category?.icon || "home");

  const [updateCategory, { isLoading }] = useUpdateCategoryMutation();

  React.useEffect(() => {
    if (category) {
      setName(category.name || "");
      setDescription(category.description || "");
      setSelectedIcon(category.icon || "home");
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !name.trim()) return;

    try {
      await updateCategory({
        id: category.id,
        name: name.trim(),
        description: description.trim() || undefined,
        icon: selectedIcon,
      }).unwrap();
      onClose?.();
    } catch {
      // handled via mutation
    }
  };

  return (
    <form onSubmit={handleSubmit} className="font-['Manrope']">
      <hr className="w-full h-[1px] bg-[#E8E8E8]" />

      <div className="mt-4 space-y-4">
        <CustomInput
          label="Name"
          placeholder="e.g Home & Property"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-11"
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#103D5C]">Description</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Household support, cleaning..."
            className="w-full p-2.5 text-xs rounded-lg border border-slate-200 outline-none focus:border-[#103D5C] resize-none"
          />
        </div>

        <div>
          <p className="text-[16px] font-medium leading-[160%] text-[#103D5C]">
            Select Icon
          </p>
          <div className="mt-2 grid grid-cols-4 lg:grid-cols-5 gap-3">
            {AVAILABLE_ICONS.map((item, index) => {
              const isSelected = selectedIcon === item.name;

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedIcon(item.name)}
                  className={`relative flex h-12 w-12 items-center justify-center rounded-full border bg-white cursor-pointer transition-all ${
                    isSelected ? "border-[#F5B517] shadow-sm" : "border-[#E8E8E8]"
                  }`}
                >
                  {item.icon}

                  {isSelected && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#F5B517]">
                      <Check size={12} strokeWidth={3} className="text-white" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex w-full gap-4">
          <CustomButton
            type="button"
            variant="tertiary"
            className="w-full h-11"
            onClick={onClose}
          >
            Cancel
          </CustomButton>

          <CustomButton
            type="submit"
            size="sm"
            disabled={isLoading || !name.trim()}
            className="w-full h-11 flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin text-white" />}
            <span>Save Changes</span>
          </CustomButton>
        </div>
      </div>
    </form>
  );
}
