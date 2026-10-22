"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Loader2, AlertCircle, RefreshCw, FolderPlus } from "lucide-react";
import CustomButton from "@/components/shared/CustomButton";
import CustomModal from "@/components/shared/CustomModal";
import {
  CareServiceIcon,
  ConstructionIcon,
  EducationIcon,
  HomeServiceIcon,
  InstatalationIcon,
  RemoteIcon,
  RepairIcon,
} from "@/components/SvgIcon/DashboardIcon";
import EditCategory from "./EditCategory";
import { useGetCategoriesQuery } from "@/lib/redux/api/categoryApi";
import { CategoryItem } from "@/types/category.types";

const ICON_MAP: Record<string, React.ReactNode> = {
  home: <HomeServiceIcon />,
  repair: <RepairIcon />,
  installation: <InstatalationIcon />,
  education: <EducationIcon />,
  care: <CareServiceIcon />,
  construction: <ConstructionIcon />,
  remote: <RemoteIcon />,
};

function getCategoryIcon(iconName?: string): React.ReactNode {
  if (iconName && ICON_MAP[iconName.toLowerCase()]) {
    return ICON_MAP[iconName.toLowerCase()];
  }
  return <HomeServiceIcon />;
}

export default function CategoryData() {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null);

  const { data: categories, isLoading, error, refetch } = useGetCategoriesQuery();

  const handleEdit = (category: CategoryItem) => {
    setSelectedCategory(category);
    setOpen(true);
  };

  return (
    <div className="space-y-6 font-['Manrope']">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#103D5C]">Service Categories</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage service categories and view connected services
          </p>
        </div>
      </div>

      {error ? (
        <div className="p-8 text-center bg-white border border-[#E8E8E8] rounded-xl">
          <AlertCircle className="mx-auto h-8 w-8 text-red-500 mb-2" />
          <p className="text-sm font-medium text-slate-800">Failed to load categories</p>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Could not retrieve service categories from the server.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#103D5C] text-white hover:bg-[#0b2b41] transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      ) : isLoading ? (
        <div className="p-16 flex flex-col items-center justify-center gap-3 bg-white border border-[#E8E8E8] rounded-xl">
          <Loader2 className="h-7 w-7 text-[#103D5C] animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Loading categories...</p>
        </div>
      ) : !categories || categories.length === 0 ? (
        <div className="p-16 text-center bg-white border border-[#E8E8E8] rounded-xl">
          <FolderPlus className="mx-auto h-10 w-10 text-slate-300 mb-2" />
          <p className="text-sm font-semibold text-slate-800">No categories found</p>
          <p className="text-xs text-slate-500 mt-1">No service categories are created yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((item) => {
            const servicesCount = item.servicesCount ?? item._count?.services ?? 0;
            const jobsCount = item.jobsCount ?? item._count?.jobs ?? 0;

            return (
              <div
                key={item.id}
                className="rounded-xl border border-[#E8E8E8] bg-white p-4 flex flex-col justify-between"
              >
                <div className="flex gap-3">
                  <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full bg-[#F3F4F6]">
                    {getCategoryIcon(item.icon)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="text-[18px] font-medium leading-[132%] text-[#103D5C]">
                      {item.name}
                    </h2>

                    <p className="mt-1 text-[14px] font-normal leading-[160%] text-[#5A5A5A] line-clamp-2">
                      {item.description || "Household support and day-to-day services."}
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-[12px] font-normal leading-[124%] text-[#747475]">
                        {servicesCount} {servicesCount === 1 ? "service" : "services"}
                      </span>

                      <div className="h-1 w-1 rounded-full bg-[#747475]" />

                      <span className="text-[12px] font-normal leading-[124%] text-[#747475]">
                        {jobsCount} {jobsCount === 1 ? "job" : "jobs"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex w-full gap-4">
                  <Link
                    href={`/dashboard/services?categoryId=${item.id}`}
                    className="w-full flex items-center justify-center rounded-md border border-[#103D5C] px-4 py-1.5 text-[14px] font-medium leading-[116%] text-[#103D5C] hover:bg-slate-50 transition-colors"
                  >
                    View Services
                  </Link>

                  <CustomButton
                    type="button"
                    size="sm"
                    className="w-full h-full"
                    onClick={() => handleEdit(item)}
                  >
                    Edit Category
                  </CustomButton>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CustomModal
        size="sm"
        open={open}
        onOpenChange={setOpen}
        title="Edit Category"
        description="Change name, description or icon as per your preferences"
      >
        <EditCategory
          category={selectedCategory}
          onClose={() => setOpen(false)}
        />
      </CustomModal>
    </div>
  );
}
