"use client";
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
import { House } from "lucide-react";
import React, { useState } from "react";
import EditCategory from "./EditCategory";

type CategoryDataType = {
  icon: React.ReactNode;
  title: string;
  description: string;
  service: string;
  job: string;
};

export default function CategoryData() {
  const [open, setOpen] = useState(false);
  const [selectId, setSelectId] = useState<number | string | null>(null);
  const categoryData: CategoryDataType[] = [
    {
      icon: <HomeServiceIcon />,
      title: "Home Services",
      description:
        "Household support, cleaning, and day-to-day maintenance services",
      service: "5 services",
      job: "12 jobs",
    },
    {
      icon: <RepairIcon />,
      title: "Repair & Diagnostic",
      description:
        "Repair, troubleshooting, and technical maintenance services",
      service: "5 services",
      job: "12 jobs",
    },
    {
      icon: <EducationIcon />,
      title: "Education & Tutoring",
      description: "Academic, professional, and skill-based learning services",
      service: "5 services",
      job: "12 jobs",
    },
    {
      icon: <InstatalationIcon />,
      title: "Installation",
      description:
        "Equipment, systems, and infrastructure installation servicess",
      service: "5 services",
      job: "12 jobs",
    },
    {
      icon: <CareServiceIcon />,
      title: "Care Services",
      description: "Personal care and assisted living support services",
      service: "5 services",
      job: "12 jobs",
    },
    {
      icon: <ConstructionIcon />,
      title: "Construction & Property",
      description:
        "Property improvement, renovation, and construction-related services",
      service: "5 services",
      job: "12 jobs",
    },
    {
      icon: <RemoteIcon />,
      title: "Remote Development",
      description: "Remote software, web, and mobile development services",
      service: "5 services",
      job: "12 jobs",
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {categoryData.map((item, index) => (
          <div
            key={index}
            className="rounded-xl border border-[#E8E8E8] bg-white p-4"
          >
            <div className="flex gap-3">
              <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full bg-[#F3F4F6]">
                {item.icon}
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-[18px] font-medium leading-[132%] text-[#103D5C]">
                  {item.title}
                </h2>

                <p className="mt-1 text-[14px] font-normal leading-[160%] text-[#5A5A5A]">
                  {item.description}
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[12px] font-normal leading-[124%] text-[#747475]">
                    {item.service}
                  </span>

                  <div className="h-1 w-1 rounded-full bg-[#747475]" />

                  <span className="text-[12px] font-normal leading-[124%] text-[#747475]">
                    {item.job}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex w-full   gap-4">
              <button className="w-full rounded-md border border-[#103D5C] px-4 py-1.5 text-[14px] font-medium leading-[116%] text-[#103D5C]">
                View Services
              </button>

              <CustomButton
                type="button"
                size="sm"
                className="w-full h-full"
                onClick={() => {
                  setOpen(true);
                  setSelectId(index);
                }}
              >
                Edit Category
              </CustomButton>
            </div>
          </div>
        ))}
      </div>
      <div>
        <CustomModal
          size="sm"
          open={open}
          onOpenChange={setOpen}
          title="Edit Category"
          description="Change name or icon as per your preferences"
        >
          <EditCategory
            category={categoryData}
            selectedId={selectId}
            onClose={() => setOpen(false)}
          />
        </CustomModal>
      </div>
    </div>
  );
}
