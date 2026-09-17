"use client";

import React, { useState } from "react";
import { Column, DataTable } from "../../shared/DataTable";
import TableToolbar from "../../shared/TableToolbar";
import { Eye } from "lucide-react";
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

export interface UserRecord {
  id: string;
  title: string;
  description: string;
  audience: string;
  status: string;
  startDate: string;
  endDate: string;
}

export type BannerRecord = UserRecord;

const sampleBanners: UserRecord[] = [
  {
    id: "1",
    title: "Trusted Experts Near You",
    description: "Hire verified experts for every service in minutes.",
    audience: "Clients",
    status: "Live",
    startDate: "Jul 27, 2026",
    endDate: "Aug 30, 2026",
  },
  {
    id: "2",
    title: "Fast-Track Project Delivery with Escrow",
    description:
      "Secure payment protection and milestone verification built for high-stakes projects.",
    audience: "All",
    status: "Live",
    startDate: "Jul 27, 2026",
    endDate: "Aug 30, 2026",
  },
  {
    id: "3",
    title: "Special Autumn Referral Discount 2026",
    description: "Earn 5% platform cashback when you invite business partners.",
    audience: "Experts",
    status: "Draft",
    startDate: "Jul 27, 2026",
    endDate: "Aug 30, 2026",
  },
];

const StatusBadge = ({ status }: { status: string }) => {
  const config = {
    Live: {
      bg: "bg-sky-50",
      border: "outline-sky-200",
      text: "text-[#0777F6]",
      dot: "bg-[#0777F6]",
    },
    Draft: {
      bg: "bg-[#FEF4DC]",
      border: "outline-[#F8B500]",
      text: "text-[#F8B500]",
      dot: "bg-[#F8B500]",
    },
    Suspended: {
      bg: "bg-rose-50",
      border: "outline-rose-200",
      text: "text-rose-600",
      dot: "bg-rose-500",
    },
  }[status] ?? {
    bg: "bg-slate-50",
    border: "outline-slate-200",
    text: "text-slate-600",
    dot: "bg-slate-400",
  };

  return (
    <div
      className={`inline-flex h-5 items-center gap-1 rounded-sm px-2 py-0.5 outline outline-1 outline-offset-[-1px] ${config.bg} ${config.border}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      <span
        className={`font-['Manrope'] text-xs font-medium leading-4 ${config.text}`}
      >
        {status}
      </span>
    </div>
  );
};

export function HomePageBannerTab() {
  const [banners, setBanners] = useState<UserRecord[]>(sampleBanners);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedBanner, setSelectedBanner] = useState<BannerFormData | null>(
    null,
  );
  const [bannerToDelete, setBannerToDelete] = useState<UserRecord | null>(null);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredBanners.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  // Add new banner
  const handleAddBanner = (formData: BannerFormData) => {
    const newBanner: UserRecord = {
      id: String(Date.now()),
      title: formData.title,
      description: formData.subtitle,
      audience: formData.audience,
      status: formData.status,
      startDate: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      endDate: "Aug 30, 2026",
    };
    setBanners((prev) => [newBanner, ...prev]);
    setIsAddModalOpen(false);
    setSelectedBanner(null);
  };

  // Edit banner
  const handleEditBanner = (formData: BannerFormData) => {
    if (formData.id) {
      setBanners((prev) =>
        prev.map((item) =>
          item.id === formData.id
            ? {
                ...item,
                title: formData.title,
                description: formData.subtitle,
                audience: formData.audience,
                status: formData.status,
              }
            : item,
        ),
      );
    }
    setIsEditModalOpen(false);
    setSelectedBanner(null);
  };

  // Delete banner
  const handleDeleteConfirm = () => {
    if (bannerToDelete) {
      setBanners((prev) => prev.filter((b) => b.id !== bannerToDelete.id));
      setSelectedIds((prev) => prev.filter((id) => id !== bannerToDelete.id));
      setBannerToDelete(null);
    }
    setIsDeleteModalOpen(false);
  };

  const filteredBanners = banners.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAudience =
      !roleFilter || b.audience.toLowerCase() === roleFilter.toLowerCase();

    const matchesStatus =
      !statusFilter || b.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesAudience && matchesStatus;
  });

  const columns: Column<UserRecord>[] = [
    {
      key: "title",
      header: "Title",
      className: "min-w-[140px]",
      cell: (item) => (
        <span className="overflow-hidden text-[#103D5C] font-medium text-ellipsis text-[13px] leading-[160%]">
          {item.title}
        </span>
      ),
    },
    {
      key: "description",
      header: "Subtitle",
      className: "min-w-[160px]",
      cell: (item) => (
        <span className="overflow-hidden text-[#5A5A5A] text-ellipsis text-[12px] font-medium leading-[160%] line-clamp-1">
          {item.description}
        </span>
      ),
    },
    {
      key: "audience",
      header: "Audience",
      className: "min-w-[120px]",
      cell: (item) => (
        <span className="overflow-hidden text-[#5A5A5A] text-ellipsis text-[12px] font-medium leading-[160%]">
          {item.audience}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      className: "min-w-[120px]",
      cell: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: "startDate",
      header: "Start Date",
      className: "min-w-[120px]",
      cell: (item) => (
        <span className="overflow-hidden text-[#5A5A5A] text-ellipsis text-[12px] font-medium leading-[160%]">
          {item.startDate}
        </span>
      ),
    },
    {
      key: "endDate",
      header: "End Date",
      className: "min-w-[120px]",
      cell: (item) => (
        <span className="overflow-hidden text-[#5A5A5A] text-ellipsis text-[12px] font-medium leading-[160%]">
          {item.endDate}
        </span>
      ),
    },
    {
      key: "action",
      header: "Action",
      className: "w-28 min-w-[110px] text-center",
      cell: (item) => (
        <div className="flex items-center gap-1.5 justify-center">
          {/* Preview Button */}
          <button
            type="button"
            onClick={() => {
              setSelectedBanner({
                id: item.id,
                title: item.title,
                subtitle: item.description,
                ctaText: "Explore Experts",
                ctaLink: "#",
                audience: item.audience,
                status: item.status,
              });
              setIsPreviewModalOpen(true);
            }}
            className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800"
            title="Preview Banner"
          >
            <Eye className="h-4 w-4" />
          </button>

          {/* Edit Button */}
          <button
            type="button"
            onClick={() => {
              setSelectedBanner({
                id: item.id,
                title: item.title,
                subtitle: item.description,
                ctaText: "Explore Experts",
                ctaLink: "#",
                audience: item.audience,
                status: item.status,
              });
              setIsEditModalOpen(true);
            }}
            className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800"
            title="Edit Banner"
          >
            <EditIcon />
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={() => {
              setBannerToDelete(item);
              setIsDeleteModalOpen(true);
            }}
            className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
            title="Delete Banner"
          >
            <DeleteIcon />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full font-['Manrope']">
      {/* Top Toolbar with Search and Dropdown Filters */}
      <TableToolbar
        searchQuery={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        dropdownFilters={[
          {
            placeholder: "All Audience",
            value: roleFilter,
            options: [
              { label: "All Audience", value: "" },
              { label: "Clients", value: "clients" },
              { label: "Experts", value: "experts" },
            ],
            onChange: (val) => setRoleFilter(val),
          },
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
        ]}
        actionButton={
          <CustomButton
            size="md"
            leadingIcon={<PlusIcon />}
            onClick={() => {
              setSelectedBanner(null);
              setIsAddModalOpen(true);
            }}
          >
            Add Banner
          </CustomButton>
        }
      />

      {/* Main Data Table */}
      <div className="border-x border-b border-[#E8E8E8] rounded-b-xl overflow-hidden bg-white">
        <DataTable columns={columns} data={filteredBanners} pagination={true} />
      </div>

      {/* 1. Add Banner CustomModal */}
      <CustomModal
        showCloseButton={false}
        size="lg"
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
      >
        <AddBanner
          onCancel={() => {
            setIsAddModalOpen(false);
            setSelectedBanner(null);
          }}
          onSubmit={handleAddBanner}
        />
      </CustomModal>

      {/* 2. Edit Banner CustomModal */}
      <CustomModal
        showCloseButton={false}
        size="lg"
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
      >
        <EditBanner
          initialData={selectedBanner}
          onCancel={() => {
            setIsEditModalOpen(false);
            setSelectedBanner(null);
          }}
          onSubmit={handleEditBanner}
        />
      </CustomModal>

      {/* 3. Preview Banner CustomModal */}
      <CustomModal
        showCloseButton={false}
        size="xsm"
        open={isPreviewModalOpen}
        onOpenChange={setIsPreviewModalOpen}
      >
        <PreviewBanner
          banner={selectedBanner}
          onClose={() => {
            setIsPreviewModalOpen(false);
            setSelectedBanner(null);
          }}
        />
      </CustomModal>

      {/* 4. Delete Confirmation CustomModal */}
      <CustomModal
        showCloseButton={false}
        size="xsm"
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
      >
        <DeleteAnnouncement
          onCancel={() => {
            setIsDeleteModalOpen(false);
            setBannerToDelete(null);
          }}
          onConfirm={handleDeleteConfirm}
        />
      </CustomModal>
    </div>
  );
}

export default HomePageBannerTab;

const PlusIcon = () => {
  return (
    <svg
      width="9"
      height="9"
      viewBox="0 0 9 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 0.5C5 0.223858 4.77614 0 4.5 0C4.22386 0 4 0.223858 4 0.5V4H0.5C0.223857 4 0 4.22386 0 4.5C0 4.77614 0.223857 5 0.5 5H4V8.5C4 8.77614 4.22386 9 4.5 9C4.77614 9 5 8.77614 5 8.5V5H8.5C8.77614 5 9 4.77614 9 4.5C9 4.22386 8.77614 4 8.5 4H5V0.5Z"
        fill="white"
      />
    </svg>
  );
};
