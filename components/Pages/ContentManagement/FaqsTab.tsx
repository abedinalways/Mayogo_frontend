"use client";

import React, { useState } from "react";
import { Column, DataTable } from "../../shared/DataTable";
import TableToolbar from "../../shared/TableToolbar";
import CustomButton from "@/components/shared/CustomButton";
import CustomModal from "@/components/shared/CustomModal";
import EditIcon from "@/components/Icons/EditIcon";
import DeleteIcon from "@/components/Icons/DeleteIcon";
import FaqAdd, { FaqFormData } from "./ContentManagementAllModal/FaqAdd";
import DeleteFaq from "./ContentManagementAllModal/DeleteFaq";
import { PlusIcon } from "lucide-react";

export interface UserRecord {
  id: string;
  title: string;
  description: string;
  latestdDate: string;
  status: string;
}

export type FaqRecord = UserRecord;

const sampleFaqs: UserRecord[] = [
  {
    id: "1",
    title: "How do I hire an expert?",
    description:
      "Search or post a job, review the quotes you receive, then accept the expert that fits you needs and pay securely in-app.",
    latestdDate: "12 Jul, 2026",
    status: "Draft",
  },
  {
    id: "2",
    title: "When is my payment released?",
    description:
      "Payments are held securely and only released to the expert once you confirm the job is complete.",
    latestdDate: "10 Jun, 2026",
    status: "Live",
  },
  {
    id: "3",
    title: "Can I get a refund?",
    description:
      "Yes. If a job is cancelled or not completed as agreed, your funds will be refunded.",
    latestdDate: "10 Jun, 2026",
    status: "Live",
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

export function FaqsTab() {
  const [faqs, setFaqs] = useState<UserRecord[]>(sampleFaqs);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Modal states
  const [openFormModal, setOpenFormModal] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<FaqFormData | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<UserRecord | null>(null);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredFaqs.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // Add / Edit submission
  const handleSaveFaq = (data: FaqFormData) => {
    if (data.id) {
      setFaqs((prev) =>
        prev.map((item) =>
          item.id === data.id
            ? {
                ...item,
                title: data.title,
                description: data.description,
                status: data.status,
              }
            : item,
        ),
      );
    } else {
      const newFaq: UserRecord = {
        id: String(Date.now()),
        title: data.title,
        description: data.description,
        status: data.status,
        latestdDate: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      };
      setFaqs((prev) => [newFaq, ...prev]);
    }
    setOpenFormModal(false);
    setSelectedFaq(null);
  };

  // Delete confirmation
  const handleConfirmDelete = () => {
    if (faqToDelete) {
      setFaqs((prev) => prev.filter((item) => item.id !== faqToDelete.id));
      setSelectedIds((prev) => prev.filter((id) => id !== faqToDelete.id));
      setFaqToDelete(null);
    }
    setIsDeleteModalOpen(false);
  };

  // Filtered FAQs
  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      !statusFilter || faq.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const columns: Column<UserRecord>[] = [
    {
      key: "checkbox",
      header: (
        <div className="flex items-center gap-2 min-w-70">
          <input
            type="checkbox"
            checked={
              selectedIds.length === filteredFaqs.length &&
              filteredFaqs.length > 0
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
      key: "latestdDate",
      header: "Last Updated",
      className: "min-w-[140px]",
      cell: (item) => (
        <span className="overflow-hidden text-[#5A5A5A] text-ellipsis text-[12px] font-medium leading-[160%]">
          {item.latestdDate}
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
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setSelectedFaq({
                id: item.id,
                title: item.title,
                description: item.description,
                status: item.status,
              });
              setOpenFormModal(true);
            }}
            className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800"
            title="Edit FAQ"
          >
            <EditIcon />
          </button>
          <button
            type="button"
            onClick={() => {
              setFaqToDelete(item);
              setIsDeleteModalOpen(true);
            }}
            className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
            title="Delete FAQ"
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
                setSelectedFaq(null);
                setOpenFormModal(true);
              }}
            >
              Add FAQ
            </CustomButton>
          }
        />

        {/* Main Data Table */}
        <div className="border-x border-b border-[#E8E8E8] rounded-b-xl overflow-hidden bg-white">
          <DataTable columns={columns} data={filteredFaqs} pagination={true} />
        </div>

        {/* Add / Edit FAQ Modal */}
        <CustomModal
          showCloseButton={false}
          size="xsm"
          open={openFormModal}
          onOpenChange={setOpenFormModal}
        >
          <FaqAdd
            initialData={selectedFaq}
            onCancel={() => {
              setOpenFormModal(false);
              setSelectedFaq(null);
            }}
            onSubmit={handleSaveFaq}
          />
        </CustomModal>

        {/* Delete FAQ Confirmation Modal */}
        <CustomModal
          showCloseButton={false}
          size="xsm"
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
        >
          <DeleteFaq
            onCancel={() => {
              setIsDeleteModalOpen(false);
              setFaqToDelete(null);
            }}
            onConfirm={handleConfirmDelete}
          />
        </CustomModal>
      </div>
    </div>
  );
}

export default FaqsTab;
