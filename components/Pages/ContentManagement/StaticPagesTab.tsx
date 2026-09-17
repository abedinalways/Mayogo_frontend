"use client";

import React, { useState } from "react";
import { Column, DataTable } from "../../shared/DataTable";
import { Tooltip } from "react-tooltip";
import TableToolbar from "../../shared/TableToolbar";
import { Edit2, Eye, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import CustomButton from "@/components/shared/CustomButton";
import CustomModal from "@/components/shared/CustomModal";
import EditIcon from "@/components/Icons/EditIcon";
import DeleteIcon from "@/components/Icons/DeleteIcon";
import EditStaticContent, {
  StaticContentFormData,
} from "./ContentManagementAllModal/EditStaticContent";
import PreviewStaticContent from "./ContentManagementAllModal/PreviewStaticContent";

export interface UserRecord {
  id: string;
  title: string;
  description: string;
  audience: string;
  status: string;
  updateBy: string;
}

const sampleStaticPages: UserRecord[] = [
  {
    id: "1",
    title: "Nepotech Terms & Conditions",
    description:
      "Terms and legal agreements for customers & service providers.",
    audience: "Jul 27, 2026",
    status: "Live",
    updateBy: "Super Admin",
  },
  {
    id: "2",
    title: "Privacy Policy",
    description:
      "Information about data collection, storage and user privacy rights.",
    audience: "Jul 27, 2026",
    status: "Live",
    updateBy: "Super Admin",
  },
  {
    id: "3",
    title: "Community Guidelines",
    description:
      "Rules and code of conduct for users and service providers on the platform.",
    audience: "Jul 25, 2026",
    status: "Draft",
    updateBy: "Super Admin",
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

export function StaticPagesTab() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [pages, setPages] = useState<UserRecord[]>(sampleStaticPages);
  const [selectedPage, setSelectedPage] = useState<UserRecord | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(pages.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSavePage = (formData: StaticContentFormData) => {
    if (formData.id) {
      setPages((prev) =>
        prev.map((item) =>
          item.id === formData.id
            ? {
                ...item,
                title: formData.title,
                status: formData.status,
              }
            : item,
        ),
      );
    }
    setIsEditModalOpen(false);
    setSelectedPage(null);
  };

  const columns: Column<UserRecord>[] = [
    {
      key: "title",
      header: "Title",
      className: "min-w-[140px]",
      cell: (item) => (
        <span className="overflow-hidden text-[#5A5A5A] text-ellipsis text-[12px] font-medium leading-[160%]">
          {item.title}
        </span>
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
      key: "createdDate",
      header: "Last Updated",
      className: "min-w-[140px]",
      cell: (item) => (
        <span className="overflow-hidden text-[#5A5A5A] text-ellipsis text-[12px] font-medium leading-[160%]">
          {item.audience}
        </span>
      ),
    },

    {
      key: "updateBy",
      header: "Updated By",
      className: "min-w-[140px]",
      cell: (item) => (
        <span className="overflow-hidden text-[#5A5A5A] text-ellipsis text-[12px] font-medium leading-[160%]">
          {item.updateBy}
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
      key: "action",
      header: "Action",
      className: "w-24 min-w-[96px] text-center",
      cell: (item) => (
        <div className="flex items-center gap-2 justify-center">
          <button
            type="button"
            onClick={() => {
              setSelectedPage(item);
              setIsEditModalOpen(true);
            }}
            data-tooltip-id="my-tooltip"
            data-tooltip-html="<strong>Edit Page</strong><br/><span style='font-size:12px;'>Click to edit headings & bold text</span>"
            className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
            title="Edit Content"
          >
            <EditIcon />
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedPage(item);
              setIsPreviewModalOpen(true);
            }}
            className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 text-[#F5B517] hover:bg-amber-50 transition-colors"
            title="Preview"
          >
            <Eye className="w-4 h-4" />
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
            placeholder: "All Status",
            value: roleFilter,
            options: [
              { label: "All Status", value: "" },
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ],
            onChange: (val) => setRoleFilter(val),
          },
          {
            placeholder: "All Status",
            value: statusFilter,
            options: [
              { label: "All Status", value: "" },
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ],
            onChange: (val) => setStatusFilter(val),
          },
        ]}
      />

      {/* Main Data Table */}
      <div className="border-x border-b border-[#E8E8E8] rounded-b-xl overflow-hidden bg-white">
        <DataTable columns={columns} data={pages} pagination={true} />
      </div>

      {/* Edit Content CustomModal (with formatting toolbar and live preview) */}
      <CustomModal
        showCloseButton={false}
        size="mmd"
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
      >
        <EditStaticContent
          initialData={
            selectedPage
              ? {
                  id: selectedPage.id,
                  title: selectedPage.title,
                  status: selectedPage.status,
                  content: "",
                }
              : null
          }
          onCancel={() => {
            setIsEditModalOpen(false);
            setSelectedPage(null);
          }}
          onSubmit={handleSavePage}
        />
      </CustomModal>

      {/* Preview Content CustomModal */}
      <CustomModal
        showCloseButton={false}
        size="xsm"
        open={isPreviewModalOpen}
        onOpenChange={setIsPreviewModalOpen}
      >
        <PreviewStaticContent
          title={selectedPage?.title}
          lastUpdated="July 2026"
          onClose={() => {
            setIsPreviewModalOpen(false);
            setSelectedPage(null);
          }}
        />
      </CustomModal>

      <Tooltip id="my-tooltip" />
    </div>
  );
}

export default StaticPagesTab;
