"use client";

import React, { useState } from "react";
import { Column, DataTable } from "../../shared/DataTable";
import TableToolbar from "../../shared/TableToolbar";
import CustomButton from "@/components/shared/CustomButton";
import CustomModal from "@/components/shared/CustomModal";
import EditIcon from "@/components/Icons/EditIcon";
import DeleteIcon from "@/components/Icons/DeleteIcon";
import CreateNewAnnounceMent, {
  AnounceMentFormData,
} from "./ContentManagementAllModal/CreateNewAnnounceMent";
import EditAnnouncement from "./ContentManagementAllModal/EditAnnouncemnt";
import DeleteAnnouncement from "./ContentManagementAllModal/DeleteAnnouncement";
import { PlusIcon } from "lucide-react";

export interface UserRecord {
  id: string;
  title: string;
  description: string;
  audience: string;
  status: string;
  published: string;
}

export type AnnouncementRecord = UserRecord;

const sampleAnnouncements: UserRecord[] = [
  {
    id: "1",
    title: "How do I hire an expert?",
    description:
      "Search or post a job, review the quotes you receive, then accept the expert that fits you needs and pay securely in-app.",
    audience: "All",
    status: "Draft",
    published: "Jul 27, 2026",
  },
  {
    id: "2",
    title: "When is my payment released?",
    description:
      "Payments are held securely and only released to the expert once you confirm the job is complete.",
    audience: "Clients",
    status: "Live",
    published: "Jul 27, 2026",
  },
  {
    id: "3",
    title: "Can I get a refund?",
    description:
      "Yes. If a job is cancelled or not completed as agreed, your funds will be refunded.",
    audience: "Experts",
    status: "Live",
    published: "Jul 27, 2026",
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

export function AnnouncementsTab() {
  const [announcements, setAnnouncements] =
    useState<UserRecord[]>(sampleAnnouncements);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<AnounceMentFormData | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] =
    useState<UserRecord | null>(null);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredAnnouncements.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Add announcement handler
  const handleAddAnnouncement = (data: AnounceMentFormData) => {
    const newAnnouncement: UserRecord = {
      id: String(Date.now()),
      title: data.title,
      description: data.description,
      audience: data.audience || "All",
      status: data.status,
      published: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    };
    setAnnouncements((prev) => [newAnnouncement, ...prev]);
    setIsAddModalOpen(false);
  };

  // Edit announcement handler
  const handleEditAnnouncement = (data: AnounceMentFormData) => {
    if (data.id) {
      setAnnouncements((prev) =>
        prev.map((item) =>
          item.id === data.id
            ? {
                ...item,
                title: data.title,
                description: data.description,
                audience: data.audience || item.audience || "All",
                status: data.status,
              }
            : item
        )
      );
    }
    setIsEditModalOpen(false);
    setSelectedAnnouncement(null);
  };

  // Delete announcement handler
  const handleDeleteConfirm = () => {
    if (announcementToDelete) {
      setAnnouncements((prev) =>
        prev.filter((item) => item.id !== announcementToDelete.id)
      );
      setSelectedIds((prev) =>
        prev.filter((id) => id !== announcementToDelete.id)
      );
      setAnnouncementToDelete(null);
    }
    setIsDeleteModalOpen(false);
  };

  // Filtered announcements
  const filteredAnnouncements = announcements.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAudience =
      !roleFilter || item.audience.toLowerCase() === roleFilter.toLowerCase();

    const matchesStatus =
      !statusFilter || item.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesAudience && matchesStatus;
  });

  const columns: Column<UserRecord>[] = [
    {
      key: "checkbox",
      header: (
        <div className="flex items-center gap-2 min-w-70">
          <input
            type="checkbox"
            checked={
              selectedIds.length === filteredAnnouncements.length &&
              filteredAnnouncements.length > 0
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
      header: "Description",
      className: "min-w-[140px]",
      cell: (item) => (
        <span className="overflow-hidden text-[#5A5A5A] text-ellipsis text-[12px] font-medium leading-[160%]">
          {item.description}
        </span>
      ),
    },
    {
      key: "audience",
      header: "Audience",
      className: "min-w-[140px]",
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
      key: "published",
      header: "Published Date",
      className: "min-w-[140px]",
      cell: (item) => (
        <span className="overflow-hidden text-[#5A5A5A] text-ellipsis text-[12px] font-medium leading-[160%]">
          {item.published}
        </span>
      ),
    },
    {
      key: "action",
      header: "Action",
      className: "w-24 min-w-[96px] text-center",
      cell: (item) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setSelectedAnnouncement({
                id: item.id,
                title: item.title,
                description: item.description,
                audience: item.audience,
                status: item.status,
              });
              setIsEditModalOpen(true);
            }}
            className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800"
            title="Edit Announcement"
          >
            <EditIcon />
          </button>
          <button
            type="button"
            onClick={() => {
              setAnnouncementToDelete(item);
              setIsDeleteModalOpen(true);
            }}
            className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
            title="Delete Announcement"
          >
            <DeleteIcon />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
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
              onClick={() => setIsAddModalOpen(true)}
            >
              Create New Announcement
            </CustomButton>
          }
        />

        {/* Main Data Table */}
        <div className="border-x border-b border-[#E8E8E8] rounded-b-xl overflow-hidden bg-white">
          <DataTable
            columns={columns}
            data={filteredAnnouncements}
            pagination={true}
          />
        </div>

        {/* 1. Add Announcement Modal */}
        <CustomModal
          showCloseButton={false}
          size="xsm"
          open={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
        >
          <CreateNewAnnounceMent
            onCancel={() => setIsAddModalOpen(false)}
            onSubmit={handleAddAnnouncement}
          />
        </CustomModal>

        {/* 2. Edit Announcement Modal */}
        <CustomModal
          showCloseButton={false}
          size="xsm"
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
        >
          <EditAnnouncement
            initialData={selectedAnnouncement}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedAnnouncement(null);
            }}
            onSubmit={handleEditAnnouncement}
          />
        </CustomModal>

        {/* 3. Delete Announcement Modal */}
        <CustomModal
          showCloseButton={false}
          size="xsm"
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
        >
          <DeleteAnnouncement
            onCancel={() => {
              setIsDeleteModalOpen(false);
              setAnnouncementToDelete(null);
            }}
            onConfirm={handleDeleteConfirm}
          />
        </CustomModal>
      </div>
    </div>
  );
}

export default AnnouncementsTab;

