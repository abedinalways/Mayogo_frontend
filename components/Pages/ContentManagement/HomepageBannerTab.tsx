"use client";

import React, { useState } from "react";
import { Column, DataTable } from "../../shared/DataTable";
import TableToolbar from "../../shared/TableToolbar";
import { Eye, PlusIcon, Loader2 } from "lucide-react";
import CustomButton from "@/components/shared/CustomButton";
import CustomModal from "@/components/shared/CustomModal";
import EditIcon from "@/components/Icons/EditIcon";
import DeleteIcon from "@/components/Icons/DeleteIcon";
import AddBanner, {
  BannerFormData,
} from "./ContentManagementAllModal/AddBanner";
import EditBanner from "./ContentManagementAllModal/EditBanner";
import PreviewBanner from "./ContentManagementAllModal/PreviewBanner";
import DeleteAnnouncement from "./ContentManagementAllModal/DeleteAnnouncement";
import {
  useGetBannersQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} from "@/lib/redux/api/contentApi";
import { BannerItem } from "@/types/content.types";

export interface BannerRecord {
  id: string;
  title: string;
  description: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  imageUrl?: string;
  audience: string;
  status: string;
  startDate: string;
  endDate: string;
}

const StatusBadge = ({ status }: { status: string }) => {
  const isLive = status.toLowerCase() === "live";
  const config = isLive
    ? {
        bg: "bg-sky-50",
        border: "outline-sky-200",
        text: "text-[#0777F6]",
        dot: "bg-[#0777F6]",
      }
    : {
        bg: "bg-[#FEF4DC]",
        border: "outline-[#F8B500]",
        text: "text-[#F8B500]",
        dot: "bg-[#F8B500]",
      };

  return (
    <div
      className={`inline-flex h-5 items-center gap-1 rounded-sm px-2 py-0.5 outline outline-1 outline-offset-[-1px] ${config.bg} ${config.border}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      <span
        className={`font-['Manrope'] text-xs font-medium leading-4 ${config.text}`}
      >
        {isLive ? "Live" : "Draft"}
      </span>
    </div>
  );
};

export function HomepageBannerTab() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [audienceFilter, setAudienceFilter] = useState("");

  const {
    data: rawBanners = [],
    isLoading,
    isFetching,
  } = useGetBannersQuery({
    search: searchTerm || undefined,
    status: statusFilter ? statusFilter.toUpperCase() : undefined,
    audience: audienceFilter ? audienceFilter.toUpperCase() : undefined,
  });

  const [createBanner] = useCreateBannerMutation();
  const [updateBanner] = useUpdateBannerMutation();
  const [deleteBanner, { isLoading: isDeleting }] = useDeleteBannerMutation();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<BannerFormData | null>(
    null
  );

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<BannerRecord | null>(
    null
  );

  const banners: BannerRecord[] = rawBanners.map((item: BannerItem) => {
    let aud = "All";
    if (item.audience?.toUpperCase() === "CLIENTS") aud = "Clients";
    if (item.audience?.toUpperCase() === "EXPERTS") aud = "Experts";

    return {
      id: item.id,
      title: item.title,
      description: item.subtitle || "No subtitle provided",
      subtitle: item.subtitle,
      ctaText: item.ctaText,
      ctaLink: item.ctaLink,
      imageUrl: item.imageUrl,
      audience: aud,
      status: item.status?.toUpperCase() === "LIVE" ? "Live" : "Draft",
      startDate: item.createdAt
        ? new Date(item.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })
        : "N/A",
      endDate: item.updatedAt
        ? new Date(item.updatedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })
        : "Active",
    };
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(banners.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCreateBanner = async (data: BannerFormData) => {
    try {
      const payloadAudience =
        data.audience?.toUpperCase() === "EXPERTS"
          ? "EXPERTS"
          : data.audience?.toUpperCase() === "CLIENTS"
          ? "CLIENTS"
          : "ALL";

      const payloadStatus =
        data.status.toLowerCase() === "live" ? "LIVE" : "DRAFT";

      await createBanner({
        title: data.title,
        subtitle: data.subtitle,
        ctaText: data.ctaText,
        ctaLink: data.ctaLink,
        imageUrl: data.image,
        audience: payloadAudience,
        status: payloadStatus,
      }).unwrap();

      setIsAddModalOpen(false);
    } catch {
      // Handled by mutation
    }
  };

  const handleUpdateBanner = async (data: BannerFormData) => {
    if (!data.id) return;
    try {
      const payloadAudience =
        data.audience?.toUpperCase() === "EXPERTS"
          ? "EXPERTS"
          : data.audience?.toUpperCase() === "CLIENTS"
          ? "CLIENTS"
          : "ALL";

      const payloadStatus =
        data.status.toLowerCase() === "live" ? "LIVE" : "DRAFT";

      await updateBanner({
        bannerId: data.id,
        title: data.title,
        subtitle: data.subtitle,
        ctaText: data.ctaText,
        ctaLink: data.ctaLink,
        imageUrl: data.image,
        audience: payloadAudience,
        status: payloadStatus,
      }).unwrap();

      setIsEditModalOpen(false);
      setSelectedBanner(null);
    } catch {
      // Handled by mutation
    }
  };

  const handleConfirmDelete = async () => {
    if (bannerToDelete) {
      try {
        await deleteBanner(bannerToDelete.id).unwrap();
        setSelectedIds((prev) =>
          prev.filter((id) => id !== bannerToDelete.id)
        );
        setBannerToDelete(null);
        setIsDeleteModalOpen(false);
      } catch {
        setIsDeleteModalOpen(false);
      }
    }
  };

  const columns: Column<BannerRecord>[] = [
    {
      key: "checkbox",
      header: (
        <div className="flex items-center gap-2 min-w-70">
          <input
            type="checkbox"
            checked={
              selectedIds.length === banners.length && banners.length > 0
            }
            onChange={handleSelectAll}
            className="h-4 w-4 cursor-pointer rounded border-slate-300 text-[#0a3558] focus:ring-0"
          />
          <span className="text-xs font-medium text-slate-600">Title</span>
        </div>
      ),
      className: "w-12 pl-6 pr-2",
      cell: (item) => (
        <div className="flex items-center gap-2 min-w-70">
          <input
            type="checkbox"
            checked={selectedIds.includes(item.id)}
            onChange={() => handleSelectRow(item.id)}
            className="h-4 w-4 cursor-pointer rounded border-slate-300 text-[#0a3558] focus:ring-0"
          />
          <span className="text-[#103D5C] text-[14px] font-normal leading-[22.4px]">
            {item.title}
          </span>
        </div>
      ),
    },
    {
      key: "description",
      header: "Description / Subtitle",
      className: "min-w-[280px]",
      cell: (item) => (
        <span className="text-[#475569] text-xs font-normal leading-[19.2px] line-clamp-2">
          {item.description}
        </span>
      ),
    },
    {
      key: "audience",
      header: "Target Audience",
      className: "min-w-[140px]",
      cell: (item) => (
        <span className="text-xs font-medium text-slate-600">
          {item.audience}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      className: "min-w-[100px]",
      cell: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: "startDate",
      header: "Start Date",
      className: "min-w-[120px]",
      cell: (item) => (
        <span className="text-xs font-medium text-slate-600 whitespace-nowrap">
          {item.startDate}
        </span>
      ),
    },
    {
      key: "action",
      header: "Action",
      className: "w-24 min-w-[96px] text-center",
      cell: (item) => (
        <div className="flex items-center gap-2 justify-center">
          <button
            onClick={() => {
              setSelectedBanner({
                id: item.id,
                title: item.title,
                subtitle: item.subtitle || "",
                ctaText: item.ctaText || "Explore",
                ctaLink: item.ctaLink || "#",
                audience: item.audience,
                status: item.status,
                image: item.imageUrl,
              });
              setIsPreviewModalOpen(true);
            }}
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800"
            aria-label="Preview banner"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setSelectedBanner({
                id: item.id,
                title: item.title,
                subtitle: item.subtitle || "",
                ctaText: item.ctaText || "",
                ctaLink: item.ctaLink || "",
                audience: item.audience,
                status: item.status,
                image: item.imageUrl,
              });
              setIsEditModalOpen(true);
            }}
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800"
            aria-label="Edit banner"
          >
            <EditIcon />
          </button>
          <button
            onClick={() => {
              setBannerToDelete(item);
              setIsDeleteModalOpen(true);
            }}
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
            aria-label="Delete banner"
          >
            <DeleteIcon />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <TableToolbar
        searchQuery={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        dropdownFilters={[
          {
            placeholder: "All Status",
            value: statusFilter,
            options: [
              { label: "All Status", value: "" },
              { label: "Live", value: "live" },
              { label: "Draft", value: "draft" },
            ],
            onChange: (val) => setStatusFilter(val),
          },
          {
            placeholder: "All Audience",
            value: audienceFilter,
            options: [
              { label: "All Audience", value: "" },
              { label: "All Users", value: "all" },
              { label: "Clients", value: "clients" },
              { label: "Experts", value: "experts" },
            ],
            onChange: (val) => setAudienceFilter(val),
          },
        ]}
        onSortClick={() => {}}
        actionButton={
          <CustomButton
            onClick={() => setIsAddModalOpen(true)}
            size="md"
            leadingIcon={<PlusIcon className="w-4 h-4" />}
          >
            Add Banner
          </CustomButton>
        }
      />

      <div className="border-x border-b border-[#E8E8E8] rounded-b-xl overflow-hidden bg-white">
        {isLoading || isFetching ? (
          <div className="flex items-center justify-center p-16">
            <Loader2 className="h-6 w-6 animate-spin text-[#0f3453]" />
          </div>
        ) : banners.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <p className="text-base font-semibold text-slate-700">
              No banners found
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Add your first homepage banner to showcase promotions.
            </p>
          </div>
        ) : (
          <DataTable columns={columns} data={banners} pagination={true} />
        )}
      </div>

      <CustomModal
        showCloseButton={false}
        size="xsm"
        open={isAddModalOpen}
        onOpenChange={() => setIsAddModalOpen(false)}
      >
        <AddBanner
          onCancel={() => setIsAddModalOpen(false)}
          onSubmit={handleCreateBanner}
        />
      </CustomModal>

      <CustomModal
        showCloseButton={false}
        size="xsm"
        open={isEditModalOpen}
        onOpenChange={() => {
          setIsEditModalOpen(false);
          setSelectedBanner(null);
        }}
      >
        <EditBanner
          initialData={selectedBanner}
          onCancel={() => {
            setIsEditModalOpen(false);
            setSelectedBanner(null);
          }}
          onSubmit={handleUpdateBanner}
        />
      </CustomModal>

      <CustomModal
        showCloseButton={false}
        size="xsm"
        open={isPreviewModalOpen}
        onOpenChange={() => {
          setIsPreviewModalOpen(false);
          setSelectedBanner(null);
        }}
      >
        <PreviewBanner
          banner={
            selectedBanner
              ? {
                  title: selectedBanner.title,
                  subtitle: selectedBanner.subtitle,
                  ctaText: selectedBanner.ctaText,
                  image: selectedBanner.image,
                }
              : null
          }
          onClose={() => {
            setIsPreviewModalOpen(false);
            setSelectedBanner(null);
          }}
        />
      </CustomModal>

      <CustomModal
        showCloseButton={false}
        size="xsm"
        open={isDeleteModalOpen}
        onOpenChange={() => setIsDeleteModalOpen(false)}
      >
        <DeleteAnnouncement
          onCancel={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
        />
      </CustomModal>
    </div>
  );
}

export default HomepageBannerTab;
