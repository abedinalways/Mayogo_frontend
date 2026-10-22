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
import { PlusIcon, Loader2 } from "lucide-react";
import {
  useGetFaqsQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
} from "@/lib/redux/api/contentApi";
import { FaqItem } from "@/types/content.types";

export interface FaqRecord {
  id: string;
  title: string;
  description: string;
  latestdDate: string;
  status: string;
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

export function FaqsTab() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const {
    data: rawFaqs = [],
    isLoading,
    isFetching,
  } = useGetFaqsQuery({
    search: searchTerm || undefined,
    status: statusFilter ? statusFilter.toUpperCase() : undefined,
  });

  const [createFaq, { isLoading: isCreating }] = useCreateFaqMutation();
  const [updateFaq, { isLoading: isUpdating }] = useUpdateFaqMutation();
  const [deleteFaq, { isLoading: isDeleting }] = useDeleteFaqMutation();

  const [openFormModal, setOpenFormModal] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<FaqFormData | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<FaqRecord | null>(null);

  const faqs: FaqRecord[] = rawFaqs.map((item: FaqItem) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    status: item.status?.toUpperCase() === "LIVE" ? "Live" : "Draft",
    latestdDate: item.updatedAt || item.createdAt
      ? new Date(item.updatedAt || item.createdAt || "").toLocaleDateString(
          "en-GB",
          { day: "2-digit", month: "short", year: "numeric" }
        )
      : "Recently",
  }));

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(faqs.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSaveFaq = async (data: FaqFormData) => {
    try {
      const payloadStatus = data.status.toLowerCase() === "live" ? "LIVE" : "DRAFT";
      if (data.id) {
        await updateFaq({
          faqId: data.id,
          title: data.title,
          description: data.description,
          status: payloadStatus,
        }).unwrap();
      } else {
        await createFaq({
          title: data.title,
          description: data.description,
          status: payloadStatus,
        }).unwrap();
      }
      setOpenFormModal(false);
      setSelectedFaq(null);
    } catch {
      // Error handled by mutation
    }
  };

  const handleConfirmDelete = async () => {
    if (faqToDelete) {
      try {
        await deleteFaq(faqToDelete.id).unwrap();
        setSelectedIds((prev) => prev.filter((id) => id !== faqToDelete.id));
        setFaqToDelete(null);
        setIsDeleteModalOpen(false);
      } catch {
        setIsDeleteModalOpen(false);
      }
    }
  };

  const columns: Column<FaqRecord>[] = [
    {
      key: "checkbox",
      header: (
        <div className="flex items-center gap-2 min-w-70">
          <input
            type="checkbox"
            checked={
              selectedIds.length === faqs.length && faqs.length > 0
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
      className: "min-w-[280px]",
      cell: (item) => (
        <span className="text-[#475569] text-xs font-normal leading-[19.2px] line-clamp-2">
          {item.description}
        </span>
      ),
    },
    {
      key: "latestdDate",
      header: "Latest Date",
      className: "min-w-[120px]",
      cell: (item) => (
        <span className="text-xs font-medium text-slate-600 whitespace-nowrap">
          {item.latestdDate}
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
      key: "action",
      header: "Action",
      className: "w-20 min-w-[80px] text-center",
      cell: (item) => (
        <div className="flex items-center gap-2 justify-center">
          <button
            onClick={() => {
              setSelectedFaq({
                id: item.id,
                title: item.title,
                description: item.description,
                status: item.status,
              });
              setOpenFormModal(true);
            }}
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800"
            aria-label="Edit FAQ"
          >
            <EditIcon />
          </button>
          <button
            onClick={() => {
              setFaqToDelete(item);
              setIsDeleteModalOpen(true);
            }}
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
            aria-label="Delete FAQ"
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
        ]}
        onSortClick={() => {}}
        actionButton={
          <CustomButton
            onClick={() => {
              setSelectedFaq(null);
              setOpenFormModal(true);
            }}
            size="md"
            leadingIcon={<PlusIcon className="w-4 h-4" />}
          >
            Add FAQ
          </CustomButton>
        }
      />

      <div className="border-x border-b border-[#E8E8E8] rounded-b-xl overflow-hidden bg-white">
        {isLoading || isFetching ? (
          <div className="flex items-center justify-center p-16">
            <Loader2 className="h-6 w-6 animate-spin text-[#0f3453]" />
          </div>
        ) : faqs.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <p className="text-base font-semibold text-slate-700">No FAQs found</p>
            <p className="text-xs text-slate-500 mt-1">
              Add your first FAQ entry to show here.
            </p>
          </div>
        ) : (
          <DataTable columns={columns} data={faqs} pagination={true} />
        )}
      </div>

      <CustomModal
        showCloseButton={false}
        size="xsm"
        open={openFormModal}
        onOpenChange={() => {
          setOpenFormModal(false);
          setSelectedFaq(null);
        }}
      >
        <FaqAdd
          initialData={selectedFaq}
          onCancel={() => {
            setOpenFormModal(false);
            setSelectedFaq(null);
          }}
          onSubmit={handleSaveFaq}
          isSubmitting={isCreating || isUpdating}
        />
      </CustomModal>

      <CustomModal
        showCloseButton={false}
        size="xsm"
        open={isDeleteModalOpen}
        onOpenChange={() => setIsDeleteModalOpen(false)}
      >
        <DeleteFaq
          onCancel={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
        />
      </CustomModal>
    </div>
  );
}

export default FaqsTab;
