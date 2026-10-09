"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Loader2, AlertCircle, RefreshCw, UserX } from "lucide-react";
import { Column, DataTable } from "@/components/shared/DataTable";
import { verificationFilterSchema } from "@/components/shared/filter-presets";
import VerificationModal from "./VerificationModal";
import CustomModal from "@/components/shared/CustomModal";
import VerificationDecisionPanel from "./VerificationDecisionPanel";
import { TableToolbar } from "@/components/shared/TableToolbar";
import { useGetVerificationRequestsQuery } from "@/lib/redux/api/expertApi";
import { VerificationRequestItem } from "@/types/expert.types";

export type VerificationStatus =
  | "Resubmission Required"
  | "Pending"
  | "Approved"
  | "Rejected";

export interface VerificationRecord {
  id: string;
  expertId: string;
  expert: {
    name: string;
    avatar: string;
  };
  contact: {
    phone: string;
    email: string;
  };
  documentsSubmitted: number;
  pendingReviews: number;
  submissionDate: string;
  status: VerificationStatus;
}

const renderStatusBadge = (status: VerificationStatus) => {
  const config = {
    "Resubmission Required": {
      bg: "bg-amber-400/20",
      border: "outline-amber-300/50",
      text: "text-amber-700",
      dot: "bg-amber-500",
    },
    Pending: {
      bg: "bg-sky-50",
      border: "outline-sky-200",
      text: "text-sky-600",
      dot: "bg-sky-500",
    },
    Approved: {
      bg: "bg-emerald-50",
      border: "outline-emerald-200",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
    },
    Rejected: {
      bg: "bg-rose-50",
      border: "outline-rose-200",
      text: "text-rose-600",
      dot: "bg-rose-500",
    },
  }[status] || {
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

export function VerificationTable() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewDetailsModal, setViewDetailsModal] = useState<boolean>(false);
  const [approvedModal, setApprovedModal] = useState<boolean>(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 350);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const offset = (page - 1) * pageSize;

  const { data, isLoading, isFetching, error, refetch } =
    useGetVerificationRequestsQuery({
      search: debouncedSearch || undefined,
      limit: pageSize,
      offset,
    });

  const { verificationList, totalCount } = useMemo(() => {
    if (!data) return { verificationList: [], totalCount: 0 };

    let items: VerificationRequestItem[] = [];
    let total = 0;

    if (Array.isArray(data.data)) {
      items = data.data;
      total = data.data.length;
    } else if (data.data) {
      items = data.data.requests || data.data.items || [];
      total = data.data.total ?? items.length;
    }

    const mapped: VerificationRecord[] = items.map((v, index) => {
      let status: VerificationStatus = "Pending";
      const rawStatus = (v.status || "").toUpperCase();
      if (rawStatus === "APPROVED") status = "Approved";
      else if (rawStatus === "REJECTED") status = "Rejected";
      else if (rawStatus.includes("RESUBMISSION")) status = "Resubmission Required";

      let formattedDate = "N/A";
      const dateVal = v.submissionDate || v.submittedAt;
      if (dateVal) {
        try {
          formattedDate = new Intl.DateTimeFormat("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }).format(new Date(dateVal));
        } catch {
          formattedDate = dateVal;
        }
      }

      return {
        id: v.id || String(index + 1),
        expertId: v.expertId || `#EXP${String(index + 1).padStart(3, "0")}`,
        expert: {
          name: v.expert?.name || "Expert Name",
          avatar:
            v.expert?.avatar ||
            `https://placehold.co/80x80?text=${encodeURIComponent(
              (v.expert?.name || "E").charAt(0)
            )}`,
        },
        contact: {
          phone: v.contact?.phone || "N/A",
          email: v.contact?.email || "N/A",
        },
        documentsSubmitted: v.documentsSubmitted ?? v.documentsCount ?? 0,
        pendingReviews: v.pendingReviews ?? 0,
        submissionDate: formattedDate,
        status,
      };
    });

    return { verificationList: mapped, totalCount: total };
  }, [data]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(verificationList.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const columns: Column<VerificationRecord>[] = [
    {
      key: "expertId",
      header: (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            onChange={handleSelectAll}
            checked={
              selectedIds.length === verificationList.length &&
              verificationList.length > 0
            }
            className="h-4 w-4 cursor-pointer rounded border-slate-300 text-[#103D5C] focus:ring-0"
          />
          <span>Expert ID</span>
        </div>
      ),
      className: "w-36 min-w-[144px] pl-4",
      cell: (item) => (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectedIds.includes(item.id)}
            onChange={() => handleSelectRow(item.id)}
            className="h-4 w-4 cursor-pointer rounded border-slate-300 text-[#103D5C] focus:ring-0"
          />
          <span className="font-['Manrope'] text-sm font-normal leading-6 text-[#103D5C]">
            {item.expertId}
          </span>
        </div>
      ),
    },
    {
      key: "expert",
      header: "Expert Name",
      className: "w-44 min-w-[176px]",
      cell: (item) => (
        <div className="flex items-center gap-2">
          <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full border border-amber-400 bg-slate-100">
            <img
              src={item.expert.avatar}
              alt={item.expert.name}
              className="h-full w-full object-cover"
            />
          </div>
          <span className="font-['Manrope'] text-xs font-medium leading-4 text-[#103D5C]">
            {item.expert.name}
          </span>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      className: "w-44 min-w-[176px]",
      cell: (item) => (
        <div className="flex flex-col justify-center">
          <span className="font-['Manrope'] text-xs font-medium leading-5 text-[#667085]">
            {item.contact.phone}
          </span>
          <span className="font-['Manrope'] text-[10px] font-medium leading-[10px] text-slate-400">
            {item.contact.email}
          </span>
        </div>
      ),
    },
    {
      key: "documentsSubmitted",
      header: "Docs Submitted",
      className: "w-28 min-w-[112px] text-center",
      cell: (item) => (
        <span className="font-['Manrope'] text-xs font-medium leading-4 text-[#667085]">
          {String(item.documentsSubmitted).padStart(2, "0")}
        </span>
      ),
    },
    {
      key: "pendingReviews",
      header: "Pending Reviews",
      className: "w-28 min-w-[112px] text-center",
      cell: (item) => (
        <span className="font-['Manrope'] text-xs font-medium leading-4 text-[#667085]">
          {String(item.pendingReviews).padStart(2, "0")}
        </span>
      ),
    },
    {
      key: "submissionDate",
      header: "Submission Date",
      className: "w-28 min-w-[112px] text-center",
      cell: (item) => (
        <span className="font-['Manrope'] text-xs font-medium leading-4 text-[#667085]">
          {item.submissionDate}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      className: "w-48 min-w-[192px] text-center",
      cell: (item) => (
        <div className="flex justify-center">
          {renderStatusBadge(item.status)}
        </div>
      ),
    },
    {
      key: "action",
      header: "Action",
      className: "w-28 min-w-[112px] pr-4 text-center",
      cell: () => (
        <button
          type="button"
          onClick={() => setViewDetailsModal(true)}
          className="inline-flex h-8 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 transition-colors hover:bg-slate-50 cursor-pointer"
        >
          <span className="font-['Manrope'] text-xs font-medium leading-3 text-slate-700">
            View Details
          </span>
        </button>
      ),
    },
  ];

  return (
    <div>
      <TableToolbar
        searchQuery={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        filterSchema={verificationFilterSchema}
      />

      {error ? (
        <div className="p-8 text-center bg-white border border-[#E8E8E8] rounded-b-xl">
          <AlertCircle className="mx-auto h-8 w-8 text-red-500 mb-2" />
          <p className="text-sm font-medium text-slate-800">Failed to load verification requests</p>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Could not retrieve verification requests from the server.
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
        <div className="p-16 flex flex-col items-center justify-center gap-3 bg-white border border-[#E8E8E8] rounded-b-xl">
          <Loader2 className="h-7 w-7 text-[#103D5C] animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Loading requests...</p>
        </div>
      ) : verificationList.length === 0 ? (
        <div className="p-16 text-center bg-white border border-[#E8E8E8] rounded-b-xl">
          <UserX className="mx-auto h-10 w-10 text-slate-300 mb-2" />
          <p className="text-sm font-semibold text-slate-800">No verification requests found</p>
          <p className="text-xs text-slate-500 mt-1">
            {searchTerm
              ? "Try adjusting your search query."
              : "There are no pending verification requests at the moment."}
          </p>
        </div>
      ) : (
        <div className="relative">
          {isFetching && (
            <div className="absolute top-2 right-4 z-10 flex items-center gap-1.5 px-2 py-1 bg-white/90 backdrop-blur rounded shadow-sm border text-[11px] text-slate-600">
              <Loader2 className="h-3 w-3 animate-spin text-[#103D5C]" />
              <span>Updating...</span>
            </div>
          )}
          <DataTable
            columns={columns}
            data={verificationList}
            pagination={true}
            pageSize={pageSize}
            pageSizeOptions={[10, 25, 50, 100]}
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setPage(1);
            }}
          />
        </div>
      )}

      <VerificationModal
        open={viewDetailsModal}
        onOpenChange={setViewDetailsModal}
        onApproved={() => setApprovedModal(true)}
      />

      <CustomModal
        open={approvedModal}
        onOpenChange={setApprovedModal}
        size="sm"
        showCloseButton={false}
        className="max-w-[367px] p-5 font-['Manrope']"
      >
        <VerificationDecisionPanel
          onConfirm={() => setApprovedModal(false)}
          onCancel={() => setApprovedModal(false)}
        />
      </CustomModal>
    </div>
  );
}

export default VerificationTable;